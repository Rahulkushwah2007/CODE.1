import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Compass,
  UserPlus,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Bed,
  Users,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap,
  Globe2,
  CheckCircle2,
  Flame,
  Droplets,
  PackageCheck
} from 'lucide-react';
import { ShelterMap } from './ShelterMap';

export const LandingPage: React.FC = () => {
  const { country, shelters, setCurrentTab, setRole } = useApp();

  const countryShelters = shelters.filter(s => country === 'ALL' || s.country === country);
  const activeSheltersCount = countryShelters.length;
  const peopleSheltered = countryShelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalBeds = countryShelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const availableBeds = countryShelters.reduce((acc, s) => acc + s.availableBeds, 0);
  const criticalSheltersCount = countryShelters.filter(s => s.status === 'CRITICAL' || s.status === 'FULL').length;

  return (
    <div id="landing-page" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 text-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-[#243656] bg-[#111C30] p-6 sm:p-10 shadow-2xl text-center md:text-left">
        <div className="relative z-10 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>DISASTER RESPONSE OPERATING SYSTEM &bull; {country === 'IND' ? 'INDIA' : country === 'NPL' ? 'NEPAL' : 'REGIONAL'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
            RESQTECH
          </h1>
          
          <p className="mt-2.5 text-lg sm:text-xl font-bold text-blue-400">
            Emergency Evacuation &amp; Disaster Shelter Coordination
          </p>

          <p className="mt-3 text-[#CBD5E1] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Real-time verified disaster shelter availability, intelligent intake routing, and logistics tracking for humanitarian relief across India and Nepal.
          </p>

          {/* Action Buttons Matrix */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            
            {/* Primary */}
            <button
              id="hero-btn-find-shelter"
              onClick={() => {
                setRole('public');
                setCurrentTab('map');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Find Nearest Shelter</span>
            </button>

            <button
              id="hero-btn-emergency-reg"
              onClick={() => {
                setRole('staff');
                setCurrentTab('intake');
              }}
              className="px-6 py-3 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] font-semibold text-sm border border-[#243656] flex items-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span>Family Registration</span>
            </button>

            {/* Secondary */}
            <button
              id="hero-btn-shelter-directory"
              onClick={() => {
                setCurrentTab('shelters');
              }}
              className="px-5 py-3 rounded-xl bg-[#111C30] hover:bg-[#182742] text-[#CBD5E1] hover:text-white font-semibold text-xs sm:text-sm border border-[#243656] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Shelter Directory</span>
            </button>

            <button
              id="hero-btn-command-center"
              onClick={() => {
                setRole('district_admin');
                setCurrentTab('command');
              }}
              className="px-5 py-3 rounded-xl bg-[#111C30] hover:bg-[#182742] text-[#CBD5E1] hover:text-white font-semibold text-xs sm:text-sm border border-[#243656] flex items-center gap-2 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-rose-400" />
              <span>Command Center</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Real-Time Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        
        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono uppercase">
            <span>Active Shelters</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{activeSheltersCount}</span>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">{country === 'IND' ? 'Indian States' : country === 'NPL' ? 'Nepal Provinces' : 'All Regions'}</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono uppercase">
            <span>Available Beds</span>
            <Bed className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">{availableBeds.toLocaleString()}</span>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">Vacant &amp; ready</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono uppercase">
            <span>People Sheltered</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">{peopleSheltered.toLocaleString()}</span>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">Of {totalBeds.toLocaleString()} capacity</span>
          </div>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono uppercase">
            <span>Critical Shelters</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400">{criticalSheltersCount}</span>
            <span className="text-[11px] text-rose-300/80 block mt-0.5">&gt; 90% Occupied</span>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-mono uppercase">
            <span>Resource Pipeline</span>
            <PackageCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">98.2%</span>
            <span className="text-[11px] text-[#94A3B8] block mt-0.5">Supplies verified</span>
          </div>
        </div>
      </section>

      {/* Disaster Operations Workflow */}
      <section className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              OPERATIONAL WORKFLOW
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              End-to-End Disaster Shelter Allocation Architecture
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          
          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656] relative">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 font-black font-mono flex items-center justify-center mb-2">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Disaster Advisory</h3>
            <p className="text-[#94A3B8] text-xs mt-1">Flood, cyclone, or seismic hazard impacts civil zones.</p>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656] relative">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black font-mono flex items-center justify-center mb-2">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Evacuee Inflow</h3>
            <p className="text-[#94A3B8] text-xs mt-1">Displaced citizens seek immediate safe shelter facilities.</p>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656] relative">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-black font-mono flex items-center justify-center mb-2">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Live Vacancy Check</h3>
            <p className="text-[#94A3B8] text-xs mt-1">RESQTECH monitors bed vacancies and supplies in real-time.</p>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656] relative">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-black font-mono flex items-center justify-center mb-2">
              4
            </div>
            <h3 className="font-bold text-white text-sm">Smart Recommendation</h3>
            <p className="text-[#94A3B8] text-xs mt-1">Directs groups away from full shelters toward nearest open sites.</p>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656] relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black font-mono flex items-center justify-center mb-2">
              5
            </div>
            <h3 className="font-bold text-white text-sm">Safe Check-In</h3>
            <p className="text-[#94A3B8] text-xs mt-1">Family verified and issued immediate shelter pass.</p>
          </div>
        </div>
      </section>

      {/* Interactive Map Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              GEOGRAPHIC GIS
            </span>
            <h2 className="text-xl font-black text-white mt-0.5">
              Live Shelter Geographic Visualization ({country === 'IND' ? 'India' : country === 'NPL' ? 'Nepal' : 'All Subcontinent'})
            </h2>
          </div>

          <button
            onClick={() => setCurrentTab('map')}
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-bold"
          >
            <span>Open Fullscreen Map →</span>
          </button>
        </div>

        <ShelterMap />
      </section>
    </div>
  );
};
