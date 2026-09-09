import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  Building2,
  PackageCheck,
  AlertOctagon,
  UserCheck,
  LayoutDashboard,
  UserPlus,
  HeartHandshake,
  BarChart3,
  Sliders,
  MapPin,
  Compass,
  Radio,
  ChevronRight,
  PlusCircle,
  Plus
} from 'lucide-react';
import { triggerHaptic } from '../utils/feedback';

interface NavItem {
  tab: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, alerts, shelters, country, theme } = useApp();

  const criticalAlertsCount = alerts.filter(a => a.status === 'active' && a.severity === 'CRITICAL').length;
  const criticalSheltersCount = shelters.filter(s => (country === 'ALL' || s.country === country) && s.status === 'CRITICAL').length;

  // Main high-priority relief options (without the flashing alert button distracting the user)
  const primaryOptions: NavItem[] = [
    {
      tab: 'shelters',
      label: 'Shelters & Safe Zones',
      icon: Building2,
      badge: criticalSheltersCount > 0 ? `${criticalSheltersCount} Alert` : undefined,
      badgeColor: 'bg-[#EA580C] text-[#FFFFFF]'
    },
    {
      tab: 'register-shelter',
      label: 'Register New Shelter',
      icon: PlusCircle,
      badge: 'Public/Private',
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      tab: 'resources',
      label: 'Relief Resources',
      icon: PackageCheck
    },
    {
      tab: 'profile',
      label: 'Evacuee Profile & Pass',
      icon: UserCheck
    }
  ];

  const coordinatorTools: NavItem[] = [
    { tab: 'command', label: 'Command Center', icon: LayoutDashboard },
    { tab: 'intake', label: 'Family Intake Wizard', icon: UserPlus },
    { tab: 'volunteers', label: 'Volunteer Network', icon: HeartHandshake },
    { tab: 'analytics', label: 'Disaster Analytics', icon: BarChart3 },
    { tab: 'settings', label: 'System Telemetry', icon: Sliders }
  ];

  const handleNav = (tab: NavigationTab) => {
    triggerHaptic(15);
    setCurrentTab(tab);
  };

  return (
    <aside
      id="desktop-persistent-sidebar"
      className="hidden lg:flex flex-col w-64 bg-[#FFFFFF] dark:bg-[#0F172A] border-r-2 border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shrink-0 select-none shadow-sm dark:shadow-xl transition-colors duration-200"
    >
      <div className="flex-1 py-5 px-3.5 space-y-6 overflow-y-auto">
        
        {/* Primary User Sections */}
        <div className="space-y-1.5">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-bold">
            Core Relief Operations
          </div>

          {primaryOptions.map(item => {
            const isActive =
              currentTab === item.tab ||
              (item.tab === 'shelters' && (currentTab === 'map' || currentTab === 'finder'));
            const Icon = item.icon;

            return (
              <button
                key={item.tab}
                id={`sidebar-nav-${item.tab}`}
                onClick={() => handleNav(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#EA580C] text-[#FFFFFF] shadow-md shadow-[#EA580C]/20 border border-white/20'
                    : 'text-[#334155] dark:text-[#E2E8F0] hover:text-[#0F172A] dark:hover:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge ? (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Action: Register Shelter (Public / Private) */}
        <div className="pt-1">
          <button
            id="sidebar-register-shelter-quick-action"
            onClick={() => handleNav('register-shelter')}
            className={`w-full text-left p-3 rounded-2xl border-2 transition-all cursor-pointer group ${
              currentTab === 'register-shelter'
                ? 'border-[#EA580C] bg-[#EA580C]/10 dark:bg-[#EA580C]/20 shadow-sm'
                : 'border-dashed border-[#CBD5E1] dark:border-slate-700 hover:border-[#EA580C] dark:hover:border-[#EA580C] bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#EA580C] text-white flex items-center justify-center shadow-sm">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-[#0F172A] dark:text-white leading-tight">
                    Add New Shelter
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    Private or Public facility
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-black uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                Register
              </span>
            </div>
          </button>
        </div>

        {/* Secondary Coordinator Sections */}
        <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] dark:text-[#64748B] font-bold">
            EOC &amp; Incident Coordination
          </div>

          {coordinatorTools.map(item => {
            const isActive = currentTab === item.tab;
            const Icon = item.icon;

            return (
              <button
                key={item.tab}
                id={`sidebar-nav-${item.tab}`}
                onClick={() => handleNav(item.tab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-slate-200 dark:bg-[#1E293B] text-[#0F172A] dark:text-[#38BDF8] border border-slate-300 dark:border-[#38BDF8]/40'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#94A3B8] dark:text-[#64748B] group-hover:text-[#0F172A] dark:group-hover:text-[#94A3B8]" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Discrete Emergency Alert System at the END of the sidebar */}
      <div className="p-3.5 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0A1120] space-y-2">
        {/* Low-key Emergency Alert System Option */}
        <button
          id="sidebar-nav-alerts-end"
          onClick={() => handleNav('alerts')}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
            currentTab === 'alerts'
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
              : 'bg-white dark:bg-[#0F172A] text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white border-[#E2E8F0] dark:border-[#1E293B] hover:border-slate-300'
          }`}
          title="Emergency alert broadcast console (Low-visibility mode)"
        >
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-[11px] font-semibold">Emergency Alert System</span>
          </div>
          {criticalAlertsCount > 0 && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {criticalAlertsCount}
            </span>
          )}
        </button>

        {/* Sync Status */}
        <div className="px-2 py-1.5 rounded-lg bg-slate-100/70 dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#059669]" />
          <div className="text-[10px] leading-tight">
            <strong className="text-[#0F172A] dark:text-[#FFFFFF] block font-semibold">RESQTECH GIS Network</strong>
            <span className="text-[#64748B] dark:text-[#94A3B8] text-[9px]">Verified Relief Grid Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
