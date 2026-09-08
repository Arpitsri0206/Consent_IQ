import React, { useState, useRef } from 'react';
import { useApp } from '../../services/store';
import {
  parseInventoryCsv,
  downloadSampleInventoryCsv,
  SAMPLE_CSV_CONTENT,
  ParsedCsvRow,
  CsvParseResult,
} from '../../utils/csvInventoryParser';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Plus,
  RefreshCw,
  FileText,
  ShieldCheck,
  Lock,
  Layers,
} from 'lucide-react';

interface DataInventoryCsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (count: number) => void;
}

export const DataInventoryCsvImportModal: React.FC<DataInventoryCsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const { bulkImportInventory } = useApp();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [rawCsvText, setRawCsvText] = useState<string>('');
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [createPurposes, setCreatePurposes] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importCompleted, setImportCompleted] = useState<boolean>(false);
  const [importedStats, setImportedStats] = useState<{ importedCount: number; newPurposesCount: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      setRawCsvText(content);
      const res = parseInventoryCsv(content);
      setParseResult(res);
      setImportCompleted(false);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleTextInputChange = (val: string) => {
    setRawCsvText(val);
    setFileName('Pasted_CSV_Dataset.csv');
    if (val.trim()) {
      const res = parseInventoryCsv(val);
      setParseResult(res);
    } else {
      setParseResult(null);
    }
    setImportCompleted(false);
  };

  const handleLoadSample = () => {
    setRawCsvText(SAMPLE_CSV_CONTENT);
    setFileName('Sample_DPDP_ROPA_Template.csv');
    const res = parseInventoryCsv(SAMPLE_CSV_CONTENT);
    setParseResult(res);
    setActiveTab('paste');
    setImportCompleted(false);
  };

  const handleExecuteImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;
    setIsProcessing(true);

    try {
      const payload = parseResult.validRows.map((r) => ({
        dataCategory: r.dataCategory,
        application: r.application,
        purpose: r.purpose,
        retention: r.retention,
        thirdParty: r.thirdParty,
        legalBasis: r.legalBasis,
        encryptionStatus: r.encryptionStatus,
        status: 'ACTIVE' as const,
      }));

      const stats = bulkImportInventory(payload, createPurposes);
      setImportedStats(stats);
      setImportCompleted(true);
      if (onImportSuccess) {
        onImportSuccess(stats.importedCount);
      }
    } catch (err) {
      console.error('Failed to import inventory rows:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setRawCsvText('');
    setFileName('');
    setParseResult(null);
    setImportCompleted(false);
    setImportedStats(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bulk Import Data Inventory & Processing Purposes
              </h2>
              <p className="text-xs text-slate-500">
                Upload CSV mapping personal data categories, applications, encryption, and DPDP lawful bases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {importCompleted && importedStats ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-emerald-900">
                  Data Inventory Successfully Ingested!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 max-w-lg mx-auto">
                  Imported <span className="font-bold">{importedStats.importedCount}</span> RoPA data records into the enterprise ledger.{' '}
                  {importedStats.newPurposesCount > 0 && (
                    <span>
                      Registered <span className="font-bold">{importedStats.newPurposesCount}</span> new purpose definitions into the Consent Registry.
                    </span>
                  )}
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  Import Another File
                </button>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                >
                  View Updated Inventory
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Template Download & Tab Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'upload'
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    File Upload (.csv)
                  </button>
                  <button
                    onClick={() => setActiveTab('paste')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'paste'
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Paste Raw CSV
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Load Sample Data</span>
                  </button>
                  <button
                    type="button"
                    onClick={downloadSampleInventoryCsv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-500" />
                    <span>Download Template</span>
                  </button>
                </div>
              </div>

              {/* Upload Drop Zone / Paste Input */}
              {activeTab === 'upload' ? (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-50/50'
                        : fileName
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-2xs text-indigo-600 mb-3 border border-slate-100">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 text-center">
                      {fileName ? fileName : 'Click to upload or drag & drop CSV file'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 text-center">
                      Standard format: <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">data_category, application, purpose, retention, third_party, legal_basis, encryption_status</code>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">
                      Paste CSV Content (with headers)
                    </label>
                    {rawCsvText && (
                      <button
                        onClick={handleReset}
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Clear Text
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={6}
                    value={rawCsvText}
                    onChange={(e) => handleTextInputChange(e.target.value)}
                    placeholder="data_category,application,purpose,retention,third_party,legal_basis,encryption_status&#10;Identity,Customer Portal,KYC Verification,7 Years,UIDAI,Consent,AES-256 GCM"
                    className="w-full rounded-xl border border-slate-200 p-3 font-mono text-xs text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 bg-slate-50/50"
                  />
                </div>
              )}

              {/* Parsed Preview Table & Validation State */}
              {parseResult && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  {/* Summary Metric Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        Total Rows: {parseResult.totalRows}
                      </span>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{parseResult.validRows.length} Valid</span>
                      </span>
                      {parseResult.invalidRows.length > 0 && (
                        <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                          <span>{parseResult.invalidRows.length} Invalid (Skipped)</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{parseResult.detectedCategories.size} Categories</span>
                      <span>•</span>
                      <span>{parseResult.uniquePurposes.size} Distinct Purposes</span>
                    </div>
                  </div>

                  {/* Pre-import Table */}
                  <div className="overflow-hidden rounded-xl border border-slate-200 max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3">Application</th>
                          <th className="py-2.5 px-3">Purpose</th>
                          <th className="py-2.5 px-3">Retention</th>
                          <th className="py-2.5 px-3">Legal Basis</th>
                          <th className="py-2.5 px-3">Encryption</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {parseResult.allRows.map((row) => (
                          <tr
                            key={row.rowNumber}
                            className={row.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/50'}
                          >
                            <td className="py-2.5 px-3">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Ready</span>
                                </span>
                              ) : (
                                <span
                                  title={row.errors.join('; ')}
                                  className="inline-flex items-center gap-1 text-rose-600 text-[11px] font-bold"
                                >
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  <span>Error</span>
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] text-indigo-700 font-bold">
                                {row.dataCategory}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">
                              {row.application}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={row.purpose}>
                              {row.purpose}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                              {row.retention}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                                {row.legalBasis}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 text-[11px] font-mono">
                              {row.encryptionStatus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Options */}
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="autoPurposeSync"
                      checked={createPurposes}
                      onChange={(e) => setCreatePurposes(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="autoPurposeSync" className="text-xs text-indigo-950 cursor-pointer">
                      <span className="font-bold">Auto-synchronize processing purposes</span>: Automatically register new purpose definitions into the Consent Registry so they can be immediately assigned to Consent Notices and Principal campaigns.
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!importCompleted && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/80">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={!parseResult || parseResult.validRows.length === 0 || isProcessing}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Importing Ledger Rows...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  <span>
                    Import {parseResult ? `${parseResult.validRows.length} Valid Records` : 'CSV'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
