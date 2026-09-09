import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  Radio,
  MapPin,
  Users,
  HeartPulse,
  Droplet,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { triggerHaptic, handleRipple } from '../utils/feedback';

interface EmergencyDistressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyDistressModal: React.FC<EmergencyDistressModalProps> = ({
  isOpen,
  onClose
}) => {
  const { country, addIncident } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [personsCount, setPersonsCount] = useState(2);
  const [location, setLocation] = useState('');
  const [hazardType, setHazardType] = useState('Flood Trapped / Rising Water');
  const [needsMedical, setNeedsMedical] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [distressCode, setDistressCode] = useState('');

  if (!isOpen) return null;

  const handleSubmitDistress = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic([60, 40, 80, 50, 100]);
    const code = `SOS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setDistressCode(code);
    setSubmitted(true);

    if (addIncident) {
      addIncident({
        id: code,
        type: hazardType,
        severity: 'CRITICAL',
        status: 'active',
        lat: country === 'NPL' ? 27.7172 : 23.0225,
        lng: country === 'NPL' ? 85.3240 : 72.5714,
        description: `DISTRESS CALL by ${name || 'Evacuee'} (${phone || 'No phone'}). Headcount: ${personsCount}. ${hazardType}. ${needsMedical ? 'URGENT MEDICAL AID NEEDED.' : ''} Landmark: ${location || 'GPS Dispatched'}`,
        timestamp: new Date().toISOString(),
        reportedBy: name || 'Public Distress Call',
        peopleAffected: personsCount
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="distress-modal-title"
    >
      <div className="w-full max-w-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-2xl elevation-4 relative text-[#0F172A] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            triggerHaptic(20);
            onClose();
          }}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-[#0F172A] transition-colors cursor-pointer"
          aria-label="Close Distress Call"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmitDistress} className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C]/10 text-[#EA580C] text-xs font-mono font-bold tracking-wider border border-[#EA580C]/30 mb-2">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                CRITICAL EMERGENCY TRANSMISSION
              </div>
              <h2 id="distress-modal-title" className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Emergency Distress Call (SOS)
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1 leading-relaxed">
                Provide your current coordinates or nearest visual landmark. State disaster control room and rescue teams receive this transmission immediately with top priority.
              </p>
            </div>

            {/* Form Fields with thick 2px #E2E8F0 borders */}
            <div className="space-y-4">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    Contact Name / Head of Family *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g., Rajesh Sharma"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    Callback Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Number of Persons & Emergency Hazard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    People Needing Evacuation *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 4, 6, 10].map(count => (
                      <button
                        type="button"
                        key={count}
                        onClick={() => {
                          triggerHaptic(15);
                          setPersonsCount(count);
                        }}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer ${
                          personsCount === count
                            ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                            : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-slate-50'
                        }`}
                      >
                        {count === 10 ? '10+' : count}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                    Disaster Threat Type *
                  </label>
                  <select
                    value={hazardType}
                    onChange={e => setHazardType(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-[#E2E8F0] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#EA580C] font-medium cursor-pointer"
                  >
                    <option value="Flood Trapped / Rising Water">Flood Trapped / Rising Water</option>
                    <option value="Structural Collapse / Debris Trap">Structural Collapse / Debris</option>
                    <option value="Cyclone / Extreme Windstorm Damage">Cyclone / High Winds Damage</option>
                    <option value="Earthquake Aftershocks">Earthquake Tremors</option>
                    <option value="Medical Emergency / Critical Illness">Critical Medical Emergency</option>
                    <option value="Stranded Without Clean Water/Food">Stranded Without Water/Food</option>
                  </select>
                </div>
              </div>

              {/* Current Location / Landmark */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                  Exact Location, Rooftop, or Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g., Rooftop of 3rd building behind Govt Hospital, Sector 4"
                  className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 transition-all font-medium"
                />
              </div>

              {/* Special Medical Requirement Toggle */}
              <div className="flex items-center gap-3 p-3.5 bg-white border-2 border-[#E2E8F0] rounded-2xl">
                <input
                  type="checkbox"
                  id="chk-needs-medical"
                  checked={needsMedical}
                  onChange={e => setNeedsMedical(e.target.checked)}
                  className="w-4 h-4 text-[#EA580C] rounded border-slate-300 focus:ring-[#EA580C] cursor-pointer"
                />
                <label htmlFor="chk-needs-medical" className="text-xs text-[#0F172A] font-semibold cursor-pointer select-none">
                  Includes Elderly, Infants, or Injured Persons requiring immediate medical stretcher
                </label>
              </div>
            </div>

            {/* Compulsory Primary Action: One massive #EA580C (Signal Amber) button spanning full width labeled 'SUBMIT DISTRESS CALL' in #FFFFFF bold text */}
            <div className="pt-2">
              <button
                type="submit"
                id="btn-submit-distress-call"
                className="w-full py-4.5 px-6 rounded-2xl clay-btn-signal bg-[#EA580C] hover:bg-[#C2410C] text-white text-base sm:text-lg font-black tracking-wide uppercase transition-all shadow-xl cursor-pointer ripple-container flex items-center justify-center gap-3 border-2 border-white/30"
              >
                <Radio className="w-5 h-5 text-white animate-ping" />
                <span>SUBMIT DISTRESS CALL</span>
              </button>
            </div>
          </form>
        ) : (
          /* Submission Confirmation */
          <div className="space-y-6 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#059669] uppercase tracking-wider">
                DISTRESS DISPATCH ACKNOWLEDGED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                Rescue Units Alerted
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto">
                Your emergency packet has been prioritized in the central Incident Command dispatch queue.
              </p>
            </div>

            <div className="p-4 bg-white border-2 border-[#E2E8F0] rounded-2xl max-w-sm mx-auto space-y-1">
              <span className="text-[10px] font-mono text-[#475569] uppercase">Tracking Ticket Number</span>
              <div className="text-2xl font-mono font-black text-[#EA580C] tracking-wider">
                {distressCode}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href="tel:112"
                className="px-6 py-3.5 rounded-xl bg-[#0F172A] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#1E293B]"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Direct Voice 112 (IND) / 1155 (NPL)</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3.5 rounded-xl bg-white border-2 border-[#E2E8F0] text-[#0F172A] text-sm font-bold hover:bg-slate-100"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
