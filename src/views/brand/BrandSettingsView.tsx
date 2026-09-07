import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { Settings, Check, Sparkles, Palette, ShieldCheck, Mail, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrandSettingsView: React.FC = () => {
  const { organizations } = useApp();
  const org = organizations.find(o => o.id === 'org_apex') || organizations[0];

  const [brandName, setBrandName] = useState(org.name);
  const [logoEmoji, setLogoEmoji] = useState(org.logo);
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [dpoEmail, setDpoEmail] = useState('dpo@apexfin.example.com');
  const [dpoName, setDpoName] = useState('Vikramaditya Sengupta');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Brand Governance & Customizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure white-label customer consent banners, Designated DPO details, and DPDP trust parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Fiduciary Branding & DPO Contact</h3>
            <p className="text-xs text-slate-500">Rendered in statutory Section 5 notices and receipts.</p>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Brand Legal Name</label>
            <input
              type="text"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Brand Icon / Emoji</label>
              <input
                type="text"
                value={logoEmoji}
                onChange={e => setLogoEmoji(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Accent Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                />
                <span className="font-mono text-xs text-slate-600">{primaryColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Designated Data Protection Officer (DPO)</label>
            <input
              type="text"
              value={dpoName}
              onChange={e => setDpoName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">DPO Statutory Grievance Email</label>
            <input
              type="email"
              value={dpoEmail}
              onChange={e => setDpoEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600">
                <Check className="h-4 w-4" /> Changes Applied Globally
              </span>
            ) : <span />}

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-2xs hover:bg-indigo-700"
            >
              Save Configuration
            </button>
          </div>
        </form>

        {/* Live Widget Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Live Consent Banner Preview</h3>
            <p className="text-xs text-slate-500">Real-time preview of the embedded widget Data Principals see.</p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{logoEmoji}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{brandName}</h4>
                    <span className="text-[10px] text-slate-400">DPDP Consent Request</span>
                  </div>
                </div>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Section 6 Ready
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                We require your explicit consent to process your profile data for personalized wealth insights and credit scoring.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-400">DPO: {dpoEmail}</span>
                <button
                  style={{ backgroundColor: primaryColor }}
                  className="rounded-lg px-3 py-1.5 font-bold text-white shadow-2xs"
                >
                  Agree & Authorize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
