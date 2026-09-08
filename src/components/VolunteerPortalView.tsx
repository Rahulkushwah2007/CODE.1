import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  Users,
  MapPin,
  HeartPulse,
  Utensils,
  Droplet,
  PackageCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Send,
  Building2
} from 'lucide-react';

export const VolunteerPortalView: React.FC = () => {
  const { country, shelters } = useApp();

  const countryShelters = useMemo(() => shelters.filter(s => s.country === country), [shelters, country]);

  // Shelters with highest occupancy or low resources
  const highNeedShelters = countryShelters.filter(
    s => s.status === 'CRITICAL' || s.status === 'LIMITED'
  );

  const [volunteerName, setVolunteerName] = useState<string>('');
  const [volunteerPhone, setVolunteerPhone] = useState<string>('');
  const [volunteerRole, setVolunteerRole] = useState<string>('General Relief Support');
  const [selectedShelterId, setSelectedShelterId] = useState<string>(highNeedShelters[0]?.id || countryShelters[0]?.id || '');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setVolunteerName('');
      setVolunteerPhone('');
    }, 2500);
  };

  return (
    <div id="volunteer-portal-view" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              COMMUNITY VOLUNTEER & NGO NETWORK
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
            Civilian Aid & On-Site Volunteer Mobilization
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
            Directly connect doctors, nurses, drivers, kitchen coordinators, and relief NGOs with shelter facilities experiencing acute operational shortages.
          </p>
        </div>
      </div>

      {/* Volunteer Registration & High Need Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Volunteer Signup Form */}
        <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-blue-400">
            <HeartHandshake className="w-5 h-5" />
            <h2 className="font-bold text-white text-base">Register to Offer Assistance</h2>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Emergency managers will contact you directly based on shelter priority gaps.
          </p>

          <form onSubmit={handleRegisterVolunteer} className="space-y-3 text-xs">
            <div>
              <label className="text-[#94A3B8] block mb-1">Full Name / Organization</label>
              <input
                type="text"
                required
                value={volunteerName}
                onChange={e => setVolunteerName(e.target.value)}
                placeholder="Dr. Sneha Verma / Seva NGO"
                className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Mobile Hotline</label>
              <input
                type="text"
                required
                value={volunteerPhone}
                onChange={e => setVolunteerPhone(e.target.value)}
                placeholder="+91 / +977..."
                className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Specialization / Role</label>
              <select
                value={volunteerRole}
                onChange={e => setVolunteerRole(e.target.value)}
                className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-white"
              >
                <option value="Medical Doctor / Nurse">Medical Doctor / Nurse (Emergency Triage)</option>
                <option value="Community Kitchen / Food Prep">Community Kitchen / Meal Distribution</option>
                <option value="Heavy Vehicle / Water Tanker Driver">Logistics / Water Tanker Driver</option>
                <option value="Child Care & Counseling">Child Care & Trauma Counseling</option>
                <option value="General Relief Support">General Intake & Crowd Marshaling</option>
              </select>
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1">Deploy to Facility</label>
              <select
                value={selectedShelterId}
                onChange={e => setSelectedShelterId(e.target.value)}
                className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-white"
              >
                {countryShelters.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city} &bull; {s.status})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Deployment Registered!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Availability</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Priority Shelters Needing Volunteer Aid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white uppercase font-mono tracking-wider">
              Facilities Requesting Immediate Hands
            </h2>
            <span className="text-xs font-mono text-rose-400">
              {highNeedShelters.length} Priority Locations
            </span>
          </div>

          <div className="space-y-3">
            {highNeedShelters.map(s => (
              <div
                key={s.id}
                className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-300">{s.id}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      s.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {s.status} OCCUPANCY ({Math.round((s.currentOccupancy / s.totalCapacity) * 100)}%)
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{s.name}</h3>
                  <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                    <span>{s.city}, {s.state} &bull; Warden: {s.managerName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${s.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] text-xs font-semibold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>Contact Camp</span>
                  </a>
                  <button
                    onClick={() => {
                      setSelectedShelterId(s.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs"
                  >
                    Volunteer Here
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
