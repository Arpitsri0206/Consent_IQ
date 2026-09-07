import { Router } from 'express';
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
import { eq, desc, and } from 'drizzle-orm';
import { getOrCreateUser } from '../db/users.ts';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', async (req, res) => {
  try {
    const consentCount = await db.select().from(consents).limit(1);
    res.json({
      status: 'ok',
      database: 'PostgreSQL (Cloud SQL)',
      timestamp: new Date().toISOString(),
      active: true,
      ready: consentCount !== undefined,
    });
  } catch (error: any) {
    console.error('Health check database connection error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Users / Auth Sync
apiRouter.post('/auth/sync', async (req, res) => {
  try {
    const { uid, email, name, role, orgId, orgName } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }
    const user = await getOrCreateUser(uid, email, name, role, orgId, orgName);
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Auth sync failed:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Consents Endpoints
apiRouter.get('/consents', async (req, res) => {
  try {
    const { userRef, tenantId, status } = req.query;
    let query = db.select().from(consents);

    const conditions = [];
    if (userRef) conditions.push(eq(consents.userRef, String(userRef)));
    if (tenantId) conditions.push(eq(consents.tenantId, String(tenantId)));
    if (status) conditions.push(eq(consents.status, String(status)));

    const result = conditions.length > 0
      ? await db.select().from(consents).where(and(...conditions)).orderBy(desc(consents.createdAt))
      : await db.select().from(consents).orderBy(desc(consents.createdAt));

    res.json(result);
  } catch (error: any) {
    console.error('Failed to get consents:', error);
    res.status(500).json({ error: 'Failed to fetch consents' });
  }
});

apiRouter.post('/consents', async (req, res) => {
  try {
    const newConsent = req.body;
    const inserted = await db.insert(consents).values(newConsent).returning();

    // Also record initial Consent Requested or Granted event in the ledger
    if (inserted[0]) {
      const c = inserted[0];
      await db.insert(consentEvents).values({
        eventId: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        consentId: c.id,
        eventType: c.status === 'GRANTED' ? 'CONSENT_GRANTED' : 'CONSENT_REQUESTED',
        timestamp: new Date().toISOString(),
        actor: c.userName || 'Data Principal',
        organization: c.brandName,
        purpose: c.purposeName,
        channel: c.collectionChannel || 'Web',
        metadata: { categories: c.dataCategories, version: c.noticeVersion },
        previousHash: c.previousHash || 'GENESIS_HASH_DPDP_INDIA_2026',
        eventHash: c.evidenceHash,
        isValid: true,
      });
    }

    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create consent:', error);
    res.status(500).json({ error: 'Failed to create consent' });
  }
});

apiRouter.put('/consents/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, eventType, actor, reason, eventHash, previousHash } = req.body;

    const now = new Date().toISOString();
    const updateData: any = { status };
    if (status === 'GRANTED') updateData.grantedAt = now;
    if (status === 'WITHDRAWN') updateData.withdrawnAt = now;

    const updated = await db
      .update(consents)
      .set(updateData)
      .where(eq(consents.id, id))
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Consent not found' });
    }

    const c = updated[0];

    // Append cryptographic event
    const newEvent = await db
      .insert(consentEvents)
      .values({
        eventId: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        consentId: c.id,
        eventType: eventType || (status === 'WITHDRAWN' ? 'CONSENT_WITHDRAWN' : 'CONSENT_GRANTED'),
        timestamp: now,
        actor: actor || c.userName,
        organization: c.brandName,
        purpose: c.purposeName,
        channel: c.collectionChannel,
        metadata: { reason: reason || null, updatedStatus: status },
        previousHash: previousHash || c.evidenceHash,
        eventHash: eventHash || `sha256_${Date.now()}`,
        isValid: true,
      })
      .returning();

    // Create Notification
    await db.insert(notifications).values({
      id: `notif_${Date.now()}`,
      title: status === 'WITHDRAWN' ? 'Consent Revocation Logged' : 'Consent Updated',
      message: `${c.brandName} - ${c.purposeName} consent is now ${status}.`,
      type: status === 'WITHDRAWN' ? 'WITHDRAWAL' : 'CONSENT',
      read: false,
      timestamp: now,
      targetRole: 'DATA_PRINCIPAL',
      linkRoute: '/user/consents',
    });

    res.json({ consent: c, event: newEvent[0] });
  } catch (error: any) {
    console.error('Failed to update consent status:', error);
    res.status(500).json({ error: 'Failed to update consent status' });
  }
});

// Chained Ledger Events
apiRouter.get('/events', async (req, res) => {
  try {
    const { consentId } = req.query;
    const result = consentId
      ? await db.select().from(consentEvents).where(eq(consentEvents.consentId, String(consentId))).orderBy(desc(consentEvents.createdAt))
      : await db.select().from(consentEvents).orderBy(desc(consentEvents.createdAt));

    res.json(result);
  } catch (error: any) {
    console.error('Failed to get events:', error);
    res.status(500).json({ error: 'Failed to fetch consent events' });
  }
});

// Organizations
apiRouter.get('/organizations', async (req, res) => {
  try {
    const result = await db.select().from(organizations);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get organizations:', error);
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

apiRouter.put('/organizations/:id/customization', async (req, res) => {
  try {
    const { id } = req.params;
    const { widgetCustomization } = req.body;

    const updated = await db
      .update(organizations)
      .set({ widgetCustomization })
      .where(eq(organizations.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to update organization customization:', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// Purposes
apiRouter.get('/purposes', async (req, res) => {
  try {
    const { tenantId } = req.query;
    const result = tenantId
      ? await db.select().from(purposes).where(eq(purposes.tenantId, String(tenantId)))
      : await db.select().from(purposes);

    res.json(result);
  } catch (error: any) {
    console.error('Failed to get purposes:', error);
    res.status(500).json({ error: 'Failed to fetch purposes' });
  }
});

apiRouter.post('/purposes', async (req, res) => {
  try {
    const newPurpose = req.body;
    const inserted = await db.insert(purposes).values(newPurpose).returning();
    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create purpose:', error);
    res.status(500).json({ error: 'Failed to create purpose' });
  }
});

// Privacy Notices
apiRouter.get('/notices', async (req, res) => {
  try {
    const { tenantId } = req.query;
    const result = tenantId
      ? await db.select().from(privacyNotices).where(eq(privacyNotices.tenantId, String(tenantId)))
      : await db.select().from(privacyNotices);

    res.json(result);
  } catch (error: any) {
    console.error('Failed to get notices:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

apiRouter.post('/notices', async (req, res) => {
  try {
    const newNotice = req.body;
    const inserted = await db.insert(privacyNotices).values(newNotice).returning();
    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create notice:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Data Principal Requests (DSR)
apiRouter.get('/requests', async (req, res) => {
  try {
    const { tenantId, userRef } = req.query;
    const conditions = [];
    if (tenantId) conditions.push(eq(dataPrincipalRequests.tenantId, String(tenantId)));
    if (userRef) conditions.push(eq(dataPrincipalRequests.userRef, String(userRef)));

    const result = conditions.length > 0
      ? await db.select().from(dataPrincipalRequests).where(and(...conditions)).orderBy(desc(dataPrincipalRequests.receivedAt))
      : await db.select().from(dataPrincipalRequests).orderBy(desc(dataPrincipalRequests.receivedAt));

    res.json(result);
  } catch (error: any) {
    console.error('Failed to get requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

apiRouter.post('/requests', async (req, res) => {
  try {
    const newRequest = req.body;
    const inserted = await db.insert(dataPrincipalRequests).values(newRequest).returning();
    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

apiRouter.put('/requests/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNotes, status } = req.body;

    const updated = await db
      .update(dataPrincipalRequests)
      .set({
        resolutionNotes,
        status: status || 'RESOLVED',
        resolvedAt: new Date().toISOString(),
      })
      .where(eq(dataPrincipalRequests.id, id))
      .returning();

    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to resolve request:', error);
    res.status(500).json({ error: 'Failed to resolve request' });
  }
});

// RoPA Data Inventory
apiRouter.get('/inventory', async (req, res) => {
  try {
    const result = await db.select().from(dataInventory);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get inventory:', error);
    res.status(500).json({ error: 'Failed to fetch data inventory' });
  }
});

// Data Sharing Graph
apiRouter.get('/sharing', async (req, res) => {
  try {
    const result = await db.select().from(dataSharingNodes);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get sharing nodes:', error);
    res.status(500).json({ error: 'Failed to fetch data sharing graph' });
  }
});

// Webhooks
apiRouter.get('/webhooks', async (req, res) => {
  try {
    const result = await db.select().from(webhooks);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get webhooks:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
});

apiRouter.post('/webhooks', async (req, res) => {
  try {
    const newWebhook = req.body;
    const inserted = await db.insert(webhooks).values(newWebhook).returning();
    res.status(201).json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to create webhook:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

apiRouter.get('/webhooks/deliveries', async (req, res) => {
  try {
    const result = await db.select().from(webhookDeliveries).orderBy(desc(webhookDeliveries.timestamp)).limit(50);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get webhook deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch webhook deliveries' });
  }
});

apiRouter.post('/webhooks/test', async (req, res) => {
  try {
    const { webhookId, endpoint, event } = req.body;
    const delivery = {
      id: `del_${Date.now()}`,
      webhookId: webhookId || 'wh_apex_crm',
      event: event || 'CONSENT_GRANTED',
      endpoint: endpoint || 'https://api.apexfin.example.com/webhooks/dpdp-events',
      statusCode: 200,
      status: 'DELIVERED',
      timestamp: new Date().toISOString(),
      payloadSummary: '{"event":"CONSENT_GRANTED","principal":"USR-8F3A2","timestamp":"2026-09-07T08:20:00Z"}',
      durationMs: Math.floor(Math.random() * 80) + 40,
    };

    const inserted = await db.insert(webhookDeliveries).values(delivery).returning();
    res.json(inserted[0]);
  } catch (error: any) {
    console.error('Failed to test webhook:', error);
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

// Audit Events
apiRouter.get('/audit', async (req, res) => {
  try {
    const result = await db.select().from(auditEvents).orderBy(desc(auditEvents.timestamp)).limit(100);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get audit events:', error);
    res.status(500).json({ error: 'Failed to fetch audit events' });
  }
});

// Notifications
apiRouter.get('/notifications', async (req, res) => {
  try {
    const result = await db.select().from(notifications).orderBy(desc(notifications.timestamp));
    res.json(result);
  } catch (error: any) {
    console.error('Failed to get notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

apiRouter.put('/notifications/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error: any) {
    console.error('Failed to mark notification read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});
