import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  HeartPulse,
  Utensils,
  Droplet,
  Compass,
  Navigation,
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Car,
  Footprints,
  Users,
  Calendar,
  Radio,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Shelter } from '../types';
import { ShelterMap } from './ShelterMap';
import { ShelterDetailBottomSheet } from './ShelterDetailBottomSheet';
import { BookingConfirmModal } from './BookingConfirmModal';
import { QuickMetricsStrip } from './QuickMetricsStrip';
import { ShelterVerificationBadge } from './ShelterVerificationBadge';
import { triggerHaptic, handleRipple, calculateDistanceKm } from '../utils/feedback';

interface SheltersRosterViewProps {
  onOpenSOS?: () => void;
}

export const SheltersRosterView: React.FC<SheltersRosterViewProps> = ({ onOpenSOS }) => {
  const {
    country,
    shelters,
    setSelectedShelterId,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    userLocation,
    onlyNearby15Km,
    setOnlyNearby15Km,
    locateUserAndFilterNearby,
    isLocating
  } = useApp();

  // View presentation state: 'both' (Map + Cards) | 'map-only' | 'cards-only'
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'cards'>('both');

  // Filter states
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterMedical, setFilterMedical] = useState<boolean>(false);
  const [filterWater, setFilterWater] = useState<boolean>(false);
  const [filterFood, setFilterFood] = useState<boolean>(false);
  const [filterWheelchair, setFilterWheelchair] = useState<boolean>(false);

  // Bottom sheet & modal states
  const [selectedSheetShelter, setSelectedSheetShelter] = useState<Shelter | null>(null);
  const [bookingModalShelter, setBookingModalShelter] = useState<Shelter | null>(null);
  const [selectedDistanceKm, setSelectedDistanceKm] = useState<number | undefined>(undefined);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const countryShelters = useMemo(() => {
    return shelters.filter(s => country === 'ALL' || s.country === country);
  }, [shelters, country]);

  // Compute distance for each shelter and apply 15km filter (User Request #4)
  const filteredShelters = useMemo(() => {
    return countryShelters
      .map(s => {
        const distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, s.lat, s.lng);
        return { ...s, distanceKm };
      })
      .filter(s => {
        // Feature only nearby 15km radius shelter if enabled
        if (onlyNearby15Km && s.distanceKm > 15) {
          return false;
        }

        if (filterType !== 'ALL' && s.type !== filterType) return false;
        if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
        if (filterMedical && !s.facilities.medicalSupport) return false;
        if (filterWater && !s.facilities.drinkingWater) return false;
        if (filterFood && !s.facilities.foodAvailable) return false;
        if (filterWheelchair && !s.facilities.wheelchairAccessible) return false;

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            s.name.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            s.district.toLowerCase().includes(q) ||
            s.managingOrg.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm); // Closest to furthest
  }, [countryShelters, userLocation, onlyNearby15Km, filterType, filterStatus, filterMedical, filterWater, filterFood, filterWheelchair, searchQuery]);

  const handleOpenSheet = (shelter: Shelter) => {
    triggerHaptic(20);
    const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, shelter.lat, shelter.lng);
    setSelectedDistanceKm(dist);
    setSelectedSheetShelter(shelter);
    setSelectedShelterId(shelter.id);
  };

  const handleOpenBooking = (shelter: Shelter) => {
    triggerHaptic([30, 20, 50]);
    setSelectedSheetShelter(null);
    setBookingModalShelter(shelter);
  };

  const toggleAccordion = (id: string) => {
    triggerHaptic(15);
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  return (
    <div id="shelters-page-container" className="space-y-6 pb-20 transition-colors">
      
      {/* Quick Metrics Strip */}
      <QuickMetricsStrip onOpenSOS={onOpenSOS} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 text-[#0F172A] dark:text-[#F8FAFC]">

        {/* 1. Hero Utility Section: Pure Focus on Safe Zones & Immediate Find Prompt */}
        <div className="bg-[#FFFFFF] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-md relative overflow-hidden transition-colors">
          <div className="relative space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A]/5 dark:bg-white/10 text-[#0F172A] dark:text-[#F8FAFC] text-xs font-mono font-bold tracking-wider border border-[#E2E8F0] dark:border-white/10">
                  <Radio className="w-3.5 h-3.5 text-[#EA580C] animate-pulse" />
                  LIVE SAFE ZONES &bull; {country === 'IND' ? 'INDIA' : country === 'NPL' ? 'NEPAL' : 'ALL REGIONS'}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-1.5 tracking-tight">
                  Verified Disaster Shelters &amp; Evacuation Points
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-400 mt-1 max-w-2xl font-medium">
                  Real-time government &amp; NGO safe facilities with live bed capacity, verified clean water, hot food rations, and medical triage.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-[#F8FAFC] dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-white/10 rounded-full p-1 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    setViewMode('both');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'both' ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] shadow-sm' : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  Map + Cards
                </button>
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    setViewMode('map');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'map' ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] shadow-sm' : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    setViewMode('cards');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'cards' ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] shadow-sm' : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  Cards ({filteredShelters.length})
                </button>
              </div>
            </div>

            {/* 15 km Radius Filter & GPS Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#EA580C] shrink-0" />
                <div>
                  <span className="font-bold">
                    {onlyNearby15Km ? '15 km Proximity Radius Active' : 'Showing All Regional Shelters'}
                  </span>
                  <span className="font-mono text-[11px] opacity-80 block sm:inline sm:ml-2">
                    ({filteredShelters.length} shelter{filteredShelters.length === 1 ? '' : 's'} displayed near GPS: {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => locateUserAndFilterNearby()}
                  disabled={isLocating}
                  className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0F172A] border border-amber-300 dark:border-amber-700 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 text-[11px] cursor-pointer flex items-center gap-1.5 shadow-sm text-slate-800 dark:text-white"
                  title="Detect GPS location and refresh nearest shelters"
                >
                  <Compass className={`w-3.5 h-3.5 text-[#EA580C] ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Locating GPS...' : 'Nearby 15km'}</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic(15);
                    setOnlyNearby15Km(!onlyNearby15Km);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-sm ${
                    onlyNearby15Km
                      ? 'bg-[#EA580C] text-white hover:bg-[#C2410C]'
                      : 'bg-white dark:bg-[#0F172A] text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {onlyNearby15Km ? '15 km Radius: ON' : 'Filter 15 km'}
                </button>
              </div>
            </div>

            {/* Massive Search & Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-[#475569] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="shelter-roster-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Find nearest shelter, district, city, landmark..."
                  className="w-full pl-10 pr-4 py-3 bg-[#FFFFFF] dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-slate-700 rounded-2xl text-sm text-[#0F172A] dark:text-white placeholder-[#475569] dark:placeholder-slate-400 focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="w-full py-3 px-3.5 bg-[#FFFFFF] dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#EA580C] font-medium cursor-pointer"
                >
                  <option value="ALL">All Shelter Types</option>
                  <option value="Government Relief Camp">Govt Relief Camp</option>
                  <option value="School">School / College</option>
                  <option value="Stadium">Stadium / Arena</option>
                  <option value="Community Hall">Community Hall</option>
                  <option value="Hospital-supported shelter">Hospital-Supported</option>
                  <option value="Religious / Community Facility">Religious Facility</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full py-3 px-3.5 bg-[#FFFFFF] dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#EA580C] font-medium cursor-pointer"
                >
                  <option value="ALL">All Occupancy States</option>
                  <option value="AVAILABLE">Available (Vacant Beds)</option>
                  <option value="LIMITED">Limited Capacity</option>
                  <option value="CRITICAL">Near Full Capacity</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] font-mono text-[#475569] dark:text-slate-400 font-bold uppercase mr-1">Filter Features:</span>
              
              <button
                onClick={() => {
                  triggerHaptic(15);
                  setFilterMedical(!filterMedical);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 ${
                  filterMedical
                    ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] border-[#0F172A] shadow-sm'
                    : 'bg-[#FFFFFF] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <HeartPulse className={`w-3.5 h-3.5 ${filterMedical ? 'text-white dark:text-rose-600' : 'text-[#DC2626]'}`} />
                <span>Medical Support</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic(15);
                  setFilterWater(!filterWater);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 ${
                  filterWater
                    ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] border-[#0F172A] shadow-sm'
                    : 'bg-[#FFFFFF] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Droplet className={`w-3.5 h-3.5 ${filterWater ? 'text-white dark:text-emerald-600' : 'text-[#059669]'}`} />
                <span>Drinking Water</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic(15);
                  setFilterFood(!filterFood);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 ${
                  filterFood
                    ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] border-[#0F172A] shadow-sm'
                    : 'bg-[#FFFFFF] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Utensils className={`w-3.5 h-3.5 ${filterFood ? 'text-white dark:text-amber-600' : 'text-[#EA580C]'}`} />
                <span>Hot Food</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic(15);
                  setFilterWheelchair(!filterWheelchair);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-full border transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 ${
                  filterWheelchair
                    ? 'bg-[#0F172A] dark:bg-white text-[#FFFFFF] dark:text-[#0F172A] border-[#0F172A] shadow-sm'
                    : 'bg-[#FFFFFF] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${filterWheelchair ? 'text-white dark:text-slate-800' : 'text-[#0F172A] dark:text-slate-200]'}`} />
                <span>Wheelchair Accessible</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Interactive Map of Safe Zones (Shown in 'both' or 'map' mode) */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#475569] dark:text-slate-400">
                Interactive Safe Zones &amp; Evacuation Map
              </span>
              <span className="text-xs font-mono text-[#0F172A] dark:text-slate-300 font-semibold">
                Tap any pin for instant details &amp; booking
              </span>
            </div>
            <div className="rounded-3xl overflow-hidden border-2 border-[#E2E8F0] dark:border-slate-800 shadow-xl">
              <ShelterMap onSelectShelter={handleOpenSheet} onOpenSOS={onOpenSOS} />
            </div>
          </div>
        )}

        {/* 3. Nearby Shelter Cards Grid (Shown in 'both' or 'cards' mode) */}
        {(viewMode === 'both' || viewMode === 'cards') && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#EA580C]" />
                <span>Verified Shelter Directory</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {filteredShelters.length} Facilities {onlyNearby15Km ? 'Within 15km' : 'Active'}
                </span>
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerHaptic(15);
                    setCurrentTab('register-shelter');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Register Shelter (Public/Private)</span>
                </button>
                <span className="text-xs font-mono text-[#475569] dark:text-slate-400 hidden md:inline font-semibold">
                  Live availability &amp; proximity
                </span>
              </div>
            </div>

            {filteredShelters.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-[#0F172A] border-2 border-dashed border-[#E2E8F0] dark:border-slate-800 text-center space-y-3">
                <MapPin className="w-8 h-8 text-[#EA580C] mx-auto opacity-70" />
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white">No Shelters in Strict 15 km Radius</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  No registered disaster safe hubs within 15 km of your GPS fix. You can view all nearby regional shelters across the state or trigger GPS refresh.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setOnlyNearby15Km(false)}
                    className="px-4 py-2 rounded-xl bg-[#EA580C] text-white font-bold text-xs cursor-pointer shadow-md"
                  >
                    Show All Regional Shelters
                  </button>
                  <button
                    onClick={() => locateUserAndFilterNearby()}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-xs cursor-pointer"
                  >
                    Refresh GPS
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShelters.map(shelter => {
                  const distanceKm = shelter.distanceKm;
                  const occRatio = shelter.totalCapacity > 0 ? shelter.currentOccupancy / shelter.totalCapacity : 0;
                  const occPct = Math.round(occRatio * 100);
                  const isFull = shelter.status === 'FULL' || shelter.availableBeds <= 0;

                  return (
                    /* Cards: Pure #FFFFFF cards in light mode with explicit #E2E8F0 border */
                    <div
                      key={shelter.id}
                      className="bg-[#FFFFFF] dark:bg-[#0F172A] border-2 border-[#E2E8F0] dark:border-slate-800 hover:border-[#0F172A]/40 dark:hover:border-slate-600 rounded-3xl p-5 shadow-md flex flex-col justify-between transition-all group relative"
                    >
                      <div className="space-y-3">
                        {/* Header with Type & Compulsory Status Badges */}
                        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#E2E8F0] dark:border-slate-800">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono text-[#475569] dark:text-slate-400 uppercase font-bold tracking-wider block">
                                {shelter.type}
                              </span>
                              <span
                                className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${
                                  shelter.ownership === 'Private' || shelter.isPrivate
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                }`}
                              >
                                {shelter.ownership || (shelter.isPrivate ? 'Private' : 'Public')}
                              </span>
                            </div>
                            <h3 className="font-black text-[#0F172A] dark:text-white text-base leading-snug group-hover:text-[#EA580C] transition-colors">
                              {shelter.name}
                            </h3>
                            <p className="text-xs text-[#475569] dark:text-slate-400 flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                              <span>{shelter.city}, {shelter.district || shelter.state}</span>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full font-mono font-bold text-[10px] uppercase block tracking-wider ${
                                isFull
                                  ? 'bg-[#DC2626] text-[#FFFFFF]'
                                  : 'bg-[#059669] text-[#FFFFFF]'
                              }`}
                            >
                              {isFull
                                ? 'AT CAPACITY'
                                : `${shelter.availableBeds} BEDS LEFT / ${shelter.totalCapacity} TOTAL`}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-[#EA580C] dark:text-amber-400 block mt-1">
                              {distanceKm} km away
                            </span>
                          </div>
                        </div>

                        {/* Live Capacity Bar */}
                        <div className="space-y-1.5 bg-[#F8FAFC] dark:bg-[#1E293B] p-3 rounded-2xl border border-[#E2E8F0] dark:border-slate-700">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-[#475569] dark:text-slate-400 font-medium">
                              Occupancy ({occPct}%)
                            </span>
                            <span className={`font-bold ${isFull ? 'text-[#DC2626]' : 'text-[#059669]'}`}>
                              {shelter.availableBeds} Vacant Beds
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#E2E8F0] dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFull ? 'bg-[#DC2626]' : 'bg-[#059669]'
                              }`}
                              style={{ width: `${Math.min(100, occPct)}%` }}
                            />
                          </div>
                        </div>

                        {/* Facility Chips */}
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-[#0F172A] dark:text-slate-200">
                          {shelter.facilities.medicalSupport && (
                            <span className="px-2 py-0.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 flex items-center gap-1 font-semibold">
                              <HeartPulse className="w-3 h-3 text-[#DC2626]" /> Medical
                            </span>
                          )}
                          {shelter.facilities.drinkingWater && (
                            <span className="px-2 py-0.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 flex items-center gap-1 font-semibold">
                              <Droplet className="w-3 h-3 text-[#059669]" /> Water
                            </span>
                          )}
                          {shelter.facilities.foodAvailable && (
                            <span className="px-2 py-0.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 flex items-center gap-1 font-semibold">
                              <Utensils className="w-3 h-3 text-[#EA580C]" /> Hot Food
                            </span>
                          )}
                          {shelter.facilities.wheelchairAccessible && (
                            <span className="px-2 py-0.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-200 flex items-center gap-1 font-semibold">
                              Wheelchair
                            </span>
                          )}
                        </div>

                        {/* Aadhaar ID & Police Verification (Hidden by default with option to check it - User Request #7) */}
                        <div className="pt-1">
                          <ShelterVerificationBadge shelter={shelter} />
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="grid grid-cols-3 gap-2 pt-4 mt-3 border-t border-[#E2E8F0] dark:border-slate-800">
                        {/* Call Hotline */}
                        <a
                          href={`tel:${shelter.contactPhone || '112'}`}
                          className="py-2.5 px-2 rounded-xl bg-[#0F172A] dark:bg-slate-800 hover:bg-[#1E293B] dark:hover:bg-slate-700 text-[#FFFFFF] text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm text-center"
                          title="Call Shelter Emergency Contact"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#FFFFFF] shrink-0" />
                          <span className="truncate">Call Hotline</span>
                        </a>

                        {/* Directions */}
                        <button
                          onClick={() => handleOpenSheet(shelter)}
                          className="py-2.5 px-2 rounded-xl bg-[#FFFFFF] dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 text-center cursor-pointer"
                          title="View Directions & Shelter Details"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#0F172A] dark:text-white shrink-0" />
                          <span className="truncate">Directions</span>
                        </button>

                        {/* Book Spot */}
                        <button
                          onClick={() => handleOpenBooking(shelter)}
                          disabled={isFull}
                          className={`py-2.5 px-2 rounded-xl text-[#FFFFFF] text-xs font-black transition-all shadow-sm text-center cursor-pointer ripple-container ${
                            isFull
                              ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                              : 'clay-btn-signal bg-[#EA580C] hover:bg-[#C2410C]'
                          }`}
                        >
                          {isFull ? 'Full' : 'Book Spot'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Accordions at the Bottom for Secondary Info */}
        <div className="pt-8 border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#475569]">
            Emergency Shelter Admission Protocols &amp; Guidelines
          </h3>

          {/* Accordion Item 1 */}
          <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('rules-1')}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>What documents or verification are required upon shelter arrival?</span>
              <ChevronDown className={`w-4 h-4 text-[#475569] transition-transform ${openAccordion === 'rules-1' ? 'rotate-180 text-[#0F172A]' : ''}`} />
            </button>
            {openAccordion === 'rules-1' && (
              <div className="px-4 pb-4 pt-1 text-xs text-[#475569] border-t border-[#E2E8F0] leading-relaxed animate-fadeIn">
                No mandatory national ID is required during life-safety evacuations. Anyone fleeing floodwaters, cyclones, or earthquakes is entitled to admission. The HavenGrid digital QR code or your booking reference expedites bed allocation and family registration.
              </div>
            )}
          </div>

          {/* Accordion Item 2 */}
          <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('rules-2')}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>What basic relief supplies are provided inside verified shelters?</span>
              <ChevronDown className={`w-4 h-4 text-[#475569] transition-transform ${openAccordion === 'rules-2' ? 'rotate-180 text-[#0F172A]' : ''}`} />
            </button>
            {openAccordion === 'rules-2' && (
              <div className="px-4 pb-4 pt-1 text-xs text-[#475569] border-t border-[#E2E8F0] leading-relaxed animate-fadeIn">
                All listed government and partner facilities supply clean potable drinking water (minimum 3L per person per day), dry rations or community kitchen meals, sanitized bedding/blankets, basic first aid, and separate sanitation facilities for women and children.
              </div>
            )}
          </div>

          {/* Accordion Item 3 */}
          <div className="bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleAccordion('rules-3')}
              className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>How does emergency reservation guarantee a bed?</span>
              <ChevronDown className={`w-4 h-4 text-[#475569] transition-transform ${openAccordion === 'rules-3' ? 'rotate-180 text-[#0F172A]' : ''}`} />
            </button>
            {openAccordion === 'rules-3' && (
              <div className="px-4 pb-4 pt-1 text-xs text-[#475569] border-t border-[#E2E8F0] leading-relaxed animate-fadeIn">
                When you tap &quot;Book Spot&quot;, our central intake system marks your family headcount against the facility&apos;s available quota for 4 hours. Coordinators at the gate hold this allocation until your arrival.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Shelter Detail Bottom Sheet */}
      <ShelterDetailBottomSheet
        shelter={selectedSheetShelter}
        distanceKm={selectedDistanceKm}
        isOpen={Boolean(selectedSheetShelter)}
        onClose={() => setSelectedSheetShelter(null)}
        onBookSpot={handleOpenBooking}
      />

      {/* Critical Booking Confirmation Dialog */}
      {bookingModalShelter && (
        <BookingConfirmModal
          shelter={bookingModalShelter}
          isOpen={Boolean(bookingModalShelter)}
          onClose={() => setBookingModalShelter(null)}
          onConfirmed={bookingData => {
            // Success logged
          }}
        />
      )}

    </div>
  );
};
