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
  Bed,
  Accessibility,
  Baby,
  Dog,
  Power,
  Navigation,
  Sparkles,
  Phone,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Shelter } from '../types';

export const SheltersRosterView: React.FC = () => {
  const { country, shelters, setSelectedShelterId, setCurrentTab } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterMedical, setFilterMedical] = useState<boolean>(false);
  const [filterWomen, setFilterWomen] = useState<boolean>(false);
  const [filterWheelchair, setFilterWheelchair] = useState<boolean>(false);

  const countryShelters = useMemo(() => {
    return shelters.filter(s => country === 'ALL' || s.country === country);
  }, [shelters, country]);

  const filteredShelters = useMemo(() => {
    return countryShelters.filter(s => {
      if (filterType !== 'ALL' && s.type !== filterType) return false;
      if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
      if (filterMedical && !s.facilities.medicalSupport) return false;
      if (filterWomen && !s.facilities.separateWomenSection) return false;
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
    });
  }, [countryShelters, filterType, filterStatus, filterMedical, filterWomen, filterWheelchair, searchQuery]);

  return (
    <div id="shelters-roster-view" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243656] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              FACILITY DIRECTORY &bull; {country === 'IND' ? 'INDIA' : 'NEPAL'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Active Disaster Shelters Roster
          </h1>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-[#111C30] border border-[#243656] rounded-lg text-blue-300">
          {filteredShelters.length} Facilities Monitored
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search shelter name, city, district..."
              className="w-full pl-9 pr-3 py-2 bg-[#0A1120] border border-[#243656] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="w-full py-2 px-3 bg-[#0A1120] border border-[#243656] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Shelter Types</option>
              <option value="Community Center">Community Centers</option>
              <option value="School / College">Schools & Colleges</option>
              <option value="Stadium / Arena">Stadiums & Arenas</option>
              <option value="Religious Complex">Religious Complexes</option>
              <option value="Transit Camp">Transit Camps</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full py-2 px-3 bg-[#0A1120] border border-[#243656] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Occupancy States</option>
              <option value="AVAILABLE">Available (&lt;70%)</option>
              <option value="LIMITED">Limited (70-90%)</option>
              <option value="CRITICAL">Critical (&gt;90%)</option>
            </select>
          </div>
        </div>

        {/* Facility Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] text-[#94A3B8] uppercase font-mono mr-1">Must Have:</span>
          
          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterMedical ? 'bg-rose-950/60 border-rose-500 text-rose-300' : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Medical Triage</span>
          </button>

          <button
            onClick={() => setFilterWomen(!filterWomen)}
            className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterWomen ? 'bg-pink-950/60 border-pink-500 text-pink-300' : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Women / Family Bay</span>
          </button>

          <button
            onClick={() => setFilterWheelchair(!filterWheelchair)}
            className={`px-3 py-1 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterWheelchair ? 'bg-purple-950/60 border-purple-500 text-purple-300' : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Wheelchair Ramp</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShelters.map(shelter => {
          const occRatio = shelter.totalCapacity > 0 ? shelter.currentOccupancy / shelter.totalCapacity : 0;
          const occPct = Math.round(occRatio * 100);

          return (
            <div
              key={shelter.id}
              className="bg-[#111C30] border border-[#243656] rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-[#243656] transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#243656]">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase block font-semibold">
                      {shelter.type}
                    </span>
                    <h3 className="font-bold text-white text-base mt-0.5 leading-snug">{shelter.name}</h3>
                    <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>{shelter.city}, {shelter.state}</span>
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                    occPct >= 90 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                    occPct >= 70 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {occPct}%
                  </span>
                </div>

                {/* Live Occupancy Mini-Bar */}
                <div className="my-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#94A3B8]">
                      {shelter.currentOccupancy} / {shelter.totalCapacity} Beds
                    </span>
                    <span className="text-blue-300 font-bold">
                      {shelter.availableBeds} Vacant
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#0A1120] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        occPct >= 90 ? 'bg-rose-500' : occPct >= 70 ? 'bg-amber-500' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, occPct)}%` }}
                    />
                  </div>
                </div>

                {/* Badges for Amenities */}
                <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-[#CBD5E1] my-3">
                  {shelter.facilities.medicalSupport && (
                    <span className="px-2 py-0.5 rounded bg-[#0A1120] border border-[#243656] text-rose-300 flex items-center gap-1">
                      <HeartPulse className="w-3 h-3" /> Med
                    </span>
                  )}
                  {shelter.facilities.separateWomenSection && (
                    <span className="px-2 py-0.5 rounded bg-[#0A1120] border border-[#243656] text-pink-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Women Bay
                    </span>
                  )}
                  {shelter.facilities.drinkingWater && (
                    <span className="px-2 py-0.5 rounded bg-[#0A1120] border border-[#243656] text-blue-300 flex items-center gap-1">
                      <Droplet className="w-3 h-3" /> Water
                    </span>
                  )}
                  {shelter.facilities.powerBackup && (
                    <span className="px-2 py-0.5 rounded bg-[#0A1120] border border-[#243656] text-emerald-300 flex items-center gap-1">
                      <Power className="w-3 h-3" /> Generator
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#94A3B8] bg-[#0A1120] p-2 rounded-xl">
                  Managed by: <strong className="text-[#F8FAFC]">{shelter.managingOrg}</strong>
                  <br />
                  Warden: {shelter.managerName}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#243656] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedShelterId(shelter.id);
                    setCurrentTab('shelter-detail');
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#182742] hover:bg-[#243656] text-white font-semibold text-xs text-center transition-colors cursor-pointer"
                >
                  View Shelter
                </button>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Get Directions"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Map</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
