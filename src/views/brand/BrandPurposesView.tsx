import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { Purpose, ProcessingType, DataCategory } from '../../types';
import { Layers, Plus, CheckCircle2, X, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrandPurposesView: React.FC = () => {
  const { purposes, createPurpose } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [businessObjective, setBusinessObjective] = useState('');
  const [processingType, setProcessingType] = useState<ProcessingType>('Marketing');
  const [retentionPeriod, setRetentionPeriod] = useState('24 months');
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>(['Identity', 'Contact']);
  const [thirdParties, setThirdParties] = useState('FinCRM Cloud India, MarketingCloud Asia');

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

  const brandPurposes = purposes.filter(p => p.tenantId === 'org_apex');

  const toggleCategory = (cat: DataCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    createPurpose({
      name,
      description,
      businessObjective: businessObjective || description,
      processingType,
      retentionPeriod,
      dataCategories: selectedCategories,
      thirdParties: thirdParties.split(',').map(s => s.trim()).filter(Boolean),
      status: 'ACTIVE'
    });

    confetti({ particleCount: 30, spread: 50 });
    setModalOpen(false);
    setName('');
    setDescription('');
    setBusinessObjective('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Processing Purpose Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define specific, unbundled legal purposes under Section 6 of DPDP Act before requesting user consent.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Purpose</span>
        </button>
      </div>

      {/* Purpose Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brandPurposes.map(purpose => (
          <div
            key={purpose.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{purpose.name}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{purpose.id}</span>
              </div>
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                {purpose.processingType}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{purpose.description}</p>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Data Categories:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {purpose.dataCategories.map(cat => (
                  <span
                    key={cat}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
              <div>
                <span className="text-slate-400">Retention Limit: </span>
                <span className="font-semibold text-slate-800">{purpose.retentionPeriod}</span>
              </div>
              <div>
                <span className="text-slate-400">Processors: </span>
                <span className="font-medium text-slate-700">{purpose.thirdParties.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
              <span>Active Consents: {purpose.activeConsentsCount.toLocaleString()}</span>
              <span className="text-emerald-600 font-bold">DPDP Compliant (Unbundled)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Purpose */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Create Processing Purpose</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Purpose Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Personalized Wealth Advisory & Insights"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Processing Type</label>
                  <select
                    value={processingType}
                    onChange={e => setProcessingType(e.target.value as ProcessingType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Personalization">Personalization</option>
                    <option value="Account Management">Account Management</option>
                    <option value="Analytics">Analytics</option>
                    <option value="Fraud Prevention">Fraud Prevention</option>
                    <option value="Service Delivery">Service Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Retention Limit</label>
                  <input
                    type="text"
                    required
                    value={retentionPeriod}
                    onChange={e => setRetentionPeriod(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Plain Language Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain clearly to users why their data is processed..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Data Categories</label>
                <div className="grid grid-cols-3 gap-2">
                  {allCategories.map(cat => {
                    const sel = selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`rounded-lg border p-2 text-left text-xs font-semibold ${
                          sel ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {sel ? '✓ ' : ''}{cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Third-Party Processors (Comma-separated)</label>
                <input
                  type="text"
                  value={thirdParties}
                  onChange={e => setThirdParties(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-2xs hover:bg-indigo-700"
                >
                  Save & Publish Purpose
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
