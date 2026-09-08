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
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Globe,
  QrCode,
  Mail,
  MessageSquare,
  MessageCircle,
  PhoneCall,
  Building2,
  Cpu,
  Volume2,
  Lock,
  RotateCcw,
  Check,
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
  const [channel, setChannel] = useState<CollectionChannel>('WhatsApp');
  const [previewAllowed, setPreviewAllowed] = useState(false);
  const [previewDeclined, setPreviewDeclined] = useState(false);
  const [smsReplyState, setSmsReplyState] = useState<'pending' | 'yes' | 'no'>('pending');
  const [ivrKeyInput, setIvrKeyInput] = useState<string | null>(null);
  const [ivrPlaying, setIvrPlaying] = useState(true);
  const [ivrLanguage, setIvrLanguage] = useState<'en' | 'hi'>('en');
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

  const channelOptions: {
    id: CollectionChannel;
    label: string;
    icon: any;
    desc: string;
    badge?: string;
    color: string;
  }[] = [
    {
      id: 'WhatsApp',
      label: 'WhatsApp Interactive Chat',
      icon: MessageCircle,
      desc: 'Interactive BSP message with official green tick, quick buttons & instant consent',
      badge: 'Popular',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      id: 'SMS',
      label: 'Telecom SMS Double Opt-In',
      icon: MessageSquare,
      desc: 'DLT registered sender ID (e.g. VK-APEXBK) with 2-way reply or OTP link',
      badge: 'High Reach',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      id: 'IVR',
      label: 'IVR Telephony Voice Consent',
      icon: PhoneCall,
      desc: 'Automated voice call with DTMF keypress (Press 1 to consent) & audio evidence hash',
      badge: 'DPDP Audio Log',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      id: 'Web',
      label: 'Web Modal / Floating Banner',
      icon: Globe,
      desc: 'In-app modal pop-up or embedded banner on website login & onboarding',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      id: 'Mobile App',
      label: 'Mobile SDK BottomSheet',
      icon: Smartphone,
      desc: 'Native Android/iOS consent prompt with biometric authentication & passkey',
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      id: 'QR Code',
      label: 'Physical / POS QR Code',
      icon: QrCode,
      desc: 'Paperless consent scan at retail branches, merchant counters, or events',
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      id: 'Email',
      label: 'Transactional Email Magic Link',
      icon: Mail,
      desc: 'Cryptographically signed single-click email verification with DKIM assurance',
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      id: 'Assisted / Branch',
      label: 'Assisted Teller / Kiosk Tablet',
      icon: Building2,
      desc: 'In-branch bank executive assisted journey with customer e-signature pad',
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    },
    {
      id: 'API SDK',
      label: 'Headless REST API / Service',
      icon: Cpu,
      desc: 'Microservice-to-microservice headless ingestion with signed JWT payloads',
      color: 'text-slate-600 bg-slate-50 border-slate-200'
    }
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
    setPreviewDeclined(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const handleSimulateDeclineInPreview = () => {
    setPreviewDeclined(true);
    setPreviewAllowed(false);
  };

  const resetPreviewState = () => {
    setPreviewAllowed(false);
    setPreviewDeclined(false);
    setSmsReplyState('pending');
    setIvrKeyInput(null);
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
                Select the omni-channel touchpoint where data principals will review and grant their consent.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {channelOptions.map(ch => {
                const Icon = ch.icon;
                const isSelected = channel === ch.id;
                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setChannel(ch.id);
                      resetPreviewState();
                    }}
                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-600/15'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {ch.badge && (
                      <span className="absolute top-3 right-3 rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                        {ch.badge}
                      </span>
                    )}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-2xs ${ch.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-3 font-bold text-slate-900 text-xs">{ch.label}</div>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{ch.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 6: Interactive Live Preview */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Step 6: Live Interactive Channel Preview</h3>
                  <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                    Channel: {channel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test the exact interactive consent journey experienced by end-users on {channel}.
                </p>
              </div>

              {/* Reset Preview Button */}
              {(previewAllowed || previewDeclined || smsReplyState !== 'pending' || ivrKeyInput) && (
                <button
                  onClick={resetPreviewState}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Preview</span>
                </button>
              )}
            </div>

            {/* 1. WHATSAPP INTERACTIVE PREVIEW */}
            {channel === 'WhatsApp' && (
              <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-slate-800 bg-[#e5ddd5] shadow-2xl">
                {/* Phone Speaker Notch */}
                <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between border-b border-emerald-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center text-sm font-bold shadow-xs">
                      {brandOrg.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-bold text-xs">
                        <span>{brandOrg.name}</span>
                        <CheckCircle2 className="h-3 w-3 text-emerald-300 fill-emerald-400" />
                      </div>
                      <span className="text-[10px] text-emerald-200 block leading-tight">Official Business Account</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-200 font-mono">10:42 AM</div>
                </div>

                {/* WhatsApp Chat Body */}
                <div className="p-3.5 space-y-3 min-h-[380px] flex flex-col justify-between text-xs">
                  {/* Encryption Notice */}
                  <div className="mx-auto rounded-lg bg-amber-50/90 border border-amber-200/70 p-2 text-center text-[10px] text-amber-900 shadow-2xs max-w-xs">
                    🔒 Messages are end-to-end encrypted. Consent decisions are signed with DPDP SHA-256 evidence logs.
                  </div>

                  {/* Incoming Interactive Template Message Bubble */}
                  <div className="rounded-2xl rounded-tl-none bg-white p-3.5 shadow-sm border border-slate-200/80 space-y-2.5 max-w-[92%]">
                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      <span className="font-bold text-[11px] text-slate-900 uppercase tracking-wide">
                        DPDP Consent Request
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{selectedPurpose.name}</h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {selectedPurpose.description}
                      </p>
                    </div>

                    {/* Data Categories Requested */}
                    <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Requested Data Categories:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedCategories.map(cat => (
                          <span
                            key={cat}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold"
                          >
                            <Check className="h-2.5 w-2.5" />
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Notice Reference */}
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Notice: {selectedNotice.version}</span>
                      <span className="text-emerald-700 font-bold underline cursor-pointer">Read Terms</span>
                    </div>

                    {/* Quick Reply Buttons */}
                    {!previewAllowed && !previewDeclined && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <button
                          onClick={handleSimulateAllowInPreview}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Allow & Grant Consent</span>
                        </button>
                        <button
                          onClick={handleSimulateDeclineInPreview}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          Decline Request
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Outgoing User Confirmation Bubble */}
                  {previewAllowed && (
                    <div className="self-end rounded-2xl rounded-tr-none bg-[#dcf8c6] p-3 shadow-xs border border-emerald-200 text-slate-900 max-w-[85%] space-y-1 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-1 font-bold text-emerald-900 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Consent Granted</span>
                      </div>
                      <p className="text-[10px] text-emerald-950">
                        I agree to share my {selectedCategories.join(', ')} data with {brandOrg.name} for {selectedPurpose.name}.
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-emerald-800 pt-1 font-mono">
                        <span>Receipt #WA-9012</span>
                        <span>10:43 AM ✓✓</span>
                      </div>
                    </div>
                  )}

                  {previewDeclined && (
                    <div className="self-end rounded-2xl rounded-tr-none bg-rose-50 p-3 shadow-xs border border-rose-200 text-rose-950 max-w-[85%] space-y-1 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-1 font-bold text-rose-900 text-xs">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>Consent Declined</span>
                      </div>
                      <p className="text-[10px] text-rose-900">
                        Request declined. No personal data will be collected or processed.
                      </p>
                      <div className="text-right text-[9px] text-rose-700 font-mono">10:43 AM ✓✓</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SMS DOUBLE OPT-IN PREVIEW */}
            {channel === 'SMS' && (
              <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-slate-800 bg-slate-100 shadow-2xl">
                {/* SMS Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-sky-400" />
                    <div>
                      <div className="font-bold text-xs font-mono">VK-APEXBK</div>
                      <span className="text-[9px] text-slate-400">DLT Verified Banking Header</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">10:45 AM</span>
                </div>

                {/* SMS Thread */}
                <div className="p-4 space-y-3 min-h-[360px] flex flex-col justify-between text-xs">
                  <div className="space-y-3">
                    {/* Incoming SMS Bubble */}
                    <div className="rounded-2xl rounded-tl-none bg-white p-3.5 shadow-xs border border-slate-200 space-y-2 max-w-[90%]">
                      <p className="text-slate-800 text-[11px] leading-relaxed font-sans">
                        <span className="font-bold">{brandOrg.name}:</span> Dear Customer, we request your consent to process {selectedCategories.join(', ')} for '{selectedPurpose.name}' under DPDP Act 2023. Notice {selectedNotice.version}: https://apexfin.in/dpdp/{selectedNotice.id}.
                      </p>
                      <p className="text-[11px] font-semibold text-indigo-700">
                        Reply <span className="font-mono bg-indigo-50 px-1 py-0.5 rounded">YES</span> to allow, or <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">NO</span> to decline.
                      </p>
                      <span className="text-[9px] text-slate-400 block text-right font-mono">10:45 AM</span>
                    </div>

                    {/* Outgoing SMS Reply */}
                    {smsReplyState === 'yes' && (
                      <div className="self-end rounded-2xl rounded-tr-none bg-indigo-600 text-white p-2.5 shadow-xs max-w-[60%] text-right space-y-0.5 animate-in fade-in">
                        <span className="font-bold font-mono text-xs">YES</span>
                        <span className="text-[9px] text-indigo-200 block">10:46 AM • Delivered</span>
                      </div>
                    )}

                    {smsReplyState === 'no' && (
                      <div className="self-end rounded-2xl rounded-tr-none bg-slate-700 text-white p-2.5 shadow-xs max-w-[60%] text-right space-y-0.5 animate-in fade-in">
                        <span className="font-bold font-mono text-xs">NO</span>
                        <span className="text-[9px] text-slate-300 block">10:46 AM • Delivered</span>
                      </div>
                    )}

                    {/* Confirmation Inbound SMS */}
                    {smsReplyState === 'yes' && (
                      <div className="rounded-2xl rounded-tl-none bg-emerald-50 border border-emerald-200 p-3 shadow-xs text-[11px] text-emerald-950 space-y-1 animate-in fade-in">
                        <p className="font-bold flex items-center gap-1 text-emerald-900">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Consent Recorded Successfully
                        </p>
                        <p className="text-[10px] text-emerald-800">
                          Evidence Hash recorded in immutable ledger. Manage at https://consentiq.app. Ref #SMS-7821.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* SMS Quick Reply Simulator Controls */}
                  {smsReplyState === 'pending' && (
                    <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSmsReplyState('yes');
                          setPreviewAllowed(true);
                          confetti({ particleCount: 30, spread: 50 });
                        }}
                        className="rounded-xl bg-indigo-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
                      >
                        Simulate Reply 'YES'
                      </button>
                      <button
                        onClick={() => {
                          setSmsReplyState('no');
                          setPreviewDeclined(true);
                        }}
                        className="rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Simulate Reply 'NO'
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. IVR VOICE TELEPHONY CONSENT PREVIEW */}
            {channel === 'IVR' && (
              <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border-4 border-slate-800 bg-[#0f172a] text-white shadow-2xl">
                {/* Calling Header */}
                <div className="p-5 text-center border-b border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Call Active (00:18)
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setIvrLanguage('en')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ivrLanguage === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => setIvrLanguage('hi')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ivrLanguage === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        हिन्दी
                      </button>
                    </div>
                  </div>

                  <div className="w-14 h-14 mx-auto rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-2xl font-bold mb-2">
                    {brandOrg.logo}
                  </div>
                  <h4 className="font-bold text-sm text-white">{brandOrg.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">+91 1800-209-APEX (DPDP Tele-Line)</span>

                  {/* Audio Waveform Animation */}
                  <div className="flex items-center justify-center gap-1 mt-3 h-5">
                    {[16, 24, 32, 20, 28, 12, 26, 30, 18, 22].map((height, i) => (
                      <div
                        key={i}
                        className="w-1 bg-indigo-400 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.8s'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Speech Transcript & Interactive DTMF Keypad */}
                <div className="p-4 space-y-4 text-xs">
                  {/* Voice Script Prompt */}
                  <div className="rounded-xl bg-slate-800/80 border border-slate-700/60 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[10px] uppercase tracking-wider">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>IVR Voice Prompt Transcript ({ivrLanguage === 'en' ? 'English' : 'Hindi'}):</span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed italic">
                      {ivrLanguage === 'en'
                        ? `"Namaste. Under India's DPDP Act, Apex Financial requires your consent to process ${selectedCategories.join(', ')} for ${selectedPurpose.name}. Press 1 on your keypad to GRANT consent. Press 9 to DECLINE."`
                        : `"नमस्ते। भारत के DPDP अधिनियम के तहत, एपेक्स को '${selectedPurpose.name}' के लिए आपकी सहमति चाहिए। सहमति देने हेतु कृपया 1 दबाएं, या अस्वीकार करने हेतु 9 दबाएं।"`}
                    </p>
                  </div>

                  {/* DTMF Keypad (Digits) */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block text-center">
                      Interactive Phone Dialpad (Press 1 to Consent / 9 to Decline)
                    </span>

                    <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => {
                        const isActionKey = key === '1' || key === '9';
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setIvrKeyInput(key);
                              if (key === '1') {
                                handleSimulateAllowInPreview();
                              } else if (key === '9') {
                                handleSimulateDeclineInPreview();
                              }
                            }}
                            className={`h-11 rounded-xl font-bold flex flex-col items-center justify-center transition-all ${
                              key === '1'
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400/30'
                                : key === '9'
                                ? 'bg-rose-700 hover:bg-rose-600 text-white ring-2 ring-rose-400/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="text-sm leading-none">{key}</span>
                            {key === '1' && <span className="text-[8px] text-emerald-200 uppercase font-semibold">Consent</span>}
                            {key === '9' && <span className="text-[8px] text-rose-200 uppercase font-semibold">Decline</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decision Display */}
                  {ivrKeyInput === '1' && (
                    <div className="rounded-xl bg-emerald-950/80 border border-emerald-500/50 p-2.5 text-center text-[11px] text-emerald-300 animate-in fade-in">
                      <p className="font-bold">✓ Key '1' Pressed: Telephony Consent Granted!</p>
                      <p className="text-[9px] text-emerald-400 font-mono mt-0.5">
                        Audio SHA-256: 77a1bc9012ef44bca... (Call Logged)
                      </p>
                    </div>
                  )}

                  {ivrKeyInput === '9' && (
                    <div className="rounded-xl bg-rose-950/80 border border-rose-500/50 p-2.5 text-center text-[11px] text-rose-300 animate-in fade-in">
                      <p className="font-bold">❌ Key '9' Pressed: Telephony Consent Declined</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. WEB / MOBILE / EMAIL / QR PREVIEWS */}
            {(channel === 'Web' || channel === 'Mobile App' || channel === 'Email' || channel === 'QR Code' || channel === 'Assisted / Branch' || channel === 'API SDK') && (
              <div className="mx-auto max-w-md overflow-hidden rounded-2xl border-2 border-slate-300 bg-white shadow-xl">
                {/* Brand Top Header */}
                <div
                  className="p-5 text-white"
                  style={{ backgroundColor: brandOrg.primaryColor || '#2563eb' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{brandOrg.logo}</span>
                      <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase">{brandOrg.name}</h4>
                        <span className="text-[10px] text-blue-100 block">
                          DPDP Consent Management • {channel} Touchpoint
                        </span>
                      </div>
                    </div>
                    {channel === 'QR Code' && <QrCode className="h-6 w-6 text-white opacity-80" />}
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
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCategories.map(cat => (
                        <div key={cat} className="flex items-center gap-2 text-slate-800 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Notice Link */}
                  <div className="rounded-lg bg-blue-50/70 p-3 text-[11px] text-blue-900 flex items-center justify-between">
                    <span>Governed by {selectedNotice.title} ({selectedNotice.version})</span>
                    <span className="font-semibold underline cursor-pointer">Read Notice</span>
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSimulateDeclineInPreview}
                      className="w-1/2 rounded-xl border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {previewDeclined ? 'Declined' : 'Decline'}
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
            )}
          </div>
        )}

        {/* Step 7: Completed & Published */}
        {step === 7 && (
          <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Consent Journey Published!</h3>
            <p className="text-xs text-slate-600">
              The consent journey has been deployed across the <span className="font-bold text-indigo-600">{channel}</span> channel for <span className="font-bold">{audience}</span>.
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
