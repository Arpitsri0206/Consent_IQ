import React from 'react';
import { ChannelNotificationLog } from '../../types';
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Mail,
  Smartphone,
  ShieldCheck,
  Copy,
  Check,
  Radio,
  ExternalLink,
  Terminal
} from 'lucide-react';

interface ChannelNotificationLogModalProps {
  log: ChannelNotificationLog | null;
  onClose: () => void;
}

export const ChannelNotificationLogModal: React.FC<ChannelNotificationLogModalProps> = ({
  log,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!log) return null;

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'WhatsApp':
        return <MessageCircle className="h-5 w-5 text-emerald-600" />;
      case 'SMS':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'IVR':
        return <PhoneCall className="h-5 w-5 text-purple-600" />;
      case 'Email':
        return <Mail className="h-5 w-5 text-amber-600" />;
      default:
        return <Smartphone className="h-5 w-5 text-indigo-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONSENT_GRANTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Consent Granted</span>
          </span>
        );
      case 'CONSENT_DENIED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-xs font-bold border border-rose-200">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>Consent Declined</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold border border-blue-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span>Delivered to Handset</span>
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold border border-amber-200">
            <Send className="h-3.5 w-3.5 text-amber-600" />
            <span>Dispatched / In-Flight</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 text-red-800 px-3 py-1 text-xs font-bold border border-red-200">
            <XCircle className="h-3.5 w-3.5 text-red-600" />
            <span>Delivery Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-800 px-3 py-1 text-xs font-bold border border-slate-200">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const copyPayload = () => {
    const payloadStr = JSON.stringify(
      {
        trackingId: log.id,
        channel: log.channel,
        recipient: log.recipient,
        recipientName: log.recipientName,
        purpose: log.purposeName,
        timestamp: log.timestamp,
        status: log.status,
        latencyMs: log.latencyMs,
        evidenceHash: log.evidenceHash,
        messageContent: log.messageContent,
        webhookPayload: log.responsePayload,
        errorMessage: log.errorMessage
      },
      null,
      2
    );
    navigator.clipboard.writeText(payloadStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs">
              {getChannelIcon(log.channel)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Consent Notification Trace: {log.id}
                </h3>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700 border border-indigo-100">
                  {log.channel}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Dispatched at {log.timestamp} • Latency {log.latencyMs}ms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status and Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Delivery Lifecycle Status
              </span>
              <div>{getStatusBadge(log.status)}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Recipient Target
              </span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800 text-xs">
                <span>{log.recipient}</span>
                {log.recipientName && (
                  <span className="text-slate-500 font-sans font-normal text-xs">
                    ({log.recipientName})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Purpose & Objective */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                DPDP Processing Purpose
              </span>
              <span className="font-mono text-[11px] text-indigo-600 font-bold">
                ID: {log.purposeId}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">{log.purposeName}</h4>
          </div>

          {/* Outbound Dispatched Message Content */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Outbound Dispatched Template & Payload
            </span>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 font-sans leading-relaxed border-l-4 border-l-indigo-600">
              {log.messageContent}
            </div>
          </div>

          {/* Error message if failed */}
          {log.errorMessage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Carrier / Gateway Error Diagnostic
              </span>
              <p className="text-rose-900 font-mono text-[11px]">{log.errorMessage}</p>
            </div>
          )}

          {/* Simulated Webhook & Response JSON */}
          {log.responsePayload && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-slate-400" />
                  <span>Gateway Webhook Payload & Call Metadata</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">200 OK Webhook Event</span>
              </div>
              <div className="rounded-xl bg-slate-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
                <pre>{JSON.stringify(log.responsePayload, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Cryptographic Proof Hash */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>SHA-256 Audit Trail Anchor</span>
              </span>
              <span className="text-[10px] text-slate-500">Immutable Hash</span>
            </div>
            <p className="font-mono text-[11px] text-slate-700 break-all bg-white p-2 rounded-lg border border-slate-200 select-all">
              {log.evidenceHash}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            onClick={copyPayload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Trace JSON' : 'Copy Trace JSON'}</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-slate-800 transition-colors"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
