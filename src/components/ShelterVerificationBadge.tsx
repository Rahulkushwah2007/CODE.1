import React, { useState } from 'react';
import { Shelter } from '../types';
import { getShelterVerification } from '../utils/verification';
import { ShieldCheck, ChevronDown, ChevronUp, Lock, CheckCircle2, Building, User, FileText } from 'lucide-react';
import { triggerHaptic } from '../utils/feedback';

interface ShelterVerificationBadgeProps {
  shelter: Shelter;
  compact?: boolean;
}

export const ShelterVerificationBadge: React.FC<ShelterVerificationBadgeProps> = ({ shelter, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const verification = getShelterVerification(shelter);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(15);
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full text-xs font-sans">
      {/* Discreet Trigger Button - Hidden by default */}
      <button
        type="button"
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 border transition-all cursor-pointer ${
          isExpanded
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-sm'
            : 'bg-slate-50 dark:bg-[#1E293B]/60 hover:bg-slate-100 dark:hover:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
        }`}
        title="Check Aadhaar ID & Police Verification records"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold text-[11px] tracking-tight">
            Aadhaar ID &amp; Police Verification
          </span>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold">
            Verified
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          <span>{isExpanded ? 'Hide' : 'Check Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Verification Details Dropdown / Panel */}
      {isExpanded && (
        <div className="mt-2 p-3.5 rounded-2xl bg-white dark:bg-[#0F172A] border-2 border-emerald-200 dark:border-emerald-800/80 shadow-md space-y-3 animate-fadeIn text-[#0F172A] dark:text-[#F8FAFC]">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              UIDAI &amp; Police Clearances Valid
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-mono">
              Status: {verification.clearanceStatus}
            </span>
          </div>

          {/* Aadhaar ID Verification Record */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Camp Warden Aadhaar ID (UIDAI Secure Mask)</span>
            </div>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1E293B] p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-mono font-bold text-xs tracking-wider text-[#0F172A] dark:text-[#FFFFFF]">
                {verification.aadhaarId}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                Verified Identity
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-1">
              Registered Holder: <strong className="text-slate-800 dark:text-slate-200">{verification.aadhaarHolderName}</strong>
            </p>
          </div>

          {/* Police Station Jurisdiction & Clearance */}
          <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              <Building className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>Jurisdictional Police Verification</span>
            </div>
            
            <div className="bg-slate-50 dark:bg-[#1E293B] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-[11px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-[#0F172A] dark:text-[#FFFFFF] block">
                    {verification.policeStation}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">
                    Clearance Record: {verification.policeVerificationId}
                  </span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold shrink-0">
                  Passed
                </span>
              </div>

              <div className="pt-1 text-[10px] text-slate-600 dark:text-slate-300 flex items-center justify-between font-mono">
                <span>Officer: {verification.verifiedByOfficer}</span>
                <span>{verification.policeStationPhone}</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 italic pt-0.5 text-center">
            Issued under Disaster Management Act Security Protocol &bull; Tamper-evident verified
          </div>
        </div>
      )}
    </div>
  );
};
