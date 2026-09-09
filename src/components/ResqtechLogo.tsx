import React from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

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
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base', subtext: 'text-[9px]' },
    md: { box: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-lg', subtext: 'text-[10px]' },
    lg: { box: 'w-14 h-14', icon: 'w-7 h-7', text: 'text-2xl', subtext: 'text-xs' },
    hero: { box: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-3xl', subtext: 'text-sm' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`relative ${currentSize.box} rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-rose-600 p-[2px] shadow-lg shadow-blue-900/40 flex items-center justify-center shrink-0 ${
          breathing ? 'logo-breathing' : ''
        }`}
      >
        <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />
          
          {/* Logo Glyph */}
          <div className="relative flex items-center justify-center">
            <ShieldAlert className={`${currentSize.icon} text-[#EA580C] transition-transform`} />
            <Activity className="w-3 h-3 text-[#38BDF8] absolute -bottom-1 -right-1 stroke-[3]" />
          </div>
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
            <span className={`font-black tracking-wider text-[#0F172A] dark:text-[#FFFFFF] ${currentSize.text}`}>
              RESQTECH
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/30 font-bold uppercase tracking-wider">
              SAFE ZONES
            </span>
          </div>
          <p className={`${currentSize.subtext} text-slate-500 dark:text-slate-300 tracking-tight font-medium`}>
            Disaster Shelter &amp; Relief Operations
          </p>
        </div>
      )}
    </div>
  );
};
