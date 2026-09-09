import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Bed, Phone, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { triggerHaptic } from '../utils/feedback';

interface QuickMetricsStripProps {
  onOpenSOS?: () => void;
}

export const QuickMetricsStrip: React.FC<QuickMetricsStripProps> = ({ onOpenSOS }) => {
  const { shelters, country } = useApp();

  const filteredShelters = shelters.filter(
    s => country === 'ALL' || s.country === country
  );

  const activeSheltersCount = filteredShelters.filter(s => s.status !== 'FULL').length;
  const totalBeds = filteredShelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const availableBeds = filteredShelters.reduce((acc, s) => acc + s.availableBeds, 0);

  return (
    <div
      id="quick-metrics-strip"
      className="w-full bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-sm py-3 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
        
        {/* Metric Card 1: Active Shelters */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#475569] block">
              Active Shelters
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
                {activeSheltersCount}
              </span>
              <span className="text-xs text-[#475569] font-medium">
                of {filteredShelters.length} Verified Facilities
              </span>
            </div>
          </div>
        </div>

        {/* Metric Card 2: Beds Available */}
        <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:pl-6">
          <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Bed className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#475569] block">
              Beds Available
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-[#059669]">
                {availableBeds.toLocaleString()}
              </span>
              <span className="text-xs text-[#475569] font-medium">
                / {totalBeds.toLocaleString()} Capacity
              </span>
            </div>
          </div>
        </div>

        {/* Metric Card 3: 24/7 Helpline */}
        <div className="flex items-center justify-between pt-2 sm:pt-0 sm:pl-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Phone className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#475569] block">
                Emergency Helpline
              </span>
              <div className="text-base sm:text-lg font-black text-[#0F172A] font-mono">
                {country === 'NPL' ? '1155 (Toll-Free)' : '112 (National)'}
              </div>
            </div>
          </div>

          <a
            href={country === 'NPL' ? 'tel:1155' : 'tel:112'}
            onClick={() => triggerHaptic([30, 20])}
            className="px-3.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
            title="Call Helpline Now"
          >
            <span>Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </a>
        </div>

      </div>
    </div>
  );
};
