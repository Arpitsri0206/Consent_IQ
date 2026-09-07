import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { DataSharingNode } from '../../types';
import { ShieldCheck, ArrowRight, Share2, Server, Database, Globe, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const DataSharingVisualMap: React.FC = () => {
  const { sharing, currentUser } = useApp();
  const [selectedNode, setSelectedNode] = useState<DataSharingNode | null>(null);

  return (
    <div className="space-y-6">
      {/* Node Detail Modal / Panel */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900">Data Transfer Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Source Fiduciary:</span>
                  <span className="font-bold text-slate-900">{selectedNode.sourceOrg}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Recipient Processor:</span>
                  <span className="font-bold text-indigo-700">{selectedNode.recipientOrg}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Processor Category:</span>
                  <span className="font-medium text-slate-700">{selectedNode.recipientCategory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Processing Status:</span>
                  <StatusBadge status={selectedNode.status} size="sm" />
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Processing Purpose</span>
                <p className="mt-1 text-slate-600">{selectedNode.purpose}</p>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Transferred Data Categories</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedNode.dataCategories.map(cat => (
                    <span
                      key={cat}
                      className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-400 block">Storage Jurisdiction</span>
                  <span className="font-medium text-slate-800">{selectedNode.jurisdiction}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Consent ID</span>
                  <span className="font-mono text-slate-800">{selectedNode.consentId}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Diagram Canvas */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">DPDP Data Sharing & Processor Graph</h3>
            <p className="text-xs text-slate-500">
              Interactive map tracking personal data flows across Data Fiduciaries and authorized downstream Processors.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active Transfer
            </span>
            <span className="flex items-center gap-1.5 font-medium text-purple-700">
              <span className="h-2 w-2 rounded-full bg-purple-500" /> Halted (Withdrawn)
            </span>
          </div>
        </div>

        {/* Root Principal Node */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-indigo-600 bg-indigo-50/80 px-6 py-3.5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              👤
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                Data Principal
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{currentUser.name}</h4>
              <span className="font-mono text-slate-500 text-xs">{currentUser.userRef}</span>
            </div>
          </div>

          {/* Connection Line */}
          <div className="h-8 w-0.5 bg-slate-300" />

          {/* Connected Fiduciaries Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {/* Apex Financial */}
            <div className="space-y-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-center shadow-xs">
                <span className="text-lg">🏦</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">Apex Financial Services</h5>
                <span className="text-[11px] text-blue-700 font-medium block">Data Fiduciary (BFSI)</span>
              </div>

              <div className="mx-auto h-4 w-0.5 bg-blue-300" />

              {/* Downstream nodes */}
              <div className="space-y-2.5">
                {sharing
                  .filter(s => s.tenantId === 'org_apex')
                  .map(node => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`cursor-pointer rounded-xl border p-3.5 text-xs transition-all hover:scale-[1.02] ${
                        node.status === 'ACTIVE'
                          ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                          : 'border-purple-200 bg-purple-50/40 hover:bg-purple-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{node.recipientOrg}</span>
                        <StatusBadge status={node.status} size="sm" />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-1">{node.purpose}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{node.dataCategories.join(', ')}</span>
                        <span className="text-indigo-600 font-medium">Inspect →</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* TravelKart */}
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-center shadow-xs">
                <span className="text-lg">✈️</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">TravelKart India</h5>
                <span className="text-[11px] text-emerald-700 font-medium block">Data Fiduciary (Travel)</span>
              </div>

              <div className="mx-auto h-4 w-0.5 bg-emerald-300" />

              <div className="space-y-2.5">
                {sharing
                  .filter(s => s.tenantId === 'org_travelkart')
                  .map(node => (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`cursor-pointer rounded-xl border p-3.5 text-xs transition-all hover:scale-[1.02] ${
                        node.status === 'ACTIVE'
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-purple-200 bg-purple-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{node.recipientOrg}</span>
                        <StatusBadge status={node.status} size="sm" />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 line-clamp-1">{node.purpose}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{node.dataCategories.join(', ')}</span>
                        <span className="text-indigo-600 font-medium">Inspect →</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* HealthPlus */}
            <div className="space-y-4">
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 text-center shadow-xs">
                <span className="text-lg">🩺</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">HealthPlus Labs</h5>
                <span className="text-[11px] text-rose-700 font-medium block">Data Fiduciary (Health)</span>
              </div>

              <div className="mx-auto h-4 w-0.5 bg-rose-300" />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-center text-slate-500">
                <span>Internal Encrypted Health Vault (No 3rd-party transfers)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
