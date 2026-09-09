import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ShieldAlert, Navigation, ArrowRight, Loader2, Radio } from 'lucide-react';
import { triggerHaptic, handleRipple, calculateDistanceKm } from '../utils/feedback';
import { Shelter } from '../types';

interface EmergencyFABProps {
  onOpenShelter: (shelter: Shelter, distanceKm: number) => void;
}

export const EmergencyFAB: React.FC<EmergencyFABProps> = ({ onOpenShelter }) => {
  const { shelters, country } = useApp();
  const [isFinding, setIsFinding] = useState<boolean>(false);

  const handleImmediateAccess = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleRipple(e);
    // Strong emergency haptic buzz [50ms vibration, 30ms pause, 70ms vibration]
    triggerHaptic([50, 30, 70]);
    setIsFinding(true);

    // Get current position or use central coordinates for disaster zone
    const findNearest = (userLat: number, userLng: number) => {
      const activeShelters = shelters.filter(s =>
        (country === 'ALL' || s.country === country) && s.status !== 'FULL'
      );

      if (activeShelters.length === 0) {
        setIsFinding(false);
        return;
      }

      let nearest = activeShelters[0];
      let minDistance = calculateDistanceKm(userLat, userLng, nearest.lat, nearest.lng);

      for (let i = 1; i < activeShelters.length; i++) {
        const d = calculateDistanceKm(userLat, userLng, activeShelters[i].lat, activeShelters[i].lng);
        if (d < minDistance) {
          minDistance = d;
          nearest = activeShelters[i];
        }
      }

      setTimeout(() => {
        setIsFinding(false);
        onOpenShelter(nearest, minDistance);
      }, 300);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          findNearest(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to primary disaster emergency center
          const fallbackLat = country === 'NPL' ? 27.7172 : 23.0225;
          const fallbackLng = country === 'NPL' ? 85.3240 : 72.5714;
          findNearest(fallbackLat, fallbackLng);
        },
        { timeout: 4000, maximumAge: 30000 }
      );
    } else {
      findNearest(23.0225, 72.5714);
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-24 lg:bottom-8 right-4 sm:right-6 z-50 flex items-center justify-end pb-safe pr-safe pointer-events-none">
      <div className="pointer-events-auto">
        <button
          id="emergency-nearby-fab"
          onClick={handleImmediateAccess}
          disabled={isFinding}
          className="group relative flex items-center gap-3 px-6 py-4 sm:px-7 sm:py-4.5 rounded-full clay-btn-signal text-white shadow-2xl elevation-4 cursor-pointer font-black text-sm sm:text-base tracking-wide uppercase fab-radar ripple-container border-2 border-white/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
          aria-label="Immediate Access to Nearby Shelter"
          title="Emergency 1-Tap Access to Nearest Verified Disaster Shelter"
        >
          {/* Beacon pulse icon */}
          <div className="relative flex items-center justify-center">
            {isFinding ? (
              <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-white" />
            ) : (
              <>
                <Radio className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
              </>
            )}
          </div>

          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-amber-100 uppercase opacity-95">
              {isFinding ? 'LOCATING GPS...' : 'SOS EMERGENCY'}
            </span>
            <span className="text-sm sm:text-base font-black text-white tracking-tight drop-shadow">
              Nearby Shelter
            </span>
          </div>

          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/30 text-white ml-1">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </div>
  );
};
