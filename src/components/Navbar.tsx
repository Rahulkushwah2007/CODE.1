import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  MapPin,
  Bell,
  Search,
  UserCheck,
  X,
  Phone,
  PhoneCall,
  Compass
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    country,
    setCountry,
    role,
    setRole,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    lastSyncTime,
    notifications,
    unreadNotifCount,
    markNotifRead,
    clearAllNotifs,
    currentIncident
  } = useApp();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    public: { label: 'Public Evacuee', badge: 'PUBLIC', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    staff: { label: 'Shelter Staff', badge: 'STAFF', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    manager: { label: 'Shelter Manager', badge: 'MANAGER', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    volunteer: { label: 'Volunteer Responder', badge: 'VOLUNTEER', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
    district_admin: { label: 'District Coordinator', badge: 'COORDINATOR', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
    super_admin: { label: 'National EOC Commander', badge: 'COMMANDER', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' }
  };

  return (
    <>
      {/* Top Incident Banner */}
      {currentIncident && (
        <div id="emergency-banner" className="bg-[#140A10] border-b border-rose-900/50 px-4 py-1.5 text-xs text-rose-200 flex flex-wrap items-center justify-between gap-2 z-40">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-bold text-white tracking-wide uppercase px-1.5 py-0.5 rounded bg-rose-600 text-[10px]">
              {currentIncident.severity} ADVISORY
            </span>
            <span className="font-semibold text-white">{currentIncident.name}</span>
            <span className="hidden md:inline text-rose-300/80">({currentIncident.region})</span>
            <span className="hidden lg:inline text-rose-300/70 border-l border-rose-800/60 pl-2">
              {currentIncident.evacuationOrders}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-800/60 text-[11px] font-mono text-rose-200">
              <PhoneCall className="w-3 h-3 text-rose-400" />
              <span>24/7 Helpline: <strong>112</strong> (IND) &bull; <strong>1155</strong> (NPL)</span>
            </div>
            <button
              id="btn-banner-find-shelter"
              onClick={() => setCurrentTab('map')}
              className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Compass className="w-3 h-3" />
              <span>Find Safe Shelter</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Command Navbar */}
      <header id="main-navbar" className="sticky top-0 z-30 bg-[#090E1A]/95 backdrop-blur-xl border-b border-[#1E2E4A] shadow-lg shadow-black/25 text-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentTab('landing')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-0.5 shadow-md shadow-blue-600/25 flex items-center justify-center">
                <div className="w-full h-full bg-[#0A1120] rounded-[10px] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg tracking-wider text-white">
                    RESQTECH
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded font-bold">
                    DISASTER PORTAL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-tight font-medium hidden sm:block">
                  Verified Disaster Shelters &bull; India &amp; Nepal
                </p>
              </div>
            </button>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search shelter, district, city..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#0F172A] border border-[#1E2E4A] rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Country Selector */}
            <div className="flex items-center bg-[#0F172A] border border-[#1E2E4A] rounded-lg p-0.5 shadow-inner">
              <button
                id="btn-country-all"
                onClick={() => setCountry('ALL')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  country === 'ALL'
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#182742]'
                }`}
                title="View All Shelters Across Subcontinent (India & Nepal)"
              >
                <span className="text-sm">🌏</span>
                <span className="hidden sm:inline">All</span>
              </button>
              <button
                id="btn-country-ind"
                onClick={() => setCountry('IND')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  country === 'IND'
                    ? 'bg-amber-600 text-white font-bold shadow-sm shadow-amber-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#182742]'
                }`}
                title="Switch to India Shelters & Districts"
              >
                <span className="text-sm">🇮🇳</span>
                <span className="hidden sm:inline">India</span>
              </button>
              <button
                id="btn-country-npl"
                onClick={() => setCountry('NPL')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  country === 'NPL'
                    ? 'bg-rose-600 text-white font-bold shadow-sm shadow-rose-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#182742]'
                }`}
                title="Switch to Nepal Shelters & Municipalities"
              >
                <span className="text-sm">🇳🇵</span>
                <span className="hidden sm:inline">Nepal</span>
              </button>
            </div>

            {/* Quick Emergency Call Button */}
            <a
              href="tel:112"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm shadow-rose-600/25 transition-colors border border-rose-500"
              title="Emergency Helpline: 112 (India) / 1155 (Nepal)"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span className="font-mono">112 / 1155</span>
            </a>

            {/* Role Switcher */}
            <div className="relative">
              <button
                id="btn-role-switcher"
                onClick={() => setShowRoleModal(!showRoleModal)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${roleLabels[role].color}`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{roleLabels[role].label}</span>
                <span className="sm:hidden">{roleLabels[role].badge}</span>
              </button>

              {/* Role Dropdown */}
              {showRoleModal && (
                <div
                  id="role-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-[#1E2E4A] rounded-xl shadow-2xl p-2 z-50 text-xs"
                >
                  <div className="px-2 py-1 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-[#1E2E4A] pb-1 mb-1">
                    Operating Role
                  </div>
                  {(Object.keys(roleLabels) as UserRole[]).map(r => (
                    <button
                      key={r}
                      id={`role-option-${r}`}
                      onClick={() => {
                        setRole(r);
                        setShowRoleModal(false);
                        if (r === 'public') setCurrentTab('finder');
                        if (r === 'manager') setCurrentTab('manager-dashboard');
                        if (r === 'district_admin' || r === 'super_admin') setCurrentTab('command');
                        if (r === 'volunteer') setCurrentTab('volunteers');
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                        role === r ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30' : 'text-slate-300 hover:bg-[#182742] hover:text-white'
                      }`}
                    >
                      <span>{roleLabels[r].label}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${roleLabels[r].color}`}>
                        {roleLabels[r].badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                className="relative p-2 rounded-lg bg-[#0F172A] border border-[#1E2E4A] text-slate-300 hover:text-white hover:border-blue-500/40 transition-colors cursor-pointer shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifDrawer && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F172A] border border-[#1E2E4A] rounded-xl shadow-2xl p-3 z-50 text-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#1E2E4A]">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-400" />
                      <span className="font-bold text-white">Disaster Alerts &amp; Logs</span>
                      {unreadNotifCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-semibold border border-rose-500/30">
                          {unreadNotifCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearAllNotifs}
                      className="text-[11px] text-slate-400 hover:text-blue-400 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#1E2E4A] my-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-slate-400">
                        No active dispatch alerts
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotifRead(n.id)}
                          className={`py-2 px-1 cursor-pointer transition-colors ${
                            !n.read ? 'bg-[#182742]/80 rounded' : 'opacity-80 hover:bg-[#182742]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] mt-0.5">{n.desc}</p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="pt-2 border-t border-[#1E2E4A] text-[10px] text-slate-400 flex justify-between">
                    <span>Last Sync: {lastSyncTime}</span>
                    <button
                      onClick={() => {
                        setShowNotifDrawer(false);
                        setCurrentTab('alerts');
                      }}
                      className="text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      View All Bulletins →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
