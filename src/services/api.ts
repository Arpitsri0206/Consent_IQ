// ConsentIQ Enterprise API Client
// Connects to Node.js / Express backend with Cloud SQL (PostgreSQL)

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
  UserProfile,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  async checkHealth(): Promise<{ status: string; database: string; ready: boolean }> {
    return fetchJson('/health');
  },

  async syncUser(user: Partial<UserProfile>): Promise<{ success: boolean; user: any }> {
    return fetchJson('/auth/sync', {
      method: 'POST',
      body: JSON.stringify({
        uid: user.id || user.userRef,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId,
        orgName: user.orgName,
      }),
    });
  },

  async getConsents(params?: { userRef?: string; tenantId?: string; status?: string }): Promise<ConsentItem[]> {
    const query = new URLSearchParams();
    if (params?.userRef) query.append('userRef', params.userRef);
    if (params?.tenantId) query.append('tenantId', params.tenantId);
    if (params?.status) query.append('status', params.status);

    const qs = query.toString();
    return fetchJson<ConsentItem[]>(`/consents${qs ? `?${qs}` : ''}`);
  },

  async createConsent(data: Partial<ConsentItem>): Promise<ConsentItem> {
    return fetchJson<ConsentItem>('/consents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateConsentStatus(
    id: string,
    payload: { status: string; eventType?: string; actor?: string; reason?: string; eventHash?: string; previousHash?: string }
  ): Promise<{ consent: ConsentItem; event: ConsentEvent }> {
    return fetchJson<{ consent: ConsentItem; event: ConsentEvent }>(`/consents/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async getEvents(consentId?: string): Promise<ConsentEvent[]> {
    return fetchJson<ConsentEvent[]>(`/events${consentId ? `?consentId=${consentId}` : ''}`);
  },

  async getOrganizations(): Promise<Organization[]> {
    return fetchJson<Organization[]>('/organizations');
  },

  async updateOrganizationCustomization(id: string, customization: Organization['widgetCustomization']): Promise<Organization> {
    return fetchJson<Organization>(`/organizations/${id}/customization`, {
      method: 'PUT',
      body: JSON.stringify({ widgetCustomization: customization }),
    });
  },

  async getPurposes(tenantId?: string): Promise<Purpose[]> {
    return fetchJson<Purpose[]>(`/purposes${tenantId ? `?tenantId=${tenantId}` : ''}`);
  },

  async createPurpose(purpose: Partial<Purpose>): Promise<Purpose> {
    return fetchJson<Purpose>('/purposes', {
      method: 'POST',
      body: JSON.stringify(purpose),
    });
  },

  async getNotices(tenantId?: string): Promise<PrivacyNotice[]> {
    return fetchJson<PrivacyNotice[]>(`/notices${tenantId ? `?tenantId=${tenantId}` : ''}`);
  },

  async createNotice(notice: Partial<PrivacyNotice>): Promise<PrivacyNotice> {
    return fetchJson<PrivacyNotice>('/notices', {
      method: 'POST',
      body: JSON.stringify(notice),
    });
  },

  async getDataPrincipalRequests(tenantId?: string, userRef?: string): Promise<DataPrincipalRequest[]> {
    const query = new URLSearchParams();
    if (tenantId) query.append('tenantId', tenantId);
    if (userRef) query.append('userRef', userRef);
    const qs = query.toString();
    return fetchJson<DataPrincipalRequest[]>(`/requests${qs ? `?${qs}` : ''}`);
  },

  async createDataPrincipalRequest(request: Partial<DataPrincipalRequest>): Promise<DataPrincipalRequest> {
    return fetchJson<DataPrincipalRequest>('/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async resolveDataPrincipalRequest(id: string, resolutionNotes: string, status?: 'RESOLVED' | 'REJECTED'): Promise<DataPrincipalRequest> {
    return fetchJson<DataPrincipalRequest>(`/requests/${id}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolutionNotes, status: status || 'RESOLVED' }),
    });
  },

  async getDataInventory(): Promise<DataInventoryItem[]> {
    return fetchJson<DataInventoryItem[]>('/inventory');
  },

  async createDataInventoryItem(item: Partial<DataInventoryItem>): Promise<DataInventoryItem> {
    return fetchJson<DataInventoryItem>('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async bulkImportDataInventory(items: Partial<DataInventoryItem>[]): Promise<{ count: number; items: DataInventoryItem[] }> {
    return fetchJson<{ count: number; items: DataInventoryItem[] }>('/inventory/bulk', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  async getDataSharingGraph(): Promise<DataSharingNode[]> {
    return fetchJson<DataSharingNode[]>('/sharing');
  },

  async getWebhooks(): Promise<WebhookEndpoint[]> {
    return fetchJson<WebhookEndpoint[]>('/webhooks');
  },

  async createWebhook(webhook: Partial<WebhookEndpoint>): Promise<WebhookEndpoint> {
    return fetchJson<WebhookEndpoint>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhook),
    });
  },

  async getWebhookDeliveries(): Promise<WebhookDelivery[]> {
    return fetchJson<WebhookDelivery[]>('/webhooks/deliveries');
  },

  async testWebhook(webhookId: string, endpoint?: string, event?: string): Promise<WebhookDelivery> {
    return fetchJson<WebhookDelivery>('/webhooks/test', {
      method: 'POST',
      body: JSON.stringify({ webhookId, endpoint, event }),
    });
  },

  async getAuditLogs(): Promise<AuditEvent[]> {
    return fetchJson<AuditEvent[]>('/audit');
  },

  async verifyLedgerHash(hashOrId: string): Promise<any> {
    return fetchJson<any>('/ledger/verify-hash', {
      method: 'POST',
      body: JSON.stringify({ hashOrId }),
    });
  },

  async getNotifications(): Promise<AppNotification[]> {
    return fetchJson<AppNotification[]>('/notifications');
  },

  async markNotificationRead(id: string): Promise<AppNotification> {
    return fetchJson<AppNotification>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async getDashboardChartAnalytics(): Promise<{
    generatedAt: string;
    source: string;
    monthlyTrend: Array<{ month: string; granted: number; withdrawn: number }>;
    purposeBreakdown: Array<{ name: string; value: number; color: string }>;
    channelBreakdown: Array<{ channel: string; count: number }>;
    tenantVolumes: Array<{ name: string; active: number; rate: string }>;
    totalActiveConsents: number;
  }> {
    return fetchJson('/analytics/dashboard-charts');
  },
};
