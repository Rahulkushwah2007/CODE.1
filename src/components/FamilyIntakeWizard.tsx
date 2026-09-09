import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserPlus,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Bed,
  Utensils,
  Droplet,
  HeartPulse,
  Building,
  ShieldCheck,
  Printer,
  QrCode,
  Check,
  Calendar,
  Phone,
  FileCheck
} from 'lucide-react';
import { FamilyMember, FamilyRequirements, Family, Shelter } from '../types';
import { rankShelters } from '../utils/scoring';

export const FamilyIntakeWizard: React.FC = () => {
  const { country, shelters, registerFamily, setCurrentTab, setSelectedShelterId, t } = useApp();

  const [step, setStep] = useState<number>(1);

  // STEP 1 State
  const [headOfFamily, setHeadOfFamily] = useState<string>('Dinesh Sharma');
  const [mobile, setMobile] = useState<string>(country === 'IND' ? '+91 98250 88712' : '+977 98412 99014');
  const [membersCount, setMembersCount] = useState<number>(4);

  // STEP 2 State: Members detail
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: 'm1', name: 'Dinesh Sharma', age: 44, gender: 'Male', category: 'Adult', hasDisability: false, medicalCondition: 'None' },
    { id: 'm2', name: 'Sunita Sharma', age: 40, gender: 'Female', category: 'Adult', hasDisability: false, medicalCondition: 'None' },
    { id: 'm3', name: 'Aarav Sharma', age: 12, gender: 'Male', category: 'Child', hasDisability: false, medicalCondition: 'Asthma inhaler' },
    { id: 'm4', name: 'Kanti Sharma', age: 72, gender: 'Female', category: 'Elderly', hasDisability: true, medicalCondition: 'Arthritis & mobility' }
  ]);

  // Adjust member rows if membersCount changes
  const handleMembersCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(15, newCount));
    setMembersCount(validCount);
    if (validCount > members.length) {
      const added: FamilyMember[] = [];
      for (let i = members.length; i < validCount; i++) {
        added.push({
          id: `m${i + 1}`,
          name: i === 0 ? headOfFamily : `Member ${i + 1}`,
          age: 30,
          gender: 'Other',
          category: 'Adult',
          hasDisability: false,
          medicalCondition: 'None'
        });
      }
      setMembers([...members, ...added]);
    } else if (validCount < members.length) {
      setMembers(members.slice(0, validCount));
    }
  };

  // STEP 3 State: Requirements
  const [requirements, setRequirements] = useState<FamilyRequirements>({
    food: true,
    water: true,
    beds: true,
    medicalAssistance: true,
    wheelchairAccessible: true,
    childFriendly: true,
    womenSafeSpace: true,
    petFriendly: false
  });

  // STEP 4 State: Selected Shelter
  const [selectedShelterIdLocal, setSelectedShelterIdLocal] = useState<string>('');
  const [overrideCapacity, setOverrideCapacity] = useState<boolean>(false);

  // STEP 5: Generated registration confirmation
  const [registeredResult, setRegisteredResult] = useState<Family | null>(null);

  // Recommendations for Step 4
  const countryShelters = useMemo(() => {
    return shelters.filter(s => s.country === country);
  }, [shelters, country]);

  const ranked = useMemo(() => {
    // Reference coordinate: center of active zone
    const refLat = country === 'IND' ? 23.0338 : 27.6953;
    const refLng = country === 'IND' ? 72.5850 : 85.3149;
    return rankShelters(countryShelters, {
      userLat: refLat,
      userLng: refLng,
      familySize: membersCount,
      requirements,
      emergencyOverride: overrideCapacity
    });
  }, [countryShelters, country, membersCount, requirements, overrideCapacity]);

  // Auto pick best match if none chosen yet
  React.useEffect(() => {
    if (ranked.length > 0 && !selectedShelterIdLocal) {
      setSelectedShelterIdLocal(ranked[0].shelter.id);
    }
  }, [ranked, selectedShelterIdLocal]);

  // Confirm registration
  const handleConfirmRegistration = () => {
    const newFam = registerFamily({
      headOfFamily,
      mobile,
      membersCount,
      members,
      requirements,
      assignedShelterId: selectedShelterIdLocal,
      status: 'Sheltered'
    });
    setRegisteredResult(newFam);
    setStep(5);
  };

  const selectedShelterObj = shelters.find(s => s.id === selectedShelterIdLocal);

  return (
    <div id="family-intake-wizard" className="max-w-4xl mx-auto p-4 sm:p-6 text-[#F8FAFC] space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
              DISASTER RELIEF INTAKE DESK
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            {t('fastRegistration')}
          </h1>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-[#1E293B] border border-[#334155] rounded-lg text-[#CBD5E1]">
          Step {step} of 5
        </span>
      </div>

      {/* Step Progress Stepper */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
        {[
          { num: 1, label: t('familyInfo') },
          { num: 2, label: t('members') },
          { num: 3, label: t('requirements') },
          { num: 4, label: t('allocation') },
          { num: 5, label: t('confirmedPass') }
        ].map(s => (
          <div
            key={s.num}
            className={`p-2 rounded-xl border transition-all ${
              step === s.num
                ? 'bg-[#1E293B] border-[#F97316] text-[#F97316] font-bold'
                : step > s.num
                ? 'bg-[#1E293B] border-[#334155] text-emerald-400'
                : 'bg-[#0B1329] border-[#334155] text-[#94A3B8]'
            }`}
          >
            <span className="block font-black text-sm">0{s.num}</span>
            <span className="text-[10px] hidden sm:block truncate">{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Family Information */}
      {step === 1 && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-lg font-black text-white">Step 1: {t('familyInfo')}</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Input primary guardian contact and total number of family members needing shelter together.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94A3B8] font-semibold mb-1">
                {t('headOfFamily')}
              </label>
              <input
                id="input-head-family"
                type="text"
                value={headOfFamily}
                onChange={e => {
                  setHeadOfFamily(e.target.value);
                  if (members.length > 0) {
                    const copy = [...members];
                    copy[0].name = e.target.value;
                    setMembers(copy);
                  }
                }}
                className="w-full bg-[#0B1329] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F97316]"
                placeholder="Full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94A3B8] font-semibold mb-1">
                  {t('phoneNumber')}
                </label>
                <input
                  id="input-mobile"
                  type="text"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full bg-[#0B1329] border border-[#334155] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F97316] font-mono"
                  placeholder="+91 / +977..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94A3B8] font-semibold mb-1">
                  {t('totalMembers')}
                </label>
                <div className="flex items-center gap-3 bg-[#0B1329] border border-[#334155] rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => handleMembersCountChange(membersCount - 1)}
                    className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-mono font-bold text-lg text-white">
                    {membersCount}
                  </span>
                  <button
                    onClick={() => handleMembersCountChange(membersCount + 1)}
                    className="w-8 h-8 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-white font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#334155] flex justify-end">
            <button
              id="btn-step1-next"
              onClick={() => setStep(2)}
              disabled={!headOfFamily.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{t('nextStep')}: {t('members')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Members Detail */}
      {step === 2 && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Step 2: {t('members')}</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Specifying individual ages and health needs ensures appropriate medicine and floor allocations.
              </p>
            </div>
            <span className="text-xs font-mono text-[#F97316] font-bold">
              {members.length} / {membersCount} Members Listed
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {members.map((mem, idx) => (
              <div key={mem.id} className="bg-[#0B1329] p-3.5 rounded-2xl border border-[#334155] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#94A3B8] font-bold">Member #{idx + 1} {idx === 0 && `(${t('headOfFamily')})`}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[11px] text-[#CBD5E1] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mem.hasDisability}
                        onChange={e => {
                          const updated = [...members];
                          updated[idx].hasDisability = e.target.checked;
                          setMembers(updated);
                        }}
                        className="rounded border-[#334155] text-purple-500"
                      />
                      <span>Mobility Aid / Disability</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={mem.name}
                    onChange={e => {
                      const updated = [...members];
                      updated[idx].name = e.target.value;
                      setMembers(updated);
                    }}
                    placeholder="Full Name"
                    className="sm:col-span-2 bg-[#1E293B] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#F97316]"
                  />

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={mem.age}
                      onChange={e => {
                        const updated = [...members];
                        const age = parseInt(e.target.value) || 0;
                        updated[idx].age = age;
                        updated[idx].category = age < 18 ? 'Child' : age >= 65 ? 'Elderly' : 'Adult';
                        setMembers(updated);
                      }}
                      placeholder="Age"
                      className="w-16 bg-[#1E293B] border border-[#334155] rounded-lg px-2 py-1.5 text-white font-mono focus:outline-none focus:border-[#F97316]"
                    />
                    <select
                      value={mem.gender}
                      onChange={e => {
                        const updated = [...members];
                        updated[idx].gender = e.target.value as any;
                        setMembers(updated);
                      }}
                      className="bg-[#1E293B] border border-[#334155] rounded-lg px-2 py-1.5 text-white text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={mem.medicalCondition}
                    onChange={e => {
                      const updated = [...members];
                      updated[idx].medicalCondition = e.target.value;
                      setMembers(updated);
                    }}
                    placeholder="Medical need / 'None'"
                    className="bg-[#1E293B] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-[#F97316]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#334155] flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-[#0B1329] border border-[#334155] hover:bg-[#334155] text-[#CBD5E1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('previousStep')}</span>
            </button>
            <button
              id="btn-step2-next"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{t('nextStep')}: {t('requirements')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Requirements */}
      {step === 3 && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-lg font-black text-white">Step 3: {t('requirements')}</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Check all that apply to guide the smart allocation algorithm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { key: 'food' as const, label: t('hotFood'), icon: Utensils, desc: 'Hot meals or packaged food rations' },
              { key: 'water' as const, label: t('drinkingWater'), icon: Droplet, desc: 'Tested potable water for formula/drinking' },
              { key: 'beds' as const, label: 'Beds / Elevated Sleeping Cots', icon: Bed, desc: `${membersCount} elevated canvas beds` },
              { key: 'medicalAssistance' as const, label: t('medicalSupport'), icon: HeartPulse, desc: 'Doctor, nurse, or daily medications' },
              { key: 'wheelchairAccessible' as const, label: 'Wheelchair / Step-Free Ramps', icon: Building, desc: 'Ground floor or ramp accessibility' },
              { key: 'womenSafeSpace' as const, label: 'Women / Family Partitioned Bay', icon: ShieldCheck, desc: 'Dedicated safe enclosure' }
            ].map(item => {
              const Icon = item.icon;
              const isChecked = requirements[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => setRequirements({ ...requirements, [item.key]: !isChecked })}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-start gap-3 transition-all ${
                    isChecked ? 'bg-[#0B1329] border-[#10B981] text-emerald-300' : 'bg-[#0B1329] border-[#334155] text-[#94A3B8] hover:border-[#334155]'
                  }`}
                >
                  <div className={`p-2 rounded-xl mt-0.5 ${isChecked ? 'bg-[#10B981] text-white' : 'bg-[#1E293B] text-[#94A3B8]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">{item.label}</span>
                    <span className="text-[11px] text-[#94A3B8]">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#334155] flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-[#0B1329] border border-[#334155] hover:bg-[#334155] text-[#CBD5E1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('previousStep')}</span>
            </button>
            <button
              id="btn-step3-next"
              onClick={() => setStep(4)}
              className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{t('nextStep')}: {t('allocation')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Shelter Allocation */}
      {step === 4 && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div>
            <h2 className="text-lg font-black text-white">Step 4: {t('allocation')}</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              The recommendation engine evaluated {countryShelters.length} facilities for {membersCount} members. Select confirmed shelter:
            </p>
          </div>

          <div className="space-y-3">
            {ranked.slice(0, 4).map(({ shelter, score, distanceKm, estimatedTravelTime, matchReasons, capacityFit }) => {
              const isSelected = selectedShelterIdLocal === shelter.id;
              const occPct = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);

              return (
                <div
                  key={shelter.id}
                  onClick={() => setSelectedShelterIdLocal(shelter.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0B1329] border-[#10B981] shadow-xl'
                      : 'bg-[#0B1329] border-[#334155] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">{shelter.name}</span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300 font-bold">
                          Score: {score}/100
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        {shelter.city} &bull; {distanceKm} km away ({estimatedTravelTime})
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                        occPct >= 90 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {occPct}% {t('occupancy')}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] block mt-1">
                        {shelter.availableBeds} {t('bedsLeft')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-[#CBD5E1] flex flex-wrap gap-2">
                    {matchReasons.slice(0, 3).map((r, i) => (
                      <span key={i} className="bg-[#1E293B] px-2 py-0.5 rounded text-[11px] text-emerald-300 border border-[#334155]">
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#334155] flex justify-between items-center">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-xl bg-[#0B1329] border border-[#334155] hover:bg-[#334155] text-[#CBD5E1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('previousStep')}</span>
            </button>

            <button
              id="btn-confirm-intake"
              onClick={handleConfirmRegistration}
              disabled={!selectedShelterIdLocal}
              className="px-8 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('confirmBookingBtn')}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Registration Pass Card */}
      {step === 5 && registeredResult && (
        <div id="registration-confirmation-card" className="bg-[#1E293B] border-2 border-emerald-500/70 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <FileCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                  {t('bookingConfirmedTitle')} &bull; {t('allocation')}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
                  {registeredResult.id}
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs self-start sm:self-center">
              STATUS: SHELTERED
            </span>
          </div>

          {/* Pass Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#0B1329] p-3.5 rounded-2xl border border-[#334155]">
              <span className="text-[#94A3B8] block">{t('headOfFamily')}</span>
              <strong className="text-sm text-white font-sans">{registeredResult.headOfFamily}</strong>
              <span className="text-[#94A3B8] block mt-1">{registeredResult.mobile}</span>
            </div>

            <div className="bg-[#0B1329] p-3.5 rounded-2xl border border-[#334155]">
              <span className="text-[#94A3B8] block">Family Unit</span>
              <strong className="text-sm text-emerald-400">{registeredResult.membersCount} Persons</strong>
              <span className="text-[#94A3B8] block mt-1 font-sans">Grouped together</span>
            </div>

            <div className="bg-[#0B1329] p-3.5 rounded-2xl border border-[#334155]">
              <span className="text-[#94A3B8] block">Assigned Shelter</span>
              <strong className="text-sm text-white font-sans truncate block">{selectedShelterObj?.name}</strong>
              <span className="text-[#94A3B8] block mt-1">{selectedShelterObj?.city}</span>
            </div>
          </div>

          {/* Members list */}
          <div className="bg-[#0B1329] p-4 rounded-2xl border border-[#334155] text-xs">
            <span className="font-mono text-[#94A3B8] block mb-2 font-bold uppercase">
              Registered Group Members ({registeredResult.members.length})
            </span>
            <div className="divide-y divide-[#334155]">
              {registeredResult.members.map((m, i) => (
                <div key={m.id} className="py-1.5 flex items-center justify-between">
                  <span className="text-[#F8FAFC]">
                    {i + 1}. {m.name} ({m.age}y, {m.gender}, {m.category})
                  </span>
                  <span className="text-[#94A3B8] font-mono">
                    {m.medicalCondition !== 'None' ? `Med: ${m.medicalCondition}` : 'No special med'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-[#0B1329] border border-[#334155] hover:bg-[#334155] text-[#F8FAFC] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Intake Slip</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setStep(1);
                  setRegisteredResult(null);
                  setHeadOfFamily('');
                  setMembersCount(1);
                  setMembers([{ id: 'm1', name: '', age: 30, gender: 'Other', category: 'Adult', hasDisability: false, medicalCondition: 'None' }]);
                }}
                className="px-4 py-2 rounded-xl bg-[#0B1329] border border-[#334155] hover:bg-[#334155] text-[#CBD5E1] text-xs font-semibold cursor-pointer"
              >
                Register Another Family
              </button>

              <button
                onClick={() => setCurrentTab('families')}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs cursor-pointer"
              >
                View in Family Registry →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
