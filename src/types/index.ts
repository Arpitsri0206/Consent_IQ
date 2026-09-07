export type UserRole = 'DATA_PRINCIPAL' | 'BRAND_ADMIN' | 'PLATFORM_ADMIN';

export type ConsentStatus = 'REQUESTED' | 'GRANTED' | 'WITHDRAWN' | 'DENIED' | 'EXPIRED' | 'RENEWED';

export type DataCategory = 
  | 'Identity'
  | 'Contact'
  | 'Financial'
  | 'Location'
  | 'Device'
  | 'Behavioural'
  | 'Employment'
  | 'Education'
  | 'Health';

export type ProcessingType = 
  | 'Marketing'
  | 'Personalization'
  | 'Analytics'
  | 'Account Management'
  | 'Fraud Prevention'
  | 'Service Delivery'
  | 'Credit Assessment';

export type CollectionChannel = 'Web' | 'Mobile App' | 'QR Code' | 'Email' | 'SMS' | 'API SDK';

export type RequestType = 
  | 'Access My Data'
  | 'Correct My Data'
  | 'Delete My Data'
  | 'Withdraw Consent'
  | 'Raise Grievance'
  | 'Request Information';

export type RequestStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'REJECTED';

export interface ConsentItem {
  id: string;
  tenantId: string;
  brandName: string;
  brandLogo: string;
  brandIndustry: string;
  purposeId: string;
  purposeName: string;
  purposeDescription: string;
  businessObjective: string;
  dataCategories: DataCategory[];
  status: ConsentStatus;
  grantedAt?: string;
  expiresAt?: string;
  withdrawnAt?: string;
  requestedAt: string;
  noticeVersion: string;
  noticeId: string;
  collectionChannel: CollectionChannel;
  retentionPeriod: string;
  thirdParties: string[];
  userRef: string;
  userName: string;
  userEmail: string;
  evidenceHash: string;
  previousHash: string;
  isCustomCreated?: boolean;
}

export interface ConsentEvent {
  eventId: string;
  consentId: string;
  eventType: 
    | 'CONSENT_REQUESTED'
    | 'NOTICE_PRESENTED'
    | 'NOTICE_VIEWED'
    | 'CONSENT_GRANTED'
    | 'CONSENT_DENIED'
    | 'CONSENT_MODIFIED'
    | 'CONSENT_RENEWED'
    | 'CONSENT_WITHDRAWN'
    | 'CONSENT_EXPIRED'
    | 'DATA_SHARED'
    | 'PROCESSING_STOPPED';
  timestamp: string;
  actor: string;
  organization: string;
  purpose: string;
  channel: CollectionChannel;
  metadata?: Record<string, any>;
  previousHash: string;
  eventHash: string;
  isValid?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  logo: string;
  primaryColor: string;
  adminName: string;
  adminRole: string;
  adminEmail: string;
  totalUsers: number;
  activeConsents: number;
  totalRequests: number;
  withdrawals: number;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'SUSPENDED';
  plan: 'ENTERPRISE' | 'GROWTH' | 'STARTER';
  createdAt: string;
  consentRate: number;
  apiKey: string;
  webhookUrl?: string;
  widgetCustomization?: {
    accentColor: string;
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    headerText: string;
    showNoticePreview: boolean;
  };
}

export interface Purpose {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  businessObjective: string;
  processingType: ProcessingType;
  retentionPeriod: string;
  dataCategories: DataCategory[];
  thirdParties: string[];
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  activeConsentsCount: number;
  createdAt: string;
}

export interface PrivacyNoticeClause {
  id: string;
  title: string;
  content: string;
}

export interface PrivacyNotice {
  id: string;
  tenantId: string;
  title: string;
  version: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SUPERSEDED';
  effectiveDate: string;
  createdBy: string;
  updatedAt: string;
  summary: string;
  clauses: PrivacyNoticeClause[];
  changelog?: string;
}

export interface DataPrincipalRequest {
  id: string;
  tenantId: string;
  userRef: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  organizationName: string;
  organizationId: string;
  requestType: RequestType;
  description: string;
  attachmentName?: string;
  status: RequestStatus;
  receivedAt: string;
  dueAt: string;
  assignedTo?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface DataInventoryItem {
  id: string;
  tenantId: string;
  dataCategory: DataCategory;
  application: string;
  purpose: string;
  retention: string;
  thirdParty: string;
  legalBasis: 'Consent' | 'Legitimate Use' | 'Legal Obligation';
  encryptionStatus: 'AES-256 GCM' | 'TLS 1.3 in transit' | 'Tokenized';
  status: 'ACTIVE' | 'UNDER_REVIEW';
}

export interface DataSharingNode {
  id: string;
  tenantId: string;
  sourceOrg: string;
  recipientOrg: string;
  recipientCategory: string;
  purpose: string;
  dataCategories: DataCategory[];
  consentId: string;
  sharedAt: string;
  status: 'ACTIVE' | 'HALTED' | 'EXPIRED';
  jurisdiction: string;
}

export interface WebhookEndpoint {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  status: 'ACTIVE' | 'INACTIVE';
  events: string[];
  secret: string;
  createdAt: string;
}

export type WebhookConfig = WebhookEndpoint;

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  endpoint: string;
  statusCode: number;
  status: 'DELIVERED' | 'FAILED';
  timestamp: string;
  payloadSummary: string;
  durationMs: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  organization: string;
  resource: string;
  ip: string;
  channel: CollectionChannel;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  hash: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'CONSENT' | 'WITHDRAWAL' | 'SECURITY' | 'NOTICE' | 'REQUEST';
  read: boolean;
  timestamp: string;
  targetRole: UserRole;
  linkRoute?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  userRef: string;
  role: UserRole;
  orgId?: string;
  orgName?: string;
  avatarUrl?: string;
}
