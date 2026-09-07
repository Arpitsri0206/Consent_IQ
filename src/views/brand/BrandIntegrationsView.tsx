import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { Link, Key, Copy, Check, QrCode, Terminal, Code2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BrandIntegrationsView: React.FC = () => {
  const { apiKey, regenerateApiKey, mockApiCall } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSdkTab, setActiveSdkTab] = useState<'react' | 'rest' | 'node'>('react');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    const res = await mockApiCall('POST', '/api/v1/consent/request', {
      userRef: 'USR-8F3A2',
      purposeId: 'pur_mkt_01',
      channel: 'API_SDK'
    });
    setTestResponse(JSON.stringify(res, null, 2));
    setIsTesting(false);
    confetti({ particleCount: 25, spread: 45 });
  };

  const reactSnippet = `import { ConsentIQProvider, ConsentBanner } from '@consentiq/react';

export function App() {
  return (
    <ConsentIQProvider apiKey="${apiKey}" tenantId="org_apex">
      <ConsentBanner
        purposeId="pur_mkt_01"
        onGrant={(receipt) => console.log('Consent Granted:', receipt.evidenceHash)}
        onDeny={() => console.log('Consent Denied')}
      />
    </ConsentIQProvider>
  );
}`;

  const restSnippet = `curl -X POST https://api.consentiq.io/v1/consent/request \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userRef": "USR-8F3A2",
    "purposeId": "pur_mkt_01",
    "noticeVersion": "v2.1",
    "channel": "Web"
  }'`;

  const nodeSnippet = `import { ConsentIQClient } from '@consentiq/node';

const client = new ConsentIQClient({
  apiKey: '${apiKey}',
  tenantId: 'org_apex'
});

// Verify consent before downstream processing
const isAuthorized = await client.verifyConsent({
  userRef: 'USR-8F3A2',
  purpose: 'Personalized Marketing'
});

if (isAuthorized) {
  // Safe to process personal data under DPDP Act
}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Developer SDKs & Integration Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Plug-and-play SDKs for React, iOS, Android, Node.js, and REST APIs with live sandbox testing.
          </p>
        </div>
      </div>

      {/* API Key Management Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Production & Sandbox API Credentials</h3>
              <p className="text-xs text-slate-500">Use this secret key to authenticate your server and client integrations.</p>
            </div>
          </div>

          <button
            onClick={() => {
              regenerateApiKey();
              confetti({ particleCount: 20, spread: 40 });
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            Roll New Key
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
          <span className="flex-1 truncate text-slate-800 font-bold">{apiKey}</span>
          <button
            onClick={copyKey}
            className="flex items-center gap-1 rounded-lg bg-white px-3 py-1 font-sans text-xs font-semibold text-slate-700 border border-slate-200 shadow-2xs hover:bg-slate-100"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* SDK Documentation & Code Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Integration Quickstart Snippets</h3>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSdkTab('react')}
              className={`rounded-md px-3 py-1 transition-all ${
                activeSdkTab === 'react' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              React / Web
            </button>
            <button
              onClick={() => setActiveSdkTab('node')}
              className={`rounded-md px-3 py-1 transition-all ${
                activeSdkTab === 'node' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Node.js
            </button>
            <button
              onClick={() => setActiveSdkTab('rest')}
              className={`rounded-md px-3 py-1 transition-all ${
                activeSdkTab === 'rest' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              cURL / REST
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="rounded-xl bg-slate-900 p-4 text-slate-200 font-mono text-xs overflow-x-auto relative">
          <pre>{activeSdkTab === 'react' ? reactSnippet : activeSdkTab === 'node' ? nodeSnippet : restSnippet}</pre>
        </div>
      </div>

      {/* Interactive API Sandbox Simulator */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Interactive Sandbox Request Runner</h3>
          </div>

          <button
            onClick={handleTestApi}
            disabled={isTesting}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50"
          >
            <Terminal className="h-4 w-4" />
            <span>{isTesting ? 'Sending Request...' : 'Send Test Request'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Dispatches a real simulated request through the ConsentIQ API layer, generating immutable SHA-256 hashes and ledger entries.
        </p>

        {testResponse && (
          <div className="rounded-xl bg-slate-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
              Response 200 OK • Consent Created & Ledger Anchored:
            </span>
            <pre>{testResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
