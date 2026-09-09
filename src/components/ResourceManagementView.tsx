import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  Filter,
  Search,
  Droplet,
  Utensils,
  HeartPulse,
  Bed,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Boxes,
  MapPin
} from 'lucide-react';
import { ResourcePriority, ResourceRequestStatus, ResourceRequest } from '../types';
import { triggerHaptic } from '../utils/feedback';

export const ResourceManagementView: React.FC = () => {
  const {
    country,
    shelters,
    resourceRequests,
    updateResourceRequestStatus,
    createResourceRequest
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [newRequestModal, setNewRequestModal] = useState<boolean>(false);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // New Request Form State
  const countryShelters = useMemo(() => shelters.filter(s => s.country === country), [shelters, country]);
  const [selectedShelterId, setSelectedShelterId] = useState<string>(countryShelters[0]?.id || '');
  const [resName, setResName] = useState<string>('Potable Drinking Water');
  const [resQty, setResQty] = useState<number>(2000);
  const [resUnit, setResUnit] = useState<string>('Liters');
  const [resPriority, setResPriority] = useState<ResourcePriority>('HIGH');
  const [resNotes, setResNotes] = useState<string>('');

  // Shortage alerts across shelters
  const lowWaterShelters = countryShelters.filter(
    s => s.resources.drinkingWater.available < s.resources.drinkingWater.required * 0.4
  );
  const lowFoodShelters = countryShelters.filter(
    s => s.resources.foodRations.available < s.resources.foodRations.required * 0.4
  );
  const lowMedShelters = countryShelters.filter(
    s => s.resources.medicalKits.available < s.resources.medicalKits.required * 0.3
  );

  const filteredRequests = useMemo(() => {
    return resourceRequests.filter(r => {
      if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
      return true;
    });
  }, [resourceRequests, filterStatus]);

  const handleCreateRequest = () => {
    const sh = countryShelters.find(s => s.id === selectedShelterId);
    if (!sh) return;
    triggerHaptic([30, 20, 50]);
    createResourceRequest({
      shelterId: sh.id,
      shelterName: sh.name,
      resourceName: resName,
      quantity: resQty,
      unit: resUnit,
      priority: resPriority,
      requestedBy: 'Logistics Liaison Officer',
      notes: resNotes
    });
    setNewRequestModal(false);
    setResNotes('');
  };

  const getStatusBadge = (status: ResourceRequestStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Approved':
        return 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Dispatched':
        return 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'Delivered':
        return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
    }
  };

  return (
    <div id="resource-management-view" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-[#0F172A] dark:text-[#F8FAFC] transition-colors">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#EA580C]">
              EMERGENCY LOGISTICS & RELIEF CONVOYS
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-1">
            Resource Stockpile & Dispatch Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Real-time tracking of water tankers, ration kits, medical trauma supplies, and bedding dispatches across active disaster sectors.
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic(20);
            setNewRequestModal(true);
          }}
          className="px-5 py-3 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Supply Requisition</span>
        </button>
      </div>

      {/* Resource Shortage Detection Cards */}
      <div className="space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
          Detected Resource Deficits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className={`p-4 rounded-2xl border-2 transition-all ${
            lowWaterShelters.length > 0
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Droplet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>POTABLE WATER CRITICAL</span>
              </div>
              <p className="text-xs mt-1 font-semibold">
                {lowWaterShelters.length} Shelters with &lt;40% reserve
              </p>
              {lowWaterShelters.map(s => (
                <span key={s.id} className="block text-[11px] font-mono mt-0.5 opacity-90">&bull; {s.name}</span>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-2 transition-all ${
            lowFoodShelters.length > 0
              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Utensils className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>FOOD RATIONS SHORTAGE</span>
              </div>
              <p className="text-xs mt-1 font-semibold">
                {lowFoodShelters.length} Shelters with &lt;40% meal kits
              </p>
              {lowFoodShelters.map(s => (
                <span key={s.id} className="block text-[11px] font-mono mt-0.5 opacity-90">&bull; {s.name}</span>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-2 transition-all ${
            lowMedShelters.length > 0
              ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
              : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>MEDICAL DEPLETION</span>
              </div>
              <p className="text-xs mt-1 font-semibold">
                {lowMedShelters.length} Shelters with depleted first aid
              </p>
              {lowMedShelters.map(s => (
                <span key={s.id} className="block text-[11px] font-mono mt-0.5 opacity-90">&bull; {s.name}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Supply Pipeline Requisitions List - CLEANED UP & UNCLUTTERED (User Request #8) */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-md space-y-4 transition-colors">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#EA580C]" />
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white">Active Dispatch Pipeline</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {filteredRequests.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clean pipeline tracking: Pending &rarr; Approved &rarr; Dispatched &rarr; Delivered
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-bold">Filter:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-white dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-[#0F172A] dark:text-white font-medium focus:outline-none focus:border-[#EA580C]"
            >
              <option value="ALL">All States ({resourceRequests.length})</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved / Staged</option>
              <option value="Dispatched">En Route (Dispatched)</option>
              <option value="Delivered">Delivered & Verified</option>
            </select>
          </div>
        </div>

        {/* Clean, Scannable Table / List Rows */}
        <div className="space-y-2.5">
          {filteredRequests.map(req => {
            const isExpanded = expandedRequestId === req.id;

            return (
              <div
                key={req.id}
                className="bg-slate-50/70 dark:bg-[#1E293B]/60 hover:bg-slate-100/80 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Clean item summary */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                      className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                      title="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                          {req.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
                          req.priority === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {req.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                          {req.quantity.toLocaleString()} {req.unit} &bull; {req.resourceName}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#EA580C]" />
                        <span className="font-medium text-[#0F172A] dark:text-slate-200">{req.shelterName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action step button - single, clean, uncluttered action */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    {req.status === 'Pending' && (
                      <button
                        onClick={() => {
                          triggerHaptic(20);
                          updateResourceRequestStatus(req.id, 'Approved');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1"
                      >
                        <span>Approve Release</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {req.status === 'Approved' && (
                      <button
                        onClick={() => {
                          triggerHaptic(20);
                          updateResourceRequestStatus(req.id, 'Dispatched');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Convoy</span>
                      </button>
                    )}

                    {req.status === 'Dispatched' && (
                      <button
                        onClick={() => {
                          triggerHaptic([30, 20, 50]);
                          updateResourceRequestStatus(req.id, 'Delivered');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Handover</span>
                      </button>
                    )}

                    {req.status === 'Delivered' && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Collapsible Details - keeps pipeline clean unless needed */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5 pl-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] uppercase block">Requested By</span>
                        <span className="font-semibold">{req.requestedBy}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono text-[10px] uppercase block">Logged Timestamp</span>
                        <span className="font-mono">{new Date(req.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {req.notes && (
                      <div className="p-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic text-[11px]">
                        "{req.notes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW REQUEST MODAL */}
      {newRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#0F172A] dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base">New Emergency Supply Requisition</h3>
              <button
                onClick={() => setNewRequestModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Target Shelter</label>
                <select
                  value={selectedShelterId}
                  onChange={e => setSelectedShelterId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-[#0F172A] dark:text-white font-medium"
                >
                  {countryShelters.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Supply Item</label>
                <select
                  value={resName}
                  onChange={e => setResName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-[#0F172A] dark:text-white font-medium"
                >
                  <option value="Potable Drinking Water Tanker">Potable Drinking Water Tanker</option>
                  <option value="Dry Ration Emergency Kits">Dry Ration Emergency Kits</option>
                  <option value="Folding Canvas Cots">Folding Canvas Cots</option>
                  <option value="Paramedic Trauma Kits">Paramedic Trauma Kits</option>
                  <option value="Thermal Blankets">Thermal Blankets</option>
                  <option value="Sanitation Mobile Bio-Toilets">Sanitation Mobile Bio-Toilets</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={resQty}
                    onChange={e => setResQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2 text-[#0F172A] dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Unit</label>
                  <input
                    type="text"
                    value={resUnit}
                    onChange={e => setResUnit(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2 text-[#0F172A] dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Priority</label>
                <select
                  value={resPriority}
                  onChange={e => setResPriority(e.target.value as ResourcePriority)}
                  className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-[#0F172A] dark:text-white font-medium"
                >
                  <option value="CRITICAL">Critical (Immediate convoy dispatch)</option>
                  <option value="HIGH">High (Next logistics rotation)</option>
                  <option value="MEDIUM">Medium (Within 12 hours)</option>
                  <option value="LOW">Low (Replenishment)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Operational Notes</label>
                <input
                  type="text"
                  value={resNotes}
                  onChange={e => setResNotes(e.target.value)}
                  placeholder="e.g. Bridge washed out, use North bypass"
                  className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-[#0F172A] dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setNewRequestModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-xs shadow-md cursor-pointer transition-all"
              >
                Authorize & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accordions at the Bottom for Secondary Relief Info */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Relief Distribution Guidelines &amp; Logistics Protocols
        </h3>

        <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <details className="group">
            <summary className="p-4 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer list-none flex items-center justify-between">
              <span>What is the minimum potable water allocation per evacuee?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-sm">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
              Standard Sphere emergency benchmarks require 15 Liters total per person per day (including 3-5 Liters drinking water, with the remainder for food preparation and sanitation). Facilities with less than 40% threshold trigger high-priority convoy dispatch.
            </div>
          </details>
        </div>

        <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <details className="group">
            <summary className="p-4 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer list-none flex items-center justify-between">
              <span>How are cold-chain medical supplies (insulin, antivenom) transported?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-sm">▼</span>
            </summary>
            <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
              All temperature-sensitive medicines are routed via refrigerated mobile triage vans with solar-backup generators. Emergency air-drops by disaster response helicopters are deployed if road access is blocked by landslides or flooding.
            </div>
          </details>
        </div>
      </div>

    </div>
  );
};
