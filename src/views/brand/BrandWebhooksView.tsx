import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { WebhookConfig, WebhookDelivery } from '../../types';
import { Radio, Plus, Send, CheckCircle2, Clock, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrandWebhooksView: React.FC = () => {
  const { webhooks, addWebhook, triggerTestWebhook } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState('https://webhook.site/apex-privacy-stream');
  const [description, setDescription] = useState('Downstream Data Pipeline Sync');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'consent.granted',
    'consent.withdrawn',
    'processing.halted'
  ]);
  const [testLog, setTestLog] = useState<{ id: string; event: string; status: number; payload: any } | null>(null);

  const brandWebhooks = webhooks.filter(w => w.tenantId === 'org_apex');

  const toggleEvent = (evt: string) => {
    if (selectedEvents.includes(evt)) {
      setSelectedEvents(selectedEvents.filter(e => e !== evt));
    } else {
      setSelectedEvents([...selectedEvents, evt]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    addWebhook({
      url,
      events: selectedEvents,
      status: 'ACTIVE',
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}`
    });

    confetti({ particleCount: 25, spread: 45 });
    setModalOpen(false);
  };

  const handleSimulateDelivery = (hookId: string) => {
    const res = triggerTestWebhook(hookId, 'consent.withdrawn', {
      consentId: 'c_7f9b2',
      userRef: 'USR-8F3A2',
      status: 'WITHDRAWN',
      purpose: 'Marketing & Offers',
      downstreamInstruction: 'PURGE_AND_STOP_PROCESSING',
      timestamp: new Date().toISOString()
    });

    setTestLog({
      id: res.id,
      event: 'consent.withdrawn',
      status: res.statusCode,
      payload: res.payload
    });

    confetti({ particleCount: 30, spread: 50 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Webhooks & Real-Time Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Transmit real-time consent events and withdrawal halts directly into CRM, CDPs, and data warehouses.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Webhook Endpoint</span>
        </button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-4">
        {brandWebhooks.map(hook => (
          <div
            key={hook.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 font-mono text-sm">{hook.url}</h3>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      {hook.status}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">Secret: {hook.secret}</span>
                </div>
              </div>

              <button
                onClick={() => handleSimulateDelivery(hook.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 shadow-2xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Trigger Test Webhook (200 OK)</span>
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Subscribed Events:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {hook.events.map(e => (
                  <span
                    key={e}
                    className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
              <span>Success Rate: 99.8%</span>
              <span>Last Delivery: 2 mins ago</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Test Delivery Inspection Window */}
      {testLog && (
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-sm font-mono">Webhook Delivery Simulation (HTTP {testLog.status} OK)</h3>
            </div>
            <button
              onClick={() => setTestLog(null)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 text-xs"
            >
              Close
            </button>
          </div>

          <div className="font-mono text-xs text-emerald-400 overflow-x-auto">
            <pre>{JSON.stringify(testLog.payload, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Modal: Add Endpoint */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-base">Configure Webhook Endpoint</h3>
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
                <label className="font-semibold text-slate-700 block mb-1">Payload URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subscribed Event Triggers</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'consent.granted',
                    'consent.withdrawn',
                    'consent.expired',
                    'notice.updated',
                    'dsr.received',
                    'processing.halted'
                  ].map(evt => {
                    const sel = selectedEvents.includes(evt);
                    return (
                      <button
                        type="button"
                        key={evt}
                        onClick={() => toggleEvent(evt)}
                        className={`rounded-lg border p-2 text-left text-xs font-mono font-semibold ${
                          sel ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {sel ? '✓ ' : ''}{evt}
                      </button>
                    );
                  })}
                </div>
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
                  Save Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
