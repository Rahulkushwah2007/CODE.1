import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  Building2,
  ExternalLink,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { AlertSeverity } from '../types';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, setSelectedShelterId, setCurrentTab } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterResolved, setFilterResolved] = useState<boolean>(false);

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    if (!filterResolved && a.resolved) return false;
    return true;
  });

  return (
    <div id="alert-center-view" className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#243656] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              TACTICAL EVENT LOG & NOTIFICATIONS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            Emergency Dispatch Alerts & Warnings
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="bg-[#111C30] border border-[#243656] rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-[#94A3B8] bg-[#111C30] border border-[#243656] px-3 py-1.5 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={filterResolved}
              onChange={e => setFilterResolved(e.target.checked)}
              className="rounded"
            />
            <span>Show Resolved</span>
          </label>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-8 text-center text-[#94A3B8] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-semibold text-white text-sm">All Operational Sectors Clear</p>
            <p className="text-xs text-[#94A3B8]">No unacknowledged critical alerts matching current filter.</p>
          </div>
        ) : (
          filteredAlerts.map(alt => {
            const isCrit = alt.severity === 'CRITICAL';

            return (
              <div
                key={alt.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  alt.resolved
                    ? 'bg-[#0A1120]/60 border-[#243656] opacity-60'
                    : isCrit
                    ? 'bg-rose-950/40 border-rose-500/70 shadow-lg'
                    : 'bg-[#111C30] border-[#243656]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        isCrit ? 'bg-rose-500 text-white' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {alt.severity}
                      </span>
                      <span className="text-xs font-mono text-blue-400 font-semibold">{alt.type} ALERT</span>
                      <span className="text-[11px] text-[#94A3B8] font-mono">
                        {new Date(alt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-sm sm:text-base mt-1">
                      {alt.shelterName}
                    </h3>
                    <p className="text-xs text-[#CBD5E1] leading-relaxed">{alt.message}</p>
                    {alt.actionRequired && (
                      <p className="text-xs text-amber-300 font-mono mt-1">
                        &rarr; Required Action: {alt.actionRequired}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        setSelectedShelterId(alt.shelterId);
                        setCurrentTab('shelter-detail');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-xs font-semibold"
                    >
                      View Facility
                    </button>

                    {!alt.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alt.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold"
                      >
                        Acknowledge
                      </button>
                    )}

                    {!alt.resolved ? (
                      <button
                        onClick={() => resolveAlert(alt.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 font-bold">Resolved</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Accordion for Secondary Early Warning Protocols */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Emergency Warning Standards &amp; Siren Protocols
        </h3>

        <div className="bg-[#111C30] border border-white/10 rounded-2xl overflow-hidden">
          <details className="group">
            <summary className="p-4 text-xs font-bold text-white hover:bg-[#182742] transition-colors cursor-pointer list-none flex items-center justify-between">
              <span>What do the Red, Amber, and Yellow bulletin levels signify?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-sm">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-white/5 leading-relaxed">
              <strong>RED (Critical):</strong> Immediate life-threat. Evacuate to highest elevation shelter within 30 minutes.<br />
              <strong>AMBER (High):</strong> Severe weather or flash flood warning within 6-12 hours. Prepare Go-Bag and vulnerable family members.<br />
              <strong>YELLOW (Medium):</strong> Watch advisory. Monitor Resqtech telemetry and radio broadcasts for updates.
            </div>
          </details>
        </div>

        <div className="bg-[#111C30] border border-white/10 rounded-2xl overflow-hidden">
          <details className="group">
            <summary className="p-4 text-xs font-bold text-white hover:bg-[#182742] transition-colors cursor-pointer list-none flex items-center justify-between">
              <span>How are false alarms or rumors filtered during disasters?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-sm">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-white/5 leading-relaxed">
              All alerts displayed in Resqtech are cryptographically signed by official State Disaster Management Authorities (SDMA / NDRF in India, NDMA in Nepal) before propagating to client devices.
            </div>
          </details>
        </div>
      </div>

    </div>
  );
};
