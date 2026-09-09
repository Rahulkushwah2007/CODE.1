import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  RotateCcw,
  Shield,
  Globe,
  Database,
  CheckCircle2,
  PhoneCall,
  Languages
} from 'lucide-react';
import { Language } from '../types';

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
    lastSyncTime,
    language,
    setLanguage,
    t
  } = useApp();

  return (
    <div id="settings-view" className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EA580C]">
              {t('platformConfiguration')}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            {t('systemSettings')}
          </h1>
        </div>
      </div>

      {/* Language Preference Setting */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-[#EA580C]">
          <Languages className="w-5 h-5 text-[#EA580C]" />
          <h3 className="font-bold text-white text-sm">{t('languageSelectTitle')}</h3>
        </div>
        <p className="text-xs text-slate-400">
          {t('languageSelectorSubtitle')}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              language === 'en'
                ? 'bg-[#0B1329] border-[#EA580C] text-white shadow-lg ring-1 ring-[#EA580C]'
                : 'bg-[#0B1329]/60 border-[#334155] text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-bold text-sm">English</span>
            <span className="text-[10px] font-mono text-slate-400">Default (EN)</span>
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              language === 'hi'
                ? 'bg-[#0B1329] border-[#EA580C] text-white shadow-lg ring-1 ring-[#EA580C]'
                : 'bg-[#0B1329]/60 border-[#334155] text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-bold text-sm">हिन्दी</span>
            <span className="text-[10px] font-mono text-slate-400">Hindi (HI)</span>
          </button>
          <button
            onClick={() => setLanguage('gu')}
            className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              language === 'gu'
                ? 'bg-[#0B1329] border-[#EA580C] text-white shadow-lg ring-1 ring-[#EA580C]'
                : 'bg-[#0B1329]/60 border-[#334155] text-slate-400 hover:text-white'
            }`}
          >
            <span className="font-bold text-sm">ગુજરાતી</span>
            <span className="text-[10px] font-mono text-slate-400">Gujarati (GU)</span>
          </button>
        </div>
      </div>

      {/* Role and Country Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Country */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#EA580C]">
            <Globe className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">{t('activeGeographicalScope')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setCountry('ALL')}
              className={`p-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                country === 'ALL' ? 'bg-[#0B1329] border-[#EA580C] text-white shadow-sm' : 'bg-[#0B1329]/60 border-[#334155] text-slate-400 hover:text-white'
              }`}
            >
              🌏 {t('all')}
            </button>
            <button
              onClick={() => setCountry('IND')}
              className={`p-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                country === 'IND' ? 'bg-[#0B1329] border-amber-500 text-amber-400 shadow-sm' : 'bg-[#0B1329]/60 border-[#334155] text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => setCountry('NPL')}
              className={`p-3 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                country === 'NPL' ? 'bg-[#0B1329] border-rose-500 text-rose-400 shadow-sm' : 'bg-[#0B1329]/60 border-[#334155] text-slate-400 hover:text-white'
              }`}
            >
              🇳🇵 Nepal
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#10B981]">
            <Shield className="w-4 h-4" />
            <h3 className="font-bold text-white text-sm">{t('operatingAuthorityRole')}</h3>
          </div>
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="w-full bg-[#0B1329] border border-[#334155] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#EA580C]"
          >
            <option value="public">{t('rolePublic')}</option>
            <option value="manager">{t('roleManager')}</option>
            <option value="district_admin">{t('roleDistrictAdmin')}</option>
            <option value="super_admin">{t('roleSuperAdmin')}</option>
            <option value="staff">{t('roleStaff')}</option>
            <option value="volunteer">{t('roleVolunteer')}</option>
          </select>
        </div>

      </div>

      {/* 24/7 Official Helplines Reference */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <PhoneCall className="w-4 h-4" />
          <h3 className="font-bold text-white text-sm">{t('hotlinesTitle')}</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-[#0B1329] rounded-xl border border-[#334155] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">{t('indiaHelpline')}</span>
              <span className="text-slate-400 text-[11px]">{t('indiaHelplineSub')}</span>
            </div>
            <a href="tel:112" className="px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-mono font-bold">112 / 1070</a>
          </div>
          <div className="p-3 bg-[#0B1329] rounded-xl border border-[#334155] flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">{t('nepalHelpline')}</span>
              <span className="text-slate-400 text-[11px]">{t('nepalHelplineSub')}</span>
            </div>
            <a href="tel:1155" className="px-3 py-1.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white font-mono font-bold">1155 / 1149</a>
          </div>
        </div>
      </div>

      {/* Local Persistence & Reset Card */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-[#CBD5E1]">
          <Database className="w-5 h-5 text-[#EA580C]" />
          <h2 className="font-bold text-white text-base">RESQTECH Database Registry</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
          <div className="bg-[#0B1329] p-3 rounded-xl border border-[#334155]">
            <span className="text-slate-400 block">{t('shelters')}</span>
            <strong className="text-white text-sm">{shelters.length}</strong>
          </div>
          <div className="bg-[#0B1329] p-3 rounded-xl border border-[#334155]">
            <span className="text-slate-400 block">{t('familyUnits')}</span>
            <strong className="text-emerald-400 text-sm">{families.length}</strong>
          </div>
          <div className="bg-[#0B1329] p-3 rounded-xl border border-[#334155]">
            <span className="text-slate-400 block">{t('eventAlerts')}</span>
            <strong className="text-rose-400 text-sm">{alerts.length}</strong>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#334155]">
          <span className="text-xs text-slate-400">
            {t('lastSynchronized')}: {lastSyncTime}
          </span>
          <button
            onClick={() => {
              if (confirm('Reset operational shelter database back to official registry?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#0B1329] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#334155] font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{t('resetBaselineRegistry')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
