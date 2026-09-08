import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Building2,
  AlertOctagon,
  UserPlus,
  Sliders
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab, alerts } = useApp();
  const activeAlerts = alerts.filter(a => a.status === 'active' && a.severity === 'CRITICAL').length;

  const items = [
    { tab: 'map' as NavigationTab, label: 'Map', icon: MapPin },
    { tab: 'finder' as NavigationTab, label: 'Find Shelter', icon: Compass },
    { tab: 'intake' as NavigationTab, label: 'Intake', icon: UserPlus },
    { tab: 'command' as NavigationTab, label: 'Command', icon: LayoutDashboard },
    { tab: 'alerts' as NavigationTab, label: 'Alerts', icon: AlertOctagon, badge: activeAlerts > 0 ? activeAlerts : undefined }
  ];

  return (
    <nav id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1120]/98 backdrop-blur-md border-t border-[#243656] text-[#94A3B8] py-1.5 px-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map(item => {
          const isActive = currentTab === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              id={`mobile-nav-${item.tab}`}
              onClick={() => setCurrentTab(item.tab)}
              className={`relative flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                isActive ? 'text-blue-400 font-bold' : 'hover:text-[#F8FAFC]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-[#94A3B8]'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && (
                <span className="absolute -top-0.5 right-1.5 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
