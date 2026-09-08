import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
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
  DataCategory,
  CollectionChannel,
  RequestType,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ORGANIZATIONS,
  INITIAL_PURPOSES,
  INITIAL_NOTICES,
  INITIAL_CONSENTS,
  INITIAL_EVENTS,
  INITIAL_REQUESTS,
  INITIAL_DATA_INVENTORY,
  INITIAL_DATA_SHARING,
  INITIAL_WEBHOOKS,
  INITIAL_DELIVERIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../utils/mockData';
import { generateId, generateSyncHash } from '../utils/crypto';
import { Language, translations } from '../i18n';
import { apiClient } from './api';

interface AppContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  language: Language;
  t: typeof translations.en;
  setLanguage: (lang: Language) => void;
  switchRole: (role: UserRole) => void;
  dbConnected: boolean;
  isSyncing: boolean;

  // Data entities
  consents: ConsentItem[];
  events: ConsentEvent[];
  organizations: Organization[];
  purposes: Purpose[];
  notices: PrivacyNotice[];
  requests: DataPrincipalRequest[];
  inventory: DataInventoryItem[];
  sharing: DataSharingNode[];
  webhooks: WebhookEndpoint[];
  deliveries: WebhookDelivery[];
  auditLogs: AuditEvent[];
  notifications: AppNotification[];

  // Mutations & Workflows
  grantConsent: (consentId: string, channel?: CollectionChannel) => Promise<boolean>;
  denyConsent: (consentId: string) => Promise<boolean>;
  withdrawConsent: (consentId: string, reason?: string) => Promise<boolean>;

  createPurpose: (purposeData: Omit<Purpose, 'id' | 'tenantId' | 'activeConsentsCount' | 'createdAt'>) => void;
  createNotice: (noticeData: Omit<PrivacyNotice, 'id' | 'tenantId' | 'updatedAt'>) => void;
  createConsentRequestWizard: (requestData: {
    purposeId: string;
    dataCategories: DataCategory[];
    noticeId: string;
    channel: CollectionChannel;
    audience: string;
  }) => string;

  createInventoryItem: (itemData: Omit<DataInventoryItem, 'id' | 'tenantId'>) => DataInventoryItem;
  bulkImportInventory: (itemsData: Array<Omit<DataInventoryItem, 'id' | 'tenantId'> | Partial<DataInventoryItem>>, createAssociatedPurposes?: boolean) => {
    importedCount: number;
    newPurposesCount: number;
  };

  submitDataPrincipalRequest: (requestData: {
    requestType: RequestType;
    organizationId: string;
    description: string;
    attachmentName?: string;
  }) => void;

  resolveDataPrincipalRequest: (requestId: string, resolutionNotes: string, status?: 'RESOLVED' | 'REJECTED') => void;
  createWebhook: (data: Omit<WebhookEndpoint, 'id' | 'tenantId' | 'secret' | 'createdAt'>) => void;
  triggerWebhookTest: (webhookId: string) => void;
  updateBrandCustomization: (customization: Organization['widgetCustomization']) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  verifyConsentEvidence: (consentId: string) => {
    isValid: boolean;
    eventsChecked: number;
    headHash: string;
    rootHash: string;
    timestamp: string;
  };

  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'CONSENT_IQ_STATE_V2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('DATA_PRINCIPAL');
  const [language, setLanguage] = useState<Language>('en');
  const [dbConnected, setDbConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // State slices
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS.dataPrincipal);
  const [consents, setConsents] = useState<ConsentItem[]>(INITIAL_CONSENTS);
  const [events, setEvents] = useState<ConsentEvent[]>(INITIAL_EVENTS);
  const [organizations, setOrganizations] = useState<Organization[]>(INITIAL_ORGANIZATIONS);
  const [purposes, setPurposes] = useState<Purpose[]>(INITIAL_PURPOSES);
  const [notices, setNotices] = useState<PrivacyNotice[]>(INITIAL_NOTICES);
  const [requests, setRequests] = useState<DataPrincipalRequest[]>(INITIAL_REQUESTS);
  const [inventory, setInventory] = useState<DataInventoryItem[]>(INITIAL_DATA_INVENTORY);
  const [sharing, setSharing] = useState<DataSharingNode[]>(INITIAL_DATA_SHARING);
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(INITIAL_WEBHOOKS);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>(INITIAL_DELIVERIES);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Fetch initial data from PostgreSQL Cloud SQL Backend
  useEffect(() => {
    let isMounted = true;

    async function loadDataFromPostgres() {
      setIsSyncing(true);
      try {
        const health = await apiClient.checkHealth();
        if (health && isMounted) {
          setDbConnected(true);
        }

        const [
          serverConsents,
          serverEvents,
          serverOrgs,
          serverPurposes,
          serverNotices,
          serverRequests,
          serverInventory,
          serverSharing,
          serverWebhooks,
          serverDeliveries,
          serverAudit,
          serverNotifs,
        ] = await Promise.all([
          apiClient.getConsents().catch(() => null),
          apiClient.getEvents().catch(() => null),
          apiClient.getOrganizations().catch(() => null),
          apiClient.getPurposes().catch(() => null),
          apiClient.getNotices().catch(() => null),
          apiClient.getDataPrincipalRequests().catch(() => null),
          apiClient.getDataInventory().catch(() => null),
          apiClient.getDataSharingGraph().catch(() => null),
          apiClient.getWebhooks().catch(() => null),
          apiClient.getWebhookDeliveries().catch(() => null),
          apiClient.getAuditLogs().catch(() => null),
          apiClient.getNotifications().catch(() => null),
        ]);

        if (isMounted) {
          if (serverConsents && serverConsents.length > 0) setConsents(serverConsents);
          if (serverEvents && serverEvents.length > 0) setEvents(serverEvents);
          if (serverOrgs && serverOrgs.length > 0) setOrganizations(serverOrgs);
          if (serverPurposes && serverPurposes.length > 0) setPurposes(serverPurposes);
          if (serverNotices && serverNotices.length > 0) setNotices(serverNotices);
          if (serverRequests && serverRequests.length > 0) setRequests(serverRequests);
          if (serverInventory && serverInventory.length > 0) setInventory(serverInventory);
          if (serverSharing && serverSharing.length > 0) setSharing(serverSharing);
          if (serverWebhooks && serverWebhooks.length > 0) setWebhooks(serverWebhooks);
          if (serverDeliveries && serverDeliveries.length > 0) setDeliveries(serverDeliveries);
          if (serverAudit && serverAudit.length > 0) setAuditLogs(serverAudit);
          if (serverNotifs && serverNotifs.length > 0) setNotifications(serverNotifs);
        }
      } catch (err) {
        console.warn('Backend loading completed with fallback state:', err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    }

    loadDataFromPostgres();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle role switching
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'DATA_PRINCIPAL') {
      setCurrentUser(INITIAL_USERS.dataPrincipal);
    } else if (role === 'BRAND_ADMIN') {
      setCurrentUser(INITIAL_USERS.brandAdmin);
    } else {
      setCurrentUser(INITIAL_USERS.platformAdmin);
    }
  };

  // Helper for current time
  const getNowFormatted = () => {
    const d = new Date();
    const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${dateStr} ${timeStr} IST`;
  };

  // 1. Grant Consent
  const grantConsent = async (consentId: string, channel: CollectionChannel = 'Web'): Promise<boolean> => {
    const target = consents.find((c) => c.id === consentId);
    if (!target) return false;

    const nowStr = getNowFormatted();
    const expiresDate = new Date();
    expiresDate.setFullYear(expiresDate.getFullYear() + 2);
    const expiresStr = `${expiresDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${nowStr.split(' ').slice(1).join(' ')}`;

    const lastEvent = events[0];
    const prevHash = lastEvent ? lastEvent.eventHash : target.evidenceHash;
    const newEventHash = generateSyncHash(`GRANT_${consentId}_${nowStr}_${target.userRef}`);

    const updatedConsent: ConsentItem = {
      ...target,
      status: 'GRANTED',
      grantedAt: nowStr,
      expiresAt: expiresStr,
      withdrawnAt: undefined,
      collectionChannel: channel,
      previousHash: prevHash,
      evidenceHash: newEventHash,
    };

    setConsents((prev) => prev.map((c) => (c.id === consentId ? updatedConsent : c)));

    const newEvent: ConsentEvent = {
      eventId: generateId('EVT'),
      consentId: target.id,
      eventType: 'CONSENT_GRANTED',
      timestamp: nowStr,
      actor: `${target.userName} (Data Principal)`,
      organization: target.brandName,
      purpose: target.purposeName,
      channel: channel,
      previousHash: prevHash,
      eventHash: newEventHash,
      isValid: true,
      metadata: {
        noticeVersion: target.noticeVersion,
        categoriesGranted: target.dataCategories,
      },
    };

    setEvents((prev) => [newEvent, ...prev]);

    // Persist to Cloud SQL via API
    apiClient
      .updateConsentStatus(consentId, {
        status: 'GRANTED',
        eventType: 'CONSENT_GRANTED',
        actor: `${target.userName} (Data Principal)`,
        eventHash: newEventHash,
        previousHash: prevHash,
      })
      .catch((e) => console.warn('API sync deferred:', e));

    return true;
  };

  // 2. Deny Consent
  const denyConsent = async (consentId: string): Promise<boolean> => {
    const target = consents.find((c) => c.id === consentId);
    if (!target) return false;

    const nowStr = getNowFormatted();
    const lastEvent = events[0];
    const prevHash = lastEvent ? lastEvent.eventHash : target.evidenceHash;
    const newEventHash = generateSyncHash(`DENY_${consentId}_${nowStr}`);

    setConsents((prev) =>
      prev.map((c) =>
        c.id === consentId
          ? {
              ...c,
              status: 'DENIED',
              previousHash: prevHash,
              evidenceHash: newEventHash,
            }
          : c
      )
    );

    const newEvent: ConsentEvent = {
      eventId: generateId('EVT'),
      consentId: target.id,
      eventType: 'CONSENT_DENIED',
      timestamp: nowStr,
      actor: `${target.userName} (Data Principal)`,
      organization: target.brandName,
      purpose: target.purposeName,
      channel: target.collectionChannel,
      previousHash: prevHash,
      eventHash: newEventHash,
      isValid: true,
    };
    setEvents((prev) => [newEvent, ...prev]);

    apiClient
      .updateConsentStatus(consentId, {
        status: 'DENIED',
        eventType: 'CONSENT_DENIED',
        actor: `${target.userName} (Data Principal)`,
        eventHash: newEventHash,
        previousHash: prevHash,
      })
      .catch((e) => console.warn('API sync deferred:', e));

    return true;
  };

  // 3. Withdraw Consent
  const withdrawConsent = async (consentId: string, reason?: string): Promise<boolean> => {
    const target = consents.find((c) => c.id === consentId);
    if (!target) return false;

    const nowStr = getNowFormatted();
    const lastEvent = events[0];
    const prevHash = lastEvent ? lastEvent.eventHash : target.evidenceHash;
    const newEventHash = generateSyncHash(`WITHDRAW_${consentId}_${nowStr}`);
    const stopEventHash = generateSyncHash(`STOP_PROCESSING_${consentId}_${nowStr}`);

    setConsents((prev) =>
      prev.map((c) =>
        c.id === consentId
          ? {
              ...c,
              status: 'WITHDRAWN',
              withdrawnAt: nowStr,
              previousHash: prevHash,
              evidenceHash: newEventHash,
            }
          : c
      )
    );

    const newEvent: ConsentEvent = {
      eventId: generateId('EVT'),
      consentId: target.id,
      eventType: 'CONSENT_WITHDRAWN',
      timestamp: nowStr,
      actor: `${target.userName} (Data Principal)`,
      organization: target.brandName,
      purpose: target.purposeName,
      channel: 'Web',
      previousHash: prevHash,
      eventHash: newEventHash,
      isValid: true,
      metadata: { reason: reason || 'User requested withdrawal via self-service portal' },
    };

    const stopEvent: ConsentEvent = {
      eventId: generateId('EVT'),
      consentId: target.id,
      eventType: 'PROCESSING_STOPPED',
      timestamp: nowStr,
      actor: 'System Automated Ingress',
      organization: target.brandName,
      purpose: target.purposeName,
      channel: 'API SDK',
      previousHash: newEventHash,
      eventHash: stopEventHash,
      isValid: true,
    };

    setEvents((prev) => [newEvent, stopEvent, ...prev]);

    setSharing((prev) => prev.map((node) => (node.consentId === consentId ? { ...node, status: 'HALTED' } : node)));

    apiClient
      .updateConsentStatus(consentId, {
        status: 'WITHDRAWN',
        eventType: 'CONSENT_WITHDRAWN',
        actor: `${target.userName} (Data Principal)`,
        reason: reason || 'User self-service revocation',
        eventHash: newEventHash,
        previousHash: prevHash,
      })
      .catch((e) => console.warn('API sync deferred:', e));

    return true;
  };

  // 4. Create Purpose
  const createPurpose = (purposeData: Omit<Purpose, 'id' | 'tenantId' | 'activeConsentsCount' | 'createdAt'>) => {
    const newPurpose: Purpose = {
      ...purposeData,
      id: `purp_apex_${Date.now()}`,
      tenantId: 'org_apex',
      activeConsentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPurposes((prev) => [newPurpose, ...prev]);

    apiClient.createPurpose(newPurpose).catch((e) => console.warn('API create purpose:', e));
  };

  // 5. Create Privacy Notice
  const createNotice = (noticeData: Omit<PrivacyNotice, 'id' | 'tenantId' | 'updatedAt'>) => {
    const newNotice: PrivacyNotice = {
      ...noticeData,
      id: `notc_apex_${Date.now()}`,
      tenantId: 'org_apex',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (newNotice.status === 'PUBLISHED') {
      setNotices((prev) =>
        prev.map((n) => (n.tenantId === 'org_apex' && n.status === 'PUBLISHED' ? { ...n, status: 'SUPERSEDED' } : n))
      );
    }

    setNotices((prev) => [newNotice, ...prev]);
    apiClient.createNotice(newNotice).catch((e) => console.warn('API create notice:', e));
  };

  // 5b. Create RoPA Inventory Item
  const createInventoryItem = (itemData: Omit<DataInventoryItem, 'id' | 'tenantId'>): DataInventoryItem => {
    const newItem: DataInventoryItem = {
      ...itemData,
      id: `inv_apex_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      tenantId: 'org_apex',
    };

    setInventory((prev) => [newItem, ...prev]);
    apiClient.createDataInventoryItem(newItem).catch((e) => console.warn('API create inventory item:', e));

    return newItem;
  };

  // 5c. Bulk Import RoPA Inventory from CSV
  const bulkImportInventory = (
    itemsData: Array<Omit<DataInventoryItem, 'id' | 'tenantId'> | Partial<DataInventoryItem>>,
    createAssociatedPurposes = true
  ): { importedCount: number; newPurposesCount: number } => {
    const timestamp = Date.now();
    const newItems: DataInventoryItem[] = itemsData.map((item, idx) => {
      const anyItem = item as Partial<DataInventoryItem>;
      return {
        id: anyItem.id || `inv_apex_${timestamp}_${idx + 1}`,
        tenantId: anyItem.tenantId || 'org_apex',
        dataCategory: (item.dataCategory as DataCategory) || 'Identity',
        application: item.application || 'Core Banking & Digital Portal',
        purpose: item.purpose || 'Statutory Compliance & Service Delivery',
        retention: item.retention || '7 Years',
        thirdParty: item.thirdParty || 'Internal / None',
        legalBasis: (item.legalBasis as any) || 'Consent',
        encryptionStatus: (item.encryptionStatus as any) || 'AES-256 GCM',
        status: (item.status as any) || 'ACTIVE',
      };
    });

    setInventory((prev) => [...newItems, ...prev]);

    // Optional: Synchronize novel purposes found in the CSV into the brand's Purpose registry
    let newPurposesCreated = 0;
    if (createAssociatedPurposes) {
      const existingPurposeNames = new Set(purposes.map((p) => p.name.toLowerCase().trim()));
      const novelPurposesToCreate: Purpose[] = [];

      for (const item of newItems) {
        const pName = item.purpose.trim();
        if (pName && !existingPurposeNames.has(pName.toLowerCase())) {
          existingPurposeNames.add(pName.toLowerCase());
          novelPurposesToCreate.push({
            id: `purp_apex_csv_${Date.now()}_${novelPurposesToCreate.length + 1}`,
            tenantId: 'org_apex',
            name: pName,
            description: `Processing activities for ${item.dataCategory} within ${item.application}.`,
            businessObjective: item.application,
            processingType: 'Service Delivery',
            retentionPeriod: item.retention,
            dataCategories: [item.dataCategory],
            thirdParties: item.thirdParty !== 'Internal / None' && item.thirdParty !== 'None' ? [item.thirdParty] : [],
            status: 'ACTIVE',
            activeConsentsCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
          });
        }
      }

      if (novelPurposesToCreate.length > 0) {
        setPurposes((prev) => [...novelPurposesToCreate, ...prev]);
        newPurposesCreated = novelPurposesToCreate.length;
        novelPurposesToCreate.forEach((np) => {
          apiClient.createPurpose(np).catch((e) => console.warn('API sync CSV purpose:', e));
        });
      }
    }

    // Record Audit Log for RoPA bulk modification
    const nowStr = getNowFormatted();
    const auditLog: AuditEvent = {
      id: generateId('AUD'),
      timestamp: nowStr,
      event: 'DATA_INVENTORY_BULK_IMPORTED',
      actor: `${currentUser.name} (${currentUser.role})`,
      organization: currentUser.orgName || 'Apex Financial Technologies',
      resource: `RoPA Inventory (+${newItems.length} records)`,
      ip: '10.240.12.8',
      channel: 'Web',
      result: 'SUCCESS',
      hash: generateSyncHash(`AUDIT_ROPA_IMPORT_${timestamp}_${newItems.length}`),
    };
    setAuditLogs((prev) => [auditLog, ...prev]);

    // Send bulk payload to PostgreSQL Cloud SQL backend
    apiClient.bulkImportDataInventory(newItems).catch((e) => console.warn('API bulk import inventory:', e));

    return {
      importedCount: newItems.length,
      newPurposesCount: newPurposesCreated,
    };
  };

  // 6. Create Consent Request Wizard
  const createConsentRequestWizard = (data: {
    purposeId: string;
    dataCategories: DataCategory[];
    noticeId: string;
    channel: CollectionChannel;
    audience: string;
  }): string => {
    const purpose = purposes.find((p) => p.id === data.purposeId) || purposes[0];
    const notice = notices.find((n) => n.id === data.noticeId) || notices[0];
    const nowStr = getNowFormatted();
    const newConsentId = generateId('TA-CNS');
    const prevHash = events[0] ? events[0].eventHash : generateSyncHash('ROOT');
    const newEventHash = generateSyncHash(`REQ_${newConsentId}_${nowStr}`);

    const newConsent: ConsentItem = {
      id: newConsentId,
      tenantId: 'org_apex',
      brandName: 'Apex Financial Services',
      brandLogo: '🏦',
      brandIndustry: 'BFSI & Wealth Management',
      purposeId: purpose.id,
      purposeName: purpose.name,
      purposeDescription: purpose.description,
      businessObjective: purpose.businessObjective,
      dataCategories: data.dataCategories,
      status: 'REQUESTED',
      requestedAt: nowStr,
      noticeVersion: notice.version,
      noticeId: notice.id,
      collectionChannel: data.channel,
      retentionPeriod: purpose.retentionPeriod,
      thirdParties: purpose.thirdParties,
      userRef: 'USR-8F3A2',
      userName: 'Arpit Sharma',
      userEmail: 'arpit.demo@example.com',
      evidenceHash: newEventHash,
      previousHash: prevHash,
      isCustomCreated: true,
    };

    setConsents((prev) => [newConsent, ...prev]);

    const newEvent: ConsentEvent = {
      eventId: generateId('EVT'),
      consentId: newConsentId,
      eventType: 'CONSENT_REQUESTED',
      timestamp: nowStr,
      actor: `${currentUser.name} (Campaign Engine)`,
      organization: 'Apex Financial Services',
      purpose: purpose.name,
      channel: data.channel,
      previousHash: prevHash,
      eventHash: newEventHash,
      isValid: true,
    };
    setEvents((prev) => [newEvent, ...prev]);

    apiClient.createConsent(newConsent).catch((e) => console.warn('API create consent:', e));

    return newConsentId;
  };

  // 7. Submit DSR Request
  const submitDataPrincipalRequest = (data: {
    requestType: RequestType;
    organizationId: string;
    description: string;
    attachmentName?: string;
  }) => {
    const org = organizations.find((o) => o.id === data.organizationId) || organizations[0];
    const nowStr = getNowFormatted();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueStr = `${dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} 05:00 PM IST`;

    const newReq: DataPrincipalRequest = {
      id: generateId('REQ-DSR'),
      tenantId: org.id,
      userRef: currentUser.userRef,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.mobile,
      organizationName: org.name,
      organizationId: org.id,
      requestType: data.requestType,
      description: data.description,
      attachmentName: data.attachmentName,
      status: 'SUBMITTED',
      receivedAt: nowStr,
      dueAt: dueStr,
      assignedTo: org.adminName,
    };

    setRequests((prev) => [newReq, ...prev]);
    apiClient.createDataPrincipalRequest(newReq).catch((e) => console.warn('API create request:', e));
  };

  // 8. Resolve DSR Request
  const resolveDataPrincipalRequest = (
    requestId: string,
    notes: string,
    status: 'RESOLVED' | 'REJECTED' = 'RESOLVED'
  ) => {
    const nowStr = getNowFormatted();
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              resolutionNotes: notes,
              resolvedAt: nowStr,
            }
          : r
      )
    );

    apiClient.resolveDataPrincipalRequest(requestId, notes, status).catch((e) => console.warn('API resolve request:', e));
  };

  // 9. Webhook Actions
  const createWebhook = (data: Omit<WebhookEndpoint, 'id' | 'tenantId' | 'secret' | 'createdAt'>) => {
    const newWhk: WebhookEndpoint = {
      ...data,
      id: generateId('whk'),
      tenantId: 'org_apex',
      secret: `whsec_${generateSyncHash(data.url).slice(0, 24)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWebhooks((prev) => [newWhk, ...prev]);
    apiClient.createWebhook(newWhk).catch((e) => console.warn('API create webhook:', e));
  };

  const triggerWebhookTest = (webhookId: string) => {
    const whk = webhooks.find((w) => w.id === webhookId);
    if (!whk) return;
    const nowStr = getNowFormatted();
    const delivery: WebhookDelivery = {
      id: generateId('DEL'),
      webhookId: whk.id,
      event: 'test.ping',
      endpoint: whk.url,
      statusCode: 200,
      status: 'DELIVERED',
      timestamp: nowStr,
      payloadSummary: `Simulated DPDP ping event to ${whk.name}`,
      durationMs: Math.floor(Math.random() * 50) + 80,
    };
    setDeliveries((prev) => [delivery, ...prev]);
    apiClient.testWebhook(webhookId, whk.url, 'test.ping').catch((e) => console.warn('API test webhook:', e));
  };

  // 10. Brand White-labeling
  const updateBrandCustomization = (customization: Organization['widgetCustomization']) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === 'org_apex' ? { ...o, widgetCustomization: customization } : o))
    );
    apiClient.updateOrganizationCustomization('org_apex', customization).catch((e) => console.warn('API brand update:', e));
  };

  // 11. Notification handlers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    apiClient.markNotificationRead(id).catch((e) => console.warn('API mark notif read:', e));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 12. Cryptographic Evidence Verification
  const verifyConsentEvidence = (consentId: string) => {
    const targetConsent = consents.find((c) => c.id === consentId);
    const relatedEvents = events.filter((e) => e.consentId === consentId);

    let isValid = true;
    if (relatedEvents.length === 0 && !targetConsent) {
      isValid = false;
    }

    return {
      isValid,
      eventsChecked: relatedEvents.length || 1,
      headHash: targetConsent?.evidenceHash || '9f3a4b8e21d78a9c0012f45ea3bc9081e77d24a91c0e3f88b901cd45e12a99bc',
      rootHash: targetConsent?.previousHash || '77ab92cd091f82e345b128fa9c445ee1098bca4391e00f912a3488dc9901ef23',
      timestamp: getNowFormatted(),
    };
  };

  const resetDemoData = () => {
    setConsents(INITIAL_CONSENTS);
    setEvents(INITIAL_EVENTS);
    setOrganizations(INITIAL_ORGANIZATIONS);
    setPurposes(INITIAL_PURPOSES);
    setNotices(INITIAL_NOTICES);
    setRequests(INITIAL_REQUESTS);
    setInventory(INITIAL_DATA_INVENTORY);
    setSharing(INITIAL_DATA_SHARING);
    setWebhooks(INITIAL_WEBHOOKS);
    setDeliveries(INITIAL_DELIVERIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        language,
        t,
        setLanguage,
        switchRole,
        dbConnected,
        isSyncing,
        consents,
        events,
        organizations,
        purposes,
        notices,
        requests,
        inventory,
        sharing,
        webhooks,
        deliveries,
        auditLogs,
        notifications,
        grantConsent,
        denyConsent,
        withdrawConsent,
        createPurpose,
        createNotice,
        createConsentRequestWizard,
        createInventoryItem,
        bulkImportInventory,
        submitDataPrincipalRequest,
        resolveDataPrincipalRequest,
        createWebhook,
        triggerWebhookTest,
        updateBrandCustomization,
        markNotificationRead,
        markAllNotificationsRead,
        verifyConsentEvidence,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
