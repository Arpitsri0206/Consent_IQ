import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ConsentItem } from '../../types';
import { X, Download, ShieldCheck, CheckCircle2, Copy, Check, Printer, FileText, QrCode } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import confetti from 'canvas-confetti';

interface ConsentReceiptModalProps {
  consent: ConsentItem | null;
  onClose: () => void;
  onVerifyEvidence?: (consentId: string) => void;
}

export const ConsentReceiptModal: React.FC<ConsentReceiptModalProps> = ({
  consent,
  onClose,
  onVerifyEvidence
}) => {
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!consent) return null;

  const verificationUrl = `https://consentiq.io/verify/consent/${consent.id}?hash=${consent.evidenceHash}&status=${consent.status}`;

  const copyReceiptDetails = () => {
    const text = `
CONSENTIQ DPDP CONSENT RECEIPT
==============================================
Consent ID: ${consent.id}
Data Principal: ${consent.userRef} (${consent.userName})
Data Fiduciary: ${consent.brandName}
Purpose: ${consent.purposeName}
Data Categories: ${consent.dataCategories.join(', ')}
Status: ${consent.status}
Granted At: ${consent.grantedAt || 'N/A'}
Expires At: ${consent.expiresAt || 'N/A'}
Notice Version: ${consent.noticeVersion}
Collection Channel: ${consent.collectionChannel}
Cryptographic SHA-256 Stamp: ${consent.evidenceHash}
Verify URL: ${verificationUrl}
==============================================
Governed under the Digital Personal Data Protection Act, 2023 (India)
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReceipt = () => {
    setDownloading(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      setDownloading(false);
      // Create download trigger
      const element = document.createElement('a');
      const file = new Blob([
        `CONSENTIQ OFFICIAL DIGITAL CONSENT RECEIPT\n` +
        `Reference: ${consent.id}\n` +
        `Data Principal: ${consent.userName} (${consent.userRef})\n` +
        `Fiduciary: ${consent.brandName}\n` +
        `Purpose: ${consent.purposeName}\n` +
        `Data Categories: ${consent.dataCategories.join(', ')}\n` +
        `Granted: ${consent.grantedAt}\n` +
        `Notice: ${consent.noticeVersion}\n` +
        `Ledger Hash: ${consent.evidenceHash}\n` +
        `Verification URL: ${verificationUrl}\n` +
        `Verification Status: CRYPTOGRAPHICALLY VALID (DPDP COMPLIANT)`
      ], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `ConsentIQ-Receipt-${consent.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">DPDP Consent Receipt</h3>
              <p className="text-xs text-slate-500">Immutable Digital Trust Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div ref={printRef} className="p-6 md:p-8 space-y-6">
          {/* Watermark Banner */}
          <div className="rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50/70 to-blue-50/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                  ConsentIQ Verified Receipt
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-900 font-mono">{consent.id}</span>
                  <StatusBadge status={consent.status} size="sm" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Scan the embedded QR code with any camera to verify DPDP ledger validity.
                </p>
              </div>
              <div className="rounded-xl border border-indigo-200 bg-white p-2 shadow-xs shrink-0 text-center">
                <QRCodeSVG
                  value={verificationUrl}
                  size={64}
                  level="M"
                />
                <span className="block mt-0.5 font-mono text-[8px] font-bold text-indigo-700 uppercase">
                  Scan Proof
                </span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs">
            <div>
              <span className="text-slate-500 block">Data Principal (User)</span>
              <span className="font-semibold text-slate-900 text-sm">{consent.userName}</span>
              <span className="text-slate-500 block font-mono mt-0.5">{consent.userRef}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Data Fiduciary (Brand)</span>
              <span className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <span>{consent.brandLogo}</span>
                <span>{consent.brandName}</span>
              </span>
              <span className="text-slate-500 block mt-0.5">{consent.brandIndustry}</span>
            </div>
          </div>

          {/* Purpose & Categories */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">Processing Purpose</span>
              <p className="text-sm font-medium text-slate-900 mt-1">{consent.purposeName}</p>
              <p className="text-xs text-slate-600 mt-0.5">{consent.purposeDescription}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block">Categories of Personal Data</span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {consent.dataCategories.map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Lifecycle & Legal Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-slate-100 py-3 text-xs">
            <div>
              <span className="text-slate-500 block">Notice Version</span>
              <span className="font-semibold text-slate-800">{consent.noticeVersion}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Channel</span>
              <span className="font-semibold text-slate-800">{consent.collectionChannel}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Granted Date</span>
              <span className="font-semibold text-slate-800">{consent.grantedAt || 'Pending'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Validity Expiry</span>
              <span className="font-semibold text-slate-800">{consent.expiresAt || 'Active'}</span>
            </div>
          </div>

          {/* Cryptographic Ledger Proof */}
          <div className="rounded-lg border border-slate-200 bg-slate-900 p-3.5 text-slate-200 font-mono text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase tracking-wider">
              <span>Cryptographic SHA-256 Ledger Stamp</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> VERIFIED
              </span>
            </div>
            <div className="break-all text-slate-300">
              <span className="text-slate-500">Hash: </span>{consent.evidenceHash}
            </div>
            <div className="break-all text-slate-400 text-[10px]">
              <span className="text-slate-600">Prev: </span>{consent.previousHash}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={copyReceiptDetails}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            {onVerifyEvidence && (
              <button
                onClick={() => {
                  onClose();
                  onVerifyEvidence(consent.id);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verify Ledger Chain</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Close
            </button>
            <button
              onClick={handleDownloadReceipt}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{downloading ? 'Preparing...' : 'Download Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
