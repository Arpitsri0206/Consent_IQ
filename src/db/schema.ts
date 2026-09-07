import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or system ref
  email: text('email').notNull(),
  name: text('name').notNull().default('Anonymous User'),
  mobile: text('mobile').default('+91 98765 43210'),
  userRef: text('user_ref').notNull().default('DP-IN-9082'),
  role: text('role').notNull().default('DATA_PRINCIPAL'),
  orgId: text('org_id'),
  orgName: text('org_name'),
  avatarUrl: text('avatar_url').default('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Organizations Table (Data Fiduciaries / Tenants)
export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  industry: text('industry').notNull(),
  logo: text('logo').default('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'),
  primaryColor: text('primary_color').default('#4f46e5'),
  adminName: text('admin_name').notNull(),
  adminRole: text('admin_role').notNull(),
  adminEmail: text('admin_email').notNull(),
  totalUsers: integer('total_users').default(0),
  activeConsents: integer('active_consents').default(0),
  totalRequests: integer('total_requests').default(0),
  withdrawals: integer('withdrawals').default(0),
  status: text('status').notNull().default('ACTIVE'),
  plan: text('plan').notNull().default('ENTERPRISE'),
  consentRate: integer('consent_rate').default(94),
  apiKey: text('api_key').notNull(),
  webhookUrl: text('webhook_url'),
  widgetCustomization: jsonb('widget_customization'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Purposes Table
export const purposes = pgTable('purposes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  businessObjective: text('business_objective').notNull(),
  processingType: text('processing_type').notNull(),
  retentionPeriod: text('retention_period').notNull(),
  dataCategories: jsonb('data_categories').notNull(),
  thirdParties: jsonb('third_parties').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  activeConsentsCount: integer('active_consents_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Privacy Notices Table (Section 5 Statutory Notice)
export const privacyNotices = pgTable('privacy_notices', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  title: text('title').notNull(),
  version: text('version').notNull(),
  status: text('status').notNull().default('PUBLISHED'),
  effectiveDate: text('effective_date').notNull(),
  createdBy: text('created_by').notNull(),
  summary: text('summary').notNull(),
  clauses: jsonb('clauses').notNull(),
  changelog: text('changelog'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Consents Table
export const consents = pgTable('consents', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  brandName: text('brand_name').notNull(),
  brandLogo: text('brand_logo'),
  brandIndustry: text('brand_industry'),
  purposeId: text('purpose_id').notNull(),
  purposeName: text('purpose_name').notNull(),
  purposeDescription: text('purpose_description').notNull(),
  businessObjective: text('business_objective').notNull(),
  dataCategories: jsonb('data_categories').notNull(),
  status: text('status').notNull().default('GRANTED'),
  grantedAt: text('granted_at'),
  expiresAt: text('expires_at'),
  withdrawnAt: text('withdrawn_at'),
  requestedAt: text('requested_at').notNull(),
  noticeVersion: text('notice_version').notNull(),
  noticeId: text('notice_id').notNull(),
  collectionChannel: text('collection_channel').notNull(),
  retentionPeriod: text('retention_period').notNull(),
  thirdParties: jsonb('third_parties').notNull(),
  userRef: text('user_ref').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  evidenceHash: text('evidence_hash').notNull(),
  previousHash: text('previous_hash').notNull(),
  isCustomCreated: boolean('is_custom_created').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Consent Events Table (Chained Cryptographic Ledger)
export const consentEvents = pgTable('consent_events', {
  eventId: text('event_id').primaryKey(),
  consentId: text('consent_id').notNull(),
  eventType: text('event_type').notNull(),
  timestamp: text('timestamp').notNull(),
  actor: text('actor').notNull(),
  organization: text('organization').notNull(),
  purpose: text('purpose').notNull(),
  channel: text('channel').notNull(),
  metadata: jsonb('metadata'),
  previousHash: text('previous_hash').notNull(),
  eventHash: text('event_hash').notNull(),
  isValid: boolean('is_valid').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Data Principal Requests (DSR & Grievances)
export const dataPrincipalRequests = pgTable('data_principal_requests', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  userRef: text('user_ref').notNull(),
  userName: text('user_name').notNull(),
  userEmail: text('user_email').notNull(),
  userPhone: text('user_phone').default('+91 98765 43210'),
  organizationName: text('organization_name').notNull(),
  organizationId: text('organization_id').notNull(),
  requestType: text('request_type').notNull(),
  description: text('description').notNull(),
  attachmentName: text('attachment_name'),
  status: text('status').notNull().default('SUBMITTED'),
  receivedAt: text('received_at').notNull(),
  dueAt: text('due_at').notNull(),
  assignedTo: text('assigned_to'),
  resolutionNotes: text('resolution_notes'),
  resolvedAt: text('resolved_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Data Inventory (RoPA)
export const dataInventory = pgTable('data_inventory', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  dataCategory: text('data_category').notNull(),
  application: text('application').notNull(),
  purpose: text('purpose').notNull(),
  retention: text('retention').notNull(),
  thirdParty: text('third_party').notNull(),
  legalBasis: text('legal_basis').notNull(),
  encryptionStatus: text('encryption_status').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Data Sharing Nodes
export const dataSharingNodes = pgTable('data_sharing_nodes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  sourceOrg: text('source_org').notNull(),
  recipientOrg: text('recipient_org').notNull(),
  recipientCategory: text('recipient_category').notNull(),
  purpose: text('purpose').notNull(),
  dataCategories: jsonb('data_categories').notNull(),
  consentId: text('consent_id').notNull(),
  sharedAt: text('shared_at').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  jurisdiction: text('jurisdiction').notNull().default('India (MeitY Approved)'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Webhook Endpoints
export const webhooks = pgTable('webhooks', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  status: text('status').notNull().default('ACTIVE'),
  events: jsonb('events').notNull(),
  secret: text('secret').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Webhook Deliveries
export const webhookDeliveries = pgTable('webhook_deliveries', {
  id: text('id').primaryKey(),
  webhookId: text('webhook_id').notNull(),
  event: text('event').notNull(),
  endpoint: text('endpoint').notNull(),
  statusCode: integer('status_code').notNull(),
  status: text('status').notNull(),
  timestamp: text('timestamp').notNull(),
  payloadSummary: text('payload_summary').notNull(),
  durationMs: integer('duration_ms').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Events Table
export const auditEvents = pgTable('audit_events', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  event: text('event').notNull(),
  actor: text('actor').notNull(),
  organization: text('organization').notNull(),
  resource: text('resource').notNull(),
  ip: text('ip').notNull(),
  channel: text('channel').notNull(),
  result: text('result').notNull(),
  hash: text('hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Notifications Table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  read: boolean('read').default(false),
  timestamp: text('timestamp').notNull(),
  targetRole: text('target_role').notNull(),
  linkRoute: text('link_route'),
  createdAt: timestamp('created_at').defaultNow(),
});
