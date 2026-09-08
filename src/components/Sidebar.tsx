import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Building2,
  UserPlus,
  Users,
  PackageCheck,
  AlertOctagon,
  HeartHandshake,
  BarChart3,
  Sliders,
  Home,
  ShieldCheck
} from 'lucide-react';

interface NavItem {
  tab: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  rolesAllowed?: string[];
}

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, alerts, shelters, country } = useApp();

  const criticalAlertsCount = alerts.filter(a => a.status === 'active' && a.severity === 'CRITICAL').length;
  const criticalSheltersCount = shelters.filter(s => (country === 'ALL' || s.country === country) && s.status === 'CRITICAL').length;

  const sections: {
    title: string;
    items: NavItem[];
  }[] = [
    {
      title: 'Shelter Operations',
      items: [
        { tab: 'map', label: 'GIS Live Map', icon: MapPin },
        { tab: 'shelters', label: 'Shelter Directory', icon: Building2, badge: criticalSheltersCount > 0 ? `${criticalSheltersCount} Alert` : undefined, badgeColor: 'bg-amber-500' },
        { tab: 'finder', label: 'Find a Shelter', icon: Compass },
      ]
    },
    {
      title: 'Evacuee Intake',
      items: [
        { tab: 'intake', label: 'Family Registration', icon: UserPlus },
        { tab: 'families', label: 'Family Groups', icon: Users },
        { tab: 'resources', label: 'Relief Resources', icon: PackageCheck },
      ]
    },
    {
      title: 'Command & Alerts',
      items: [
        { tab: 'command', label: 'Command Center', icon: LayoutDashboard, badge: criticalAlertsCount > 0 ? `${criticalAlertsCount}` : undefined, badgeColor: 'bg-rose-500' },
        { tab: 'alerts', label: 'Emergency Bulletins', icon: AlertOctagon, badge: `${alerts.filter(a => a.status === 'active').length}`, badgeColor: 'bg-rose-600' },
        { tab: 'volunteers', label: 'Volunteer Network', icon: HeartHandshake },
        { tab: 'analytics', label: 'Operational Analytics', icon: BarChart3 },
        { tab: 'settings', label: 'Settings & Telemetry', icon: Sliders },
        { tab: 'landing', label: 'System Overview', icon: Home },
      ]
    }
  ];

  return (
    <aside id="desktop-sidebar" className="hidden lg:flex flex-col w-64 bg-[#0A1120] border-r border-[#243656] text-[#F8FAFC] shrink-0 select-none">
      
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {sections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
              {section.title}
            </div>

            {section.items.map(item => {
              const isActive = currentTab === item.tab;
              const Icon = item.icon;

              return (
                <button
                  key={item.tab}
                  id={`sidebar-link-${item.tab}`}
                  onClick={() => setCurrentTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#182742] text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#111C30]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-[#94A3B8] group-hover:text-[#CBD5E1]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full text-white ${
                        item.badgeColor || 'bg-[#243656]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-[#243656] bg-[#070D18] text-[11px]">
        <div className="flex items-center justify-between text-[#CBD5E1] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-400 font-semibold">GIS FEED ACTIVE</span>
          </div>
          <span className="text-[#94A3B8]">v2.4-PRO</span>
        </div>
        <p className="text-[10px] text-[#94A3B8] mt-1">
          NDRRMA Nepal &amp; NDMA India Operations
        </p>
      </div>
    </aside>
  );
};
