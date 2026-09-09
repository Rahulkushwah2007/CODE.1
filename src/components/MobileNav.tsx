import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  Building2,
  PackageCheck,
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { triggerHaptic, handleRipple } from '../utils/feedback';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, alerts } = useApp();
  const activeAlerts = alerts.filter(a => a.status === 'active' && a.severity === 'CRITICAL').length;

  const items = [
    {
      tab: 'shelters' as NavigationTab,
      label: 'Shelters',
      icon: Building2
    },
    {
      tab: 'resources' as NavigationTab,
      label: 'Resources',
      icon: PackageCheck
    },
    {
      tab: 'alerts' as NavigationTab,
      label: 'Alerts',
      icon: AlertOctagon,
      badge: activeAlerts > 0 ? activeAlerts : undefined
    },
    {
      tab: 'profile' as NavigationTab,
      label: 'Profile',
      icon: UserCheck
    }
  ];

  const handleNav = (e: React.MouseEvent<HTMLButtonElement>, tab: NavigationTab) => {
    handleRipple(e);
    triggerHaptic(20);
    setCurrentTab(tab);
  };

  return (
    <nav
      id="mobile-bottom-nav"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A] border-t-2 border-[#1E293B] text-[#F8FAFC] pb-safe shadow-2xl"
    >
      <div className="grid grid-cols-4 items-center max-w-md mx-auto py-1 px-1">
        {items.map(item => {
          const isActive =
            currentTab === item.tab ||
            (item.tab === 'shelters' && (currentTab === 'map' || currentTab === 'finder'));
          const Icon = item.icon;

          return (
            <button
              key={item.tab}
              id={`mobile-nav-btn-${item.tab}`}
              onClick={e => handleNav(e, item.tab)}
              className={`relative flex flex-col items-center justify-center min-h-[52px] py-1 px-1 rounded-xl transition-all cursor-pointer ripple-container ${
                isActive
                  ? 'text-[#EA580C] font-black bg-[#1E293B] border border-[#EA580C]/40'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF]'
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[#EA580C] scale-110' : 'text-[#94A3B8]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-[#DC2626] text-[#FFFFFF] rounded-full text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight font-medium ${isActive ? 'text-[#EA580C] font-black' : 'text-[#94A3B8]'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
