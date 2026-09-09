import React, { useState } from 'react';
import { Shelter } from '../types';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Users,
  Phone,
  QrCode,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { triggerHaptic, handleRipple } from '../utils/feedback';

interface BookingConfirmModalProps {
  shelter: Shelter;
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: (bookingData: {
    shelterId: string;
    headcount: number;
    notes: string;
    bookingCode: string;
  }) => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  shelter,
  isOpen,
  onClose,
  onConfirmed
}) => {
  const [headcount, setHeadcount] = useState<number>(2);
  const [specialNeeds, setSpecialNeeds] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [bookingCode, setBookingCode] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    triggerHaptic([40, 30, 60]);
    const code = `RSQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${headcount}`;
    setBookingCode(code);
    setConfirmed(true);
    onConfirmed({
      shelterId: shelter.id,
      headcount,
      notes: specialNeeds,
      bookingCode: code
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="w-full max-w-lg bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-2xl elevation-4 relative text-[#0F172A] overflow-hidden">
        
        {/* Close button */}
        <button
          onClick={() => {
            triggerHaptic(25);
            onClose();
          }}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!confirmed ? (
          <div className="space-y-6">
            {/* Modal Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EA580C]/10 text-[#EA580C] text-xs font-bold font-mono tracking-wider border border-[#EA580C]/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                CRITICAL RESERVATION
              </div>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-black text-[#0F172A]">
                Confirm Spot at this Shelter?
              </h2>
              <p className="text-sm text-[#475569] mt-1 font-medium">
                A guaranteed spot will be reserved for your family at this verified safe facility.
              </p>
            </div>

            {/* Shelter Summary Box */}
            <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">{shelter.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#475569] mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                    <span>{shelter.city}, {shelter.state}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  shelter.status === 'AVAILABLE' ? 'bg-[#059669] text-[#FFFFFF]' :
                  shelter.status === 'LIMITED' ? 'bg-[#EA580C] text-[#FFFFFF]' :
                  'bg-[#DC2626] text-[#FFFFFF]'
                }`}>
                  {shelter.status === 'AVAILABLE' ? 'AVAILABLE' : shelter.status === 'LIMITED' ? 'LIMITED BEDS' : 'FULL'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#475569]">
                <span>Available Beds: <strong className="text-[#059669] font-bold">{shelter.availableBeds}</strong></span>
                <span>Coordinator: <strong className="text-[#0F172A] font-bold">{shelter.managerName}</strong></span>
              </div>
            </div>

            {/* Group Size Inputs - Massive Touch Targets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                Number of Evacuees (Family Size)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      triggerHaptic(20);
                      setHeadcount(num);
                    }}
                    className={`py-3 rounded-xl font-black text-sm transition-all cursor-pointer ${
                      headcount === num
                        ? 'bg-[#0F172A] text-[#FFFFFF] shadow-md border-2 border-[#0F172A]'
                        : 'bg-[#FFFFFF] hover:bg-slate-50 text-[#0F172A] border-2 border-[#E2E8F0]'
                    }`}
                  >
                    {num === 6 ? '5+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Special Needs / Notes */}
            <div className="space-y-1.5">
              <label htmlFor="special-needs-input" className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                Urgent Needs / Medical Notes (Optional)
              </label>
              <input
                id="special-needs-input"
                type="text"
                value={specialNeeds}
                onChange={e => setSpecialNeeds(e.target.value)}
                placeholder="e.g. Wheelchair, infant baby formula, insulin refrigeration"
                className="w-full px-4 py-3 bg-[#FFFFFF] border-2 border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/20 font-medium"
              />
            </div>

            {/* Emergency Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border-2 border-[#E2E8F0] text-[#475569] text-xs">
              <AlertTriangle className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
              <span>
                Please proceed directly to the shelter after booking. Your reservation will be held for <strong>4 hours</strong> upon dispatch.
              </span>
            </div>

            {/* Actions: #EA580C Signal Amber CTA and #FFFFFF outline */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(20);
                  onClose();
                }}
                className="flex-1 py-3.5 px-4 rounded-full bg-[#FFFFFF] hover:bg-slate-50 text-[#0F172A] text-sm font-bold transition-colors cursor-pointer border-2 border-[#E2E8F0]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-2 py-3.5 px-6 rounded-full clay-btn-signal bg-[#EA580C] hover:bg-[#C2410C] text-[#FFFFFF] text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl ripple-container"
              >
                <span>Confirm Spot ({headcount} {headcount === 1 ? 'Person' : 'People'})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Success Pass */
          <div className="space-y-6 py-2 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#059669]/10 border-2 border-[#059669] text-[#059669] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase font-bold text-[#059669] tracking-wider">
                SPOT CONFIRMED &amp; REGISTERED
              </span>
              <h2 className="text-2xl font-black text-[#0F172A] mt-1">
                Your Shelter Pass is Ready
              </h2>
              <p className="text-xs text-[#475569] mt-1 max-w-sm mx-auto font-medium">
                Present this pass or quote your booking reference upon arrival at the relief gate.
              </p>
            </div>

            {/* Digital Pass Card */}
            <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl p-5 text-left space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#475569] uppercase font-bold">Booking Pass ID</span>
                  <div className="text-lg font-mono font-black text-[#0F172A] tracking-widest">
                    {bookingCode}
                  </div>
                </div>
                <div className="w-12 h-12 bg-[#FFFFFF] border border-[#E2E8F0] rounded-lg p-1 flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-[#0F172A]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#475569] block text-[10px] font-semibold">Shelter</span>
                  <strong className="text-[#0F172A] font-bold">{shelter.name}</strong>
                </div>
                <div>
                  <span className="text-[#475569] block text-[10px] font-semibold">Reserved For</span>
                  <strong className="text-[#0F172A] font-bold">{headcount} Evacuees</strong>
                </div>
                <div>
                  <span className="text-[#475569] block text-[10px] font-semibold">Shelter Phone</span>
                  <a href={`tel:${shelter.phone}`} className="text-[#0F172A] font-black underline">
                    {shelter.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[#475569] block text-[10px] font-semibold">Valid Until</span>
                  <strong className="text-[#EA580C] font-bold">4 Hours from Now</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-[#FFFFFF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>Navigate to Shelter</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-full bg-[#FFFFFF] hover:bg-slate-50 text-[#0F172A] text-xs font-bold border-2 border-[#E2E8F0] transition-colors cursor-pointer"
              >
                Close &amp; View Pass
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
