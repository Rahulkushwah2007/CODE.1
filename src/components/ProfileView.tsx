import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  ShieldCheck,
  Phone,
  Users,
  QrCode,
  HeartPulse,
  Save,
  AlertTriangle,
  ChevronDown,
  Building,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { triggerHaptic, handleRipple } from '../utils/feedback';

export const ProfileView: React.FC = () => {
  const { role, country, shelters, setCurrentTab, t } = useApp();

  // Evacuee Profile Form State with local persistence
  const [fullName, setFullName] = useState(() => localStorage.getItem('rsq_profile_name') || 'Aarav Sharma');
  const [phone, setPhone] = useState(() => localStorage.getItem('rsq_profile_phone') || '+91 98765 43210');
  const [kinPhone, setKinPhone] = useState(() => localStorage.getItem('rsq_profile_kin') || '+91 98111 22334');
  const [headcount, setHeadcount] = useState<number>(() => Number(localStorage.getItem('rsq_profile_count')) || 3);
  const [medicalFlags, setMedicalFlags] = useState(() => localStorage.getItem('rsq_profile_med') || 'Diabetic insulin storage, 1 elderly family member');
  const [isSaved, setIsSaved] = useState(false);

  // Accordion open states for secondary info
  const [openAccordion, setOpenAccordion] = useState<string | null>('faq-1');

  const toggleAccordion = (id: string) => {
    triggerHaptic(15);
    setOpenAccordion(prev => (prev === id ? null : id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic([30, 20, 40]);
    localStorage.setItem('rsq_profile_name', fullName);
    localStorage.setItem('rsq_profile_phone', phone);
    localStorage.setItem('rsq_profile_kin', kinPhone);
    localStorage.setItem('rsq_profile_count', headcount.toString());
    localStorage.setItem('rsq_profile_med', medicalFlags);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div id="profile-view" className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-[#F8FAFC]">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
              EVACUEE CREDENTIALS &bull; {country === 'IND' ? 'INDIA' : country === 'NPL' ? 'NEPAL' : 'ALL REGIONS'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {t('profile')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Keep this digital relief credential accessible offline for rapid intake at disaster safe zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            OFFLINE VERIFIED PASS
          </span>
        </div>
      </div>

      {/* 12-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Digital Emergency Pass (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-2xl elevation-3 relative overflow-hidden">
            {/* Holographic style corner badge */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  RELIEF IDENTIFICATION PASS
                </span>
                <div className="text-xl font-black text-white tracking-wider">
                  {fullName || 'REGISTERED EVACUEE'}
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-md flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
            </div>

            {/* Pass Metadata */}
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">{t('phoneNumber')}</span>
                  <span className="font-mono font-bold text-white">{phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Emergency Kin</span>
                  <span className="font-mono font-bold text-rose-300">{kinPhone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#334155]">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">{t('totalMembers')}</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#F97316]" />
                    {headcount} Persons
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-mono block">Pass Validity</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ACTIVE RELIEF
                  </span>
                </div>
              </div>

              {medicalFlags && (
                <div className="pt-2 border-t border-[#334155] bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  <span className="text-rose-400 text-[10px] font-bold uppercase block flex items-center gap-1">
                    <HeartPulse className="w-3 h-3" /> Medical Notes / Care Required
                  </span>
                  <p className="text-[11px] text-rose-200 mt-0.5">{medicalFlags}</p>
                </div>
              )}
            </div>

            {/* Pass Footer */}
            <div className="pt-3 border-t border-[#334155] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Token: RSQ-IND-{phone.slice(-4) || '9876'}</span>
              <span>Gov Verified Protocol</span>
            </div>
          </div>

          {/* Quick Action: Find Shelter */}
          <button
            onClick={() => {
              triggerHaptic(25);
              setCurrentTab('shelters');
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-xs font-bold text-[#F8FAFC] hover:text-[#10B981] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Building className="w-4 h-4 text-[#10B981]" />
            <span>Search Verified Safe Shelters for Family</span>
          </button>
        </div>

        {/* Right Column: Profile & Medical Settings Form (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSave} className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#F97316]" />
              Evacuee Personal Details
            </h3>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('fullName')} / {t('headOfFamily')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Full Legal Name"
                className="w-full px-4 py-3 bg-[#0B1329] border border-[#334155] rounded-xl text-sm text-white focus:outline-none focus:border-[#F97316]"
              />
            </div>

            {/* Contact Phones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t('phoneNumber')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 / +977 Mobile"
                  className="w-full px-4 py-3 bg-[#0B1329] border border-[#334155] rounded-xl text-sm text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Emergency Next-of-Kin Contact
                </label>
                <input
                  type="tel"
                  value={kinPhone}
                  onChange={e => setKinPhone(e.target.value)}
                  placeholder="Relative / Friend Phone"
                  className="w-full px-4 py-3 bg-[#0B1329] border border-[#334155] rounded-xl text-sm text-white focus:outline-none focus:border-[#F97316]"
                />
              </div>
            </div>

            {/* Family Headcount Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                {t('totalMembers')}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      setHeadcount(num);
                    }}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      headcount === num
                        ? 'bg-[#F97316] text-white shadow-md border border-[#F97316]'
                        : 'bg-[#0B1329] text-slate-400 hover:text-white border border-[#334155]'
                    }`}
                  >
                    {num === 6 ? '6+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical / Special Accessibility Flags */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Critical Medical Needs / Allergies / Mobility Requirements
              </label>
              <textarea
                value={medicalFlags}
                onChange={e => setMedicalFlags(e.target.value)}
                rows={2}
                placeholder="List medical conditions, needed medications, wheelchair needs, infant formula, or dietary restrictions..."
                className="w-full px-4 py-3 bg-[#0B1329] border border-[#334155] rounded-xl text-sm text-white focus:outline-none focus:border-[#F97316]"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" /> Profile Updated Successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Data stored safely in offline device storage.
                </span>
              )}

              <button
                type="submit"
                onClick={handleRipple}
                className="py-3 px-6 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{t('saveChanges')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Accordions at the Bottom for Secondary Info */}
      <div className="pt-6 border-t border-[#334155] space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Frequently Asked Questions &amp; Relief Policies
        </h3>

        {/* FAQ Item 1 */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('faq-1')}
            className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-[#0B1329] transition-colors cursor-pointer"
          >
            <span>How is my offline QR digital pass used at the shelter?</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAccordion === 'faq-1' ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>
          {openAccordion === 'faq-1' && (
            <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-[#334155] leading-relaxed animate-fadeIn">
              Shelter registration volunteers use handheld QR scanners to verify your arrival in under 5 seconds. This grants your family priority bed assignment, ration allocations, and keeps missing persons records synchronized without requiring cellular internet.
            </div>
          )}
        </div>

        {/* FAQ Item 2 */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('faq-2')}
            className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-[#0B1329] transition-colors cursor-pointer"
          >
            <span>Can pets and special mobility equipment be accommodated?</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAccordion === 'faq-2' ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>
          {openAccordion === 'faq-2' && (
            <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-[#334155] leading-relaxed animate-fadeIn">
              Verified shelters with the wheelchair accessible tag feature ramps, widened entrances, and ground floor bedding. Animal-friendly designated shelters provide designated kennels and vet support. Check the amenities filter on the Shelters page before proceeding.
            </div>
          )}
        </div>

        {/* FAQ Item 3 */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleAccordion('faq-3')}
            className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-[#0B1329] transition-colors cursor-pointer"
          >
            <span>What should I do if cellular networks fail?</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openAccordion === 'faq-3' ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>
          {openAccordion === 'faq-3' && (
            <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-[#334155] leading-relaxed animate-fadeIn">
              Resqtech automatically caches all verified safe zones, GIS maps, and your digital pass locally on your device. You can navigate directly to the nearest highlighted stadium or school even without network connectivity.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
