import {
  ConsentItem,
  ConsentEvent,
  DataInventoryItem,
  DataPrincipalRequest,
  AuditEvent,
  Purpose,
  PrivacyNotice,
  DataSharingNode,
} from '../types';

function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

function triggerDownload(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 1. Consent Ledger Export
export function exportConsentsCsv(consents: ConsentItem[], filenameSuffix = 'Consents_Ledger'): void {
  const headers = [
    'Consent ID',
    'Data Principal UserRef',
    'User Name',
    'User Email',
    'Brand / Organization',
    'Purpose Name',
    'Business Objective',
    'Data Categories',
    'Status',
    'Collection Channel',
    'Requested At',
    'Granted At',
    'Expires At',
    'Withdrawn At',
    'Retention Period',
    'Notice Version',
    'Third-Party Recipients',
    'Evidence Hash',
    'Previous Block Hash',
  ];

  const rows = consents.map((c) => [
    escapeCsvCell(c.id),
    escapeCsvCell(c.userRef),
    escapeCsvCell(c.userName),
    escapeCsvCell(c.userEmail),
    escapeCsvCell(c.brandName),
    escapeCsvCell(c.purposeName),
    escapeCsvCell(c.businessObjective),
    escapeCsvCell(c.dataCategories.join('; ')),
    escapeCsvCell(c.status),
    escapeCsvCell(c.collectionChannel),
    escapeCsvCell(c.requestedAt),
    escapeCsvCell(c.grantedAt || 'N/A'),
    escapeCsvCell(c.expiresAt || 'N/A'),
    escapeCsvCell(c.withdrawnAt || 'N/A'),
    escapeCsvCell(c.retentionPeriod),
    escapeCsvCell(c.noticeVersion),
    escapeCsvCell(c.thirdParties?.join('; ') || 'None'),
    escapeCsvCell(c.evidenceHash),
    escapeCsvCell(c.previousHash),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(csvContent, `ConsentIQ_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
}

// 2. RoPA Data Inventory Export
export function exportDataInventoryCsv(inventory: DataInventoryItem[], filenameSuffix = 'ROPA_Inventory'): void {
  const headers = [
    'Record ID',
    'Data Category',
    'Application & System Scope',
    'Primary Processing Purpose',
    'Retention Period',
    'Processor / 3rd Party',
    'DPDP Lawful Basis',
    'Security Safeguard / Encryption',
    'Status',
  ];

  const rows = inventory.map((i) => [
    escapeCsvCell(i.id),
    escapeCsvCell(i.dataCategory),
    escapeCsvCell(i.application),
    escapeCsvCell(i.purpose),
    escapeCsvCell(i.retention),
    escapeCsvCell(i.thirdParty),
    escapeCsvCell(i.legalBasis),
    escapeCsvCell(i.encryptionStatus),
    escapeCsvCell(i.status),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(csvContent, `ConsentIQ_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
}

// 3. DSR Requests Export
export function exportDsrRequestsCsv(requests: DataPrincipalRequest[], filenameSuffix = 'DSR_Grievances'): void {
  const headers = [
    'Request ID',
    'Data Principal UserRef',
    'User Name',
    'Email Address',
    'Phone',
    'Target Organization',
    'Request Type',
    'Description',
    'Status',
    'Received At',
    'SLA Due Date',
    'Assigned Officer',
    'Resolved At',
    'Resolution Notes',
  ];

  const rows = requests.map((r) => [
    escapeCsvCell(r.id),
    escapeCsvCell(r.userRef),
    escapeCsvCell(r.userName),
    escapeCsvCell(r.userEmail),
    escapeCsvCell(r.userPhone),
    escapeCsvCell(r.organizationName),
    escapeCsvCell(r.requestType),
    escapeCsvCell(r.description),
    escapeCsvCell(r.status),
    escapeCsvCell(r.receivedAt),
    escapeCsvCell(r.dueAt),
    escapeCsvCell(r.assignedTo || 'Unassigned'),
    escapeCsvCell(r.resolvedAt || 'Pending'),
    escapeCsvCell(r.resolutionNotes || 'None'),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(csvContent, `ConsentIQ_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
}

// 4. Audit Trail Event Logs Export
export function exportAuditLogsCsv(auditLogs: AuditEvent[], filenameSuffix = 'Audit_Trail'): void {
  const headers = [
    'Audit Event ID',
    'Timestamp',
    'Action / Event Type',
    'Actor & Role',
    'Organization',
    'Target Resource',
    'IP Address',
    'Ingress Channel',
    'Outcome Result',
    'Cryptographic Hash',
  ];

  const rows = auditLogs.map((a) => [
    escapeCsvCell(a.id),
    escapeCsvCell(a.timestamp),
    escapeCsvCell(a.event),
    escapeCsvCell(a.actor),
    escapeCsvCell(a.organization),
    escapeCsvCell(a.resource),
    escapeCsvCell(a.ip),
    escapeCsvCell(a.channel),
    escapeCsvCell(a.result),
    escapeCsvCell(a.hash),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(csvContent, `ConsentIQ_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
}

// 5. Purpose & Privacy Notice Registry Export
export function exportPurposesCsv(purposes: Purpose[], filenameSuffix = 'Purposes_Registry'): void {
  const headers = [
    'Purpose ID',
    'Purpose Name',
    'Business Objective',
    'Processing Type',
    'Retention Period',
    'Covered Data Categories',
    'Authorized Third Parties',
    'Active Consents Count',
    'Status',
    'Created At',
  ];

  const rows = purposes.map((p) => [
    escapeCsvCell(p.id),
    escapeCsvCell(p.name),
    escapeCsvCell(p.businessObjective),
    escapeCsvCell(p.processingType),
    escapeCsvCell(p.retentionPeriod),
    escapeCsvCell(p.dataCategories.join('; ')),
    escapeCsvCell(p.thirdParties?.join('; ') || 'Internal Only'),
    escapeCsvCell(p.activeConsentsCount),
    escapeCsvCell(p.status),
    escapeCsvCell(p.createdAt),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(csvContent, `ConsentIQ_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
}

// 6. Third-Party Data Sharing Node Export
export function exportDataSharingCsv(sharingNodes: DataSharingNode[], filenameSuffix = 'Third_Party_Sharing'): void {
  const headers = [
    'Node ID',
    'Source Fiduciary',
    'Recipient Processor / Org',
    'Recipient Category',
    'Authorized Processing Purpose',
    'Data Categories Shared',
    'Underlying Consent ID',
    'Authorized Jurisdiction',
    'Shared Timestamp',
    'Status',
  ];

  const rows = sharingNodes.map((s) => [
    escapeCsvCell(s.id),
    escapeCsvCell(s.sourceOrg),
    escapeCsvCell(s.recipientOrg),
    escapeCsvCell(s.recipientCategory),
    escapeCsvCell(s.purpose),
    escapeCsvCell(s.dataCategories.join('; ')),
    escapeCsvCell(s.consentId),
    escapeCsvCell(s.jurisdiction),
    escapeCsvCell(s.sharedAt),
    escapeCsvCell(s.status),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(csvContent, `ConsentIQ_${filenameSuffix}_${new Date().toISOString().split('T')[0]}.csv`);
}
