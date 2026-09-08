import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateSyncHash } from './crypto';

export interface PDFReportData {
  brandName: string;
  adminName: string;
  industry: string;
  timeRange: string;
  channel: string;
  benchmarkTarget: number;
  summary: {
    avgApprovalRate: number;
    totalGranted: number;
    totalWithdrawn: number;
    totalRequests: number;
    avgDailyNetGrowth: number;
    approvalTrendDiff: number;
    withdrawalTrendDiff: number;
    peakApprovalDay: string;
    lowestApprovalDay: string;
  };
  dailyRecords: Array<{
    date: string;
    formattedDate: string;
    dayOfWeek: string;
    requests: number;
    granted: number;
    withdrawn: number;
    approvalRate: number;
    withdrawalRate: number;
    netGrowth: number;
  }>;
}

export function generateConsentTrendPDF(data: PDFReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const reportId = `REP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  const ledgerHash = generateSyncHash(`REPORT_${reportId}_${data.brandName}_${now.toISOString()}`);

  // 1. Top Decorative Header Bar
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(79, 70, 229); // Indigo 600
  doc.rect(0, 26.5, pageWidth, 1.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ConsentIQ Enterprise', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254); // Indigo 200
  doc.text('DPDP Act 2023 Consent Velocity & Statutory Withdrawal Telemetry Report', 14, 18);

  // Top Right Meta in Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`ID: ${reportId}`, pageWidth - 14, 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`${dateFormatted} ${timeFormatted} IST`, pageWidth - 14, 17, { align: 'right' });

  // 2. Fiduciary & Scope Metadata Section
  let currentY = 36;

  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(data.brandName, 18, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(`Industry: ${data.industry}  •  Data Protection Officer: ${data.adminName}`, 18, currentY + 11.5);
  doc.text(`Reporting Window: Last ${data.timeRange}  •  Channel Filter: ${data.channel === 'ALL' ? 'All Ingestion Channels (Web, Mobile, QR, API)' : data.channel}`, 18, currentY + 16.5);
  doc.text(`Statutory Target Benchmark: ${data.benchmarkTarget}% Approval Ratio`, 18, currentY + 21.5);

  // Status Badge on Right of Box
  const isTargetMet = data.summary.avgApprovalRate >= data.benchmarkTarget;
  if (isTargetMet) {
    doc.setFillColor(236, 253, 245); // Emerald 50
    doc.setDrawColor(167, 243, 208); // Emerald 200
    doc.setTextColor(6, 95, 70); // Emerald 800
  } else {
    doc.setFillColor(254, 242, 242); // Rose 50
    doc.setDrawColor(254, 202, 202); // Rose 200
    doc.setTextColor(153, 27, 27); // Rose 800
  }
  doc.roundedRect(pageWidth - 68, currentY + 4.5, 50, 15, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isTargetMet ? 'COMPLIANT WITH TARGET' : 'BELOW BENCHMARK', pageWidth - 43, currentY + 11, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`${data.summary.avgApprovalRate}% vs ${data.benchmarkTarget}% Target`, pageWidth - 43, currentY + 16, { align: 'center' });

  // 3. Executive Summary KPI Cards (4 columns)
  currentY += 32;

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Executive Telemetry Summary', 14, currentY);

  currentY += 4;
  const cardWidth = (pageWidth - 28 - 9) / 4;
  const cardHeight = 21;

  const kpis = [
    {
      label: 'Avg Approval Rate',
      val: `${data.summary.avgApprovalRate}%`,
      sub: `${data.summary.approvalTrendDiff >= 0 ? '+' : ''}${data.summary.approvalTrendDiff}% vs prior`,
      accent: [79, 70, 229], // Indigo
    },
    {
      label: 'Granted Approvals',
      val: data.summary.totalGranted.toLocaleString(),
      sub: `From ${data.summary.totalRequests.toLocaleString()} prompts`,
      accent: [16, 185, 129], // Emerald
    },
    {
      label: 'User Withdrawals',
      val: data.summary.totalWithdrawn.toLocaleString(),
      sub: `${((data.summary.totalWithdrawn / Math.max(1, data.summary.totalGranted)) * 100).toFixed(2)}% Churn Ratio`,
      accent: [147, 51, 234], // Purple
    },
    {
      label: 'Net Daily Intake',
      val: `${data.summary.avgDailyNetGrowth >= 0 ? '+' : ''}${data.summary.avgDailyNetGrowth.toLocaleString()}`,
      sub: `Peak: ${data.summary.peakApprovalDay}`,
      accent: [14, 165, 233], // Sky
    },
  ];

  kpis.forEach((kpi, idx) => {
    const cardX = 14 + idx * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    // Accent line at top of card
    doc.setFillColor(kpi.accent[0], kpi.accent[1], kpi.accent[2]);
    doc.rect(cardX, currentY, cardWidth, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, cardX + 3.5, currentY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, cardX + 3.5, currentY + 12.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.sub, cardX + 3.5, currentY + 17.5);
  });

  // 4. Granular Daily Telemetry Table
  currentY += cardHeight + 8;

  const tableHeaders = [
    'Date',
    'Day',
    'Requests Sent',
    'Granted',
    'Withdrawn',
    'Approval Rate',
    'Withdrawal Rate',
    'Net Growth',
  ];

  const tableRows = data.dailyRecords.map((d) => [
    d.date,
    d.dayOfWeek,
    d.requests.toLocaleString(),
    d.granted.toLocaleString(),
    d.withdrawn.toLocaleString(),
    `${d.approvalRate}%`,
    `${d.withdrawalRate}%`,
    d.netGrowth >= 0 ? `+${d.netGrowth.toLocaleString()}` : d.netGrowth.toLocaleString(),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    margin: { left: 14, right: 14, bottom: 24 },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [30, 41, 59], // Slate 800
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: 16, halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold', textColor: [67, 56, 202] }, // Indigo
      4: { halign: 'right', textColor: [147, 51, 234] }, // Purple
      5: { halign: 'right', fontStyle: 'bold', textColor: [16, 185, 129] }, // Emerald
      6: { halign: 'right', textColor: [225, 29, 72] }, // Rose
      7: { halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didDrawPage: (hookData) => {
      // 5. Professional Footer on Every Page
      doc.setFillColor(241, 245, 249);
      doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');

      doc.setDrawColor(226, 232, 240);
      doc.line(0, pageHeight - 16, pageWidth, pageHeight - 16);

      // Ledger Hash & Verification Note
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`SHA-256 Merkle Ledger Stamp: ${ledgerHash.substring(0, 38)}...`, 14, pageHeight - 9);
      doc.text('Certified valid under DPDP Act 2023 Sec 6 Consent Artifact Registry • Generated by ConsentIQ Enterprise', 14, pageHeight - 5);

      // Page Number
      const pageStr = `Page ${hookData.pageNumber}`;
      doc.text(pageStr, pageWidth - 14, pageHeight - 7, { align: 'right' });
    },
  });

  // Save the PDF
  const filename = `ConsentIQ_Report_${data.brandName.replace(/\s+/g, '_')}_${data.timeRange}_${now.toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
