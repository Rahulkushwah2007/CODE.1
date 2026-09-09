import React, { useState, useRef, useEffect } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  Search,
  MapPin,
  X,
  Phone,
  Compass,
  Menu,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Layers,
  Building2,
  PackageCheck,
  AlertOctagon,
  UserCheck,
  LayoutDashboard,
  HeartHandshake,
  Radio,
  Sun,
  Moon,
  Loader2,
  PlusCircle
} from 'lucide-react';
import { ResqtechLogo } from './ResqtechLogo';
import { triggerHaptic, handleRipple, calculateDistanceKm } from '../utils/feedback';
import { Shelter } from '../types';

interface NavbarProps {
  onOpenShelterDetails?: (shelter: Shelter, distanceKm?: number) => void;
  onOpenSOS?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShelterDetails, onOpenSOS }) => {
  const {
    country,
    setCountry,
    role,
    setRole,
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    shelters,
    setSelectedShelterId,
    alerts,
    currentIncident,
    theme,
    toggleTheme,
    locateUserAndFilterNearby,
    isLocating
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLocatingNearby, setIsLocatingNearby] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter shelters for search suggestions
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return shelters
      .filter(s => (country === 'ALL' || s.country === country))
      .filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, shelters, country]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectShelter = (shelter: Shelter) => {
    triggerHaptic(20);
    setSelectedShelterId(shelter.id);
    setShowSearchDropdown(false);
    setSearchQuery(shelter.name);
    if (onOpenShelterDetails) {
      onOpenShelterDetails(shelter, 2.4);
    } else {
      setCurrentTab('shelters');
    }
  };

  const handleNearbySearch = () => {
    triggerHaptic([30, 20, 40]);
    setIsLocatingNearby(true);
    locateUserAndFilterNearby((coords, nearest, distKm) => {
      setIsLocatingNearby(false);
      if (onOpenShelterDetails && nearest) {
        onOpenShelterDetails(nearest, distKm);
      }
    });
  };

  const navigateTo = (tab: NavigationTab) => {
    triggerHaptic(20);
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const criticalAlertCount = alerts.filter(a => a.status === 'active' && a.severity === 'CRITICAL').length;

  return (
    <>
      {/* Sticky Header: Paper White in Light Mode, Deep Slate in Dark Mode */}
      <header
        id="resqtech-floating-top-bar"
        className="sticky top-0 z-40 bg-[#FFFFFF] dark:bg-[#0F172A] border-b border-[#E2E8F0] dark:border-white/10 text-[#0F172A] dark:text-[#FFFFFF] shadow-sm dark:shadow-md pt-safe transition-colors duration-200"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Mobile Hamburger & RESQTECH Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Button */}
            <button
              id="btn-mobile-hamburger"
              onClick={() => {
                triggerHaptic(20);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-[#F1F5F9] dark:bg-white/10 hover:bg-[#E2E8F0] dark:hover:bg-white/20 text-[#0F172A] dark:text-[#FFFFFF] border border-[#CBD5E1] dark:border-white/20 transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo & Name: Logo with RESQTECH */}
            <button
              onClick={() => navigateTo('shelters')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <ResqtechLogo size="md" breathing={isLocatingNearby || isLocating} />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-wider text-[#0F172A] dark:text-[#FFFFFF]">
                    RESQTECH
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EA580C] text-[#FFFFFF] font-black uppercase">
                    SOS
                  </span>
                </div>
                <p className="text-[10px] text-[#475569] dark:text-slate-300 -mt-0.5 font-medium">
                  National Disaster Safe Zones &amp; Relocations
                </p>
              </div>
            </button>
          </div>

          {/* Center: Robust Floating Search Option */}
          <div ref={searchRef} className="flex-1 max-w-md lg:max-w-lg relative mx-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="top-shelter-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder="Search shelter, safe zone, city, district..."
                className="w-full pl-9.5 pr-28 py-2 sm:py-2.5 bg-[#F8FAFC] dark:bg-[#1E293B] border-2 border-[#CBD5E1] dark:border-[#E2E8F0]/30 rounded-full text-xs sm:text-sm text-[#0F172A] dark:text-[#FFFFFF] placeholder-slate-400 focus:outline-none focus:border-[#EA580C] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                aria-label="Search disaster shelters"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-24 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}

              {/* Quick "Nearby" GPS action inside search bar */}
              <button
                type="button"
                onClick={handleNearbySearch}
                disabled={isLocatingNearby || isLocating}
                className="absolute right-1.5 px-2.5 py-1 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-[10px] sm:text-xs font-bold text-white flex items-center gap-1 transition-colors cursor-pointer shadow-sm disabled:opacity-75"
                title="Find verified shelters nearest to your GPS position (15 km radius)"
              >
                {isLocatingNearby || isLocating ? (
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                ) : (
                  <Compass className="w-3 h-3 text-white" />
                )}
                <span className="hidden sm:inline">Nearby (15km)</span>
              </button>
            </div>

            {/* Live Search Auto-Suggestions Dropdown */}
            {showSearchDropdown && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl shadow-2xl elevation-4 z-50 overflow-hidden animate-fadeIn text-[#0F172A]">
                <div className="p-2 border-b border-[#E2E8F0] text-[10px] font-mono text-[#475569] uppercase tracking-wider flex justify-between bg-slate-50">
                  <span>Verified Safe Zones</span>
                  <span>{searchSuggestions.length} found</span>
                </div>
                <div className="divide-y divide-[#E2E8F0] max-h-64 overflow-y-auto">
                  {searchSuggestions.map(shelter => (
                    <button
                      key={shelter.id}
                      onClick={() => handleSelectShelter(shelter)}
                      className="w-full p-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-[#0F172A] group-hover:text-[#EA580C]">
                          {shelter.name}
                        </div>
                        <div className="text-[11px] text-[#475569] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#EA580C] shrink-0" />
                          <span>{shelter.city}, {shelter.district}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        shelter.status === 'AVAILABLE' ? 'bg-[#059669] text-[#FFFFFF]' :
                        shelter.status === 'LIMITED' ? 'bg-[#EA580C] text-[#FFFFFF]' :
                        'bg-[#DC2626] text-[#FFFFFF]'
                      }`}>
                        {shelter.status === 'AVAILABLE' ? `${shelter.availableBeds} BEDS LEFT` : shelter.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Quick Locator Dropdown, Theme Switcher & SOS Broadcast */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Dark / Paper White Mode Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={() => {
                triggerHaptic(20);
                toggleTheme();
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full border border-[#CBD5E1] dark:border-white/20 bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#FFFFFF] hover:bg-[#E2E8F0] dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm"
              title={`Switch to ${theme === 'light' ? 'Dark Mode' : 'Paper White Mode'}`}
              aria-label="Toggle Dark and Light theme"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline text-[11px] font-semibold text-[#0F172A]">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline text-[11px] font-semibold text-white">Paper</span>
                </>
              )}
            </button>

            {/* Quick Locator Dropdown */}
            <div className="flex items-center bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-white/20 rounded-full p-0.5 text-[#0F172A] dark:text-[#FFFFFF]">
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setCountry('ALL');
                }}
                className={`px-2 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  country === 'ALL' ? 'bg-[#EA580C] text-[#FFFFFF] shadow-sm' : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setCountry('IND');
                }}
                className={`px-2 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  country === 'IND' ? 'bg-[#EA580C] text-[#FFFFFF] shadow-sm' : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                🇮🇳 IND
              </button>
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setCountry('NPL');
                }}
                className={`px-2 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  country === 'NPL' ? 'bg-[#EA580C] text-[#FFFFFF] shadow-sm' : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                }`}
              >
                🇳🇵 NPL
              </button>
            </div>

            {/* SOS Broadcast Action Button: #EA580C (Signal Amber) solid button */}
            <button
              onClick={() => {
                triggerHaptic([50, 30, 60]);
                if (onOpenSOS) {
                  onOpenSOS();
                } else {
                  navigateTo('alerts');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full clay-btn-signal bg-[#EA580C] hover:bg-[#C2410C] text-[#FFFFFF] font-black text-xs shadow-md border border-white/30 transition-colors cursor-pointer"
              title="SOS Emergency Broadcast & Distress Call"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span className="font-bold uppercase tracking-tight">SOS</span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Hamburger Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-4/5 max-w-sm h-full bg-[#FFFFFF] dark:bg-[#0F172A] border-r border-[#E2E8F0] dark:border-white/15 p-6 flex flex-col justify-between shadow-2xl transition-colors">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-white/10 pb-4">
                <ResqtechLogo size="sm" showText={true} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links - Dedicated Separate Pages adhering to prompt */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => navigateTo('shelters')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    currentTab === 'shelters' || currentTab === 'map' || currentTab === 'finder'
                      ? 'bg-[#EA580C] text-white shadow-lg'
                      : 'text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-[#EA580C]" />
                    <span>Shelters (15km Radius)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => navigateTo('register-shelter')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    currentTab === 'register-shelter'
                      ? 'bg-[#EA580C] text-white shadow-lg'
                      : 'text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 border border-dashed border-[#EA580C]/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-5 h-5 text-emerald-500" />
                    <span>Register Shelter (Public/Private)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
                    Add
                  </span>
                </button>

                <button
                  onClick={() => navigateTo('resources')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    currentTab === 'resources' ? 'bg-[#059669] text-white shadow-lg' : 'text-[#0F172A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PackageCheck className="w-5 h-5 text-[#059669]" />
                    <span>Relief Resources</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <button
                  onClick={() => navigateTo('alerts')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    currentTab === 'alerts' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertOctagon className="w-5 h-5 text-rose-400" />
                    <span>Disaster Alerts</span>
                  </div>
                  {criticalAlertCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {criticalAlertCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigateTo('profile')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                    currentTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <span>Evacuee Profile &amp; Pass</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <button
                    onClick={() => navigateTo('command')}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-sky-400" />
                      <span>Command Center (EOC)</span>
                    </div>
                  </button>

                  <button
                    onClick={() => navigateTo('volunteers')}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-indigo-400" />
                      <span>Volunteer Network</span>
                    </div>
                  </button>
                </div>
              </nav>

              {/* Mobile Country Selector */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                  Disaster Jurisdiction
                </span>
                <div className="grid grid-cols-3 gap-1.5 bg-[#0A1120] p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setCountry('ALL')}
                    className={`py-2 text-xs font-bold rounded-lg ${country === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCountry('IND')}
                    className={`py-2 text-xs font-bold rounded-lg ${country === 'IND' ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
                  >
                    🇮🇳 India
                  </button>
                  <button
                    onClick={() => setCountry('NPL')}
                    className={`py-2 text-xs font-bold rounded-lg ${country === 'NPL' ? 'bg-rose-600 text-white' : 'text-slate-400'}`}
                  >
                    🇳🇵 Nepal
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Helpline Box in Drawer */}
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-rose-300 uppercase block">
                24/7 National Emergency Hotline
              </span>
              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-rose-600 text-white font-black text-sm w-full shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Call 112 (IND) / 1155 (NPL)</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
