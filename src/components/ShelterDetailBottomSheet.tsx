import React from 'react';
import { Shelter } from '../types';
import {
  X,
  MapPin,
  Users,
  Phone,
  Navigation,
  HeartPulse,
  Droplet,
  Utensils,
  Bed,
  Accessibility,
  Baby,
  Dog,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Car,
  Footprints
} from 'lucide-react';
import { ShelterVerificationBadge } from './ShelterVerificationBadge';
import { triggerHaptic, handleRipple } from '../utils/feedback';

interface ShelterDetailBottomSheetProps {
  shelter: Shelter | null;
  distanceKm?: number;
  isOpen: boolean;
  onClose: () => void;
  onBookSpot: (shelter: Shelter) => void;
}

export const ShelterDetailBottomSheet: React.FC<ShelterDetailBottomSheetProps> = ({
  shelter,
  distanceKm,
  isOpen,
  onClose,
  onBookSpot
}) => {
  if (!isOpen || !shelter) return null;

  const occupancyPercent = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);
  const estDriveMin = distanceKm ? Math.max(3, Math.round(distanceKm * 2.2)) : null;
  const estWalkMin = distanceKm ? Math.max(8, Math.round(distanceKm * 12)) : null;

  const handleBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    triggerHaptic([35, 25, 45]);
    onBookSpot(shelter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Container */}
      <div
        className="relative w-full max-w-xl bg-[#FFFFFF] dark:bg-[#0F172A] border-t sm:border-2 border-[#E2E8F0] dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl elevation-4 text-[#0F172A] dark:text-[#F8FAFC] max-h-[85vh] overflow-y-auto z-10 pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-shelter-title"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#E2E8F0] rounded-full" />
        </div>

        {/* Sheet Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top Bar with Status Badge & Close */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  shelter.status === 'AVAILABLE'
                    ? 'bg-[#059669] text-[#FFFFFF]'
                    : shelter.status === 'LIMITED'
                    ? 'bg-[#EA580C] text-[#FFFFFF]'
                    : 'bg-[#DC2626] text-[#FFFFFF]'
                }`}>
                  {shelter.status === 'AVAILABLE' ? 'AVAILABLE' : shelter.status === 'LIMITED' ? 'LIMITED BEDS' : 'AT CAPACITY'}
                </span>
                <span className="text-xs font-mono text-[#475569] font-medium">
                  {shelter.type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  shelter.ownership === 'Private' || shelter.isPrivate
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {shelter.ownership || (shelter.isPrivate ? 'Private' : 'Public')}
                </span>
              </div>
              <h2 id="sheet-shelter-title" className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight">
                {shelter.name}
              </h2>
              <p className="text-xs text-[#475569] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                <span>{shelter.address}, {shelter.city}</span>
              </p>
            </div>

            <button
              onClick={() => {
                triggerHaptic(20);
                onClose();
              }}
              className="p-2.5 rounded-full bg-[#F8FAFC] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] transition-colors cursor-pointer shrink-0"
              aria-label="Close shelter details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Distance & Travel Time Strip (if distance is provided) */}
          {distanceKm !== undefined && (
            <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl p-3 text-center">
              <div>
                <span className="text-[10px] text-[#475569] uppercase font-mono block font-bold">Distance</span>
                <span className="text-base font-black text-[#0F172A]">{distanceKm} km</span>
              </div>
              <div className="border-x-2 border-[#E2E8F0]">
                <span className="text-[10px] text-[#475569] uppercase font-mono block flex items-center justify-center gap-1 font-bold">
                  <Car className="w-3 h-3 text-[#0F172A]" /> Drive
                </span>
                <span className="text-base font-bold text-[#0F172A]">~{estDriveMin} min</span>
              </div>
              <div>
                <span className="text-[10px] text-[#475569] uppercase font-mono block flex items-center justify-center gap-1 font-bold">
                  <Footprints className="w-3 h-3 text-[#059669]" /> Walk
                </span>
                <span className="text-base font-bold text-[#059669]">~{estWalkMin} min</span>
              </div>
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#0F172A] flex items-center gap-1.5 font-bold">
                <Users className="w-4 h-4 text-[#0F172A]" />
                Live Capacity Status
              </span>
              <span className="font-mono text-[#0F172A] font-bold">
                {shelter.currentOccupancy} / {shelter.totalCapacity} ({occupancyPercent}%)
              </span>
            </div>
            
            <div className="w-full bg-[#E2E8F0] rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancyPercent > 90 ? 'bg-[#DC2626]' : occupancyPercent > 70 ? 'bg-[#EA580C]' : 'bg-[#059669]'
                }`}
                style={{ width: `${Math.min(100, occupancyPercent)}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#475569] pt-1 font-mono">
              <span>Available Beds: <strong className="text-[#059669] font-bold">{shelter.availableBeds}</strong></span>
              <span>Updated: {shelter.lastUpdated}</span>
            </div>
          </div>

          {/* Verified Amenities Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">
              Verified Relief Facilities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.medicalSupport ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#F8FAFC]/50 border-dashed border-[#E2E8F0] text-[#475569] line-through'
              }`}>
                <HeartPulse className="w-4 h-4 text-[#DC2626] shrink-0" />
                <span>Medical Care</span>
              </div>

              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.drinkingWater ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#F8FAFC]/50 border-dashed border-[#E2E8F0] text-[#475569] line-through'
              }`}>
                <Droplet className="w-4 h-4 text-[#059669] shrink-0" />
                <span>Clean Water</span>
              </div>

              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.foodAvailable ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#F8FAFC]/50 border-dashed border-[#E2E8F0] text-[#475569] line-through'
              }`}>
                <Utensils className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span>Hot Meals</span>
              </div>

              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.wheelchairAccessible ? 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]' : 'bg-[#F8FAFC]/50 border-dashed border-[#E2E8F0] text-[#475569] line-through'
              }`}>
                <Accessibility className="w-4 h-4 text-[#0F172A] shrink-0" />
                <span>Wheelchair</span>
              </div>
            </div>
          </div>

          {/* Aadhaar ID & Police Verification (Hidden by default with option to check it - User Request #7) */}
          <div className="pt-1">
            <ShelterVerificationBadge shelter={shelter} />
          </div>

          {/* Contact & Managing Authority */}
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border-2 border-[#E2E8F0] dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-[#475569] uppercase font-mono block font-bold">Managing Authority</span>
              <strong className="text-[#0F172A] font-black">{shelter.managingOrg}</strong>
              <span className="text-[#475569] block text-[11px] font-medium">Coord: {shelter.managerName}</span>
            </div>
            <a
              href={`tel:${shelter.phone}`}
              className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#FFFFFF] font-black flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Facility</span>
            </a>
          </div>

          {/* Primary Action Buttons: Directions (#FFFFFF outline) & Book Spot (#EA580C Signal Amber) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-full bg-[#FFFFFF] hover:bg-slate-50 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition-colors border-2 border-[#E2E8F0] cursor-pointer text-center"
            >
              <Navigation className="w-4 h-4 text-[#0F172A]" />
              <span>Open in Maps</span>
            </a>

            <button
              onClick={handleBook}
              disabled={shelter.status === 'FULL'}
              className={`w-full sm:w-1/2 py-3.5 px-6 rounded-full text-[#FFFFFF] text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl ripple-container ${
                shelter.status === 'FULL'
                  ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                  : 'clay-btn-signal bg-[#EA580C] hover:bg-[#C2410C]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{shelter.status === 'FULL' ? 'Shelter Full' : 'Book Spot at Shelter'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
