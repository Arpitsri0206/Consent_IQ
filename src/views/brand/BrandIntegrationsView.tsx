import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { CollectionChannel, ChannelNotificationLog, NotificationDeliveryStatus } from '../../types';
import {
  Key,
  Copy,
  Check,
  Terminal,
  Code2,
  ShieldCheck,
  MessageCircle,
  MessageSquare,
  PhoneCall,
  Mail,
  Smartphone,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Eye,
  FileSpreadsheet,
  Settings2,
  Volume2,
  ChevronRight,
  Activity,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChannelNotificationLogModal } from '../../components/brand/ChannelNotificationLogModal';
import { ChannelSuccessSparkline, DailyMessageSuccessPoint } from '../../components/brand/ChannelSuccessSparkline';

export type ChannelConnectivityStatus = 'Online' | 'Offline' | 'Error' | 'Checking';

export interface ChannelGatewayConfig {
  id: CollectionChannel;
  name: string;
  provider: string;
  icon: React.ComponentType<{ className?: string }>;
  color: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconText: string;
  };
  enabled: boolean;
  connectivityStatus: ChannelConnectivityStatus;
  connectivityLatencyMs: number;
  lastChecked: string;
  endpoint: string;
  senderIdentifier: string;
  templateOrPilot: string;
  webhookStatus: string;
  avgLatency: string;
  successRate: string;
  statusDetails?: string;
  dailySuccessRates: DailyMessageSuccessPoint[];
  sparklineColor: {
    stroke: string;
    fillGradient: string;
    badgeBg: string;
    badgeText: string;
    text: string;
  };
}

const INITIAL_CHANNEL_CONFIGS: ChannelGatewayConfig[] = [
  {
    id: 'WhatsApp',
    name: 'WhatsApp Business API',
    provider: 'Meta Cloud API / Gupshup BSP',
    icon: MessageCircle,
    color: {
      bg: 'bg-emerald-50/40',
      border: 'border-emerald-200',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      iconBg: 'bg-emerald-600',
      iconText: 'text-white'
    },
    enabled: true,
    connectivityStatus: 'Online',
    connectivityLatencyMs: 42,
    lastChecked: 'Just now',
    endpoint: 'https://graph.facebook.com/v19.0/waba_apex_91823/health',
    senderIdentifier: 'WABA ID: waba_apex_91823 (+91 98765 00000)',
    templateOrPilot: 'Template: dpdp_consent_interactive_v2',
    webhookStatus: 'Webhook Active (https://api.apexbank.com/hooks/wa)',
    avgLatency: '420ms',
    successRate: '99.8%',
    statusDetails: 'Meta Graph API TLS handshake verified. Webhook ACK 200.',
    dailySuccessRates: [
      { day: 'Mon', date: 'Sep 01', successRate: 99.4, totalSent: 12400, delivered: 12325, failed: 75 },
      { day: 'Tue', date: 'Sep 02', successRate: 99.6, totalSent: 13800, delivered: 13745, failed: 55 },
      { day: 'Wed', date: 'Sep 03', successRate: 99.8, totalSent: 14200, delivered: 14171, failed: 29 },
      { day: 'Thu', date: 'Sep 04', successRate: 99.5, totalSent: 15100, delivered: 15024, failed: 76 },
      { day: 'Fri', date: 'Sep 05', successRate: 99.9, totalSent: 16800, delivered: 16783, failed: 17 },
      { day: 'Sat', date: 'Sep 06', successRate: 99.7, totalSent: 9400, delivered: 9372, failed: 28 },
      { day: 'Today', date: 'Sep 07', successRate: 99.8, totalSent: 11200, delivered: 11178, failed: 22 }
    ],
    sparklineColor: {
      stroke: '#059669',
      fillGradient: '#10b981',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      text: 'text-emerald-700'
    }
  },
  {
    id: 'SMS',
    name: 'Telecom SMS Gateway (DLT)',
    provider: 'Karix / Tanla Telecom SMSC',
    icon: MessageSquare,
    color: {
      bg: 'bg-blue-50/40',
      border: 'border-blue-200',
      text: 'text-blue-950',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      iconBg: 'bg-blue-600',
      iconText: 'text-white'
    },
    enabled: true,
    connectivityStatus: 'Online',
    connectivityLatencyMs: 118,
    lastChecked: 'Just now',
    endpoint: 'https://smsc.telecom.in/api/v3/dlt/healthcheck',
    senderIdentifier: 'DLT Header: VK-APEXBK (Entity: 140155289001)',
    templateOrPilot: 'Template ID: 11071689201948271 (2-Way: 56161)',
    webhookStatus: 'SMSC DLR Callbacks Connected',
    avgLatency: '1.2s',
    successRate: '98.4%',
    statusDetails: 'TRAI DLT Portal synced. Header VK-APEXBK active.',
    dailySuccessRates: [
      { day: 'Mon', date: 'Sep 01', successRate: 97.8, totalSent: 28400, delivered: 27775, failed: 625 },
      { day: 'Tue', date: 'Sep 02', successRate: 98.1, totalSent: 31200, delivered: 30607, failed: 593 },
      { day: 'Wed', date: 'Sep 03', successRate: 98.5, totalSent: 29800, delivered: 29353, failed: 447 },
      { day: 'Thu', date: 'Sep 04', successRate: 97.9, totalSent: 34100, delivered: 33384, failed: 716 },
      { day: 'Fri', date: 'Sep 05', successRate: 98.6, totalSent: 36500, delivered: 35989, failed: 511 },
      { day: 'Sat', date: 'Sep 06', successRate: 98.2, totalSent: 19400, delivered: 19051, failed: 349 },
      { day: 'Today', date: 'Sep 07', successRate: 98.4, totalSent: 22800, delivered: 22435, failed: 365 }
    ],
    sparklineColor: {
      stroke: '#2563eb',
      fillGradient: '#3b82f6',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-800',
      text: 'text-blue-700'
    }
  },
  {
    id: 'IVR',
    name: 'IVR Voice Telephony (SIP Trunk)',
    provider: 'Exotel / Twilio Voice Cloud',
    icon: PhoneCall,
    color: {
      bg: 'bg-purple-50/40',
      border: 'border-purple-200',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      iconBg: 'bg-purple-600',
      iconText: 'text-white'
    },
    enabled: true,
    connectivityStatus: 'Online',
    connectivityLatencyMs: 84,
    lastChecked: 'Just now',
    endpoint: 'sip:apex-ivr-gateway.telephony.cloud:5060/ping',
    senderIdentifier: 'Pilot Number: +91 1800-209-APEX (Toll-Free)',
    templateOrPilot: 'Bilingual Neural TTS (Hindi / English)',
    webhookStatus: 'SIP CDR & DTMF Webhook Connected',
    avgLatency: '840ms',
    successRate: '96.9%',
    statusDetails: 'SIP Trunk Registration 200 OK. DTMF Engine ready.',
    dailySuccessRates: [
      { day: 'Mon', date: 'Sep 01', successRate: 95.8, totalSent: 4200, delivered: 4023, failed: 177 },
      { day: 'Tue', date: 'Sep 02', successRate: 96.2, totalSent: 4800, delivered: 4617, failed: 183 },
      { day: 'Wed', date: 'Sep 03', successRate: 96.5, totalSent: 4600, delivered: 4439, failed: 161 },
      { day: 'Thu', date: 'Sep 04', successRate: 97.1, totalSent: 5100, delivered: 4952, failed: 148 },
      { day: 'Fri', date: 'Sep 05', successRate: 96.8, totalSent: 5400, delivered: 5227, failed: 173 },
      { day: 'Sat', date: 'Sep 06', successRate: 96.4, totalSent: 2800, delivered: 2699, failed: 101 },
      { day: 'Today', date: 'Sep 07', successRate: 96.9, totalSent: 3600, delivered: 3488, failed: 112 }
    ],
    sparklineColor: {
      stroke: '#9333ea',
      fillGradient: '#a855f7',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      text: 'text-purple-700'
    }
  },
  {
    id: 'Email',
    name: 'Transactional Email (DPDP Notice)',
    provider: 'SendGrid / AWS SES Dedicated IP',
    icon: Mail,
    color: {
      bg: 'bg-amber-50/40',
      border: 'border-amber-200',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      iconBg: 'bg-amber-600',
      iconText: 'text-white'
    },
    enabled: true,
    connectivityStatus: 'Online',
    connectivityLatencyMs: 145,
    lastChecked: 'Just now',
    endpoint: 'https://api.sendgrid.com/v3/scopes',
    senderIdentifier: 'From: privacy@apexbank.com (DKIM Verified)',
    templateOrPilot: 'Template: dpdp_consent_verification_v2',
    webhookStatus: 'Bounce & Open Webhook Active',
    avgLatency: '1.8s',
    successRate: '99.1%',
    statusDetails: 'SPF/DKIM/DMARC Pass. Dedicated IP 198.51.100.24 warmed.',
    dailySuccessRates: [
      { day: 'Mon', date: 'Sep 01', successRate: 98.7, totalSent: 18500, delivered: 18259, failed: 241 },
      { day: 'Tue', date: 'Sep 02', successRate: 98.9, totalSent: 19800, delivered: 19582, failed: 218 },
      { day: 'Wed', date: 'Sep 03', successRate: 99.2, totalSent: 21400, delivered: 21228, failed: 172 },
      { day: 'Thu', date: 'Sep 04', successRate: 99.0, totalSent: 22100, delivered: 21879, failed: 221 },
      { day: 'Fri', date: 'Sep 05', successRate: 99.4, totalSent: 24300, delivered: 24154, failed: 146 },
      { day: 'Sat', date: 'Sep 06', successRate: 98.8, totalSent: 14200, delivered: 14030, failed: 170 },
      { day: 'Today', date: 'Sep 07', successRate: 99.1, totalSent: 16900, delivered: 16748, failed: 152 }
    ],
    sparklineColor: {
      stroke: '#d97706',
      fillGradient: '#f59e0b',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      text: 'text-amber-700'
    }
  },
  {
    id: 'Mobile App',
    name: 'Mobile SDK Push & BottomSheet',
    provider: 'Firebase Cloud Messaging & iOS APNs',
    icon: Smartphone,
    color: {
      bg: 'bg-indigo-50/40',
      border: 'border-indigo-200',
      text: 'text-indigo-950',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      iconBg: 'bg-indigo-600',
      iconText: 'text-white'
    },
    enabled: true,
    connectivityStatus: 'Online',
    connectivityLatencyMs: 28,
    lastChecked: 'Just now',
    endpoint: 'https://fcm.googleapis.com/v1/projects/apex-bank/messages:send',
    senderIdentifier: 'App: com.apexbank.mobile (SDK v3.2)',
    templateOrPilot: 'Native In-App BottomSheet Consent Notice',
    webhookStatus: 'FCM Push Server Connected',
    avgLatency: '320ms',
    successRate: '99.5%',
    statusDetails: 'FCM & APNs token sync active. Push socket connected.',
    dailySuccessRates: [
      { day: 'Mon', date: 'Sep 01', successRate: 99.2, totalSent: 34200, delivered: 33926, failed: 274 },
      { day: 'Tue', date: 'Sep 02', successRate: 99.4, totalSent: 37800, delivered: 37573, failed: 227 },
      { day: 'Wed', date: 'Sep 03', successRate: 99.6, totalSent: 39100, delivered: 38943, failed: 157 },
      { day: 'Thu', date: 'Sep 04', successRate: 99.3, totalSent: 41200, delivered: 40911, failed: 289 },
      { day: 'Fri', date: 'Sep 05', successRate: 99.7, totalSent: 44500, delivered: 44366, failed: 134 },
      { day: 'Sat', date: 'Sep 06', successRate: 99.5, totalSent: 28900, delivered: 28755, failed: 145 },
      { day: 'Today', date: 'Sep 07', successRate: 99.5, totalSent: 31400, delivered: 31243, failed: 157 }
    ],
    sparklineColor: {
      stroke: '#4f46e5',
      fillGradient: '#6366f1',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      text: 'text-indigo-700'
    }
  }
];

const INITIAL_NOTIFICATION_LOGS: ChannelNotificationLog[] = [
  {
    id: 'NTF-892411',
    channel: 'WhatsApp',
    recipient: '+91 98765 43210',
    recipientName: 'Arpit Sharma',
    purposeId: 'purp_apex_marketing',
    purposeName: 'Personalized Financial Offers & Insights',
    templateId: 'dpdp_consent_interactive_v2',
    status: 'CONSENT_GRANTED',
    timestamp: 'Today, 10:14:22 AM',
    latencyMs: 420,
    evidenceHash: 'c3ab88192a0e41f99c82b9e847190f84a1e967d26458a01f7863be217a94ef92',
    messageContent:
      'Namaste Arpit, Apex Bank requests your DPDP consent to share tailored wealth recommendations & credit cards. Click [✅ Allow & Consent] or [❌ Decline]. Notice v2.1.',
    responsePayload: {
      webhookEvent: 'messages.interactive_button_reply',
      buttonId: 'btn_allow',
      buttonTitle: '✅ Allow & Consent',
      wabaMessageId: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSQjRDNzM3MjdGOUQ5MEU5MDIA',
      timestamp: '2026-09-07T10:14:22Z',
      deliveryTick: 'READ_DOUBLE_BLUE',
      principalHash: 'c3ab88192a0e41f99c82b9e847190f84a1e967d26458a01f7863be217a94ef92'
    }
  },
  {
    id: 'NTF-892410',
    channel: 'SMS',
    recipient: '+91 98111 22334',
    recipientName: 'Priya Sundaram',
    purposeId: 'purp_apex_kyc',
    purposeName: 'Digital KYC & WhatsApp Account Alerts',
    templateId: '11071689201948271',
    status: 'DELIVERED',
    timestamp: 'Today, 09:58:15 AM',
    latencyMs: 1180,
    evidenceHash: 'f19d20c384e5a90183bce4812f8d38e2109405ae817290bc9837123910ebca81',
    messageContent:
      'Apex Bank: Under DPDP Act 2023, consent is requested to process KYC data and send WhatsApp alerts. Reply YES to 56161 to allow. Template ID: 11071689201948271.',
    responsePayload: {
      smscStatus: 'DELIVRD',
      operator: 'Airtel Telecom India',
      dltHeader: 'VK-APEXBK',
      smscMsgId: 'SMSC-89104-9811122334',
      handsetReceiptTime: '2026-09-07T09:58:16Z'
    }
  },
  {
    id: 'NTF-892409',
    channel: 'IVR',
    recipient: '+91 98222 33445',
    recipientName: 'Vikram Mehra',
    purposeId: 'purp_apex_loan',
    purposeName: 'Credit Scoring & Pre-Approved Loan Eligibility',
    templateId: 'ivr_dpdp_bilingual_v1',
    status: 'CONSENT_GRANTED',
    timestamp: 'Today, 09:32:40 AM',
    latencyMs: 840,
    evidenceHash: '74a2b9183cc9801faecb9910d84710382901ebc894726190fadec718290128cb',
    messageContent:
      'Outbound SIP Telephony Call: "Namaste Vikram, Apex Bank loan verification desk seeking your DPDP consent for credit bureau scoring. Press 1 on your phone keypad to Allow, or Press 9 to Decline."',
    responsePayload: {
      sipCallDurationSec: 42,
      dtmfDigitReceived: '1',
      action: 'CONSENT_GRANTED',
      speechSynthesizerLanguage: 'hi-IN',
      recordedAudioProofUrl: 's3://vault-apex-evidence/audio/ivr_cns_892409.wav',
      cdrReference: 'CDR-EXOTEL-9822233445-892409'
    }
  },
  {
    id: 'NTF-892408',
    channel: 'WhatsApp',
    recipient: '+91 99887 76655',
    recipientName: 'Sneha Kapoor',
    purposeId: 'purp_apex_wealth',
    purposeName: 'Weekly Portfolio Insights & Market Alerts',
    templateId: 'dpdp_consent_interactive_v2',
    status: 'CONSENT_DENIED',
    timestamp: 'Today, 09:05:11 AM',
    latencyMs: 310,
    evidenceHash: '109ab72610c384fe90123847eecba190283749018274cbef901283746190abef',
    messageContent:
      'Apex Bank DPDP Notice: Consent requested to analyze stock portfolio holdings and send market alerts. Click [✅ Allow] or [❌ Decline].',
    responsePayload: {
      webhookEvent: 'messages.interactive_button_reply',
      buttonId: 'btn_deny',
      buttonTitle: '❌ Decline',
      feedback: 'Opting out of market updates',
      timestamp: '2026-09-07T09:05:12Z'
    }
  },
  {
    id: 'NTF-892407',
    channel: 'SMS',
    recipient: '+91 97654 32109',
    recipientName: 'Rohan Deshmukh',
    purposeId: 'purp_apex_marketing',
    purposeName: 'Marketing & Festive Co-Brand Promotions',
    templateId: '11071689201948271',
    status: 'FAILED',
    timestamp: 'Today, 08:41:02 AM',
    latencyMs: 4200,
    evidenceHash: '88bc710293847a910ecb48192019482710394817290184716290184710293847',
    messageContent:
      'Apex Bank: DPDP consent required for partner brand dining vouchers and cashback. Reply YES to 56161 to authorize.',
    errorMessage: 'SMSC Error: Handset unreachable / Telecom DND (Do-Not-Disturb) registry block active.',
    responsePayload: {
      smscStatus: 'UNDELIV',
      errorCode: 'ERR_DND_BLOCKED_TRAI',
      operator: 'Jio Telecom'
    }
  }
];

export const BrandIntegrationsView: React.FC = () => {
  const { apiKey, regenerateApiKey, mockApiCall, purposes } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [activeSdkTab, setActiveSdkTab] = useState<'whatsapp' | 'sms' | 'ivr' | 'react' | 'node' | 'rest'>('whatsapp');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Communication Channels Toggles & Connectivity State
  const [channelConfigs, setChannelConfigs] = useState<ChannelGatewayConfig[]>(INITIAL_CHANNEL_CONFIGS);
  const [isProbingAll, setIsProbingAll] = useState(false);

  // Test Dispatcher State
  const [simChannel, setSimChannel] = useState<CollectionChannel>('WhatsApp');
  const [simPhone, setSimPhone] = useState('+91 98765 43210');
  const [simName, setSimName] = useState('Arpit Sharma');
  const [simPurposeId, setSimPurposeId] = useState(purposes[0]?.id || 'purp_apex_marketing');
  const [simLanguage, setSimLanguage] = useState('en');
  const [simBehavior, setSimBehavior] = useState<'AUTO_GRANT' | 'AUTO_DENY' | 'AWAITING' | 'SIM_ERROR'>('AUTO_GRANT');
  const [isDispatching, setIsDispatching] = useState(false);
  const [lastDispatchedBanner, setLastDispatchedBanner] = useState<ChannelNotificationLog | null>(null);

  // Notification Logs Table State
  const [notificationLogs, setNotificationLogs] = useState<ChannelNotificationLog[]>(INITIAL_NOTIFICATION_LOGS);
  const [logFilterChannel, setLogFilterChannel] = useState<string>('ALL');
  const [logFilterStatus, setLogFilterStatus] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [inspectingLog, setInspectingLog] = useState<ChannelNotificationLog | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  const toggleChannel = (channelId: CollectionChannel) => {
    setChannelConfigs(prev =>
      prev.map(c => {
        if (c.id === channelId) {
          const nextEnabled = !c.enabled;
          return {
            ...c,
            enabled: nextEnabled,
            connectivityStatus: nextEnabled ? 'Online' : 'Offline',
            statusDetails: nextEnabled
              ? 'Gateway enabled by admin. Connectivity probe passed.'
              : 'Channel paused by admin toggle. Live dispatch disabled.'
          };
        }
        return c;
      })
    );
  };

  const setChannelMockStatus = (channelId: CollectionChannel, status: ChannelConnectivityStatus) => {
    setChannelConfigs(prev =>
      prev.map(c => {
        if (c.id === channelId) {
          let details = 'Gateway online & healthy.';
          let latency = Math.floor(25 + Math.random() * 80);
          if (status === 'Offline') {
            details = 'Gateway socket disconnected / service offline.';
            latency = 0;
          } else if (status === 'Error') {
            details =
              channelId === 'WhatsApp'
                ? 'HTTP 502: Meta WABA Cloud API handshake failure.'
                : channelId === 'SMS'
                ? 'Telecom DLT Gateway timeout (Error 504 Gateway Timeout).'
                : 'SIP Trunk registration lost (503 Service Unavailable).';
            latency = 3200;
          }
          return {
            ...c,
            connectivityStatus: status,
            connectivityLatencyMs: latency,
            lastChecked: 'Just now',
            statusDetails: details
          };
        }
        return c;
      })
    );
  };

  const runSingleChannelConnectivityCheck = (channelId: CollectionChannel) => {
    // Set to Checking
    setChannelConfigs(prev =>
      prev.map(c => (c.id === channelId ? { ...c, connectivityStatus: 'Checking' } : c))
    );

    setTimeout(() => {
      setChannelConfigs(prev =>
        prev.map(c => {
          if (c.id === channelId) {
            if (!c.enabled) {
              return {
                ...c,
                connectivityStatus: 'Offline',
                connectivityLatencyMs: 0,
                lastChecked: 'Just now',
                statusDetails: 'Admin switch is OFF. Gateway routing paused.'
              };
            }
            const pingLatency = Math.floor(20 + Math.random() * 65);
            return {
              ...c,
              connectivityStatus: 'Online',
              connectivityLatencyMs: pingLatency,
              lastChecked: 'Just now',
              statusDetails: `Mock ping probe completed successfully in ${pingLatency}ms. TLS 1.3 Verified.`
            };
          }
          return c;
        })
      );
    }, 700);
  };

  const runAllChannelsConnectivityChecks = () => {
    setIsProbingAll(true);
    // Set all to checking
    setChannelConfigs(prev =>
      prev.map(c => ({ ...c, connectivityStatus: 'Checking' }))
    );

    setTimeout(() => {
      setChannelConfigs(prev =>
        prev.map(c => {
          if (!c.enabled) {
            return {
              ...c,
              connectivityStatus: 'Offline',
              connectivityLatencyMs: 0,
              lastChecked: 'Just now',
              statusDetails: 'Channel disabled by admin.'
            };
          }
          const pingLatency = Math.floor(25 + Math.random() * 85);
          return {
            ...c,
            connectivityStatus: 'Online',
            connectivityLatencyMs: pingLatency,
            lastChecked: 'Just now',
            statusDetails: `Health probe verified in ${pingLatency}ms. All webhook listeners operational.`
          };
        })
      );
      setIsProbingAll(false);
      confetti({ particleCount: 20, spread: 50 });
    }, 900);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    const res = await mockApiCall('POST', '/api/v1/consent/request', {
      userRef: 'USR-8F3A2',
      purposeId: simPurposeId,
      channel: simChannel
    });
    setTestResponse(JSON.stringify(res, null, 2));
    setIsTesting(false);
    confetti({ particleCount: 25, spread: 45 });
  };

  const generateSha256 = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const handleDispatchNotification = () => {
    const currentConfig = channelConfigs.find(c => c.id === simChannel);
    if (currentConfig && !currentConfig.enabled) {
      alert(`The ${simChannel} communication channel is currently disabled. Please toggle it ON in the Communication Channel Gateways section above.`);
      return;
    }

    if (currentConfig && currentConfig.connectivityStatus === 'Error') {
      const proceed = window.confirm(
        `Warning: The ${simChannel} gateway is currently in an 'Error' state. Would you like to proceed with testing carrier error handling?`
      );
      if (!proceed) return;
    }

    setIsDispatching(true);

    setTimeout(() => {
      const logId = `NTF-${Date.now().toString().slice(-6)}`;
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const selectedPurpose = purposes.find(p => p.id === simPurposeId) || purposes[0];
      const purposeTitle = selectedPurpose ? selectedPurpose.name : 'Personalized Financial Offers & Insights';
      const evidenceHash = generateSha256();

      let finalStatus: NotificationDeliveryStatus = 'DISPATCHED';
      let latencyMs = 380;
      let messageContent = '';
      let responsePayload: Record<string, any> | undefined = undefined;
      let errorMessage: string | undefined = undefined;

      if (simBehavior === 'SIM_ERROR' || currentConfig?.connectivityStatus === 'Error') {
        finalStatus = 'FAILED';
        latencyMs = 3800;
        errorMessage = simChannel === 'SMS' 
          ? 'SMSC Error: Telecom DLT timeout / Handset DND active.' 
          : simChannel === 'WhatsApp' 
          ? 'Meta Cloud API Error: Handshake failed (HTTP 502).'
          : 'SIP Carrier Error: Call rejected by user / Busy tone.';
        messageContent = `Consent Request dispatched via ${simChannel} gateway for purpose: ${purposeTitle}.`;
        responsePayload = {
          errorCode: 'GATEWAY_DELIVERY_FAILURE',
          channel: simChannel,
          destination: simPhone,
          attempt: 1,
          timestamp: new Date().toISOString()
        };
      } else if (simBehavior === 'AUTO_GRANT') {
        finalStatus = 'CONSENT_GRANTED';
        latencyMs = simChannel === 'WhatsApp' ? 410 : simChannel === 'SMS' ? 980 : 1200;
        if (simChannel === 'WhatsApp') {
          messageContent = `Namaste ${simName}, Apex Bank requests your DPDP consent for "${purposeTitle}". Click [✅ Allow & Consent] or [❌ Decline]. Notice v2.1.`;
          responsePayload = {
            webhookEvent: 'messages.interactive_button_reply',
            buttonId: 'btn_allow',
            buttonTitle: '✅ Allow & Consent',
            wabaMessageId: `wamid.HBg${Date.now()}`,
            timestamp: new Date().toISOString(),
            deliveryTick: 'READ_DOUBLE_BLUE',
            evidenceHash
          };
        } else if (simChannel === 'SMS') {
          messageContent = `Apex Bank: Under DPDP Act, consent is requested for "${purposeTitle}". Reply YES to 56161 to allow. Template ID: 11071689201948271.`;
          responsePayload = {
            smscStatus: 'DELIVRD',
            replyKeyword: 'YES',
            dltHeader: 'VK-APEXBK',
            replyReceivedAt: new Date().toISOString(),
            evidenceHash
          };
        } else if (simChannel === 'IVR') {
          messageContent = `Outbound IVR SIP Call to ${simPhone}: "Namaste ${simName}, Apex Bank seeking voice consent for ${purposeTitle}. Press 1 to Allow, Press 9 to Decline."`;
          responsePayload = {
            sipCallDurationSec: 36,
            dtmfDigitReceived: '1',
            action: 'CONSENT_GRANTED',
            speechSynthesizerLanguage: simLanguage === 'hi' ? 'hi-IN' : 'en-IN',
            recordedAudioProofUrl: `s3://vault-apex-evidence/audio/ivr_cns_${logId}.wav`,
            evidenceHash
          };
        } else {
          messageContent = `Consent request dispatched via ${simChannel} for "${purposeTitle}".`;
          responsePayload = { action: 'CONSENT_GRANTED', timestamp: new Date().toISOString(), evidenceHash };
        }
      } else if (simBehavior === 'AUTO_DENY') {
        finalStatus = 'CONSENT_DENIED';
        latencyMs = 350;
        messageContent = `Consent Request dispatched via ${simChannel} for "${purposeTitle}". Recipient selected decline.`;
        responsePayload = {
          action: 'CONSENT_DECLINED',
          channel: simChannel,
          reason: 'User declined via interactive prompt',
          timestamp: new Date().toISOString()
        };
      } else {
        finalStatus = 'DELIVERED';
        latencyMs = 820;
        messageContent = `Consent Request sent via ${simChannel} for "${purposeTitle}". Delivered to handset; awaiting user action.`;
        responsePayload = {
          deliveryStatus: 'DELIVERED',
          channel: simChannel,
          timestamp: new Date().toISOString()
        };
      }

      const newLog: ChannelNotificationLog = {
        id: logId,
        channel: simChannel,
        recipient: simPhone,
        recipientName: simName,
        purposeId: simPurposeId,
        purposeName: purposeTitle,
        templateId: currentConfig?.templateOrPilot || 'dpdp_consent_v2',
        status: finalStatus,
        timestamp: `Today, ${now}`,
        latencyMs,
        evidenceHash,
        messageContent,
        responsePayload,
        errorMessage
      };

      setNotificationLogs(prev => [newLog, ...prev]);
      setLastDispatchedBanner(newLog);
      setIsDispatching(false);

      if (finalStatus === 'CONSENT_GRANTED') {
        confetti({ particleCount: 35, spread: 60 });
      }
    }, 600);
  };

  const handleExportCsv = () => {
    const headers = [
      'Tracking ID',
      'Channel',
      'Recipient Contact',
      'Recipient Name',
      'Purpose ID',
      'Purpose Name',
      'Status',
      'Sent Timestamp',
      'Latency (ms)',
      'Evidence SHA-256 Hash'
    ];

    const rows = filteredLogs.map(log => [
      `"${log.id}"`,
      `"${log.channel}"`,
      `"${log.recipient}"`,
      `"${log.recipientName || ''}"`,
      `"${log.purposeId}"`,
      `"${log.purposeName.replace(/"/g, '""')}"`,
      `"${log.status}"`,
      `"${log.timestamp}"`,
      log.latencyMs,
      `"${log.evidenceHash}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `consentiq-notification-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `consentiq-notification-logs-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyEvidenceHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const resetSampleLogs = () => {
    setNotificationLogs(INITIAL_NOTIFICATION_LOGS);
    setLastDispatchedBanner(null);
  };

  const clearAllLogs = () => {
    if (window.confirm('Are you sure you want to clear all mock notification logs?')) {
      setNotificationLogs([]);
      setLastDispatchedBanner(null);
    }
  };

  // Filtered Notification Logs
  const filteredLogs = notificationLogs.filter(log => {
    if (logFilterChannel !== 'ALL' && log.channel !== logFilterChannel) return false;
    if (logFilterStatus !== 'ALL' && log.status !== logFilterStatus) return false;
    if (logSearchQuery.trim() !== '') {
      const query = logSearchQuery.toLowerCase();
      const matchId = log.id.toLowerCase().includes(query);
      const matchRecipient = log.recipient.toLowerCase().includes(query);
      const matchName = log.recipientName?.toLowerCase().includes(query) || false;
      const matchPurpose = log.purposeName.toLowerCase().includes(query);
      const matchHash = log.evidenceHash.toLowerCase().includes(query);
      if (!matchId && !matchRecipient && !matchName && !matchPurpose && !matchHash) return false;
    }
    return true;
  });

  // Helper to render small connectivity status badge
  const renderConnectivityBadge = (status: ChannelConnectivityStatus, latency?: number, isCompact: boolean = false) => {
    switch (status) {
      case 'Online':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold ${
              isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
            }`}
            title="Gateway Connected & Online"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Online</span>
            {latency !== undefined && latency > 0 && (
              <span className="text-[10px] text-emerald-600 font-mono font-medium">({latency}ms)</span>
            )}
          </span>
        );
      case 'Offline':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-bold ${
              isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
            }`}
            title="Gateway Offline / Paused"
          >
            <WifiOff className="h-2.5 w-2.5 text-slate-400" />
            <span>Offline</span>
          </span>
        );
      case 'Error':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold ${
              isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
            }`}
            title="Gateway Connectivity Error"
          >
            <AlertTriangle className="h-2.5 w-2.5 text-rose-500" />
            <span>Error</span>
          </span>
        );
      case 'Checking':
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold ${
              isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'
            }`}
            title="Running Mock Connectivity Check..."
          >
            <RefreshCw className="h-2.5 w-2.5 text-blue-500 animate-spin" />
            <span>Checking...</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: NotificationDeliveryStatus) => {
    switch (status) {
      case 'CONSENT_GRANTED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Consent Granted</span>
          </span>
        );
      case 'CONSENT_DENIED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-[11px] font-bold border border-rose-200">
            <XCircle className="h-3 w-3 text-rose-600" />
            <span>Consent Declined</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[11px] font-bold border border-blue-200">
            <CheckCircle2 className="h-3 w-3 text-blue-600" />
            <span>Delivered</span>
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold border border-amber-200">
            <Send className="h-3 w-3 text-amber-600" />
            <span>Dispatched</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 text-red-800 px-2.5 py-0.5 text-[11px] font-bold border border-red-200">
            <XCircle className="h-3 w-3 text-red-600" />
            <span>Delivery Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-800 px-2.5 py-0.5 text-[11px] font-bold border border-slate-200">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const getChannelBadge = (channel: CollectionChannel) => {
    switch (channel) {
      case 'WhatsApp':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 px-2 py-0.5 text-xs font-bold border border-emerald-200">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </span>
        );
      case 'SMS':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 text-blue-800 px-2 py-0.5 text-xs font-bold border border-blue-200">
            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
            <span>SMS DLT</span>
          </span>
        );
      case 'IVR':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 text-purple-800 px-2 py-0.5 text-xs font-bold border border-purple-200">
            <PhoneCall className="h-3.5 w-3.5 text-purple-600" />
            <span>IVR Voice</span>
          </span>
        );
      case 'Email':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 px-2 py-0.5 text-xs font-bold border border-amber-200">
            <Mail className="h-3.5 w-3.5 text-amber-600" />
            <span>Email</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 text-indigo-800 px-2 py-0.5 text-xs font-bold border border-indigo-200">
            <Smartphone className="h-3.5 w-3.5 text-indigo-600" />
            <span>{channel}</span>
          </span>
        );
    }
  };

  const reactSnippet = `import { ConsentIQProvider, ConsentBanner } from '@consentiq/react';

export function App() {
  return (
    <ConsentIQProvider apiKey="${apiKey}" tenantId="org_apex">
      <ConsentBanner
        purposeId="purp_apex_marketing"
        channel="Web"
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
    "purposeId": "purp_apex_marketing",
    "noticeVersion": "v2.1",
    "channel": "WhatsApp",
    "recipientPhone": "+919876543210"
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

  const whatsappSnippet = `// Send WhatsApp Interactive Consent Request via ConsentIQ API
const response = await fetch('https://api.consentiq.io/v1/channels/whatsapp/dispatch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipientPhone: '+919876543210',
    templateName: 'dpdp_consent_interactive_v2',
    purposeId: 'purp_apex_marketing',
    interactiveButtons: [
      { id: 'btn_allow', title: '✅ Allow & Consent' },
      { id: 'btn_deny', title: '❌ Decline' }
    ]
  })
});
const result = await response.json();
console.log('WhatsApp Dispatched, Tracking ID:', result.trackingId);`;

  const smsSnippet = `// Send DLT Compliant SMS Double Opt-In
const response = await fetch('https://api.consentiq.io/v1/channels/sms/dispatch', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipientPhone: '+919876543210',
    dltHeader: 'VK-APEXBK',
    dltTemplateId: '11071689201948271',
    purposeId: 'purp_apex_kyc',
    replyKeyword: 'YES'
  })
});`;

  const ivrSnippet = `// Trigger Outbound Automated Voice Telephony Consent
const response = await fetch('https://api.consentiq.io/v1/channels/ivr/call', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipientPhone: '+919876543210',
    pilotNumber: '+9118002092739',
    language: 'hi', // Hindi / English bilingual
    purposeId: 'purp_apex_marketing',
    dtmfKeyForConsent: 1,
    dtmfKeyForDecline: 9,
    recordAudioProof: true
  })
});`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Omni-Channel Gateways & Communication Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure, toggle, test, and audit consent dispatch across WhatsApp, Telecom SMS, IVR Voice, Email, and Mobile Apps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runAllChannelsConnectivityChecks}
            disabled={isProbingAll}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100/80 shadow-2xs transition-colors disabled:opacity-60"
            title="Perform mock ping connectivity checks on all communication gateways"
          >
            <Activity className={`h-4 w-4 text-indigo-600 ${isProbingAll ? 'animate-spin' : ''}`} />
            <span>{isProbingAll ? 'Probing Gateways...' : 'Check All Gateways'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>DPDP Section 5 Compliant</span>
          </span>
        </div>
      </div>

      {/* SECTION 1: Communication Channel Gateways, Toggles, and Live Connectivity Badges */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">
              Communication Channel Gateways & Connectivity Health
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Real-time mock connectivity checks (Online/Offline/Error) and routing switches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channelConfigs.map(config => {
            const Icon = config.icon;
            return (
              <div
                key={config.id}
                className={`rounded-2xl border ${config.color.border} ${
                  config.enabled ? config.color.bg : 'bg-slate-50/70 opacity-85'
                } p-5 shadow-xs space-y-4 transition-all hover:shadow-sm`}
              >
                {/* Card Header with Icon, Name, Connectivity Badge, and Toggle Switch */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        config.enabled ? config.color.iconBg : 'bg-slate-400'
                      } text-white shadow-2xs`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {config.name}
                        </h3>
                        {/* Status badge next to channel name */}
                        {renderConnectivityBadge(config.connectivityStatus, config.connectivityLatencyMs, true)}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block">
                        {config.provider}
                      </span>
                    </div>
                  </div>

                  {/* Interactive Toggle Switch */}
                  <button
                    onClick={() => toggleChannel(config.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      config.enabled ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={config.enabled}
                    title={config.enabled ? `Disable ${config.name}` : `Enable ${config.name}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        config.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Connectivity & Health Status Summary Bar */}
                <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-3">
                  <div className="flex items-center gap-1.5">
                    {renderConnectivityBadge(config.connectivityStatus, config.connectivityLatencyMs)}
                  </div>

                  {/* Mock Connectivity State Selector */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => runSingleChannelConnectivityCheck(config.id)}
                      disabled={config.connectivityStatus === 'Checking'}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-white shadow-2xs transition-colors"
                      title="Run mock ping connectivity check"
                    >
                      <RefreshCw
                        className={`h-2.5 w-2.5 text-indigo-600 ${
                          config.connectivityStatus === 'Checking' ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Ping Check</span>
                    </button>

                    <select
                      value={config.connectivityStatus}
                      onChange={e =>
                        setChannelMockStatus(config.id, e.target.value as ChannelConnectivityStatus)
                      }
                      className="rounded-lg border border-slate-200 bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 focus:outline-hidden"
                      title="Simulate channel health (Online, Offline, Error)"
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Error">Error</option>
                    </select>
                  </div>
                </div>

                {/* Status Details / Health Explanation */}
                {config.statusDetails && (
                  <div
                    className={`rounded-lg p-2 text-[10px] font-mono leading-relaxed border ${
                      config.connectivityStatus === 'Error'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : config.connectivityStatus === 'Offline'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-emerald-50/70 text-emerald-900 border-emerald-100'
                    }`}
                  >
                    {config.statusDetails}
                  </div>
                )}

                {/* Gateway Metadata Summary */}
                <div className="rounded-xl bg-white/90 p-3 border border-slate-200/80 space-y-1.5 text-[11px]">
                  <div className="text-slate-600 font-mono text-[10px] truncate" title={config.senderIdentifier}>
                    {config.senderIdentifier}
                  </div>
                  <div className="text-slate-600 font-mono text-[10px] truncate" title={config.templateOrPilot}>
                    {config.templateOrPilot}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                    <span>Avg Latency: <strong className="text-slate-800">{config.avgLatency}</strong></span>
                    <span>Success Rate: <strong className="text-emerald-700">{config.successRate}</strong></span>
                  </div>
                </div>

                {/* 7-Day Message Success Rate Summary Sparkline Chart */}
                <ChannelSuccessSparkline
                  channelId={config.id}
                  channelName={config.name}
                  dailyData={config.dailySuccessRates}
                  color={config.sparklineColor}
                />

                {/* Card Quick Action */}
                <button
                  onClick={() => {
                    setSimChannel(config.id);
                    const el = document.getElementById('test-dispatcher-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  <Send className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Test {config.id} Dispatch</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Interactive Channel Testing & Test Consent Dispatcher */}
      <div id="test-dispatcher-section" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Interactive Consent Request Dispatcher & Channel Tester
              </h2>
              <p className="text-xs text-slate-500">
                Send live test notifications across WhatsApp, SMS, IVR, or Email to test message templates and recipient feedback flows.
              </p>
            </div>
          </div>

          <button
            onClick={handleDispatchNotification}
            disabled={isDispatching}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>{isDispatching ? 'Dispatching Test Notification...' : 'Dispatch Test Consent Request'}</span>
          </button>
        </div>

        {/* Dispatch Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Channel Select with Status Badge indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                1. Delivery Channel
              </label>
              {renderConnectivityBadge(
                channelConfigs.find(c => c.id === simChannel)?.connectivityStatus || 'Online',
                channelConfigs.find(c => c.id === simChannel)?.connectivityLatencyMs,
                true
              )}
            </div>
            <select
              value={simChannel}
              onChange={e => setSimChannel(e.target.value as CollectionChannel)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            >
              {channelConfigs.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} • [{c.connectivityStatus}] {!c.enabled ? '(Disabled)' : ''}
                </option>
              ))}
            </select>
            {channelConfigs.find(c => c.id === simChannel)?.enabled === false && (
              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                This channel is toggled OFF.
              </span>
            )}
            {channelConfigs.find(c => c.id === simChannel)?.connectivityStatus === 'Error' && (
              <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Channel is in Error state ({channelConfigs.find(c => c.id === simChannel)?.statusDetails}).
              </span>
            )}
          </div>

          {/* Test Recipient Phone / Contact */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              2. Target Phone / Handset
            </label>
            <input
              type="text"
              value={simPhone}
              onChange={e => setSimPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            />
            <div className="flex gap-1.5 text-[10px] text-indigo-600">
              <button
                type="button"
                onClick={() => {
                  setSimPhone('+91 98765 43210');
                  setSimName('Arpit Sharma');
                }}
                className="hover:underline font-semibold"
              >
                Preset: Arpit
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSimPhone('+91 98111 22334');
                  setSimName('Priya Sundaram');
                }}
                className="hover:underline font-semibold"
              >
                Priya
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setSimPhone('+91 98222 33445');
                  setSimName('Vikram Mehra');
                }}
                className="hover:underline font-semibold"
              >
                Vikram
              </button>
            </div>
          </div>

          {/* Purpose Select */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              3. DPDP Purpose
            </label>
            <select
              value={simPurposeId}
              onChange={e => setSimPurposeId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            >
              {purposes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Simulated Recipient Action */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
              4. Recipient Response Simulation
            </label>
            <select
              value={simBehavior}
              onChange={e => setSimBehavior(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="AUTO_GRANT">✅ Auto-Grant (User clicks Allow / DTMF 1)</option>
              <option value="AUTO_DENY">❌ Auto-Deny (User clicks Decline / DTMF 9)</option>
              <option value="AWAITING">⏳ Awaiting Action (Dispatched & Pending)</option>
              <option value="SIM_ERROR">⚠️ Carrier Failure (DND / Unreachable)</option>
            </select>
          </div>
        </div>

        {/* Live Channel Message Preview Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-indigo-600" />
              <span>Channel Handset Preview: {simChannel}</span>
              {renderConnectivityBadge(
                channelConfigs.find(c => c.id === simChannel)?.connectivityStatus || 'Online',
                channelConfigs.find(c => c.id === simChannel)?.connectivityLatencyMs,
                true
              )}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Recipient: {simName} ({simPhone})
            </span>
          </div>

          {/* Visual Channel Layout Simulator */}
          {simChannel === 'WhatsApp' && (
            <div className="max-w-md rounded-2xl bg-[#EFEAE2] p-4 border border-[#DAD2C8] space-y-2.5 shadow-xs">
              <div className="rounded-xl bg-white p-3 shadow-xs space-y-2 text-xs text-slate-800 font-sans">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Apex Financial Services (Official Business Account)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Namaste <strong>{simName}</strong>, Apex Bank requests your DPDP consent to process data for{' '}
                  <strong>{purposes.find(p => p.id === simPurposeId)?.name || 'Personalized Insights'}</strong>.
                </p>
                <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-1 flex justify-between">
                  <span>DPDP Notice Version: v2.1</span>
                  <span>10:14 AM ✓✓</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                <div className="rounded-xl bg-white py-2 text-emerald-600 shadow-xs border border-emerald-100 flex items-center justify-center gap-1">
                  <span>✅ Allow & Consent</span>
                </div>
                <div className="rounded-xl bg-white py-2 text-rose-600 shadow-xs border border-rose-100 flex items-center justify-center gap-1">
                  <span>❌ Decline</span>
                </div>
              </div>
            </div>
          )}

          {simChannel === 'SMS' && (
            <div className="max-w-md rounded-2xl bg-slate-100 p-4 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-bold text-slate-800">VK-APEXBK (DLT SMS)</span>
                <span>Just now</span>
              </div>
              <div className="rounded-xl bg-blue-600 p-3 text-white text-xs leading-relaxed shadow-xs">
                Apex Bank: Under DPDP Act 2023, consent is requested for{' '}
                {purposes.find(p => p.id === simPurposeId)?.name || 'Account Updates'}. Reply YES to 56161 to allow.
                Notice ID: notc_apex_v21.
              </div>
            </div>
          )}

          {simChannel === 'IVR' && (
            <div className="max-w-md rounded-2xl bg-purple-50 p-4 border border-purple-200 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-xs">
                <Volume2 className="h-4 w-4 text-purple-600 animate-pulse" />
                <span>Outbound Automated Voice Telephony (+91 1800-209-APEX)</span>
              </div>
              <div className="rounded-xl bg-white p-3 border border-purple-100 text-xs text-slate-700 italic leading-relaxed">
                "Namaste {simName}, this is an automated call from Apex Bank under India's DPDP Act. We are seeking
                your consent for {purposes.find(p => p.id === simPurposeId)?.name || 'KYC'}. Please press 1 on your
                phone dialpad to authorize, or press 9 to decline."
              </div>
              <div className="flex items-center justify-between text-[11px] text-purple-800 font-mono bg-purple-100/70 p-2 rounded-lg">
                <span>Key 1: Allow (Grant)</span>
                <span>Key 9: Decline</span>
                <span>Key 0: Repeat Notice</span>
              </div>
            </div>
          )}

          {simChannel === 'Email' && (
            <div className="max-w-md rounded-2xl bg-white p-4 border border-slate-200 space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">From: privacy@apexbank.com</span>
                <span className="text-[10px] text-emerald-600 font-bold">DKIM Signed</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs">
                DPDP Consent Request: {purposes.find(p => p.id === simPurposeId)?.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hello {simName}, please review and authorize data processing preferences for your account.
              </p>
              <div className="pt-2 flex gap-2">
                <span className="rounded-lg bg-indigo-600 text-white px-3 py-1 text-[11px] font-bold">
                  Review & Authorize
                </span>
              </div>
            </div>
          )}

          {simChannel === 'Mobile App' && (
            <div className="max-w-md rounded-2xl bg-slate-900 text-white p-4 space-y-2 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Apex Mobile Banking</span>
                <span>Push Notification</span>
              </div>
              <h4 className="font-bold text-white text-xs">DPDP Consent Verification Required</h4>
              <p className="text-xs text-slate-300">
                Tap to open the secure consent authorization sheet for {purposes.find(p => p.id === simPurposeId)?.name}.
              </p>
            </div>
          )}
        </div>

        {/* Success Banner of Last Dispatched Notification */}
        {lastDispatchedBanner && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Test Consent Request Dispatched ({lastDispatchedBanner.id})</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-700">{lastDispatchedBanner.timestamp}</span>
            </div>
            <p className="text-[11px] text-emerald-950 leading-relaxed font-mono bg-white/80 p-2.5 rounded-lg border border-emerald-100">
              {lastDispatchedBanner.messageContent}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-emerald-900 font-medium">
              <div className="flex items-center gap-2">
                <span>Channel: <strong>{lastDispatchedBanner.channel}</strong></span>
                <span>•</span>
                <span>Destination: <strong className="font-mono">{lastDispatchedBanner.recipient}</strong></span>
                <span>•</span>
                <span>Latency: <strong>{lastDispatchedBanner.latencyMs}ms</strong></span>
              </div>
              <button
                onClick={() => setInspectingLog(lastDispatchedBanner)}
                className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
              >
                <span>Inspect Trace JSON</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: Mock Notification & Consent Request Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base">
                Mock Notification & Consent Request Logs
              </h2>
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 font-bold text-indigo-700 text-xs border border-indigo-100">
                {filteredLogs.length} Records
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Complete audit trail of mock consent requests, carrier webhook callbacks, and SHA-256 evidence logs.
            </p>
          </div>

          {/* Log Export and Seed Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-indigo-600" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={resetSampleLogs}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-2xs transition-colors"
              title="Reset with 5 realistic sample dispatches"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Samples</span>
            </button>

            <button
              onClick={clearAllLogs}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 shadow-2xs transition-colors"
              title="Clear all logs"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={logSearchQuery}
              onChange={e => setLogSearchQuery(e.target.value)}
              placeholder="Search by Tracking ID, recipient phone, purpose, or hash..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          {/* Filter by Channel */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Channel:</span>
            <select
              value={logFilterChannel}
              onChange={e => setLogFilterChannel(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Channels</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">Telecom SMS</option>
              <option value="IVR">IVR Voice</option>
              <option value="Email">Email</option>
              <option value="Mobile App">Mobile App</option>
            </select>
          </div>

          {/* Filter by Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Status:</span>
            <select
              value={logFilterStatus}
              onChange={e => setLogFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONSENT_GRANTED">Consent Granted</option>
              <option value="CONSENT_DENIED">Consent Declined</option>
              <option value="DELIVERED">Delivered</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="FAILED">Delivery Failed</option>
            </select>
          </div>
        </div>

        {/* Logs Data Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="px-4 py-3">Tracking ID</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Recipient</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent Time / Latency</th>
                <th className="px-4 py-3">Evidence Hash</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-xs">
                    No notification logs found matching your filters. Try dispatching a test request above.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-600 whitespace-nowrap">
                      {log.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getChannelBadge(log.channel)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">{log.recipient}</div>
                      {log.recipientName && (
                        <div className="text-[11px] text-slate-500 font-sans">{log.recipientName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate" title={log.purposeName}>
                      <span className="font-semibold text-slate-800">{log.purposeName}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(log.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                      <div>{log.timestamp}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.latencyMs}ms transit</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-500 max-w-[90px] truncate">
                          {log.evidenceHash.slice(0, 12)}...
                        </span>
                        <button
                          onClick={() => copyEvidenceHash(log.evidenceHash, log.id)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                          title="Copy SHA-256 Hash"
                        >
                          {copiedHashId === log.id ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => setInspectingLog(log)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors"
                      >
                        <Eye className="h-3 w-3 text-indigo-600" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: API Key Management */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 shadow-2xs">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Production & Sandbox API Credentials</h3>
              <p className="text-xs text-slate-500">
                Use this secret key to authenticate your server, WhatsApp BSP, and IVR voice gateways.
              </p>
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

      {/* SECTION 5: SDK Documentation & Code Snippets Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Omni-Channel Integration Snippets</h3>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveSdkTab('whatsapp')}
              className={`rounded-md px-3 py-1 transition-all whitespace-nowrap ${
                activeSdkTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WhatsApp API
            </button>
            <button
              onClick={() => setActiveSdkTab('sms')}
              className={`rounded-md px-3 py-1 transition-all whitespace-nowrap ${
                activeSdkTab === 'sms' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Telecom SMS
            </button>
            <button
              onClick={() => setActiveSdkTab('ivr')}
              className={`rounded-md px-3 py-1 transition-all whitespace-nowrap ${
                activeSdkTab === 'ivr' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IVR Voice
            </button>
            <button
              onClick={() => setActiveSdkTab('react')}
              className={`rounded-md px-3 py-1 transition-all whitespace-nowrap ${
                activeSdkTab === 'react' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              React / Web
            </button>
            <button
              onClick={() => setActiveSdkTab('node')}
              className={`rounded-md px-3 py-1 transition-all whitespace-nowrap ${
                activeSdkTab === 'node' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Node.js
            </button>
            <button
              onClick={() => setActiveSdkTab('rest')}
              className={`rounded-md px-3 py-1 transition-all whitespace-nowrap ${
                activeSdkTab === 'rest' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              cURL / REST
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="rounded-xl bg-slate-900 p-4 text-slate-200 font-mono text-xs overflow-x-auto relative">
          <pre>
            {activeSdkTab === 'whatsapp'
              ? whatsappSnippet
              : activeSdkTab === 'sms'
              ? smsSnippet
              : activeSdkTab === 'ivr'
              ? ivrSnippet
              : activeSdkTab === 'react'
              ? reactSnippet
              : activeSdkTab === 'node'
              ? nodeSnippet
              : restSnippet}
          </pre>
        </div>
      </div>

      {/* SECTION 6: Interactive API Sandbox Runner */}
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

      {/* Channel Notification Log Details Modal */}
      <ChannelNotificationLogModal
        log={inspectingLog}
        onClose={() => setInspectingLog(null)}
      />
    </div>
  );
};
