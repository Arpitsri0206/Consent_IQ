import { db } from '../db/index.ts';
import {
  users,
  organizations,
  purposes,
  privacyNotices,
  consents,
  consentEvents,
  dataPrincipalRequests,
  dataInventory,
  dataSharingNodes,
  webhooks,
  webhookDeliveries,
  auditEvents,
  notifications,
} from '../db/schema.ts';
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
} from '../utils/mockData.ts';

export async function seedDatabaseIfEmpty() {
  try {
    const existingConsents = await db.select().from(consents).limit(1);
    if (existingConsents.length > 0) {
      console.log('Database already populated. Skipping initial seed.');
      return;
    }

    console.log('Database is empty. Running initial PostgreSQL data seeding...');

    // 1. Seed Users
    for (const u of Object.values(INITIAL_USERS)) {
      await db
        .insert(users)
        .values({
          uid: u.id,
          email: u.email,
          name: u.name,
          mobile: u.mobile,
          userRef: u.userRef,
          role: u.role,
          orgId: u.orgId || null,
          orgName: u.orgName || null,
          avatarUrl: u.avatarUrl,
        })
        .onConflictDoNothing();
    }

    // 2. Seed Organizations
    for (const org of INITIAL_ORGANIZATIONS) {
      await db
        .insert(organizations)
        .values({
          id: org.id,
          name: org.name,
          industry: org.industry,
          logo: org.logo,
          primaryColor: org.primaryColor,
          adminName: org.adminName,
          adminRole: org.adminRole,
          adminEmail: org.adminEmail,
          totalUsers: org.totalUsers,
          activeConsents: org.activeConsents,
          totalRequests: org.totalRequests,
          withdrawals: org.withdrawals,
          status: org.status,
          plan: org.plan,
          consentRate: Math.round(org.consentRate),
          apiKey: org.apiKey,
          webhookUrl: org.webhookUrl || null,
          widgetCustomization: org.widgetCustomization || null,
        })
        .onConflictDoNothing();
    }

    // 3. Seed Purposes
    for (const p of INITIAL_PURPOSES) {
      await db
        .insert(purposes)
        .values({
          id: p.id,
          tenantId: p.tenantId,
          name: p.name,
          description: p.description,
          businessObjective: p.businessObjective,
          processingType: p.processingType,
          retentionPeriod: p.retentionPeriod,
          dataCategories: p.dataCategories,
          thirdParties: p.thirdParties,
          status: p.status,
          activeConsentsCount: p.activeConsentsCount,
        })
        .onConflictDoNothing();
    }

    // 4. Seed Privacy Notices
    for (const n of INITIAL_NOTICES) {
      await db
        .insert(privacyNotices)
        .values({
          id: n.id,
          tenantId: n.tenantId,
          title: n.title,
          version: n.version,
          status: n.status,
          effectiveDate: n.effectiveDate,
          createdBy: n.createdBy,
          summary: n.summary,
          clauses: n.clauses,
          changelog: n.changelog || null,
        })
        .onConflictDoNothing();
    }

    // 5. Seed Consents
    for (const c of INITIAL_CONSENTS) {
      await db
        .insert(consents)
        .values({
          id: c.id,
          tenantId: c.tenantId,
          brandName: c.brandName,
          brandLogo: c.brandLogo,
          brandIndustry: c.brandIndustry,
          purposeId: c.purposeId,
          purposeName: c.purposeName,
          purposeDescription: c.purposeDescription,
          businessObjective: c.businessObjective,
          dataCategories: c.dataCategories,
          status: c.status,
          grantedAt: c.grantedAt || null,
          expiresAt: c.expiresAt || null,
          withdrawnAt: c.withdrawnAt || null,
          requestedAt: c.requestedAt,
          noticeVersion: c.noticeVersion,
          noticeId: c.noticeId,
          collectionChannel: c.collectionChannel,
          retentionPeriod: c.retentionPeriod,
          thirdParties: c.thirdParties,
          userRef: c.userRef,
          userName: c.userName,
          userEmail: c.userEmail,
          evidenceHash: c.evidenceHash,
          previousHash: c.previousHash,
          isCustomCreated: c.isCustomCreated || false,
        })
        .onConflictDoNothing();
    }

    // 6. Seed Consent Events (Chained Audit Ledger)
    for (const ev of INITIAL_EVENTS) {
      await db
        .insert(consentEvents)
        .values({
          eventId: ev.eventId,
          consentId: ev.consentId,
          eventType: ev.eventType,
          timestamp: ev.timestamp,
          actor: ev.actor,
          organization: ev.organization,
          purpose: ev.purpose,
          channel: ev.channel,
          metadata: ev.metadata || null,
          previousHash: ev.previousHash,
          eventHash: ev.eventHash,
          isValid: ev.isValid ?? true,
        })
        .onConflictDoNothing();
    }

    // 7. Seed Data Principal Requests
    for (const req of INITIAL_REQUESTS) {
      await db
        .insert(dataPrincipalRequests)
        .values({
          id: req.id,
          tenantId: req.tenantId,
          userRef: req.userRef,
          userName: req.userName,
          userEmail: req.userEmail,
          userPhone: req.userPhone || '+91 98765 43210',
          organizationName: req.organizationName,
          organizationId: req.organizationId,
          requestType: req.requestType,
          description: req.description,
          attachmentName: req.attachmentName || null,
          status: req.status,
          receivedAt: req.receivedAt,
          dueAt: req.dueAt,
          assignedTo: req.assignedTo || null,
          resolutionNotes: req.resolutionNotes || null,
          resolvedAt: req.resolvedAt || null,
        })
        .onConflictDoNothing();
    }

    // 8. Seed Data Inventory (RoPA)
    for (const inv of INITIAL_DATA_INVENTORY) {
      await db
        .insert(dataInventory)
        .values({
          id: inv.id,
          tenantId: inv.tenantId,
          dataCategory: inv.dataCategory,
          application: inv.application,
          purpose: inv.purpose,
          retention: inv.retention,
          thirdParty: inv.thirdParty,
          legalBasis: inv.legalBasis,
          encryptionStatus: inv.encryptionStatus,
          status: inv.status,
        })
        .onConflictDoNothing();
    }

    // 9. Seed Data Sharing Nodes
    for (const ds of INITIAL_DATA_SHARING) {
      await db
        .insert(dataSharingNodes)
        .values({
          id: ds.id,
          tenantId: ds.tenantId,
          sourceOrg: ds.sourceOrg,
          recipientOrg: ds.recipientOrg,
          recipientCategory: ds.recipientCategory,
          purpose: ds.purpose,
          dataCategories: ds.dataCategories,
          consentId: ds.consentId,
          sharedAt: ds.sharedAt,
          status: ds.status,
          jurisdiction: ds.jurisdiction,
        })
        .onConflictDoNothing();
    }

    // 10. Seed Webhooks
    for (const wh of INITIAL_WEBHOOKS) {
      await db
        .insert(webhooks)
        .values({
          id: wh.id,
          tenantId: wh.tenantId,
          name: wh.name,
          url: wh.url,
          status: wh.status,
          events: wh.events,
          secret: wh.secret,
        })
        .onConflictDoNothing();
    }

    // 11. Seed Webhook Deliveries
    for (const del of INITIAL_DELIVERIES) {
      await db
        .insert(webhookDeliveries)
        .values({
          id: del.id,
          webhookId: del.webhookId,
          event: del.event,
          endpoint: del.endpoint,
          statusCode: del.statusCode,
          status: del.status,
          timestamp: del.timestamp,
          payloadSummary: del.payloadSummary,
          durationMs: del.durationMs,
        })
        .onConflictDoNothing();
    }

    // 12. Seed Audit Events
    for (const al of INITIAL_AUDIT_LOGS) {
      await db
        .insert(auditEvents)
        .values({
          id: al.id,
          timestamp: al.timestamp,
          event: al.event,
          actor: al.actor,
          organization: al.organization,
          resource: al.resource,
          ip: al.ip,
          channel: al.channel,
          result: al.result,
          hash: al.hash,
        })
        .onConflictDoNothing();
    }

    // 13. Seed Notifications
    for (const notif of INITIAL_NOTIFICATIONS) {
      await db
        .insert(notifications)
        .values({
          id: notif.id,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          read: notif.read,
          timestamp: notif.timestamp,
          targetRole: notif.targetRole,
          linkRoute: notif.linkRoute || null,
        })
        .onConflictDoNothing();
    }

    console.log('PostgreSQL database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
