import {
  ConsentItem,
  ConsentEvent,
  Organization,
  Purpose,
  PrivacyNotice,
  DataPrincipalRequest,
  DataInventoryItem,
  DataSharingNode,
  WebhookEndpoint,
  WebhookDelivery,
  AuditEvent,
  AppNotification,
  UserProfile
} from '../types';
import { generateSyncHash } from './crypto';

export const INITIAL_USERS: Record<string, UserProfile> = {
  dataPrincipal: {
    id: 'usr_arpit_01',
    name: 'Arpit Sharma',
    email: 'arpit.demo@example.com',
    mobile: '+91 98765 43210',
    userRef: 'USR-8F3A2',
    role: 'DATA_PRINCIPAL',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  brandAdmin: {
    id: 'usr_rahul_02',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@apexfin.example.com',
    mobile: '+91 91234 56789',
    userRef: 'ADM-APEX-09',
    role: 'BRAND_ADMIN',
    orgId: 'org_apex',
    orgName: 'Apex Financial Services',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  platformAdmin: {
    id: 'usr_priya_03',
    name: 'Priya Nair',
    email: 'priya.nair@consent-iq.internal',
    mobile: '+91 99887 76655',
    userRef: 'SYS-OPS-01',
    role: 'PLATFORM_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  }
};

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_apex',
    name: 'Apex Financial Services',
    industry: 'BFSI & Wealth Management',
    logo: '🏦',
    primaryColor: '#2563eb',
    adminName: 'Rahul Mehta',
    adminRole: 'Chief Privacy Officer',
    adminEmail: 'rahul.mehta@apexfin.example.com',
    totalUsers: 2420000,
    activeConsents: 1820000,
    totalRequests: 2410000,
    withdrawals: 38400,
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-01-15',
    consentRate: 75.6,
    apiKey: 'ciq_live_apex_9a87dfb612e4',
    webhookUrl: 'https://api.apexfin.example.com/webhooks/dpdp-events',
    widgetCustomization: {
      accentColor: '#2563eb',
      borderRadius: 'lg',
      headerText: 'Apex Financial Trust & Consent',
      showNoticePreview: true
    }
  },
  {
    id: 'org_travelkart',
    name: 'TravelKart India',
    industry: 'Travel & Hospitality',
    logo: '✈️',
    primaryColor: '#059669',
    adminName: 'Sunita Rao',
    adminRole: 'Data Protection Officer',
    adminEmail: 'sunita@travelkart.example.com',
    totalUsers: 1450000,
    activeConsents: 980000,
    totalRequests: 1200000,
    withdrawals: 22100,
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-03-10',
    consentRate: 81.6,
    apiKey: 'ciq_live_travel_4c28bb9910d1',
    webhookUrl: 'https://api.travelkart.example.com/dpdp/consent-callback'
  },
  {
    id: 'org_healthplus',
    name: 'HealthPlus Clinics & Labs',
    industry: 'Healthcare & Diagnostics',
    logo: '🩺',
    primaryColor: '#dc2626',
    adminName: 'Dr. Vivek Saxena',
    adminRole: 'Clinical Data Officer',
    adminEmail: 'vivek@healthplus.example.com',
    totalUsers: 890000,
    activeConsents: 740000,
    totalRequests: 810000,
    withdrawals: 9400,
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-02-01',
    consentRate: 91.3,
    apiKey: 'ciq_live_health_3f89ee1029ba'
  },
  {
    id: 'org_shopkart',
    name: 'ShopKart Retail',
    industry: 'E-Commerce & Retail',
    logo: '🛍️',
    primaryColor: '#d97706',
    adminName: 'Ananya Verma',
    adminRole: 'Compliance Lead',
    adminEmail: 'ananya@shopkart.example.com',
    totalUsers: 3800000,
    activeConsents: 2600000,
    totalRequests: 3600000,
    withdrawals: 65000,
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-04-18',
    consentRate: 72.2,
    apiKey: 'ciq_live_shopkart_88d2ef9012'
  },
  {
    id: 'org_edusphere',
    name: 'EduSphere Learning',
    industry: 'EdTech & Certifications',
    logo: '🎓',
    primaryColor: '#7c3aed',
    adminName: 'Rohan Gupta',
    adminRole: 'Legal Counsel',
    adminEmail: 'rohan@edusphere.example.com',
    totalUsers: 620000,
    activeConsents: 510000,
    totalRequests: 580000,
    withdrawals: 8100,
    status: 'ACTIVE',
    plan: 'GROWTH',
    createdAt: '2024-05-12',
    consentRate: 87.9,
    apiKey: 'ciq_live_edu_29d4901aa8'
  },
  {
    id: 'org_teleconnect',
    name: 'TeleConnect Broadband',
    industry: 'Telecommunications',
    logo: '📡',
    primaryColor: '#0891b2',
    adminName: 'Manoj Pillai',
    adminRole: 'Privacy Manager',
    adminEmail: 'manoj@teleconnect.example.com',
    totalUsers: 5100000,
    activeConsents: 4200000,
    totalRequests: 4900000,
    withdrawals: 88000,
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-01-20',
    consentRate: 85.7,
    apiKey: 'ciq_live_tele_77a0bc4412'
  },
  {
    id: 'org_secureinsure',
    name: 'SecureInsure Life & General',
    industry: 'Insurance',
    logo: '🛡️',
    primaryColor: '#4f46e5',
    adminName: 'Kavita Joshi',
    adminRole: 'VP Compliance',
    adminEmail: 'kavita@secureinsure.example.com',
    totalUsers: 1900000,
    activeConsents: 1550000,
    totalRequests: 1800000,
    withdrawals: 29000,
    status: 'ACTIVE',
    plan: 'ENTERPRISE',
    createdAt: '2024-02-14',
    consentRate: 86.1,
    apiKey: 'ciq_live_insure_65c3dd8821'
  }
];

export const INITIAL_PURPOSES: Purpose[] = [
  {
    id: 'purp_apex_marketing',
    tenantId: 'org_apex',
    name: 'Personalized Financial Offers & Insights',
    description: 'Use customer contact & profile details to recommend customized investment funds, credit cards, and loan terms.',
    businessObjective: 'Deliver tailored credit and investment recommendations aligned with customer life stage.',
    processingType: 'Marketing',
    retentionPeriod: '24 months from grant date',
    dataCategories: ['Identity', 'Contact', 'Financial', 'Location'],
    thirdParties: ['FinCRM Cloud India', 'MarketingCloud Asia', 'MoEngage SMS Engine'],
    status: 'ACTIVE',
    activeConsentsCount: 1820000,
    createdAt: '2024-01-20'
  },
  {
    id: 'purp_apex_kyc',
    tenantId: 'org_apex',
    name: 'Account Management & Digital KYC',
    description: 'Process PAN, Aadhaar XML offline verification, and facial match for bank account maintenance.',
    businessObjective: 'Statutory compliance with RBI KYC master directions and DPDP mandate.',
    processingType: 'Account Management',
    retentionPeriod: '5 years after account closure',
    dataCategories: ['Identity', 'Contact', 'Financial', 'Employment'],
    thirdParties: ['UIDAI Offline KYC API', 'Karza Verification Gateway'],
    status: 'ACTIVE',
    activeConsentsCount: 2380000,
    createdAt: '2024-01-18'
  },
  {
    id: 'purp_apex_fraud',
    tenantId: 'org_apex',
    name: 'Real-time Fraud & Anomaly Prevention',
    description: 'Process device signals and transaction geolocations to protect accounts from unauthorized takeovers.',
    businessObjective: 'Prevent illicit access and detect fraudulent payment patterns.',
    processingType: 'Fraud Prevention',
    retentionPeriod: '12 months',
    dataCategories: ['Device', 'Location', 'Behavioural'],
    thirdParties: ['RiskShield AI Engine'],
    status: 'ACTIVE',
    activeConsentsCount: 2410000,
    createdAt: '2024-01-18'
  },
  {
    id: 'purp_shopkart_recs',
    tenantId: 'org_shopkart',
    name: 'Personalized Shopping Experience',
    description: 'Recommend products based on browsing behavior and purchase history with exclusive discount alerts.',
    businessObjective: 'Enhance e-commerce storefront relevance and customized merchandising.',
    processingType: 'Personalization',
    retentionPeriod: '18 months',
    dataCategories: ['Identity', 'Contact', 'Behavioural', 'Location'],
    thirdParties: ['ShopRec AI', 'CleverTap Push Services'],
    status: 'ACTIVE',
    activeConsentsCount: 2600000,
    createdAt: '2024-04-20'
  },
  {
    id: 'purp_travelkart_deals',
    tenantId: 'org_travelkart',
    name: 'Customized Holiday & Flight Recommendations',
    description: 'Process travel searches to send fare drop notifications and curated hotel itineraries.',
    businessObjective: 'Inform customers of seasonal discounts on frequented flight sectors.',
    processingType: 'Marketing',
    retentionPeriod: '12 months',
    dataCategories: ['Contact', 'Location', 'Behavioural'],
    thirdParties: ['Amadeus GDS', 'Gupshup WhatsApp API'],
    status: 'ACTIVE',
    activeConsentsCount: 980000,
    createdAt: '2024-03-12'
  },
  {
    id: 'purp_healthplus_telehealth',
    tenantId: 'org_healthplus',
    name: 'Tele-Consultation & Digital Health Records',
    description: 'Store diagnostic lab reports, vitals and prescription history accessible across network doctors.',
    businessObjective: 'Facilitate continuous patient care and Ayushman Bharat Digital Mission (ABDM) integration.',
    processingType: 'Service Delivery',
    retentionPeriod: '7 years from test date',
    dataCategories: ['Identity', 'Contact', 'Health', 'Location'],
    thirdParties: ['HealthCloud Secure Vault', 'Thyrocare Lab Sync'],
    status: 'ACTIVE',
    activeConsentsCount: 740000,
    createdAt: '2024-02-05'
  }
];

export const INITIAL_NOTICES: PrivacyNotice[] = [
  {
    id: 'notc_apex_v21',
    tenantId: 'org_apex',
    title: 'Apex Financial Master DPDP Privacy Notice',
    version: 'v2.1',
    status: 'PUBLISHED',
    effectiveDate: '2026-08-15',
    createdBy: 'Rahul Mehta (Privacy Officer)',
    updatedAt: '2026-08-15',
    summary: 'Updated in accordance with DPDP Rules 2026 detailing data fiduciary responsibilities, grievance redressal turnaround, and unbundled consent mechanisms.',
    clauses: [
      {
        id: 'c1',
        title: '1. Identity and Contact of Data Fiduciary',
        content: 'Apex Financial Services Ltd, Registered Office: Nariman Point, Mumbai 400021. Designated Data Protection Officer: dpo@apexfin.example.com.'
      },
      {
        id: 'c2',
        title: '2. Purpose of Processing & Categories of Personal Data',
        content: 'We process personal identifiers (Name, Email, Mobile), financial profile (income range, credit score proxy), and device telemetry strictly for personalized marketing and account servicing as approved by you.'
      },
      {
        id: 'c3',
        title: '3. Data Sharing & Third-Party Processors',
        content: 'Your data is shared only with vetted cloud processors (FinCRM India, MoEngage) located in certified Indian data centers. We never sell personal data to brokers.'
      },
      {
        id: 'c4',
        title: '4. Rights of Data Principal & Withdrawal Procedure',
        content: 'You may withdraw consent at any time via ConsentIQ portal without cost. You have the right to access, correct, or request deletion of data subject to mandatory RBI retention laws.'
      },
      {
        id: 'c5',
        title: '5. Grievance Redressal Mechanism',
        content: 'Grievance Officer: Mr. Sameer Verma, grievances@apexfin.example.com. Turnaround time: Maximum 72 business hours.'
      }
    ],
    changelog: 'Added explicit cross-border transfer guarantees and simplified vernacular summaries.'
  },
  {
    id: 'notc_apex_v20',
    tenantId: 'org_apex',
    title: 'Apex Financial Master DPDP Privacy Notice',
    version: 'v2.0',
    status: 'SUPERSEDED',
    effectiveDate: '2026-01-10',
    createdBy: 'Rahul Mehta',
    updatedAt: '2026-01-10',
    summary: 'Previous baseline notice for digital wealth platform operations.',
    clauses: [
      {
        id: 'c1',
        title: '1. Data Fiduciary Contact',
        content: 'Apex Financial Services Ltd. Contact: privacy@apexfin.example.com.'
      },
      {
        id: 'c2',
        title: '2. Processing Scope',
        content: 'General processing of customer contact details for advisory communication.'
      }
    ]
  },
  {
    id: 'notc_shopkart_v13',
    tenantId: 'org_shopkart',
    title: 'ShopKart Customer Privacy & Personalization Notice',
    version: 'v1.3',
    status: 'PUBLISHED',
    effectiveDate: '2026-06-01',
    createdBy: 'Ananya Verma',
    updatedAt: '2026-06-01',
    summary: 'Explains e-commerce behavioral tracking, shopping cart retention, and targeted product recommendations.',
    clauses: [
      {
        id: 'sk_c1',
        title: '1. Collection & Purpose Scope',
        content: 'ShopKart collects name, delivery coordinates, browsing signals and purchase history to provide optimized deal alerts.'
      },
      {
        id: 'sk_c2',
        title: '2. Your Rights Under DPDP Act',
        content: 'You can toggle marketing preferences, delete your search history, or withdraw recommendation consent via ConsentIQ dashboard.'
      }
    ]
  }
];

export const INITIAL_CONSENTS: ConsentItem[] = [
  {
    id: 'TA-CNS-2026-000123',
    tenantId: 'org_apex',
    brandName: 'Apex Financial Services',
    brandLogo: '🏦',
    brandIndustry: 'BFSI & Wealth Management',
    purposeId: 'purp_apex_marketing',
    purposeName: 'Personalized Financial Offers & Insights',
    purposeDescription: 'To provide personalized financial product recommendations, loan insights, and relevant portfolio offers.',
    businessObjective: 'Deliver tailored credit and investment recommendations.',
    dataCategories: ['Identity', 'Contact', 'Financial', 'Location'],
    status: 'GRANTED',
    grantedAt: '2026-09-02 10:42 AM IST',
    expiresAt: '2028-09-02 10:42 AM IST',
    requestedAt: '2026-09-02 10:35 AM IST',
    noticeVersion: 'v2.1',
    noticeId: 'notc_apex_v21',
    collectionChannel: 'Web',
    retentionPeriod: '24 months',
    thirdParties: ['FinCRM Cloud India', 'MarketingCloud Asia', 'MoEngage SMS Engine'],
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    evidenceHash: '9f3a4b8e21d78a9c0012f45ea3bc9081e77d24a91c0e3f88b901cd45e12a99bc',
    previousHash: '77ab92cd091f82e345b128fa9c445ee1098bca4391e00f912a3488dc9901ef23'
  },
  {
    id: 'TA-CNS-2026-000124',
    tenantId: 'org_apex',
    brandName: 'Apex Financial Services',
    brandLogo: '🏦',
    brandIndustry: 'BFSI & Wealth Management',
    purposeId: 'purp_apex_fraud',
    purposeName: 'Real-time Fraud & Anomaly Prevention',
    purposeDescription: 'Monitors device signals and session IP telemetry to identify unauthorized sign-ins.',
    businessObjective: 'Protect user wealth from cyber threats and suspicious activity.',
    dataCategories: ['Device', 'Location', 'Behavioural'],
    status: 'GRANTED',
    grantedAt: '2026-08-10 09:15 AM IST',
    expiresAt: '2027-08-10 09:15 AM IST',
    requestedAt: '2026-08-10 09:10 AM IST',
    noticeVersion: 'v2.1',
    noticeId: 'notc_apex_v21',
    collectionChannel: 'Mobile App',
    retentionPeriod: '12 months',
    thirdParties: ['RiskShield AI Engine'],
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    evidenceHash: '4a8b71cf0981e42ba9c8789ef0123984aa910cbe77298d01ef8324a9b0c128ef',
    previousHash: '9f3a4b8e21d78a9c0012f45ea3bc9081e77d24a91c0e3f88b901cd45e12a99bc'
  },
  {
    id: 'TA-CNS-2026-000125',
    tenantId: 'org_travelkart',
    brandName: 'TravelKart India',
    brandLogo: '✈️',
    brandIndustry: 'Travel & Hospitality',
    purposeId: 'purp_travelkart_deals',
    purposeName: 'Personalized Travel Deals & Fare Alerts',
    purposeDescription: 'Sends customized flight deals and vacation package discounts based on search trends.',
    businessObjective: 'Seasonal vacation promotion and booking recommendations.',
    dataCategories: ['Contact', 'Location', 'Behavioural'],
    status: 'WITHDRAWN',
    grantedAt: '2026-07-15 02:20 PM IST',
    withdrawnAt: '2026-08-29 02:12 PM IST',
    requestedAt: '2026-07-15 02:15 PM IST',
    noticeVersion: 'v1.4',
    noticeId: 'notc_travelkart_v14',
    collectionChannel: 'Web',
    retentionPeriod: '12 months',
    thirdParties: ['Amadeus GDS', 'Gupshup WhatsApp API'],
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    evidenceHash: '8b9c001ef45281a9cd0981e7724a10c99f3a4b8e21d78a9c0012f45ea3bc9081',
    previousHash: '4a8b71cf0981e42ba9c8789ef0123984aa910cbe77298d01ef8324a9b0c128ef'
  },
  {
    id: 'TA-CNS-2026-000126',
    tenantId: 'org_healthplus',
    brandName: 'HealthPlus Clinics & Labs',
    brandLogo: '🩺',
    brandIndustry: 'Healthcare & Diagnostics',
    purposeId: 'purp_healthplus_telehealth',
    purposeName: 'Tele-Consultation & Digital Health Records',
    purposeDescription: 'Maintains digital prescription and diagnostic test repository for continuous doctor care.',
    businessObjective: 'Patient diagnostic access and doctor consultation facilitation.',
    dataCategories: ['Identity', 'Contact', 'Health'],
    status: 'GRANTED',
    grantedAt: '2026-08-01 11:00 AM IST',
    expiresAt: '2033-08-01 11:00 AM IST',
    requestedAt: '2026-08-01 10:50 AM IST',
    noticeVersion: 'v2.0',
    noticeId: 'notc_healthplus_v20',
    collectionChannel: 'Mobile App',
    retentionPeriod: '7 years',
    thirdParties: ['HealthCloud Secure Vault', 'Thyrocare Lab Sync'],
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    evidenceHash: 'c90128efa3488dc9901ef2377ab92cd091f82e345b128fa9c445ee1098bca439',
    previousHash: '8b9c001ef45281a9cd0981e7724a10c99f3a4b8e21d78a9c0012f45ea3bc9081'
  },
  {
    id: 'TA-CNS-2026-000127',
    tenantId: 'org_shopkart',
    brandName: 'ShopKart Retail',
    brandLogo: '🛍️',
    brandIndustry: 'E-Commerce & Retail',
    purposeId: 'purp_shopkart_recs',
    purposeName: 'Personalized Shopping Experience',
    purposeDescription: 'To personalize product recommendations, curated sales, and customized search results.',
    businessObjective: 'Tailor merchandising and shopping convenience.',
    dataCategories: ['Identity', 'Contact', 'Behavioural'],
    status: 'REQUESTED',
    requestedAt: '2026-09-02 08:30 AM IST',
    noticeVersion: 'v1.3',
    noticeId: 'notc_shopkart_v13',
    collectionChannel: 'Web',
    retentionPeriod: '18 months',
    thirdParties: ['ShopRec AI', 'CleverTap Push Services'],
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    evidenceHash: '5e7a91bf33c82901ad4487ef99012a88bf019c4391e00f912a3488dc9901ef23',
    previousHash: 'c90128efa3488dc9901ef2377ab92cd091f82e345b128fa9c445ee1098bca439'
  }
];

export const INITIAL_EVENTS: ConsentEvent[] = [
  {
    eventId: 'EVT-2026-8901',
    consentId: 'TA-CNS-2026-000123',
    eventType: 'CONSENT_GRANTED',
    timestamp: '2026-09-02 10:42 AM IST',
    actor: 'Arpit Sharma (Data Principal)',
    organization: 'Apex Financial Services',
    purpose: 'Personalized Financial Offers & Insights',
    channel: 'Web',
    previousHash: '77ab92cd091f82e345b128fa9c445ee1098bca4391e00f912a3488dc9901ef23',
    eventHash: '9f3a4b8e21d78a9c0012f45ea3bc9081e77d24a91c0e3f88b901cd45e12a99bc',
    isValid: true
  },
  {
    eventId: 'EVT-2026-8900',
    consentId: 'TA-CNS-2026-000123',
    eventType: 'NOTICE_VIEWED',
    timestamp: '2026-09-02 10:40 AM IST',
    actor: 'Arpit Sharma',
    organization: 'Apex Financial Services',
    purpose: 'Personalized Financial Offers & Insights',
    channel: 'Web',
    previousHash: '66ab11cd091f82e345b128fa9c445ee1098bca4391e00f912a3488dc9901ef11',
    eventHash: '77ab92cd091f82e345b128fa9c445ee1098bca4391e00f912a3488dc9901ef23',
    isValid: true
  },
  {
    eventId: 'EVT-2026-8899',
    consentId: 'TA-CNS-2026-000125',
    eventType: 'CONSENT_WITHDRAWN',
    timestamp: '2026-08-29 02:12 PM IST',
    actor: 'Arpit Sharma (Data Principal)',
    organization: 'TravelKart India',
    purpose: 'Personalized Travel Deals & Fare Alerts',
    channel: 'Web',
    previousHash: '4a8b71cf0981e42ba9c8789ef0123984aa910cbe77298d01ef8324a9b0c128ef',
    eventHash: '8b9c001ef45281a9cd0981e7724a10c99f3a4b8e21d78a9c0012f45ea3bc9081',
    isValid: true
  },
  {
    eventId: 'EVT-2026-8898',
    consentId: 'TA-CNS-2026-000127',
    eventType: 'CONSENT_REQUESTED',
    timestamp: '2026-09-02 08:30 AM IST',
    actor: 'ShopKart Automated Workflow',
    organization: 'ShopKart Retail',
    purpose: 'Personalized Shopping Experience',
    channel: 'Web',
    previousHash: 'c90128efa3488dc9901ef2377ab92cd091f82e345b128fa9c445ee1098bca439',
    eventHash: '5e7a91bf33c82901ad4487ef99012a88bf019c4391e00f912a3488dc9901ef23',
    isValid: true
  }
];

export const INITIAL_REQUESTS: DataPrincipalRequest[] = [
  {
    id: 'REQ-DSR-2026-4410',
    tenantId: 'org_apex',
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    userPhone: '+91 98765 43210',
    organizationName: 'Apex Financial Services',
    organizationId: 'org_apex',
    requestType: 'Access My Data',
    description: 'Please provide a machine-readable JSON copy of all personal details, credit rating models, and communication logs maintained with Apex Financial.',
    status: 'UNDER_REVIEW',
    receivedAt: '2026-09-01 04:15 PM IST',
    dueAt: '2026-09-08 04:15 PM IST',
    assignedTo: 'Rahul Mehta'
  },
  {
    id: 'REQ-DSR-2026-4409',
    tenantId: 'org_travelkart',
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    userPhone: '+91 98765 43210',
    organizationName: 'TravelKart India',
    organizationId: 'org_travelkart',
    requestType: 'Delete My Data',
    description: 'Requesting erasure of all search traces and past inactive flight booking cookies following consent withdrawal.',
    status: 'RESOLVED',
    receivedAt: '2026-08-29 02:30 PM IST',
    dueAt: '2026-09-05 02:30 PM IST',
    assignedTo: 'Sunita Rao',
    resolutionNotes: 'Customer search profiles and tracking IDs purged from marketing caches on 2026-08-30.',
    resolvedAt: '2026-08-30 11:20 AM IST'
  },
  {
    id: 'REQ-DSR-2026-4408',
    tenantId: 'org_healthplus',
    userRef: 'USR-8F3A2',
    userName: 'Arpit Sharma',
    userEmail: 'arpit.demo@example.com',
    userPhone: '+91 98765 43210',
    organizationName: 'HealthPlus Clinics & Labs',
    organizationId: 'org_healthplus',
    requestType: 'Correct My Data',
    description: 'Please update my communication phone number from old office line to current registered mobile.',
    status: 'RESOLVED',
    receivedAt: '2026-08-18 10:00 AM IST',
    dueAt: '2026-08-25 10:00 AM IST',
    assignedTo: 'Dr. Vivek Saxena',
    resolutionNotes: 'Verified identity and updated primary contact in patient master database.',
    resolvedAt: '2026-08-19 03:45 PM IST'
  }
];

export const INITIAL_DATA_INVENTORY: DataInventoryItem[] = [
  {
    id: 'inv_01',
    tenantId: 'org_apex',
    dataCategory: 'Identity',
    application: 'Retail Banking Portal & Mobile App',
    purpose: 'Digital KYC & Statutory Identity Verification',
    retention: '5 years after account closure',
    thirdParty: 'UIDAI Offline eKYC Gateway',
    legalBasis: 'Legal Obligation',
    encryptionStatus: 'AES-256 GCM',
    status: 'ACTIVE'
  },
  {
    id: 'inv_02',
    tenantId: 'org_apex',
    dataCategory: 'Contact',
    application: 'Wealth Management Dashboard',
    purpose: 'Transactional Alerts and Investment Recommendations',
    retention: '24 months from grant date',
    thirdParty: 'FinCRM Cloud India',
    legalBasis: 'Consent',
    encryptionStatus: 'AES-256 GCM',
    status: 'ACTIVE'
  },
  {
    id: 'inv_03',
    tenantId: 'org_apex',
    dataCategory: 'Financial',
    application: 'Credit Risk Decision Engine',
    purpose: 'Credit Limit Appraisal & Personalized Loan Terms',
    retention: '36 months',
    thirdParty: 'CIBIL / Experian Credit Bureau',
    legalBasis: 'Consent',
    encryptionStatus: 'Tokenized',
    status: 'ACTIVE'
  },
  {
    id: 'inv_04',
    tenantId: 'org_apex',
    dataCategory: 'Location',
    application: 'Mobile Banking App',
    purpose: 'ATM Locator & Geofenced Fraud Prevention',
    retention: '12 months',
    thirdParty: 'RiskShield AI Engine',
    legalBasis: 'Consent',
    encryptionStatus: 'TLS 1.3 in transit',
    status: 'ACTIVE'
  },
  {
    id: 'inv_05',
    tenantId: 'org_apex',
    dataCategory: 'Device',
    application: 'Single Sign-On Security Layer',
    purpose: 'Device Fingerprinting & Session Anomaly Detection',
    retention: '6 months',
    thirdParty: 'Internal Security Gateway',
    legalBasis: 'Legitimate Use',
    encryptionStatus: 'AES-256 GCM',
    status: 'ACTIVE'
  }
];

export const INITIAL_DATA_SHARING: DataSharingNode[] = [
  {
    id: 'share_01',
    tenantId: 'org_apex',
    sourceOrg: 'Apex Financial Services',
    recipientOrg: 'FinCRM Provider (India Cloud)',
    recipientCategory: 'Enterprise CRM Processor',
    purpose: 'Customer Relationship & Portfolio Communication',
    dataCategories: ['Identity', 'Contact', 'Financial'],
    consentId: 'TA-CNS-2026-000123',
    sharedAt: '2026-09-02 10:45 AM IST',
    status: 'ACTIVE',
    jurisdiction: 'India (Mumbai Region)'
  },
  {
    id: 'share_02',
    tenantId: 'org_apex',
    sourceOrg: 'FinCRM Provider (India Cloud)',
    recipientOrg: 'MarketingCloud Asia',
    recipientCategory: 'Communication Dispatcher',
    purpose: 'Omnichannel Email & In-App Recommendations',
    dataCategories: ['Contact'],
    consentId: 'TA-CNS-2026-000123',
    sharedAt: '2026-09-02 10:48 AM IST',
    status: 'ACTIVE',
    jurisdiction: 'India (Pune Region)'
  },
  {
    id: 'share_03',
    tenantId: 'org_apex',
    sourceOrg: 'Apex Financial Services',
    recipientOrg: 'RiskShield AI Engine',
    recipientCategory: 'Fraud Prevention Processor',
    purpose: 'Session Geolocation & Anomaly Protection',
    dataCategories: ['Device', 'Location'],
    consentId: 'TA-CNS-2026-000124',
    sharedAt: '2026-08-10 09:20 AM IST',
    status: 'ACTIVE',
    jurisdiction: 'India (Hyderabad Region)'
  },
  {
    id: 'share_04',
    tenantId: 'org_travelkart',
    sourceOrg: 'TravelKart India',
    recipientOrg: 'Amadeus GDS Global',
    recipientCategory: 'Airline Reservation Network',
    purpose: 'Flight Availability & Fare Tracking',
    dataCategories: ['Contact', 'Location'],
    consentId: 'TA-CNS-2026-000125',
    sharedAt: '2026-07-15 02:30 PM IST',
    status: 'HALTED',
    jurisdiction: 'India / EU Cross-Border Adequacy'
  }
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'whk_apex_01',
    tenantId: 'org_apex',
    name: 'Apex Core Banking DPDP Ingress',
    url: 'https://api.apexfin.example.com/webhooks/dpdp-events',
    status: 'ACTIVE',
    events: ['consent.granted', 'consent.withdrawn', 'consent.expired', 'request.created', 'request.resolved'],
    secret: 'whsec_99af28b19320e81c74a9bc',
    createdAt: '2024-02-01'
  },
  {
    id: 'whk_apex_02',
    tenantId: 'org_apex',
    name: 'FinCRM Sync Pipeline',
    url: 'https://fincrm.internal.apexfin.com/consent/sync',
    status: 'ACTIVE',
    events: ['consent.withdrawn', 'consent.denied'],
    secret: 'whsec_1109bc4412ef8910',
    createdAt: '2024-03-15'
  }
];

export const INITIAL_DELIVERIES: WebhookDelivery[] = [
  {
    id: 'del_01',
    webhookId: 'whk_apex_01',
    event: 'consent.granted',
    endpoint: 'https://api.apexfin.example.com/webhooks/dpdp-events',
    statusCode: 200,
    status: 'DELIVERED',
    timestamp: '2026-09-02 10:42:04 AM IST',
    payloadSummary: 'Consent TA-CNS-2026-000123 granted for USR-8F3A2 (Apex Marketing)',
    durationMs: 142
  },
  {
    id: 'del_02',
    webhookId: 'whk_apex_02',
    event: 'consent.withdrawn',
    endpoint: 'https://fincrm.internal.apexfin.com/consent/sync',
    statusCode: 200,
    status: 'DELIVERED',
    timestamp: '2026-08-29 02:12:10 PM IST',
    payloadSummary: 'Processing stopped for TravelKart deals on USR-8F3A2',
    durationMs: 198
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud_901',
    timestamp: '2026-09-02 10:42 AM IST',
    event: 'Consent Granted',
    actor: 'Arpit Sharma (Data Principal)',
    organization: 'Apex Financial Services',
    resource: 'TA-CNS-2026-000123',
    ip: '103.21.144.18 (Mumbai, IN)',
    channel: 'Web',
    result: 'SUCCESS',
    hash: '9f3a4b8e21d78a9c0012f45ea3bc9081e77d24a91c0e3f88b901cd45e12a99bc'
  },
  {
    id: 'aud_900',
    timestamp: '2026-09-02 10:40 AM IST',
    event: 'Privacy Notice Presented',
    actor: 'Arpit Sharma',
    organization: 'Apex Financial Services',
    resource: 'notc_apex_v21 (v2.1)',
    ip: '103.21.144.18 (Mumbai, IN)',
    channel: 'Web',
    result: 'SUCCESS',
    hash: '77ab92cd091f82e345b128fa9c445ee1098bca4391e00f912a3488dc9901ef23'
  },
  {
    id: 'aud_899',
    timestamp: '2026-09-01 04:15 PM IST',
    event: 'DSR Request Raised (Access Data)',
    actor: 'Arpit Sharma',
    organization: 'Apex Financial Services',
    resource: 'REQ-DSR-2026-4410',
    ip: '103.21.144.18 (Mumbai, IN)',
    channel: 'Web',
    result: 'SUCCESS',
    hash: '3f89ee1029ba4c28bb9910d19a87dfb612e4c90128efa3488dc9901ef2377ab9'
  },
  {
    id: 'aud_898',
    timestamp: '2026-08-29 02:12 PM IST',
    event: 'Consent Withdrawn',
    actor: 'Arpit Sharma',
    organization: 'TravelKart India',
    resource: 'TA-CNS-2026-000125',
    ip: '103.21.144.18 (Mumbai, IN)',
    channel: 'Web',
    result: 'SUCCESS',
    hash: '8b9c001ef45281a9cd0981e7724a10c99f3a4b8e21d78a9c0012f45ea3bc9081'
  },
  {
    id: 'aud_897',
    timestamp: '2026-08-15 11:30 AM IST',
    event: 'Privacy Notice Published (v2.1)',
    actor: 'Rahul Mehta (Privacy Officer)',
    organization: 'Apex Financial Services',
    resource: 'notc_apex_v21',
    ip: '14.143.40.2 (Apex HQ, Mumbai)',
    channel: 'API SDK',
    result: 'SUCCESS',
    hash: '65c3dd882177a0bc441229d4901aa888d2ef90123f89ee1029ba4c28bb9910d1'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'Pending Consent Request: ShopKart',
    message: 'ShopKart Retail is requesting consent for Personalized Shopping Experience.',
    type: 'CONSENT',
    read: false,
    timestamp: '10 mins ago',
    targetRole: 'DATA_PRINCIPAL',
    linkRoute: '/user/consents?status=pending'
  },
  {
    id: 'notif_02',
    title: 'Privacy Notice Updated',
    message: 'Apex Financial Services has updated their DPDP Master Privacy Notice to v2.1.',
    type: 'NOTICE',
    read: true,
    timestamp: 'Yesterday',
    targetRole: 'DATA_PRINCIPAL',
    linkRoute: '/user/consents'
  },
  {
    id: 'notif_03',
    title: 'New DSR Access Request',
    message: 'Data Principal USR-8F3A2 has submitted an Access My Data request.',
    type: 'REQUEST',
    read: false,
    timestamp: '1 hour ago',
    targetRole: 'BRAND_ADMIN',
    linkRoute: '/brand/requests'
  },
  {
    id: 'notif_04',
    title: 'High Consent Conversion',
    message: 'Apex Financial achieved 75.6% consent acceptance rate across digital channels.',
    type: 'CONSENT',
    read: true,
    timestamp: '2 hours ago',
    targetRole: 'BRAND_ADMIN',
    linkRoute: '/brand/dashboard'
  },
  {
    id: 'notif_05',
    title: 'System Node Health Normal',
    message: 'All 7 tenant clusters are operating at 99.98% uptime with zero cryptographic ledger defects.',
    type: 'SECURITY',
    read: false,
    timestamp: '30 mins ago',
    targetRole: 'PLATFORM_ADMIN',
    linkRoute: '/admin/dashboard'
  }
];
