import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../../services/store';
import {
  X,
  QrCode,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Sparkles,
  Camera,
  ScanLine,
  Building2,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserPrivacyPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt?: (consentId: string) => void;
}

export const UserPrivacyPassModal: React.FC<UserPrivacyPassModalProps> = ({
  isOpen,
  onClose,
  onOpenReceipt
}) => {
  const { currentUser, consents, grantConsent } = useApp();
  const [tab, setTab] = useState<'MY_PASS' | 'SCAN_BRANCH'>('MY_PASS');
  const [copiedLink, setCopiedLink] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);

  if (!isOpen) return null;

  const activeConsents = consents.filter(c => c.status === 'GRANTED');
  const passUrl = `https://consentiq.io/verify/pass/${currentUser.userRef}?id=${currentUser.id}&ts=${Date.now()}`;

  const copyPassLink = () => {
    navigator.clipboard.writeText(passUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateScan = async (branchName: string, purpose: string, consentId: string) => {
    setIsProcessingScan(true);
    setTimeout(async () => {
      setIsProcessingScan(false);
      setScannedResult(`Scanned ${branchName}: "${purpose}". Tap below to authorize instantly.`);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }, 600);
  };

  const handleAuthorizeScannedConsent = async () => {
    // Grant first pending or simulated consent
    const pending = consents.find(c => c.status === 'REQUESTED');
    if (pending) {
      await grantConsent(pending.id, 'QR Code');
    }
    setScannedResult('Consent Authorized via In-Branch QR Code! Ledger proof generated.');
    confetti({ particleCount: 50, spread: 70 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Digital Privacy Pass & QR Hub</h3>
              <p className="text-xs text-slate-500">Data Principal Identity & In-Branch Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setTab('MY_PASS')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
              tab === 'MY_PASS'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>My Privacy QR Pass</span>
          </button>
          <button
            onClick={() => setTab('SCAN_BRANCH')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all ${
              tab === 'SCAN_BRANCH'
                ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ScanLine className="h-4 w-4" />
            <span>Scan In-Branch QR Code</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 space-y-6">
          {tab === 'MY_PASS' ? (
            <div className="space-y-6">
              {/* QR Card Presentation */}
              <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 p-6 shadow-sm text-center space-y-5">
                <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      DPDP Section 6 Verified Pass
                    </span>
                  </div>
                  <span className="rounded-md bg-indigo-100/80 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-800">
                    PASS-{currentUser.userRef}
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="inline-block rounded-2xl bg-white p-4 shadow-md border border-slate-100">
                  <QRCodeSVG
                    value={passUrl}
                    size={190}
                    level="H"
                    includeMargin={false}
                    className="mx-auto"
                  />
                  <span className="block mt-2 font-mono text-[10px] text-slate-400">
                    Scan with any mobile camera or kiosk
                  </span>
                </div>

                {/* User Details */}
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900">{currentUser.name}</h4>
                  <p className="font-mono text-xs text-slate-500">{currentUser.email} • {currentUser.userRef}</p>
                </div>

                {/* Active Badges */}
                <div className="flex flex-wrap justify-center gap-2 pt-1 text-xs">
                  <span className="rounded-lg bg-emerald-100 px-3 py-1 font-bold text-emerald-800 flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {activeConsents.length} Active Consents
                  </span>
                  <span className="rounded-lg bg-indigo-100 px-3 py-1 font-bold text-indigo-800 flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                    Right to Withdraw Active
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={copyPassLink}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedLink ? 'Verification Link Copied' : 'Copy Public Verify URL'}</span>
                </button>

                <button
                  onClick={() => {
                    confetti({ particleCount: 30, spread: 50 });
                    alert(`Digital Privacy Pass saved to device for ${currentUser.name} (${currentUser.userRef})`);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-2xs"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Passcard</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Scan Branch QR Simulator */}
              <div className="rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/30 p-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
                  <Camera className="h-7 w-7 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm">In-Branch QR Code Scanner</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Visiting a physical bank branch, hospital counter, or retail store? Scan their DPDP Notice QR code to review and grant consent.
                  </p>
                </div>
              </div>

              {/* Preset Branch QR Samples for Demo */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Select a Branch QR Standee to Simulate:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() =>
                      handleSimulateScan(
                        'Apex Bank Mumbai Branch (Desk 4)',
                        'In-Person Account KYC & Biometric Verification',
                        'c_apex_01'
                      )
                    }
                    disabled={isProcessingScan}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Apex Bank Branch Desk</span>
                      <span className="text-[10px] text-slate-500">Notice v2.1 • In-Person KYC</span>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      handleSimulateScan(
                        'CureWell Health Clinic',
                        'Diagnostic Lab Record Sharing under DPDP',
                        'c_cure_02'
                      )
                    }
                    disabled={isProcessingScan}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">CureWell Clinic Counter</span>
                      <span className="text-[10px] text-slate-500">Notice v1.4 • Health Records</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Scan Result Output */}
              {scannedResult && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>QR Code Decoded Successfully</span>
                  </div>
                  <p className="text-slate-700 text-xs">{scannedResult}</p>
                  <button
                    onClick={handleAuthorizeScannedConsent}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 font-bold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Authorize In-Branch Consent (1-Click)</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
