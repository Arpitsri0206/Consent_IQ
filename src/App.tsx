import React, { useState } from 'react';
import { AppProvider, useApp } from './services/store';
import { AppShell } from './components/layout/AppShell';

// Modals
import { ConsentReceiptModal } from './components/common/ConsentReceiptModal';
import { EvidenceModal } from './components/common/EvidenceModal';
import { NoticeViewerModal } from './components/common/NoticeViewerModal';
import { DataSharingVisualMap } from './components/common/DataSharingVisualMap';
import { ConsentRequestBuilder } from './components/brand/ConsentRequestBuilder';

// User Views
import { UserDashboardView } from './views/user/UserDashboardView';
import { UserConsentsView } from './views/user/UserConsentsView';
import { UserHistoryView } from './views/user/UserHistoryView';
import { UserRequestsView } from './views/user/UserRequestsView';

// Brand Views
import { BrandDashboardView } from './views/brand/BrandDashboardView';
import { BrandConsentsView } from './views/brand/BrandConsentsView';
import { BrandPurposesView } from './views/brand/BrandPurposesView';
import { BrandNoticesView } from './views/brand/BrandNoticesView';
import { BrandDataInventoryView } from './views/brand/BrandDataInventoryView';
import { BrandRequestsView } from './views/brand/BrandRequestsView';
import { BrandIntegrationsView } from './views/brand/BrandIntegrationsView';
import { BrandWebhooksView } from './views/brand/BrandWebhooksView';
import { BrandAuditView } from './views/brand/BrandAuditView';
import { BrandEvidenceView } from './views/brand/BrandEvidenceView';
import { BrandSettingsView } from './views/brand/BrandSettingsView';

// Admin Views
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminOrganizationsView } from './views/admin/AdminOrganizationsView';
import { AdminSecurityView } from './views/admin/AdminSecurityView';

// Auth View
import { LoginView } from './views/auth/LoginView';

const AppContent: React.FC = () => {
  const { currentRole, consents, notices } = useApp();
  const [currentRoute, setCurrentRoute] = useState<string>('/user/dashboard');

  // Active Modals
  const [receiptConsentId, setReceiptConsentId] = useState<string | null>(null);
  const [evidenceConsentId, setEvidenceConsentId] = useState<string | null>(null);
  const [noticeIdToView, setNoticeIdToView] = useState<string | null>(null);

  const activeReceiptConsent = consents.find(c => c.id === receiptConsentId) || null;
  const activeEvidenceConsent = consents.find(c => c.id === evidenceConsentId) || null;
  const activeNotice = notices.find(n => n.id === noticeIdToView) || null;

  const navigateTo = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user navigated to login
  if (currentRoute === '/login') {
    return (
      <LoginView
        onSelectPersona={(role, route) => {
          navigateTo(route);
        }}
      />
    );
  }

  return (
    <AppShell currentRoute={currentRoute} onNavigate={navigateTo}>
      {/* Route Router Switch */}
      {(() => {
        switch (currentRoute) {
          // Data Principal Routes
          case '/user/dashboard':
            return (
              <UserDashboardView
                onNavigate={navigateTo}
                onOpenReceipt={id => setReceiptConsentId(id)}
                onOpenNotice={id => setNoticeIdToView(id)}
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
          case '/user/consents':
            return (
              <UserConsentsView
                onOpenReceipt={id => setReceiptConsentId(id)}
                onOpenNotice={id => setNoticeIdToView(id)}
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
          case '/user/history':
            return (
              <UserHistoryView
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
          case '/user/data-sharing':
            return <DataSharingVisualMap />;
          case '/user/requests':
            return <UserRequestsView />;

          // Brand Admin Routes
          case '/brand/dashboard':
            return <BrandDashboardView onNavigate={navigateTo} />;
          case '/brand/consents':
            return (
              <BrandConsentsView
                onNavigate={navigateTo}
                onOpenReceipt={id => setReceiptConsentId(id)}
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
          case '/brand/consents/create':
            return <ConsentRequestBuilder onComplete={() => navigateTo('/brand/consents')} />;
          case '/brand/purposes':
            return <BrandPurposesView />;
          case '/brand/notices':
            return <BrandNoticesView onOpenNoticeModal={id => setNoticeIdToView(id)} />;
          case '/brand/data-inventory':
            return <BrandDataInventoryView />;
          case '/brand/data-sharing':
            return <DataSharingVisualMap />;
          case '/brand/requests':
            return <BrandRequestsView />;
          case '/brand/integrations':
            return <BrandIntegrationsView />;
          case '/brand/webhooks':
            return <BrandWebhooksView />;
          case '/brand/audit':
            return (
              <BrandAuditView
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
          case '/brand/evidence':
            return (
              <BrandEvidenceView
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
          case '/brand/settings':
            return <BrandSettingsView />;

          // Platform Admin Routes
          case '/admin/dashboard':
            return <AdminDashboardView onNavigate={navigateTo} />;
          case '/admin/organizations':
            return <AdminOrganizationsView />;
          case '/admin/security':
            return <AdminSecurityView />;
          case '/admin/audit':
            return (
              <BrandAuditView
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );

          default:
            return (
              <UserDashboardView
                onNavigate={navigateTo}
                onOpenReceipt={id => setReceiptConsentId(id)}
                onOpenNotice={id => setNoticeIdToView(id)}
                onVerifyEvidence={id => setEvidenceConsentId(id)}
              />
            );
        }
      })()}

      {/* Global Modals */}
      {activeReceiptConsent && (
        <ConsentReceiptModal
          consent={activeReceiptConsent}
          isOpen={!!receiptConsentId}
          onClose={() => setReceiptConsentId(null)}
        />
      )}

      {activeEvidenceConsent && (
        <EvidenceModal
          consent={activeEvidenceConsent}
          isOpen={!!evidenceConsentId}
          onClose={() => setEvidenceConsentId(null)}
        />
      )}

      {activeNotice && (
        <NoticeViewerModal
          notice={activeNotice}
          isOpen={!!noticeIdToView}
          onClose={() => setNoticeIdToView(null)}
        />
      )}
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
