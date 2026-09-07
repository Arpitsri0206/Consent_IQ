import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { Organization } from '../../types';
import { Building2, Plus, Search, CheckCircle2, X, Shield, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminOrganizationsView: React.FC = () => {
  const { organizations, addOrganization } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Fintech & NBFC');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [logo, setLogo] = useState('🏛️');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addOrganization({
      name,
      industry,
      logo: logo || '🏢',
      status: 'ACTIVE',
      adminEmail: adminEmail || 'admin@enterprise.in',
      adminName: adminName || 'Chief Compliance Officer',
      activeConsents: 120000,
      withdrawals: 1400,
      consentRate: 78.4,
      dataPrincipalsCount: 150000,
      plan: 'ENTERPRISE',
      createdAt: new Date().toISOString().split('T')[0]
    });

    confetti({ particleCount: 35, spread: 55 });
    setModalOpen(false);
    setName('');
    setAdminEmail('');
    setAdminName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Fiduciary Tenant Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Multi-tenant partition management, DPO compliance verification, and statutory DPDP governance.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>Provision New Tenant</span>
        </button>
      </div>

      {/* Grid of Tenants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map(org => (
          <div
            key={org.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{org.logo}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{org.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">{org.id}</span>
                </div>
              </div>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 font-mono">
                {org.plan}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div>
                <span className="text-slate-400">Industry: </span>
                <span className="font-medium text-slate-800">{org.industry}</span>
              </div>
              <div>
                <span className="text-slate-400">DPO Admin: </span>
                <span className="font-medium text-slate-800">{org.adminName}</span>
              </div>
              <div>
                <span className="text-slate-400">DPO Email: </span>
                <span className="font-mono text-[11px] text-slate-700">{org.adminEmail}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Active Consents</span>
                <span className="font-bold text-slate-900 font-mono">
                  {(org.activeConsents / 1000000).toFixed(2)}M
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Acceptance Rate</span>
                <span className="font-bold text-emerald-600 font-mono">{org.consentRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
              <span>Onboarded: {org.createdAt}</span>
              <span className="text-emerald-600 font-semibold">Active & Isolated</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Provision Tenant */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Provision New Data Fiduciary Tenant</h3>
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
                <label className="font-semibold text-slate-700 block mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Retail Digital Ltd"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Industry Sector</label>
                  <select
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Banking & Financial Services">Banking & Financial</option>
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Healthcare & Diagnostics">Healthcare & Pharma</option>
                    <option value="Telecom & ISP">Telecom & ISP</option>
                    <option value="Travel & Hospitality">Travel & Hospitality</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Icon / Logo Emoji</label>
                  <input
                    type="text"
                    value={logo}
                    onChange={e => setLogo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designated DPO Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Patel"
                  value={adminName}
                  onChange={e => setAdminName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">DPO Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="dpo@company.com"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
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
                  Provision Partition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
