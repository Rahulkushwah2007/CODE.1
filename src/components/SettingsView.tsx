import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  RotateCcw,
  Shield,
  Globe,
  Database,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    country,
    setCountry,
    role,
    setRole,
    resetToDefaultData,
    shelters,
    families,
    alerts,
    lastSyncTime
  } = useApp();

  return (
    <div id="settings-view" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243656] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              PLATFORM CONFIGURATION
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            System Settings &amp; Field Telemetry
          </h1>
        </div>
      </div>

      {/* Role and Country Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Country */}
        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Globe className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">Active Geographical Scope</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setCountry('ALL')}
              className={`p-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                country === 'ALL' ? 'bg-[#182742] border-blue-500 text-blue-400 shadow-sm' : 'bg-[#0A1120] border-[#243656] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              🌏 All
            </button>
            <button
              onClick={() => setCountry('IND')}
              className={`p-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                country === 'IND' ? 'bg-[#182742] border-amber-500 text-amber-400 shadow-sm' : 'bg-[#0A1120] border-[#243656] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => setCountry('NPL')}
              className={`p-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                country === 'NPL' ? 'bg-[#182742] border-rose-500 text-rose-400 shadow-sm' : 'bg-[#0A1120] border-[#243656] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              🇳🇵 Nepal
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Shield className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">Operating Authority Role</h3>
          </div>
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="public">Public Evacuee</option>
            <option value="manager">Shelter Manager</option>
            <option value="district_admin">District Disaster Coordinator</option>
            <option value="super_admin">National EOC Commander</option>
            <option value="staff">Intake Staff</option>
            <option value="volunteer">Volunteer Responder</option>
          </select>
        </div>

      </div>

      {/* 24/7 Official Helplines Reference */}
      <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <PhoneCall className="w-4 h-4" />
          <h3 className="font-bold text-white text-sm">Emergency Hotlines &amp; Dispatch Contacts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">India National Disaster Helpline (NDMA)</span>
              <span className="text-[#94A3B8] text-[11px]">Direct Police / Ambulance / Fire / NDRF Dispatch</span>
            </div>
            <a href="tel:112" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono font-bold hover:bg-blue-500">112 / 1070</a>
          </div>
          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Nepal NDRRMA Emergency Operations</span>
              <span className="text-[#94A3B8] text-[11px]">National Emergency Operations Centre (NEOC)</span>
            </div>
            <a href="tel:1155" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-mono font-bold hover:bg-blue-500">1155 / 1149</a>
          </div>
        </div>
      </div>

      {/* Local Persistence & Reset Card */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#CBD5E1]">
          <Database className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-white text-base">RESQTECH Database Registry</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
          <div className="bg-[#0A1120] p-3 rounded-xl border border-[#243656]">
            <span className="text-[#94A3B8] block">Shelters</span>
            <strong className="text-white text-sm">{shelters.length}</strong>
          </div>
          <div className="bg-[#0A1120] p-3 rounded-xl border border-[#243656]">
            <span className="text-[#94A3B8] block">Families</span>
            <strong className="text-blue-300 text-sm">{families.length}</strong>
          </div>
          <div className="bg-[#0A1120] p-3 rounded-xl border border-[#243656]">
            <span className="text-[#94A3B8] block">Event Alerts</span>
            <strong className="text-rose-400 text-sm">{alerts.length}</strong>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#243656]">
          <span className="text-xs text-[#94A3B8]">
            Last Synchronized: {lastSyncTime}
          </span>
          <button
            onClick={() => {
              if (confirm('Reset operational shelter database back to official registry?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] hover:text-white border border-[#243656] font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
            <span>Reset to Baseline Registry</span>
          </button>
        </div>
      </div>

    </div>
  );
};
