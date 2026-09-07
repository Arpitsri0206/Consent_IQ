import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { DataCategory, CollectionChannel } from '../../types';
import {
  Layers,
  FileText,
  Users,
  Radio,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Globe,
  QrCode,
  Mail,
  MessageSquare,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConsentRequestBuilderProps {
  onComplete: () => void;
}

export const ConsentRequestBuilder: React.FC<ConsentRequestBuilderProps> = ({ onComplete }) => {
  const { purposes, notices, createConsentRequestWizard, grantConsent, organizations } = useApp();

  const [step, setStep] = useState(1);
  const [selectedPurposeId, setSelectedPurposeId] = useState(purposes[0]?.id || '');
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>([
    'Identity',
    'Contact',
    'Financial'
  ]);
  const [selectedNoticeId, setSelectedNoticeId] = useState(notices[0]?.id || '');
  const [audience, setAudience] = useState('All Retail Banking Customers (Segment: Active-2026)');
  const [channel, setChannel] = useState<CollectionChannel>('Web');
  const [previewAllowed, setPreviewAllowed] = useState(false);
  const [createdConsentId, setCreatedConsentId] = useState<string | null>(null);

  const selectedPurpose = purposes.find(p => p.id === selectedPurposeId) || purposes[0];
  const selectedNotice = notices.find(n => n.id === selectedNoticeId) || notices[0];
  const brandOrg = organizations.find(o => o.id === 'org_apex') || organizations[0];

  const allCategories: DataCategory[] = [
    'Identity',
    'Contact',
    'Financial',
    'Location',
    'Device',
    'Behavioural',
    'Employment',
    'Education',
    'Health'
  ];

  const channelOptions: { id: CollectionChannel; label: string; icon: any; desc: string }[] = [
    { id: 'Web', label: 'Web Modal / Embedded Banner', icon: Globe, desc: 'In-app modal pop-up on website login' },
    { id: 'Mobile App', label: 'Mobile SDK BottomSheet', icon: Smartphone, desc: 'Native Android/iOS consent prompt' },
    { id: 'QR Code', label: 'In-Branch QR Scan', icon: QrCode, desc: 'Point-of-Sale or Physical branch scan' },
    { id: 'Email', label: 'Transactional Email Link', icon: Mail, desc: 'Single-click signed consent magic link' },
    { id: 'SMS', label: 'OTP SMS Verification', icon: MessageSquare, desc: 'Verified mobile consent reply' },
    { id: 'API SDK', label: 'Headless REST API', icon: Cpu, desc: 'Server-to-server microservice ingestion' }
  ];

  const toggleCategory = (cat: DataCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handlePublish = () => {
    const consentId = createConsentRequestWizard({
      purposeId: selectedPurposeId,
      dataCategories: selectedCategories,
      noticeId: selectedNoticeId,
      channel,
      audience
    });
    setCreatedConsentId(consentId);
    setStep(7);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSimulateAllowInPreview = async () => {
    setPreviewAllowed(true);
    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span>DPDP Consent Request Builder</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Build unbundled, notice-backed consent journeys with real-time UI preview and instant deployment.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
            <span>Step {step} of 7</span>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="mt-5 grid grid-cols-7 gap-2">
          {[
            '1. Purpose',
            '2. Data Categories',
            '3. Notice',
            '4. Audience',
            '5. Channel',
            '6. Live Preview',
            '7. Published'
          ].map((label, idx) => (
            <div key={label} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step > idx + 1
                    ? 'bg-emerald-500'
                    : step === idx + 1
                    ? 'bg-indigo-600'
                    : 'bg-slate-200'
                }`}
              />
              <span className={`text-[10px] truncate block font-medium ${
                step === idx + 1 ? 'text-indigo-700 font-bold' : 'text-slate-500'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs min-h-[420px]">
        {/* Step 1: Select Purpose */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 1: Select Processing Purpose</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the business objective under which personal data will be collected and processed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {purposes.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPurposeId(p.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedPurposeId === p.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {p.processingType}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{p.description}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                    <span>Retention: {p.retentionPeriod}</span>
                    <span className="font-medium text-indigo-700">{p.dataCategories.length} Categories</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Data Categories */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 2: Granular Data Categories</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select only the data categories strictly required for this specific purpose (Data Minimization Principle).
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allCategories.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <div
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`cursor-pointer rounded-xl border p-4 text-xs font-semibold transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-600/10'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat}</span>
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              *Selected {selectedCategories.length} personal data categories for consent bundling.
            </p>
          </div>
        )}

        {/* Step 3: Privacy Notice */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 3: Attach DPDP Privacy Notice</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every consent request must accompany or precede an itemized Privacy Notice under Section 5.
              </p>
            </div>

            <div className="space-y-3">
              {notices.map(n => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNoticeId(n.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    selectedNoticeId === n.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                      <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800 font-mono">
                        {n.version}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">Effective: {n.effectiveDate}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{n.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Audience */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 4: Target Principal Audience</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define which customer cohorts or digital segments will receive this consent prompt.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: 'All Retail Banking Customers', desc: 'Broadcast to all 2.4M registered data principals upon sign-in' },
                { title: 'New Customer Onboarding Journey', desc: 'Trigger during KYC and account opening wizard' },
                { title: 'Wealth Management & Investment Tier', desc: 'Target portfolio investors exploring Mutual Funds' },
                { title: 'Specific Test Principal (Arpit Sharma - USR-8F3A2)', desc: 'Immediate instant delivery to demo user account' }
              ].map(opt => (
                <div
                  key={opt.title}
                  onClick={() => setAudience(opt.title)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    audience === opt.title
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-600/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900">{opt.title}</div>
                  <p className="mt-0.5 text-slate-600">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Collection Channel */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 5: Select Collection Channel</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select the touchpoint where the user interacts with the consent dialogue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {channelOptions.map(ch => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setChannel(ch.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 shadow-xs ring-2 ring-indigo-600/10'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-xs border border-slate-200 text-indigo-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 font-bold text-slate-900 text-xs">{ch.label}</div>
                    <p className="mt-1 text-[11px] text-slate-500">{ch.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Interactive Live Preview */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step 6: Live Interactive Consent Screen Preview</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Test the exact dialog seen by end-users. You can click 'Allow' or 'Decline' to test responsiveness.
              </p>
            </div>

            {/* The actual Consent Screen UI as required by Master Prompt Section 23 */}
            <div className="mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-xl">
              {/* Brand Top Header */}
              <div
                className="p-5 text-white"
                style={{ backgroundColor: brandOrg.primaryColor || '#2563eb' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{brandOrg.logo}</span>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide uppercase">{brandOrg.name}</h4>
                    <span className="text-[10px] text-blue-100 block">DPDP Consent Management Gateway</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{selectedPurpose.name}</h4>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    {selectedPurpose.description}
                  </p>
                </div>

                {/* Data categories list with checks */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Data Requested for this Purpose:
                  </span>
                  {selectedCategories.map(cat => (
                    <div key={cat} className="flex items-center gap-2 text-slate-800 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{cat}</span>
                    </div>
                  ))}
                </div>

                {/* Privacy Notice Link */}
                <div className="rounded-lg bg-blue-50/70 p-3 text-[11px] text-blue-900 flex items-center justify-between">
                  <span>Governed by {selectedNotice.title} ({selectedNotice.version})</span>
                  <span className="font-semibold underline cursor-pointer">Read Notice</span>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => alert('Decline clicked: Request will be rejected without collecting data.')}
                    className="w-1/2 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleSimulateAllowInPreview}
                    className="w-1/2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
                  >
                    {previewAllowed ? '✓ Allowed in Preview' : 'Allow & Consent'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Completed & Published */}
        {step === 7 && (
          <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Consent Request Published!</h3>
            <p className="text-xs text-slate-600">
              The consent journey has been deployed across the <span className="font-bold">{channel}</span> channel for <span className="font-bold">{audience}</span>.
            </p>
            {createdConsentId && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800">
                Tracking ID: {createdConsentId}
              </div>
            )}
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={onComplete}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                Go to Brand Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation */}
      {step < 7 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Publish Consent Request</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
