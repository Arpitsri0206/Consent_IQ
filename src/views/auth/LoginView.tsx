import React from 'react';
import { useApp } from '../../services/store';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck, Building2, Lock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginViewProps {
  onSelectPersona: (role: UserRole, targetRoute: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSelectPersona }) => {
  const { switchRole } = useApp();

  const handleSelect = (role: UserRole, route: string) => {
    switchRole(role);
    confetti({ particleCount: 35, spread: 60 });
    onSelectPersona(role, route);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl space-y-8 relative z-10">
        {/* Brand title */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">ConsentIQ</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            DPDP Digital Consent & Trust Management Platform for India. Select a persona to launch the simulation.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Persona 1: Data Principal */}
          <div
            onClick={() => handleSelect('DATA_PRINCIPAL', '/user/dashboard')}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left transition-all hover:border-indigo-500 hover:bg-slate-800/90 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UserCheck className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">Data Principal</h3>
                <p className="text-xs text-indigo-400 font-medium">Individual Consumer (Arpit Sharma)</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Review, grant, inspect, and withdraw personal data consents across connected apps with one-click revocation.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
              <span>Enter Principal Portal</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Persona 2: Brand Admin */}
          <div
            onClick={() => handleSelect('BRAND_ADMIN', '/brand/dashboard')}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left transition-all hover:border-blue-500 hover:bg-slate-800/90 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">Brand Privacy Officer</h3>
                <p className="text-xs text-blue-400 font-medium">Apex Financial Services (Data Fiduciary)</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Publish Section 5 privacy notices, define purpose scopes, launch consent journeys, manage webhooks, and resolve DSRs.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-semibold text-blue-400 group-hover:text-blue-300">
              <span>Enter Fiduciary Console</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Persona 3: Platform Admin */}
          <div
            onClick={() => handleSelect('PLATFORM_ADMIN', '/admin/dashboard')}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left transition-all hover:border-purple-500 hover:bg-slate-800/90 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Lock className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-bold text-white text-base">Platform Super Admin</h3>
                <p className="text-xs text-purple-400 font-medium">ConsentIQ System Governance</p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor multi-tenant health, inspect Merkle tree proof integrity, rotate cryptographic HSM keys, and provision tenants.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4 text-xs font-semibold text-purple-400 group-hover:text-purple-300">
              <span>Enter Admin Center</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
