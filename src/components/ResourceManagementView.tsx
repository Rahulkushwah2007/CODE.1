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
  ShieldAlert
} from 'lucide-react';
import { ResourcePriority, ResourceRequestStatus, ResourceRequest } from '../types';

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
  };

  return (
    <div id="resource-management-view" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              EMERGENCY LOGISTICS & RELIEF CONVOYS
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
            Resource Stockpile & Dispatch Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
            Real-time tracking of water tankers, ration kits, medical trauma supplies, and bedding dispatches across active disaster sectors.
          </p>
        </div>

        <button
          onClick={() => setNewRequestModal(true)}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Supply Requisition</span>
        </button>
      </div>

      {/* 13. Resource Shortage Detection Cards */}
      <div className="space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
          Detected Resource Deficits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className={`p-4 rounded-2xl border flex items-start justify-between ${
            lowWaterShelters.length > 0 ? 'bg-[#182742] border-blue-500/50 text-blue-300' : 'bg-[#111C30] border-[#243656] text-[#94A3B8]'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Droplet className="w-4 h-4 text-blue-400" />
                <span>POTABLE WATER CRITICAL</span>
              </div>
              <p className="text-xs mt-1 text-[#CBD5E1]">
                {lowWaterShelters.length} Shelters with &lt;40% reserve
              </p>
              {lowWaterShelters.map(s => (
                <span key={s.id} className="block text-[11px] text-blue-300 font-mono mt-0.5">&bull; {s.name}</span>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-start justify-between ${
            lowFoodShelters.length > 0 ? 'bg-amber-950/40 border-amber-500/50 text-amber-200' : 'bg-[#111C30] border-[#243656] text-[#94A3B8]'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>FOOD RATIONS SHORTAGE</span>
              </div>
              <p className="text-xs mt-1 text-[#CBD5E1]">
                {lowFoodShelters.length} Shelters with &lt;40% meal kits
              </p>
              {lowFoodShelters.map(s => (
                <span key={s.id} className="block text-[11px] text-amber-300 font-mono mt-0.5">&bull; {s.name}</span>
              ))}
            </div>
          </div>

          <div className={`p-4 rounded-2xl border flex items-start justify-between ${
            lowMedShelters.length > 0 ? 'bg-rose-950/40 border-rose-500/50 text-rose-200' : 'bg-[#111C30] border-[#243656] text-[#94A3B8]'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <span>MEDICAL / TRIAGE DEPLETION</span>
              </div>
              <p className="text-xs mt-1 text-[#CBD5E1]">
                {lowMedShelters.length} Shelters with depleted first aid
              </p>
              {lowMedShelters.map(s => (
                <span key={s.id} className="block text-[11px] text-rose-300 font-mono mt-0.5">&bull; {s.name}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Supply Pipeline Requisitions List */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243656]">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">Active Dispatch Pipeline</h2>
            <p className="text-xs text-[#94A3B8]">Order tracking: Pending &rarr; Approved &rarr; Dispatched &rarr; Delivered</p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#94A3B8] font-mono">Filter:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="ALL">All States</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved / Staging</option>
              <option value="Dispatched">Dispatched (En Route)</option>
              <option value="Delivered">Delivered & Verified</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRequests.map(req => {
            let badgeColor = 'bg-[#182742] text-[#CBD5E1] border-[#243656]';
            if (req.status === 'Pending') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            if (req.status === 'Approved') badgeColor = 'bg-blue-600/20 text-blue-300 border-blue-500/40';
            if (req.status === 'Dispatched') badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse';
            if (req.status === 'Delivered') badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';

            return (
              <div
                key={req.id}
                className="bg-[#0A1120] border border-[#243656] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-300">{req.id}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${badgeColor}`}>
                      {req.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      req.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-[#182742] text-[#94A3B8]'
                    }`}>
                      {req.priority} PRIORITY
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm">
                    {req.quantity} {req.unit} &bull; {req.resourceName}
                  </h3>
                  
                  <p className="text-xs text-[#94A3B8]">
                    Destination: <strong className="text-[#F8FAFC]">{req.shelterName}</strong> &bull; Req by: {req.requestedBy}
                  </p>
                  {req.notes && <p className="text-[11px] text-[#94A3B8] italic mt-0.5">"{req.notes}"</p>}
                </div>

                {/* State Progress Flow Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'Pending' && (
                    <button
                      onClick={() => updateResourceRequestStatus(req.id, 'Approved')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs cursor-pointer"
                    >
                      Approve Release
                    </button>
                  )}

                  {req.status === 'Approved' && (
                    <button
                      onClick={() => updateResourceRequestStatus(req.id, 'Dispatched')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Convoy</span>
                    </button>
                  )}

                  {req.status === 'Dispatched' && (
                    <button
                      onClick={() => updateResourceRequestStatus(req.id, 'Delivered')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Handover</span>
                    </button>
                  )}

                  {req.status === 'Delivered' && (
                    <span className="text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivered at Shelter</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW REQUEST MODAL */}
      {newRequestModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#243656] pb-3">
              <h3 className="font-bold text-white text-base">New Emergency Supply Requisition</h3>
              <button onClick={() => setNewRequestModal(false)} className="text-[#94A3B8] text-lg font-bold">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Target Shelter</label>
                <select
                  value={selectedShelterId}
                  onChange={e => setSelectedShelterId(e.target.value)}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2.5 text-white"
                >
                  {countryShelters.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Supply Item</label>
                <select
                  value={resName}
                  onChange={e => setResName(e.target.value)}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2.5 text-white"
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
                  <label className="text-[#94A3B8] block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={resQty}
                    onChange={e => setResQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] block mb-1">Unit</label>
                  <input
                    type="text"
                    value={resUnit}
                    onChange={e => setResUnit(e.target.value)}
                    className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Priority</label>
                <select
                  value={resPriority}
                  onChange={e => setResPriority(e.target.value as ResourcePriority)}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2.5 text-white"
                >
                  <option value="CRITICAL">Critical (Immediate convoy dispatch)</option>
                  <option value="HIGH">High (Next logistics rotation)</option>
                  <option value="MEDIUM">Medium (Within 12 hours)</option>
                  <option value="LOW">Low (Replenishment)</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Operational Notes</label>
                <input
                  type="text"
                  value={resNotes}
                  onChange={e => setResNotes(e.target.value)}
                  placeholder="e.g. Bridge washed out, use North bypass"
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2.5 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#243656]">
              <button
                onClick={() => setNewRequestModal(false)}
                className="px-4 py-2 rounded-xl bg-[#182742] text-[#CBD5E1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg"
              >
                Authorize & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
