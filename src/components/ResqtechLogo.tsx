import React from 'react';

const resqtechLogoImg = '/resqtech-logo.jpg';

interface ResqtechLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  breathing?: boolean;
  showText?: boolean;
}

export const ResqtechLogo: React.FC<ResqtechLogoProps> = ({
  className = '',
  size = 'md',
  breathing = false,
  showText = false
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', rounded: 'rounded-xl', text: 'text-base', subtext: 'text-[9px]' },
    md: { box: 'w-10 h-10', rounded: 'rounded-2xl', text: 'text-lg', subtext: 'text-[10px]' },
    lg: { box: 'w-14 h-14', rounded: 'rounded-2xl', text: 'text-2xl', subtext: 'text-xs' },
    hero: { box: 'w-20 h-20', rounded: 'rounded-3xl', text: 'text-3xl', subtext: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${currentSize.box} ${currentSize.rounded} p-[2px] bg-gradient-to-br from-[#38BDF8] via-[#2563EB] to-[#EA580C] shadow-lg shadow-[#0B1329]/80 flex items-center justify-center shrink-0 overflow-hidden ${
          breathing ? 'logo-breathing ring-2 ring-[#EA580C]/60' : ''
        }`}
      >
        <div className={`w-full h-full ${currentSize.rounded} overflow-hidden bg-[#0B1329] flex items-center justify-center relative shadow-inner`}>
          <img
            src={resqtechLogoImg}
            alt="RESQTECH Shield & Hand Rescue Logo"
            className="w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Live Indicator Pill */}
        {breathing && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA580C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EA580C] border border-[#0F172A]"></span>
          </span>
        )}
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-wider text-[#FFFFFF] ${currentSize.text}`}>
              RESQTECH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/30 font-bold uppercase tracking-wider">
              SAFE ZONES
            </span>
          </div>
          <p className={`${currentSize.subtext} text-[#CBD5E1] tracking-tight font-medium`}>
            Disaster Shelter &amp; Relief Operations
          </p>
        </div>
      )}
    </div>
  );
};

