import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Users,
  HeartPulse,
  Droplet,
  Utensils,
  Bed,
  Phone,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  Building,
  ShieldCheck,
  Accessibility,
  Dog,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { Shelter, FamilyRequirements } from '../types';
import { rankShelters, calculateDistanceKm } from '../utils/scoring';
import { searchLocations, GeocodedLocation } from '../services/geocoding';

export const PublicShelterFinder: React.FC = () => {
  const { country, shelters, setSelectedShelterId, setCurrentTab } = useApp();

  // Location State
  const [activeLocationName, setActiveLocationName] = useState<string>('Sabarmati Riverfront, Ahmedabad');
  const [currentCoordinates, setCurrentCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 23.0338,
    lng: 72.5850
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Search input & live geocoding
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Evacuee Group Size
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Quick care toggles (optional, non-intrusive)
  const [needsMedical, setNeedsMedical] = useState<boolean>(false);
  const [needsWheelchair, setNeedsWheelchair] = useState<boolean>(false);
  const [hasPets, setHasPets] = useState<boolean>(false);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live geocoding search for ANY location in India, Nepal, or globally
  useEffect(() => {
    if (!inputQuery || inputQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(inputQuery);
        setSearchResults(results);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [inputQuery]);

  // Handle browser geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCurrentCoordinates(coords);
        setActiveLocationName(`GPS Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        setInputQuery('');
        setHasSearched(true);
      },
      err => {
        setIsLocating(false);
        setLocationError('Unable to retrieve your location. Please type your city or area below.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Select a searched location
  const handleSelectLocation = (loc: GeocodedLocation) => {
    setCurrentCoordinates({ lat: loc.lat, lng: loc.lng });
    setActiveLocationName(loc.name || loc.displayName.split(',')[0]);
    setInputQuery('');
    setShowSearchDropdown(false);
    setHasSearched(true);
  };

  // Submit manual search
  const handleManualSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchLocations(inputQuery);
      if (results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        setLocationError(`Could not find "${inputQuery}". Please check the spelling or try a nearby city.`);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Requirements object for ranking
  const requirements: FamilyRequirements = useMemo(
    () => ({
      food: true,
      water: true,
      beds: true,
      medicalAssistance: needsMedical,
      wheelchairAccessible: needsWheelchair,
      childFriendly: false,
      womenSafeSpace: false,
      petFriendly: hasPets
    }),
    [needsMedical, needsWheelchair, hasPets]
  );

  // Ranked Shelters
  const rankedShelters = useMemo(() => {
    const list = country === 'ALL' ? shelters : shelters.filter(s => s.country === country);
    return rankShelters(list, {
      userLat: currentCoordinates.lat,
      userLng: currentCoordinates.lng,
      familySize: peopleCount,
      requirements,
      emergencyOverride: false
    });
  }, [shelters, country, currentCoordinates, peopleCount, requirements]);

  return (
    <div
      id="public-shelter-finder"
      className="min-h-screen bg-[#0A1120] text-[#F8FAFC] py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-[#F8FAFC]"
    >
      <div className="max-w-4xl mx-auto space-y-8">

        {/* REASSURING HEADER / HERO */}
        <div className="text-center pt-4 pb-2 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182742] border border-[#243656] text-blue-400 text-xs font-semibold tracking-wide">
            <Compass className="w-3.5 h-3.5" />
            <span>Official Disaster Evacuation Portal &bull; Verified Safe Shelters</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Find a Safe Shelter
          </h1>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            Instant capacity matching with verified clean water, medical aid, and safe bed allocations across India &amp; Nepal.
          </p>
        </div>

        {/* PRIMARY ACTION CARD */}
        <div
          id="finder-primary-card"
          className="bg-[#111C30] border border-[#243656] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* STEP 1: LOCATION (USE MY LOCATION OR ENTER LOCATION) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
              1. Where are you located?
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Use My Location Button */}
              <button
                id="btn-use-my-location"
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#182742] hover:bg-[#243656] border border-[#243656] text-blue-300 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                ) : (
                  <MapPin className="w-4 h-4 text-blue-400" />
                )}
                <span>{isLocating ? 'Detecting GPS...' : 'Use My Location'}</span>
              </button>

              <div className="hidden sm:flex items-center text-xs font-bold text-[#64748B] px-1">
                OR
              </div>

              {/* Enter Location Input with Real-time Search */}
              <div ref={searchContainerRef} className="relative flex-1">
                <form onSubmit={handleManualSearchSubmit} className="relative">
                  <input
                    id="input-enter-location"
                    type="text"
                    value={inputQuery}
                    onChange={e => {
                      setInputQuery(e.target.value);
                      setLocationError(null);
                    }}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowSearchDropdown(true);
                    }}
                    placeholder="Enter city, neighborhood, or landmark (e.g. Kathmandu, Bandra, Paldi...)"
                    className="w-full pl-10 pr-10 py-3 bg-[#111C30] border border-[#243656] rounded-xl text-sm text-[#F8FAFC] placeholder-[#8FA2AF] focus:outline-none focus:border-[#35C7B4] focus:ring-1 focus:ring-[#35C7B4] transition-all"
                  />
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  {inputQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputQuery('');
                        setSearchResults([]);
                        setShowSearchDropdown(false);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Live Geocoded Suggestions Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#111C30] border border-[#243656] rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-[#243656] max-h-64 overflow-y-auto">
                    {searchResults.map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectLocation(res)}
                        className="w-full text-left px-4 py-3 hover:bg-[#0A1120] flex items-start gap-3 transition-colors text-xs sm:text-sm text-[#F8FAFC]"
                      >
                        <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#F8FAFC]">{res.name}</p>
                          <p className="text-xs text-[#94A3B8] truncate max-w-md">{res.displayName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {locationError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{locationError}</span>
              </p>
            )}

            {/* Current Active Location Indicator */}
            <div className="pt-1 flex items-center gap-2 text-xs text-[#94A3B8]">
              <span className="font-semibold text-[#F8FAFC]">Active reference:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#182742] text-blue-300 font-medium border border-[#243656]">
                <MapPin className="w-3 h-3 text-blue-400" />
                {activeLocationName}
              </span>
            </div>
          </div>

          {/* STEP 2: HOW MANY PEOPLE NEED SHELTER? */}
          <div className="space-y-3 pt-2 border-t border-[#243656]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                2. How many people need shelter?
              </label>
              <span className="text-xs text-[#94A3B8]">
                Ensures safe cot capacity without family separation
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#243656] rounded-xl overflow-hidden bg-[#111C30]">
                <button
                  type="button"
                  onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                  className="w-11 h-11 flex items-center justify-center text-lg font-bold text-[#F8FAFC] hover:bg-[#0A1120] transition-colors"
                >
                  -
                </button>
                <div className="w-16 text-center font-bold text-lg text-[#F8FAFC]">
                  {peopleCount}
                </div>
                <button
                  type="button"
                  onClick={() => setPeopleCount(peopleCount + 1)}
                  className="w-11 h-11 flex items-center justify-center text-lg font-bold text-[#F8FAFC] hover:bg-[#0A1120] transition-colors"
                >
                  +
                </button>
              </div>

              {/* Quick Select Pill Buttons */}
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPeopleCount(num)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      peopleCount === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#182742] text-[#94A3B8] hover:bg-[#243656]'
                    }`}
                  >
                    {num} {num === 1 ? 'Person' : 'People'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* OPTIONAL SUPPORT TOGGLES (CALM, UNCLUTTERED) */}
          <div className="pt-2 border-t border-[#243656]">
            <span className="block text-xs font-semibold text-[#94A3B8] mb-2">
              Specialized Care Requirements (Optional):
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setNeedsMedical(!needsMedical)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  needsMedical
                    ? 'bg-[#182742] border-[#35C7B4] text-blue-300'
                    : 'bg-[#111C30] border-[#243656] text-[#94A3B8] hover:border-[#94A3B8]'
                }`}
              >
                <HeartPulse className={`w-3.5 h-3.5 ${needsMedical ? 'text-blue-400' : 'text-[#94A3B8]'}`} />
                <span>Medical Aid / Triage</span>
              </button>

              <button
                type="button"
                onClick={() => setNeedsWheelchair(!needsWheelchair)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  needsWheelchair
                    ? 'bg-[#182742] border-[#35C7B4] text-blue-300'
                    : 'bg-[#111C30] border-[#243656] text-[#94A3B8] hover:border-[#94A3B8]'
                }`}
              >
                <Accessibility className={`w-3.5 h-3.5 ${needsWheelchair ? 'text-blue-400' : 'text-[#94A3B8]'}`} />
                <span>Wheelchair Accessibility</span>
              </button>

              <button
                type="button"
                onClick={() => setHasPets(!hasPets)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                  hasPets
                    ? 'bg-[#182742] border-[#35C7B4] text-blue-300'
                    : 'bg-[#111C30] border-[#243656] text-[#94A3B8] hover:border-[#94A3B8]'
                }`}
              >
                <Dog className={`w-3.5 h-3.5 ${hasPets ? 'text-blue-400' : 'text-[#94A3B8]'}`} />
                <span>Pet Friendly</span>
              </button>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTON: FIND SHELTER */}
          <div className="pt-2">
            <button
              id="btn-find-shelter"
              type="button"
              onClick={() => setHasSearched(true)}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-[#F8FAFC] font-bold text-base tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>FIND SHELTER</span>
            </button>
          </div>
        </div>

        {/* RESULTS SECTION: ANSWERS 5 SAFETY-FIRST QUESTIONS */}
        {hasSearched && (
          <div id="safe-shelters-results" className="space-y-6 pt-2">
            
            {/* Context Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-[#F8FAFC]">
                  Verified Safe Shelters Near You
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8]">
                  Showing nearest available locations for {peopleCount} {peopleCount === 1 ? 'person' : 'people'} from {activeLocationName}
                </p>
              </div>

              <button
                onClick={() => {
                  setCurrentTab('map');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-[#F8FAFC] transition-colors"
              >
                <Compass className="w-4 h-4 text-blue-400" />
                <span>Open in Interactive Map</span>
              </button>
            </div>

            {/* SHELTER CARDS (CALM, HIGHLY READABLE SPECIFICATION) */}
            <div className="space-y-4">
              {rankedShelters.length > 0 ? (
                rankedShelters.map(({ shelter, distanceKm }) => {
                  const isAvailable = shelter.status === 'ACTIVE' || shelter.status === 'PREPARED';
                  const isLimited = shelter.status === 'SURGE' || (shelter.availableBeds < 50 && shelter.availableBeds > 0);
                  const isCritical = shelter.status === 'CRITICAL' || shelter.availableBeds <= 0;

                  return (
                    <div
                      key={shelter.id}
                      className="bg-[#111C30] border border-[#243656] rounded-2xl p-6 sm:p-7 shadow-sm hover:border-[#243656] transition-all space-y-4"
                    >
                      {/* Top Row: Name & Distance */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
                            {shelter.name}
                          </h3>
                          <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span>{shelter.address}, {shelter.city}, {shelter.state}</span>
                          </p>
                        </div>

                        {/* Distance Badge */}
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#182742] text-blue-300 text-xs font-bold shrink-0 self-start">
                          <Navigation className="w-3 h-3 text-blue-400" />
                          <span>{distanceKm} km away</span>
                        </div>
                      </div>

                      {/* Status Indicator (Always Color + Icon + Text) */}
                      <div className="flex flex-wrap items-center gap-3">
                        {isCritical ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-950/40 border border-rose-500/50 text-rose-400 text-xs font-bold">
                            <span>⚠ CRITICAL CAPACITY</span>
                          </div>
                        ) : isLimited ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-950/40 border border-amber-500/50 text-amber-400 text-xs font-bold">
                            <span>! LIMITED</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 text-xs font-bold">
                            <span>✓ AVAILABLE</span>
                          </div>
                        )}

                        <span className="text-xs font-medium text-[#94A3B8]">
                          {shelter.currentOccupancy} / {shelter.totalCapacity} people
                        </span>

                        <span className="text-xs font-bold text-blue-300">
                          {shelter.availableBeds} beds available
                        </span>
                      </div>

                      {/* Verified Support Checklist */}
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#CBD5E1]">
                        {shelter.amenities?.medicalTriage && (
                          <span className="flex items-center gap-1.5 font-medium text-blue-300">
                            <span className="text-emerald-400 font-bold">✓</span> Medical Aid
                          </span>
                        )}
                        {shelter.amenities?.potableWater && (
                          <span className="flex items-center gap-1.5 font-medium text-blue-300">
                            <span className="text-emerald-400 font-bold">✓</span> Clean Water
                          </span>
                        )}
                        {shelter.amenities?.hotMealsKitchen && (
                          <span className="flex items-center gap-1.5 font-medium text-blue-300">
                            <span className="text-emerald-400 font-bold">✓</span> Food
                          </span>
                        )}
                        {shelter.amenities?.generators && (
                          <span className="flex items-center gap-1.5 font-medium text-[#94A3B8]">
                            <span className="text-emerald-400 font-bold">✓</span> Power Backup
                          </span>
                        )}
                        {shelter.amenities?.wheelchairAccess && (
                          <span className="flex items-center gap-1.5 font-medium text-[#94A3B8]">
                            <span className="text-emerald-400 font-bold">✓</span> Wheelchair Accessible
                          </span>
                        )}
                      </div>

                      {/* Management & Timestamp */}
                      <div className="pt-3 border-t border-[#243656] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#94A3B8]">
                        <div>
                          <span>Managed by: </span>
                          <strong className="text-[#F8FAFC] font-semibold">{shelter.managingOrg}</strong>
                          <span className="mx-2">&bull;</span>
                          <span>Updated 5 min ago</span>
                        </div>

                        {/* Action Buttons: VIEW SHELTER in Calm Teal */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${shelter.phone}`}
                            className="px-3.5 py-2 rounded-lg bg-[#111C30] border border-[#243656] hover:bg-[#0A1120] text-[#F8FAFC] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-blue-400" />
                            <span>Call ({shelter.phone})</span>
                          </a>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-lg bg-[#111C30] border border-[#243656] hover:bg-[#0A1120] text-[#F8FAFC] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Navigation className="w-3.5 h-3.5 text-blue-400" />
                            <span>Directions</span>
                          </a>

                          <button
                            id={`btn-view-shelter-${shelter.id}`}
                            onClick={() => {
                              setSelectedShelterId(shelter.id);
                              setCurrentTab('shelter-detail');
                            }}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-[#F8FAFC] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <span>VIEW SHELTER</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-8 text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-[#E5B84B] mx-auto" />
                  <h3 className="text-base font-bold text-[#F8FAFC]">No Direct Shelters Found Nearby</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                    Try searching for a larger neighboring city, or contact emergency dispatch directly.
                  </p>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergency Call 112</span>
                  </a>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
