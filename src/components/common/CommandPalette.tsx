import React, { useState, useEffect } from 'react';
import { useApp } from '../../services/store';
import { Search, Shield, Building2, Target, FileText, ArrowRight, X, Clock, HelpCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConsent?: (id: string) => void;
  onNavigate?: (route: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectConsent,
  onNavigate
}) => {
  const { consents, organizations, purposes, notices, requests } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle will be handled outside if passed
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredConsents = consents.filter(
    c =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.brandName.toLowerCase().includes(query.toLowerCase()) ||
      c.purposeName.toLowerCase().includes(query.toLowerCase()) ||
      c.userRef.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOrgs = organizations.filter(
    o => o.name.toLowerCase().includes(query.toLowerCase()) || o.industry.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPurposes = purposes.filter(
    p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 pt-16 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center border-b border-slate-100 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search consents, organizations, purposes, notices or DSR tickets..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent px-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Consents */}
          {filteredConsents.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Consents ({filteredConsents.length})
              </span>
              <div className="mt-1 space-y-1">
                {filteredConsents.slice(0, 4).map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (onSelectConsent) onSelectConsent(c.id);
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-700 font-bold">
                        {c.brandLogo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{c.brandName}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-mono text-slate-500 text-[11px]">{c.id}</span>
                        </div>
                        <span className="text-slate-500 text-[11px] truncate block max-w-md">{c.purposeName}</span>
                      </div>
                    </div>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizations */}
          {filteredOrgs.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Data Fiduciaries ({filteredOrgs.length})
              </span>
              <div className="mt-1 space-y-1">
                {filteredOrgs.slice(0, 3).map(org => (
                  <div
                    key={org.id}
                    onClick={() => {
                      if (onNavigate) onNavigate('/brand/dashboard');
                      onClose();
                    }}
                    className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-sm">
                        {org.logo}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{org.name}</div>
                        <span className="text-slate-500 text-[11px]">{org.industry}</span>
                      </div>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {org.activeConsents.toLocaleString()} Consents
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty search fallback */}
          {filteredConsents.length === 0 && filteredOrgs.length === 0 && query.length > 0 && (
            <div className="p-8 text-center text-slate-500">
              <Search className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-medium">No records found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "Apex", "ShopKart", "Marketing", or "TA-CNS"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-500">
          <span>Tip: Use Tab or Arrow keys to navigate</span>
          <span className="font-mono">ConsentIQ Search Engine</span>
        </div>
      </div>
    </div>
  );
};
