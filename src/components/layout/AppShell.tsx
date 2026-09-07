import React, { useState } from 'react';
import { useApp } from '../../services/store';
import { UserRole } from '../../types';
import {
  Shield,
  ShieldCheck,
  LayoutDashboard,
  CheckSquare,
  History,
  Share2,
  FileQuestion,
  Layers,
  FileText,
  Database,
  Link,
  Radio,
  FileCheck,
  Building2,
  Lock,
  Settings,
  Bell,
  Search,
  Globe,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { CommandPalette } from '../common/CommandPalette';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ currentRoute, onNavigate, children }) => {
  const {
    currentUser,
    currentRole,
    switchRole,
    language,
    setLanguage,
    t,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
    dbConnected,
    isSyncing
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read && n.targetRole === currentRole).length;

  // Nav Items based on Role
  const navItems = {
    DATA_PRINCIPAL: [
      { id: '/user/dashboard', label: t.navDashboard, icon: LayoutDashboard },
      { id: '/user/consents', label: t.navConsents, icon: CheckSquare, badge: '1' },
      { id: '/user/history', label: t.navHistory, icon: History },
      { id: '/user/data-sharing', label: t.navDataSharing, icon: Share2 },
      { id: '/user/requests', label: t.navRequests, icon: FileQuestion }
    ],
    BRAND_ADMIN: [
      { id: '/brand/dashboard', label: t.navDashboard, icon: LayoutDashboard },
      { id: '/brand/consents', label: t.navConsentRegistry, icon: CheckSquare },
      { id: '/brand/consents/create', label: t.navCreateConsent, icon: Sparkles, highlight: true },
      { id: '/brand/purposes', label: t.navPurposes, icon: Layers },
      { id: '/brand/notices', label: t.navNotices, icon: FileText },
      { id: '/brand/data-inventory', label: t.navDataInventory, icon: Database },
      { id: '/brand/data-sharing', label: 'Third-Party Processors', icon: Share2 },
      { id: '/brand/requests', label: 'DSR Grievance Queue', icon: FileQuestion },
      { id: '/brand/integrations', label: t.navIntegrations, icon: Link },
      { id: '/brand/webhooks', label: t.navWebhooks, icon: Radio },
      { id: '/brand/audit', label: t.navAudit, icon: FileCheck },
      { id: '/brand/evidence', label: t.navEvidence, icon: ShieldCheck },
      { id: '/brand/settings', label: t.navSettings, icon: Settings }
    ],
    PLATFORM_ADMIN: [
      { id: '/admin/dashboard', label: t.navDashboard, icon: LayoutDashboard },
      { id: '/admin/organizations', label: t.navOrganizations, icon: Building2 },
      { id: '/admin/security', label: t.navSecurity, icon: Lock },
      { id: '/admin/audit', label: t.navAudit, icon: FileCheck }
    ]
  }[currentRole];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={route => onNavigate(route)}
      />

      {/* Top Banner: DPDP Compliance Notice & DB Connection */}
      <div className="bg-[#0b1120] px-4 py-1.5 text-center text-xs text-slate-400 font-medium flex items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 mx-auto">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">ConsentIQ Engine</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">{t.dpdpDisclaimer}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <Database className="w-3 h-3 text-indigo-400" />
          <span className="text-slate-300">Cloud SQL (PostgreSQL):</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            asia-southeast1 (Connected)
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop (Sleek Interface Deep Slate Navy) */}
        <aside className="hidden lg:flex w-64 flex-col shrink-0 bg-[#0f172a] text-slate-300 select-none">
          <div className="p-6">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold text-white tracking-tight">ConsentIQ</span>
                  <span className="rounded bg-indigo-500/20 border border-indigo-400/30 px-1.5 py-0.2 text-[9px] font-bold text-indigo-300 font-mono">
                    DPDP
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Digital Trust Platform</p>
              </div>
            </div>

            {/* Persona Switcher inside Dark Sidebar */}
            <div className="mb-6 rounded-xl bg-slate-800/60 p-1 border border-slate-700/50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
                <span>Active Role</span>
                <span className="text-indigo-400 font-mono text-[9px]">LIVE</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-semibold">
                <button
                  onClick={() => {
                    switchRole('DATA_PRINCIPAL');
                    onNavigate('/user/dashboard');
                  }}
                  className={`rounded-lg py-1.5 text-center transition-all ${
                    currentRole === 'DATA_PRINCIPAL'
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                  }`}
                >
                  Principal
                </button>
                <button
                  onClick={() => {
                    switchRole('BRAND_ADMIN');
                    onNavigate('/brand/dashboard');
                  }}
                  className={`rounded-lg py-1.5 text-center transition-all ${
                    currentRole === 'BRAND_ADMIN'
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                  }`}
                >
                  Brand
                </button>
                <button
                  onClick={() => {
                    switchRole('PLATFORM_ADMIN');
                    onNavigate('/admin/dashboard');
                  }}
                  className={`rounded-lg py-1.5 text-center transition-all ${
                    currentRole === 'PLATFORM_ADMIN'
                      ? 'bg-indigo-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1 text-sm font-medium">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between rounded-lg px-3.5 py-2.5 transition-all text-left ${
                      isActive
                        ? 'bg-white/10 text-white font-semibold'
                        : item.highlight
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'opacity-70'}`} />
                      <span className="text-xs">{item.label}</span>
                    </div>
                    {item.badge && !isActive && (
                      <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom System Status Widget (From Sleek Interface Theme) */}
          <div className="mt-auto p-4 space-y-3">
            <div className="p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1.5">System Status</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-300 font-medium">Ledger Synced</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                  99.98%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
              <button
                onClick={resetDemoData}
                title="Reset simulation state"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset Demo</span>
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 font-medium transition-colors"
              >
                <LogOut className="h-3 w-3" />
                <span>Switch Role</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Header / Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/70 backdrop-blur-xs">
            <div className="w-72 bg-[#0f172a] text-slate-300 p-5 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5 font-bold text-white">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-lg">ConsentIQ</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="my-4 rounded-xl bg-slate-800/60 border border-slate-700/50 p-2 text-xs space-y-1 font-semibold">
                <button
                  onClick={() => {
                    switchRole('DATA_PRINCIPAL');
                    onNavigate('/user/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${currentRole === 'DATA_PRINCIPAL' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Data Principal (User)
                </button>
                <button
                  onClick={() => {
                    switchRole('BRAND_ADMIN');
                    onNavigate('/brand/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${currentRole === 'BRAND_ADMIN' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Brand / Data Fiduciary
                </button>
                <button
                  onClick={() => {
                    switchRole('PLATFORM_ADMIN');
                    onNavigate('/admin/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg ${currentRole === 'PLATFORM_ADMIN' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Platform Admin
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto space-y-1 text-xs font-semibold">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg px-3.5 py-2.5 ${
                        isActive ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'opacity-70'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-y-auto">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 sm:h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10 shrink-0">
            {/* Left: Mobile menu toggle + Sleek Search Input */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Sleek Global Search Bar */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="relative flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 hover:border-slate-300 hover:bg-white shadow-2xs transition-all w-52 sm:w-80 md:w-96"
              >
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="truncate text-xs sm:text-sm">Search global records, consents, DSRs...</span>
                <kbd className="ml-auto hidden sm:inline-block rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-400 font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Language switch, Notification bell, Divider, User Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Language Switcher */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-semibold">
                <button
                  onClick={() => setLanguage('en')}
                  className={`rounded px-2.5 py-1 transition-all ${
                    language === 'en' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`rounded px-2.5 py-1 transition-all ${
                    language === 'hi' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute 1 top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white shadow-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl z-50 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-900">Notifications & Alerts</span>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-indigo-600 hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                      {notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkRoute) onNavigate(notif.linkRoute);
                            setNotifOpen(false);
                          }}
                          className={`cursor-pointer rounded-xl p-3 transition-colors ${
                            notif.read ? 'bg-slate-50 text-slate-600' : 'bg-indigo-50/70 text-indigo-950 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-bold uppercase tracking-wider text-indigo-700">{notif.type}</span>
                            <span>{notif.timestamp}</span>
                          </div>
                          <p className="font-semibold text-slate-900 text-xs">{notif.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="h-8 w-px bg-slate-200 mx-1"></div>

              {/* Sleek User Profile Block */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                  <div className="text-xs text-slate-500 font-medium">
                    {currentRole === 'DATA_PRINCIPAL'
                      ? 'Data Principal'
                      : currentRole === 'BRAND_ADMIN'
                      ? 'Brand Privacy Officer'
                      : 'Platform Super Admin'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-xs flex items-center justify-center text-white font-bold overflow-hidden ring-1 ring-slate-200">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page Body View */}
          <main className="flex-1 p-6 sm:p-10 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
