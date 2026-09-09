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
import { useApp } from '../context/AppContext';

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
  const { t } = useApp();

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm transition-opacity animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Container */}
      <div
        className="relative w-full max-w-xl bg-[#FFFFFF] dark:bg-[#1E293B] border-t sm:border-2 border-[#E2E8F0] dark:border-[#334155] rounded-t-3xl sm:rounded-3xl shadow-2xl text-[#0F172A] dark:text-[#F8FAFC] max-h-[85vh] overflow-y-auto z-10 pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-shelter-title"
      >
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#E2E8F0] dark:bg-[#334155] rounded-full" />
        </div>

        {/* Sheet Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top Bar with Status Badge & Close */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  shelter.status === 'AVAILABLE'
                    ? 'bg-[#10B981] text-[#FFFFFF]'
                    : shelter.status === 'LIMITED'
                    ? 'bg-[#EA580C] text-[#FFFFFF]'
                    : 'bg-[#EF4444] text-[#FFFFFF]'
                }`}>
                  {shelter.status === 'AVAILABLE' ? t('vacantBeds') : shelter.status === 'LIMITED' ? t('limitedCapacity') : t('atCapacity')}
                </span>
                <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] font-medium">
                  {shelter.type}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  shelter.ownership === 'Private' || shelter.isPrivate
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                }`}>
                  {shelter.ownership || (shelter.isPrivate ? 'Private' : 'Public')}
                </span>
              </div>
              <h2 id="sheet-shelter-title" className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white leading-tight">
                {shelter.name}
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
                <span>{shelter.address}, {shelter.city}</span>
              </p>
            </div>

            <button
              onClick={() => {
                triggerHaptic(20);
                onClose();
              }}
              className="p-2.5 rounded-full bg-[#F8FAFC] dark:bg-[#0B1329] hover:bg-[#E2E8F0] dark:hover:bg-[#334155] text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#E2E8F0] dark:border-[#334155] transition-colors cursor-pointer shrink-0"
              aria-label="Close shelter details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Distance & Travel Time Strip (if distance is provided) */}
          {distanceKm !== undefined && (
            <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] dark:bg-[#0B1329] border-2 border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-3 text-center">
              <div>
                <span className="text-[10px] text-[#475569] dark:text-[#64748B] uppercase font-mono block font-bold">Distance</span>
                <span className="text-base font-black text-[#0F172A] dark:text-white">{distanceKm} km</span>
              </div>
              <div className="border-x-2 border-[#E2E8F0] dark:border-[#334155]">
                <span className="text-[10px] text-[#475569] dark:text-[#64748B] uppercase font-mono block flex items-center justify-center gap-1 font-bold">
                  <Car className="w-3 h-3 text-[#0F172A] dark:text-white" /> Drive
                </span>
                <span className="text-base font-bold text-[#0F172A] dark:text-white">~{estDriveMin} min</span>
              </div>
              <div>
                <span className="text-[10px] text-[#475569] dark:text-[#64748B] uppercase font-mono block flex items-center justify-center gap-1 font-bold">
                  <Footprints className="w-3 h-3 text-[#10B981]" /> Walk
                </span>
                <span className="text-base font-bold text-[#10B981]">~{estWalkMin} min</span>
              </div>
            </div>
          )}

          {/* Capacity Progress Bar */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B1329] border-2 border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#0F172A] dark:text-white flex items-center gap-1.5 font-bold">
                <Users className="w-4 h-4 text-[#EA580C]" />
                {t('capacityStatus')}
              </span>
              <span className="font-mono text-[#0F172A] dark:text-white font-bold">
                {shelter.currentOccupancy} / {shelter.totalCapacity} ({occupancyPercent}%)
              </span>
            </div>
            
            <div className="w-full bg-[#E2E8F0] dark:bg-[#334155] rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupancyPercent > 90 ? 'bg-[#EF4444]' : occupancyPercent > 70 ? 'bg-[#EA580C]' : 'bg-[#10B981]'
                }`}
                style={{ width: `${Math.min(100, occupancyPercent)}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#475569] dark:text-[#CBD5E1] pt-1 font-mono">
              <span>{t('vacantBeds')}: <strong className="text-[#10B981] font-bold">{shelter.availableBeds}</strong></span>
              <span>Updated: {shelter.lastUpdated}</span>
            </div>
          </div>

          {/* Verified Amenities Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
              {t('filterFeatures')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.medicalSupport ? 'bg-[#F8FAFC] dark:bg-[#0B1329] border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white' : 'bg-[#F8FAFC]/50 dark:bg-[#0B1329]/50 border-dashed border-[#E2E8F0] dark:border-[#334155] text-[#475569] line-through'
              }`}>
                <HeartPulse className="w-4 h-4 text-[#EF4444] shrink-0" />
                <span>{t('medicalSupport')}</span>
              </div>

              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.drinkingWater ? 'bg-[#F8FAFC] dark:bg-[#0B1329] border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white' : 'bg-[#F8FAFC]/50 dark:bg-[#0B1329]/50 border-dashed border-[#E2E8F0] dark:border-[#334155] text-[#475569] line-through'
              }`}>
                <Droplet className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>{t('drinkingWater')}</span>
              </div>

              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.foodAvailable ? 'bg-[#F8FAFC] dark:bg-[#0B1329] border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white' : 'bg-[#F8FAFC]/50 dark:bg-[#0B1329]/50 border-dashed border-[#E2E8F0] dark:border-[#334155] text-[#475569] line-through'
              }`}>
                <Utensils className="w-4 h-4 text-[#EA580C] shrink-0" />
                <span>{t('hotFood')}</span>
              </div>

              <div className={`p-2.5 rounded-xl border-2 flex items-center gap-2 text-xs font-bold ${
                shelter.facilities.wheelchairAccessible ? 'bg-[#F8FAFC] dark:bg-[#0B1329] border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white' : 'bg-[#F8FAFC]/50 dark:bg-[#0B1329]/50 border-dashed border-[#E2E8F0] dark:border-[#334155] text-[#475569] line-through'
              }`}>
                <Accessibility className="w-4 h-4 text-[#0F172A] dark:text-white shrink-0" />
                <span>{t('wheelchairAccessible')}</span>
              </div>
            </div>
          </div>

          {/* Aadhaar ID & Police Verification */}
          <div className="pt-1">
            <ShelterVerificationBadge shelter={shelter} />
          </div>

          {/* Contact & Managing Authority */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B1329] border-2 border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-[#475569] dark:text-[#64748B] uppercase font-mono block font-bold">Managing Authority</span>
              <strong className="text-[#0F172A] dark:text-white font-black">{shelter.managingOrg}</strong>
              <span className="text-[#475569] dark:text-[#CBD5E1] block text-[11px] font-medium">Coord: {shelter.managerName}</span>
            </div>
            <a
              href={`tel:${shelter.phone || shelter.contactPhone || '112'}`}
              className="px-4 py-2.5 rounded-xl bg-[#0F172A] dark:bg-[#1E293B] hover:bg-[#1E293B] dark:hover:bg-[#334155] border border-transparent dark:border-[#334155] text-[#FFFFFF] font-black flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('callHotline')}</span>
            </a>
          </div>

          {/* Primary Action Buttons: Directions & Book Centre in Advance */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-full bg-[#FFFFFF] dark:bg-[#0B1329] hover:bg-slate-50 dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border-2 border-[#E2E8F0] dark:border-[#334155] cursor-pointer text-center"
            >
              <Navigation className="w-4 h-4 text-[#0F172A] dark:text-white" />
              <span>{t('directions')}</span>
            </a>

            <button
              onClick={handleBook}
              disabled={shelter.status === 'FULL'}
              className={`w-full sm:w-1/2 py-3.5 px-6 rounded-full text-[#FFFFFF] text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xl ripple-container ${
                shelter.status === 'FULL'
                  ? 'bg-slate-700 opacity-60 cursor-not-allowed'
                  : 'bg-[#10B981] hover:bg-[#059669] border border-emerald-400/30'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{shelter.status === 'FULL' ? t('full') : t('bookCentreInAdvance')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
