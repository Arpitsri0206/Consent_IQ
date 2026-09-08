export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Brand
    brandName: 'ConsentIQ',
    tagline: 'Your Data. Your Consent. Your Control.',
    dpdpReadiness: 'DPDP Readiness & Consent Management',
    dpdpDisclaimer: 'Demo/Prototype environment. Complies with DPDP Act, 2023 design patterns.',
    
    // Roles
    roleDataPrincipal: 'Data Principal',
    roleBrandAdmin: 'Brand / Data Fiduciary',
    rolePlatformAdmin: 'Platform Admin',
    
    // Navigation
    navDashboard: 'Dashboard',
    navConsents: 'My Consents',
    navConsentRegistry: 'Consent Registry',
    navCreateConsent: 'New Consent Request',
    navHistory: 'Consent History',
    navDataSharing: 'Data Sharing Map',
    navRequests: 'Data Rights (DSR)',
    navPurposes: 'Purpose Management',
    navNotices: 'Privacy Notices',
    navDataInventory: 'Data Inventory (ROPA)',
    navIntegrations: 'SDKs & API Keys',
    navWebhooks: 'Webhooks Simulator',
    navAudit: 'Audit Trail',
    navEvidence: 'Consent Ledger',
    navReports: 'Reports & CSV Exports',
    navOrganizations: 'Organizations',
    navSecurity: 'Security & Integrity',
    navSettings: 'Settings & Branding',
    navLogout: 'Log Out',
    
    // Statuses
    statusActive: 'Active',
    statusPending: 'Pending Request',
    statusWithdrawn: 'Withdrawn',
    statusExpired: 'Expired',
    statusDenied: 'Denied',
    statusGranted: 'Granted',
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusResolved: 'Resolved',
    statusActionRequired: 'Action Required',
    
    // Common Actions
    actionAllow: 'Allow & Grant Consent',
    actionDecline: 'Decline',
    actionWithdraw: 'Withdraw Consent',
    actionViewDetails: 'View Details',
    actionViewReceipt: 'Consent Receipt',
    actionVerifyEvidence: 'Verify Evidence',
    actionRaiseRequest: 'Raise Data Request',
    actionSearch: 'Search consents, organizations, purposes...',
    actionExport: 'Export Ledger',
    
    // Data Principal specific
    welcomeUser: 'Good morning',
    userDashboardSubtitle: "Here's an overview of your digital consent and privacy activity under DPDP.",
    privacyHealth: 'Privacy Control Score',
    privacyHealthText: 'Your privacy preferences are actively safeguarded and up to date.',
    activeConsentsCount: 'Active Consents',
    pendingRequestsCount: 'Pending Requests',
    withdrawnConsentsCount: 'Withdrawn Consents',
    connectedBrandsCount: 'Connected Brands',
    
    // Brand specific
    brandDashboardTitle: 'Privacy & Consent Operations',
    brandSubtitle: 'Data Fiduciary Compliance and Consent Lifecycle Engine',
    totalPrincipals: 'Total Data Principals',
    consentRate: 'Consent Acceptance Rate',
    expiringSoon: 'Expiring in 30 Days',
    openDsrRequests: 'Open DSR Grievances',
  },
  hi: {
    // Brand
    brandName: 'ConsentIQ',
    tagline: 'आपका डेटा। आपकी सहमति। आपका नियंत्रण।',
    dpdpReadiness: 'DPDP तत्परता और सहमति प्रबंधन',
    dpdpDisclaimer: 'डेमो/प्रोटोटाइप परिवेश। DPDP अधिनियम, 2023 के अनुरूप।',
    
    // Roles
    roleDataPrincipal: 'डेटा प्रिंसिपल (उपयोगकर्ता)',
    roleBrandAdmin: 'ब्रांड / डेटा फिडुशियरी',
    rolePlatformAdmin: 'प्लेटफ़ॉर्म व्यवस्थापक',
    
    // Navigation
    navDashboard: 'डैशबोर्ड',
    navConsents: 'मेरी सहमतियां',
    navConsentRegistry: 'सहमति रजिस्टर',
    navCreateConsent: 'नया सहमति अनुरोध',
    navHistory: 'सहमति इतिहास',
    navDataSharing: 'डेटा साझाकरण मानचित्र',
    navRequests: 'डेटा अधिकार (DSR)',
    navPurposes: 'उद्देश्य प्रबंधन',
    navNotices: 'गोपनीयता सूचनाएं',
    navDataInventory: 'डेटा सूची (ROPA)',
    navIntegrations: 'SDKs व API कुंजी',
    navWebhooks: 'वेबहुक सिम्युलेटर',
    navAudit: 'ऑडिट ट्रेल',
    navEvidence: 'सहमति लेजर',
    navReports: 'रिपोर्ट्स व CSV निर्यात',
    navOrganizations: 'संगठन',
    navSecurity: 'सुरक्षा निगरानी',
    navSettings: 'सेटिंग्स व ब्रांडिंग',
    navLogout: 'लॉग आउट',
    
    // Statuses
    statusActive: 'सक्रिय',
    statusPending: 'लंबित अनुरोध',
    statusWithdrawn: 'वापस लिया गया',
    statusExpired: 'समाप्त',
    statusDenied: 'अस्वीकृत',
    statusGranted: 'अनुदानित',
    statusSubmitted: 'प्रस्तुत',
    statusUnderReview: 'समीक्षाधीन',
    statusResolved: 'समाधानित',
    statusActionRequired: 'कार्रवाई आवश्यक',
    
    // Common Actions
    actionAllow: 'स्वीकारें और सहमति दें',
    actionDecline: 'अस्वीकार करें',
    actionWithdraw: 'सहमति वापस लें',
    actionViewDetails: 'विवरण देखें',
    actionViewReceipt: 'सहमति रसीद',
    actionVerifyEvidence: 'प्रमाण सत्यापित करें',
    actionRaiseRequest: 'डेटा अनुरोध दर्ज करें',
    actionSearch: 'सहमति, संगठन या उद्देश्य खोजें...',
    actionExport: 'लेजर निर्यात करें',
    
    // Data Principal specific
    welcomeUser: 'शुभ प्रभात',
    userDashboardSubtitle: 'DPDP के अंतर्गत आपकी डिजिटल सहमति और गोपनीयता गतिविधि का अवलोकन।',
    privacyHealth: 'गोपनीयता नियंत्रण स्कोर',
    privacyHealthText: 'आपकी गोपनीयता प्राथमिकताएं सुरक्षित और अद्यतन हैं।',
    activeConsentsCount: 'सक्रिय सहमतियां',
    pendingRequestsCount: 'लंबित अनुरोध',
    withdrawnConsentsCount: 'वापस ली गई सहमतियां',
    connectedBrandsCount: 'जुड़े हुए ब्रांड',
    
    // Brand specific
    brandDashboardTitle: 'गोपनीयता और सहमति संचालन',
    brandSubtitle: 'डेटा फिडुशियरी अनुपालन और सहमति प्रबंधन इंजन',
    totalPrincipals: 'कुल डेटा प्रिंसिपल्स',
    consentRate: 'सहमति स्वीकृति दर',
    expiringSoon: '30 दिनों में समाप्त होने वाली',
    openDsrRequests: 'सुलझाने हेतु DSR अनुरोध',
  }
};
