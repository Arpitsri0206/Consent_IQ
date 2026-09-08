import React, { useState, useMemo } from 'react';
import { useApp } from '../../services/store';
import { DataInventoryCsvImportModal } from '../../components/brand/DataInventoryCsvImportModal';
import { downloadSampleInventoryCsv } from '../../utils/csvInventoryParser';
import {
  Database,
  ShieldCheck,
  Lock,
  ExternalLink,
  UploadCloud,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  Layers,
  Sparkles,
  Server,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { DataCategory } from '../../types';

export const BrandDataInventoryView: React.FC = () => {
  const { inventory } = useApp();
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [legalBasisFilter, setLegalBasisFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Compute summary stats
  const totalCount = inventory.length;
  const consentBasedCount = inventory.filter((i) => i.legalBasis === 'Consent').length;
  const categoriesCount = new Set(inventory.map((i) => i.dataCategory)).size;
  const encryptedCount = inventory.filter(
    (i) => i.encryptionStatus === 'AES-256 GCM' || i.encryptionStatus === 'Tokenized'
  ).length;

  // Filtered inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.dataCategory.toLowerCase().includes(query) ||
        item.application.toLowerCase().includes(query) ||
        item.purpose.toLowerCase().includes(query) ||
        item.thirdParty.toLowerCase().includes(query) ||
        item.legalBasis.toLowerCase().includes(query);

      // Category match
      const matchesCategory =
        categoryFilter === 'ALL' || item.dataCategory === categoryFilter;

      // Legal basis match
      const matchesBasis =
        legalBasisFilter === 'ALL' || item.legalBasis === legalBasisFilter;

      return matchesSearch && matchesCategory && matchesBasis;
    });
  }, [inventory, searchQuery, categoryFilter, legalBasisFilter]);

  // Export current inventory as CSV
  const handleExportCsv = () => {
    const headers = [
      'Data Category',
      'Application & Scope',
      'Primary Purpose',
      'Retention Period',
      'Processor / 3rd Party',
      'Legal Basis',
      'Security Safeguard',
      'Status',
    ];

    const rows = filteredInventory.map((item) => [
      `"${item.dataCategory}"`,
      `"${item.application.replace(/"/g, '""')}"`,
      `"${item.purpose.replace(/"/g, '""')}"`,
      `"${item.retention}"`,
      `"${item.thirdParty.replace(/"/g, '""')}"`,
      `"${item.legalBasis}"`,
      `"${item.encryptionStatus}"`,
      `"${item.status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ConsentIQ_ROPA_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Inventory & ROPA Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Record of Processing Activities (ROPA) under DPDP Act 2023 Sec 6 mapping personal data categories, applications, encryption, and legal grounds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={downloadSampleInventoryCsv}
            title="Download CSV Schema Template"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Download Template</span>
          </button>

          <button
            onClick={handleExportCsv}
            title="Export filtered records to CSV"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export ROPA</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total RoPA Records</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Active data processing paths</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Database className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Consent-Governed</p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">{consentBasedCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalCount > 0 ? `${((consentBasedCount / totalCount) * 100).toFixed(0)}% of inventory` : '0%'}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Data Categories</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{categoriesCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Distinct DPDP dimensions</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">High-Grade Encryption</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{encryptedCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">AES-256 GCM or Tokenized</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Lock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search category, application, purpose, processor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="Identity">Identity</option>
              <option value="Contact">Contact</option>
              <option value="Financial">Financial</option>
              <option value="Location">Location</option>
              <option value="Device">Device</option>
              <option value="Behavioural">Behavioural</option>
              <option value="Employment">Employment</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
            </select>
          </div>

          {/* Legal Basis Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Legal Basis:</span>
            <select
              value={legalBasisFilter}
              onChange={(e) => setLegalBasisFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="ALL">All Bases</option>
              <option value="Consent">Consent</option>
              <option value="Legitimate Use">Legitimate Use</option>
              <option value="Legal Obligation">Legal Obligation</option>
            </select>
          </div>

          {(searchQuery || categoryFilter !== 'ALL' || legalBasisFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
                setLegalBasisFilter('ALL');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Data Category</th>
                <th className="py-3.5 px-4">Application & Scope</th>
                <th className="py-3.5 px-4">Primary Purpose</th>
                <th className="py-3.5 px-4">Retention</th>
                <th className="py-3.5 px-4">Processor / 3rd Party</th>
                <th className="py-3.5 px-4">Legal Basis</th>
                <th className="py-3.5 px-4">Security Safeguard</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <span className="inline-block rounded-md bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-700">
                        {item.dataCategory}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {item.application}
                    </td>
                    <td className="py-4 px-4 text-slate-700 max-w-sm">
                      <p className="font-medium truncate" title={item.purpose}>
                        {item.purpose}
                      </p>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-600 text-[11px]">
                      {item.retention}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {item.thirdParty}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                          item.legalBasis === 'Consent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.legalBasis === 'Legal Obligation'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.legalBasis}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-semibold bg-emerald-50/60 px-2 py-0.5 rounded border border-emerald-100">
                        <Lock className="h-3 w-3" />
                        <span>{item.encryptionStatus}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>{item.status || 'ACTIVE'}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Database className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-700">No RoPA records match your filter</p>
                        <p className="text-xs text-slate-400">
                          Try adjusting your search criteria or import a new batch of data categories via CSV.
                        </p>
                      </div>
                      <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                      >
                        <UploadCloud className="h-4 w-4" />
                        <span>Import CSV Dataset</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      <DataInventoryCsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(count) => {
          showNotification(`Successfully imported ${count} data inventory records into the RoPA ledger.`);
        }}
      />
    </div>
  );
};
