import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Building2,
  Users,
  Bed,
  AlertTriangle,
  PackageCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Zap,
  Phone,
  HeartPulse,
  Utensils,
  Droplet,
  Send,
  RefreshCw,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Shelter, ShelterStatus } from '../types';

export const CommandCenter: React.FC = () => {
  const {
    country,
    shelters,
    families,
    alerts,
    resourceRequests,
    currentIncident,
    setSelectedShelterId,
    setCurrentTab,
    updateShelterOccupancy
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [redirectModalShelter, setRedirectModalShelter] = useState<Shelter | null>(null);
  const [supplyModalShelter, setSupplyModalShelter] = useState<Shelter | null>(null);

  // Country Shelters
  const countryShelters = useMemo(() => {
    return shelters.filter(s => country === 'ALL' || s.country === country);
  }, [shelters, country]);

  // Top KPIs
  const activeSheltersCount = countryShelters.length;
  const peopleSheltered = countryShelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalBeds = countryShelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const availableBeds = countryShelters.reduce((acc, s) => acc + s.availableBeds, 0);
  const criticalShelters = countryShelters.filter(s => s.status === 'CRITICAL' || s.status === 'FULL');
  const registeredFamiliesCount = families.length;
  const activeResourceAlerts = resourceRequests.filter(r => r.status === 'Pending' || r.status === 'Approved').length;

  // Filtered monitoring table
  const tableShelters = useMemo(() => {
    return countryShelters.filter(s => {
      if (filterStatus !== 'ALL' && s.status !== filterStatus) return false;
      if (filterSearch) {
        const q = filterSearch.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.managerName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [countryShelters, filterStatus, filterSearch]);

  // Nearby alternatives for redirect modal
  const redirectAlternatives = useMemo(() => {
    if (!redirectModalShelter) return [];
    return countryShelters
      .filter(s => s.id !== redirectModalShelter.id && s.status === 'AVAILABLE')
      .slice(0, 3);
  }, [countryShelters, redirectModalShelter]);

  return (
    <div id="command-center" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Command Center Header */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 p-0.5 flex items-center justify-center shrink-0 shadow-lg">
            <div className="w-full h-full bg-[#0A1120] rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                DISASTER COMMAND CENTER
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {currentIncident?.severity || 'HIGH'} SEVERITY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {currentIncident?.name || 'Regional Hazard Event'}
            </h1>
            <p className="text-xs sm:text-sm text-[#CBD5E1] mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{currentIncident?.region || 'Operational Theater'}</span>
              <span className="text-[#94A3B8]">&bull;</span>
              <span className="text-[#94A3B8] font-mono">Status: ACTIVE EVACUATION</span>
            </p>
          </div>
        </div>

        {/* Quick Operations Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('map')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>GIS Map View</span>
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">Active Shelters</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{activeSheltersCount}</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono mt-1 block">100% Operational</span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">People Sheltered</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{peopleSheltered.toLocaleString()}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono mt-1 block">
            {Math.round((peopleSheltered / (totalBeds || 1)) * 100)}% Sector Load
          </span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">Available Beds</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">{availableBeds.toLocaleString()}</span>
            <Bed className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] text-emerald-500 font-mono mt-1 block">Vacant &amp; ready</span>
        </div>

        <div className={`border rounded-2xl p-4 shadow-lg transition-all ${
          criticalShelters.length > 0 ? 'bg-rose-950/30 border-rose-500/60' : 'bg-[#111C30] border-[#243656]'
        }`}>
          <span className="text-[11px] font-mono text-rose-300 uppercase block">Critical Shelters</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400">{criticalShelters.length}</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-[10px] text-rose-400 font-mono mt-1 block">&gt;90% Capacity Surpassed</span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">Families Registered</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-blue-300">{registeredFamiliesCount}</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono mt-1 block">Tracked as units</span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">Resource Alerts</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">{activeResourceAlerts}</span>
            <PackageCheck className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[10px] text-amber-400 font-mono mt-1 block">Supply requests active</span>
        </div>
      </div>

      {/* 12. Critical Shelter Alerts (Actionable Decision Layer) */}
      {criticalShelters.length > 0 && (
        <div id="critical-shelter-decision-alerts" className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-rose-400">
              CRITICAL SHELTER ACTION REQUIRED ({criticalShelters.length} Facilities &gt;90%)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {criticalShelters.map(crit => {
              const occPct = Math.round((crit.currentOccupancy / crit.totalCapacity) * 100);

              return (
                <div
                  key={crit.id}
                  className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border-2 border-rose-500/80 rounded-2xl p-5 shadow-2xl space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[10px]">
                          🔴 CRITICAL &bull; {occPct}%
                        </span>
                        <span className="text-xs font-mono text-[#94A3B8]">{crit.id}</span>
                      </div>
                      <h3 className="font-bold text-white text-base mt-1">{crit.name}</h3>
                      <p className="text-xs text-[#CBD5E1] mt-0.5">{crit.address}, {crit.city}</p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs text-[#94A3B8] block">Remaining Beds</span>
                      <strong className="text-xl text-rose-400 font-black">{crit.availableBeds}</strong>
                    </div>
                  </div>

                  <div className="bg-[#0A1120]/80 p-3 rounded-xl border border-rose-900/50 text-xs text-rose-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Capacity critical — redirect new families</span>
                      <p className="text-[#94A3B8] text-[11px] mt-0.5">
                        Occupancy reached {occPct}%. Incoming flood intake must be diverted to protect hygiene and safety ratios.
                      </p>
                    </div>
                  </div>

                  {/* Decision Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedShelterId(crit.id);
                        setCurrentTab('shelter-detail');
                      }}
                      className="py-2 px-2.5 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] font-semibold text-xs text-center transition-colors cursor-pointer"
                    >
                      View Shelter
                    </button>

                    <button
                      onClick={() => setRedirectModalShelter(crit)}
                      className="py-2 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Redirect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSupplyModalShelter(crit)}
                      className="py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs text-center transition-colors cursor-pointer"
                    >
                      Dispatch Aid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 11. Live Shelter Monitoring Table */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243656]">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Live Shelter Capacity Monitoring
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Comprehensive real-time status across {country === 'IND' ? 'India' : 'Nepal'}
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterSearch}
                onChange={e => setFilterSearch(e.target.value)}
                placeholder="Filter by city, name..."
                className="pl-8 pr-2.5 py-1 text-xs bg-[#0A1120] border border-[#243656] rounded-lg text-[#F8FAFC] focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-[#0A1120] border border-[#243656] rounded-lg px-2.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available (&lt;70%)</option>
              <option value="LIMITED">Limited (70-90%)</option>
              <option value="CRITICAL">Critical (&gt;90%)</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#CBD5E1] font-sans">
            <thead className="bg-[#0A1120] text-[#94A3B8] uppercase font-mono text-[10px] tracking-wider border-b border-[#243656]">
              <tr>
                <th className="py-3 px-3">Shelter & Location</th>
                <th className="py-3 px-3">Manager & Org</th>
                <th className="py-3 px-3 text-right">Capacity</th>
                <th className="py-3 px-3 text-center">Occupancy %</th>
                <th className="py-3 px-3 text-right">Available Beds</th>
                <th className="py-3 px-3 text-center">Supplies</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {tableShelters.map(shelter => {
                const occPct = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);

                let statusBadge = (
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    GREEN
                  </span>
                );

                if (occPct >= 90) {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                      RED
                    </span>
                  );
                } else if (occPct >= 70) {
                  statusBadge = (
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      YELLOW
                    </span>
                  );
                }

                return (
                  <tr key={shelter.id} className="hover:bg-[#182742]/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-xs">{shelter.name}</div>
                      <div className="text-[11px] text-[#94A3B8]">{shelter.city}, {shelter.state}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-[#F8FAFC]">{shelter.managerName}</div>
                      <div className="text-[10px] text-[#94A3B8] truncate max-w-[140px]">{shelter.managingOrg}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-[#CBD5E1]">
                      {shelter.totalCapacity}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 font-mono">
                        <strong className={
                          occPct >= 90 ? 'text-rose-400' : occPct >= 70 ? 'text-amber-400' : 'text-emerald-400'
                        }>
                          {occPct}%
                        </strong>
                        <span className="text-[10px] text-[#94A3B8]">({shelter.currentOccupancy})</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-300">
                      {shelter.availableBeds}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[10px]">
                        <span title="Medical" className={`p-1 rounded ${shelter.facilities.medicalSupport ? 'text-emerald-400 bg-emerald-950/40' : 'text-[#64748B]'}`}>
                          <HeartPulse className="w-3.5 h-3.5" />
                        </span>
                        <span title="Food" className={`p-1 rounded ${shelter.facilities.foodAvailable ? 'text-emerald-400 bg-emerald-950/40' : 'text-[#64748B]'}`}>
                          <Utensils className="w-3.5 h-3.5" />
                        </span>
                        <span title="Water" className={`p-1 rounded ${shelter.facilities.drinkingWater ? 'text-emerald-400 bg-emerald-950/40' : 'text-[#64748B]'}`}>
                          <Droplet className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      {statusBadge}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedShelterId(shelter.id);
                          setCurrentTab('shelter-detail');
                        }}
                        className="px-2.5 py-1 rounded bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redirect Modal when clicking 'Redirect' on critical shelter */}
      {redirectModalShelter && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#243656]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white text-base">
                  Divert Intake from {redirectModalShelter.name}
                </h3>
              </div>
              <button
                onClick={() => setRedirectModalShelter(null)}
                className="text-[#94A3B8] hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#CBD5E1]">
              This shelter is currently at <strong>{Math.round((redirectModalShelter.currentOccupancy / redirectModalShelter.totalCapacity) * 100)}% capacity</strong> with only <strong>{redirectModalShelter.availableBeds} beds remaining</strong>. Recommend nearby available facilities:
            </p>

            <div className="space-y-2">
              {redirectAlternatives.map(alt => (
                <div
                  key={alt.id}
                  className="bg-[#0A1120] p-3 rounded-xl border border-[#243656] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-xs">{alt.name}</h4>
                    <p className="text-[11px] text-[#94A3B8]">{alt.city} &bull; {alt.availableBeds} beds vacant</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedShelterId(alt.id);
                      setRedirectModalShelter(null);
                      setCurrentTab('shelter-detail');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs"
                  >
                    Select Facility
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setRedirectModalShelter(null)}
                className="px-4 py-2 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Aid Modal */}
      {supplyModalShelter && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#243656]">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Emergency Supply Dispatch
                </h3>
              </div>
              <button
                onClick={() => setSupplyModalShelter(null)}
                className="text-[#94A3B8] hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#CBD5E1]">
              Select urgent relief convoy to route to <strong>{supplyModalShelter.name}</strong>:
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  alert(`Water Tanker (5,000L) dispatched to ${supplyModalShelter.name}`);
                  setSupplyModalShelter(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#0A1120] hover:bg-[#182742] border border-[#243656] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">Potable Water Tanker (5,000L)</span>
                  <span className="text-[11px] text-blue-400 font-mono">Dispatches from Municipal Central Depot</span>
                </div>
                <Send className="w-4 h-4 text-blue-400" />
              </button>

              <button
                onClick={() => {
                  alert(`100 Folding Canvas Beds dispatched to ${supplyModalShelter.name}`);
                  setSupplyModalShelter(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#0A1120] hover:bg-[#182742] border border-[#243656] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">Folding Canvas Beds (100 units)</span>
                  <span className="text-[11px] text-emerald-400 font-mono">Dispatches from Red Cross Logistics</span>
                </div>
                <Send className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  alert(`Emergency Trauma Paramedic Unit dispatched to ${supplyModalShelter.name}`);
                  setSupplyModalShelter(null);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#0A1120] hover:bg-[#182742] border border-[#243656] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-white block">Emergency Trauma Paramedic Unit</span>
                  <span className="text-[11px] text-rose-400 font-mono">Civil Hospital Quick Response Mobile</span>
                </div>
                <Send className="w-4 h-4 text-rose-400" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
