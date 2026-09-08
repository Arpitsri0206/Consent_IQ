import React, { useState, useMemo } from 'react';
import { useApp } from '../../services/store';
import {
  exportConsentsCsv,
  exportDataInventoryCsv,
  exportDsrRequestsCsv,
  exportAuditLogsCsv,
  exportPurposesCsv,
  exportDataSharingCsv,
} from '../../utils/csvReportExporters';
import {
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Database,
  ShieldCheck,
  FileQuestion,
  FileCheck,
  Layers,
  Share2,
  Calendar,
  Filter,
  Eye,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Table,
  Check,
} from 'lucide-react';
import { DataInventoryCsvImportModal } from '../../components/brand/DataInventoryCsvImportModal';

interface BrandReportsViewProps {
  onNavigate?: (route: string) => void;
}

export const BrandReportsView: React.FC<BrandReportsViewProps> = ({ onNavigate }) => {
  const {
    consents,
    inventory,
    requests,
    auditLogs,
    purposes,
    sharing,
  } = useApp();

  const [notification, setNotification] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Custom Builder State
  const [selectedDataset, setSelectedDataset] = useState<'consents' | 'inventory' | 'requests' | 'audit'>('consents');
  const [dateFilter, setDateFilter] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [previewTab, setPreviewTab] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered dataset for custom builder
  const customFilteredData = useMemo(() => {
    if (selectedDataset === 'consents') {
      return consents.filter((c) => {
        if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
        return true;
      });
    } else if (selectedDataset === 'inventory') {
      return inventory.filter((i) => {
        if (statusFilter !== 'ALL' && i.legalBasis !== statusFilter) return false;
        return true;
      });
    } else if (selectedDataset === 'requests') {
      return requests.filter((r) => {
        if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
        return true;
      });
    } else {
      return auditLogs;
    }
  }, [selectedDataset, statusFilter, consents, inventory, requests, auditLogs]);

  const handleCustomExport = () => {
    if (selectedDataset === 'consents') {
      exportConsentsCsv(customFilteredData as any, 'Custom_Consents_Export');
      showToast(`Exported ${customFilteredData.length} Consent records to CSV`);
    } else if (selectedDataset === 'inventory') {
      exportDataInventoryCsv(customFilteredData as any, 'Custom_ROPA_Inventory_Export');
      showToast(`Exported ${customFilteredData.length} RoPA Inventory records to CSV`);
    } else if (selectedDataset === 'requests') {
      exportDsrRequestsCsv(customFilteredData as any, 'Custom_DSR_Requests_Export');
      showToast(`Exported ${customFilteredData.length} DSR Request records to CSV`);
    } else {
      exportAuditLogsCsv(customFilteredData as any, 'Custom_Audit_Trail_Export');
      showToast(`Exported ${customFilteredData.length} Audit Event records to CSV`);
    }
  };

  const reportCards = [
    {
      id: 'consents',
      title: 'Consent & Revocation Ledger',
      description: 'Comprehensive log of all granted, requested, denied, and withdrawn consents with cryptographic SHA-256 evidence hashes and channel metrics.',
      count: consents.length,
      countLabel: 'Consent Records',
      icon: CheckCircle2,
      color: 'indigo',
      badge: 'DPDP Sec 6',
      onExport: () => {
        exportConsentsCsv(consents);
        showToast(`Exported ${consents.length} Consent Ledger records to CSV`);
      },
    },
    {
      id: 'inventory',
      title: 'RoPA Data Inventory Registry',
      description: 'Full Record of Processing Activities mapping personal data categories, scope applications, retention periods, encryption, and lawful bases.',
      count: inventory.length,
      countLabel: 'RoPA Elements',
      icon: Database,
      color: 'blue',
      badge: 'Data Map',
      onExport: () => {
        exportDataInventoryCsv(inventory);
        showToast(`Exported ${inventory.length} RoPA Data Inventory records to CSV`);
      },
    },
    {
      id: 'requests',
      title: 'Data Principal Rights & Grievances (DSR)',
      description: 'Log of data access, correction, erasure, and grievance requests with SLA due dates, assigned privacy officers, and resolution notes.',
      count: requests.length,
      countLabel: 'DSR Requests',
      icon: FileQuestion,
      color: 'amber',
      badge: 'SLA Tracking',
      onExport: () => {
        exportDsrRequestsCsv(requests);
        showToast(`Exported ${requests.length} DSR Request records to CSV`);
      },
    },
    {
      id: 'audit',
      title: 'Cryptographic Audit Trail',
      description: 'Tamper-evident system activity log recording ingress timestamps, IP addresses, actors, collection channels, and verification block hashes.',
      count: auditLogs.length,
      countLabel: 'Audit Logs',
      icon: FileCheck,
      color: 'emerald',
      badge: 'Immutable',
      onExport: () => {
        exportAuditLogsCsv(auditLogs);
        showToast(`Exported ${auditLogs.length} Audit Trail events to CSV`);
      },
    },
    {
      id: 'purposes',
      title: 'Processing Purposes & Notice Registry',
      description: 'Catalog of approved business objectives, processing types, notice versions, data categories, and authorized processor relationships.',
      count: purposes.length,
      countLabel: 'Purpose Definitions',
      icon: Layers,
      color: 'purple',
      badge: 'Governance',
      onExport: () => {
        exportPurposesCsv(purposes);
        showToast(`Exported ${purposes.length} Purpose Definitions to CSV`);
      },
    },
    {
      id: 'sharing',
      title: 'Third-Party Processors & Sharing Map',
      description: 'Cross-border data flows, authorized recipient processors, categories shared, jurisdiction safeguards, and underlying consent bindings.',
      count: sharing.length,
      countLabel: 'Sharing Nodes',
      icon: Share2,
      color: 'cyan',
      badge: 'Cross-Border',
      onExport: () => {
        exportDataSharingCsv(sharing);
        showToast(`Exported ${sharing.length} Data Sharing Nodes to CSV`);
      },
    },
  ];

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-900 shadow-lg animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reports & CSV Export Center
            </h1>
            <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              DPDP Compliance Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate and download formatted CSV exports across consent registers, RoPA inventory, DSR grievances, and audit ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
            <span>Import RoPA CSV</span>
          </button>

          <button
            onClick={() => {
              exportConsentsCsv(consents);
              exportDataInventoryCsv(inventory);
              showToast('Exported Master Ledgers (Consents & RoPA) to CSV');
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Master Ledgers</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Consents</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{consents.length}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold">Ledger Active</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">RoPA Records</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{inventory.length}</h3>
            <span className="text-[11px] text-indigo-600 font-semibold">Data Categories</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">DSR Grievances</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{requests.length}</h3>
            <span className="text-[11px] text-amber-600 font-semibold">In Compliance SLA</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Trail Events</p>
          <div className="flex items-baseline justify-between mt-1">
            <h3 className="text-2xl font-extrabold text-slate-900">{auditLogs.length}</h3>
            <span className="text-[11px] text-purple-600 font-semibold">Immutable Hashes</span>
          </div>
        </div>
      </div>

      {/* 6 Report Module Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Standard Compliance Reports</h2>
          <span className="text-xs text-slate-500">All exports formatted to RFC 4180 CSV standard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reportCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {card.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900">{card.count}</span>
                    <span className="text-[11px] text-slate-400 ml-1.5">{card.countLabel}</span>
                  </div>

                  <button
                    onClick={card.onExport}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-2xs transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom CSV Export Builder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Dataset CSV Exporter</h3>
              <p className="text-xs text-slate-500">Select dataset, apply filters, preview records, and download</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewTab(!previewTab)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              <span>{previewTab ? 'Hide Preview' : 'Show Preview Table'}</span>
            </button>
            <button
              onClick={handleCustomExport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Filtered CSV ({customFilteredData.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Select Dataset:
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value as any);
                setStatusFilter('ALL');
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="consents">Consent Ledger ({consents.length} rows)</option>
              <option value="inventory">RoPA Data Inventory ({inventory.length} rows)</option>
              <option value="requests">DSR Grievance Requests ({requests.length} rows)</option>
              <option value="audit">Cryptographic Audit Logs ({auditLogs.length} rows)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Status / Basis Filter:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">All Records</option>
              {selectedDataset === 'consents' && (
                <>
                  <option value="GRANTED">Granted Only</option>
                  <option value="REQUESTED">Pending Request</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                  <option value="DENIED">Denied</option>
                  <option value="EXPIRED">Expired</option>
                </>
              )}
              {selectedDataset === 'inventory' && (
                <>
                  <option value="Consent">Consent Basis</option>
                  <option value="Legitimate Use">Legitimate Use Basis</option>
                  <option value="Legal Obligation">Legal Obligation Basis</option>
                </>
              )}
              {selectedDataset === 'requests' && (
                <>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="ACTION_REQUIRED">Action Required</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Timeframe:
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="all">All-Time History</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Live Preview Table */}
        {previewTab && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Previewing first 10 rows:</span>
              <span>Total Matching: {customFilteredData.length} records</span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 max-h-64 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Record Key</th>
                    <th className="py-2.5 px-3">Primary Identifier</th>
                    <th className="py-2.5 px-3">Scope / Purpose</th>
                    <th className="py-2.5 px-3">Status / Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {customFilteredData.slice(0, 10).map((row: any, idx) => (
                    <tr key={row.id || idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{row.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {row.userName || row.dataCategory || row.event || row.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                        {row.purposeName || row.purpose || row.description || row.resource}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {row.status || row.legalBasis || row.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CSV Import Modal */}
      <DataInventoryCsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => {
          showToast(`Successfully imported ${count} data inventory records into the RoPA ledger.`);
        }}
      />
    </div>
  );
};
