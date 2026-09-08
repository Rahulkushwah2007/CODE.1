import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Bed,
  Utensils,
  Droplet,
  HeartPulse,
  Package,
  Layers,
  Phone,
  Mail,
  AlertTriangle,
  Plus,
  Minus,
  RefreshCw,
  Send,
  Edit2,
  CheckCircle2,
  Power,
  Sparkles
} from 'lucide-react';
import { Shelter, ResourcePriority } from '../types';

export const ShelterManagerDashboard: React.FC = () => {
  const {
    country,
    shelters,
    selectedShelterId,
    setSelectedShelterId,
    updateShelterOccupancy,
    setShelterOccupancy,
    updateShelterResource,
    createResourceRequest
  } = useApp();

  const countryShelters = shelters.filter(s => s.country === country);

  // Fallback to first shelter if none selected
  const activeShelter =
    countryShelters.find(s => s.id === selectedShelterId) || countryShelters[0] || shelters[0];

  // Manual occupancy override input
  const [manualOccupancy, setManualOccupancy] = useState<number>(activeShelter?.currentOccupancy || 0);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  // Resource Update Modal
  const [editingResourceKey, setEditingResourceKey] = useState<keyof Shelter['resources'] | null>(null);
  const [editResourceValue, setEditResourceValue] = useState<number>(0);

  // Supply Request Modal
  const [requestingResourceKey, setRequestingResourceKey] = useState<string | null>(null);
  const [requestQty, setRequestQty] = useState<number>(100);
  const [requestPriority, setRequestPriority] = useState<ResourcePriority>('HIGH');
  const [requestNotes, setRequestNotes] = useState<string>('');

  if (!activeShelter) {
    return (
      <div className="p-8 text-center text-[#94A3B8]">
        No active shelters available for {country}.
      </div>
    );
  }

  const occupancyRatio =
    activeShelter.totalCapacity > 0 ? activeShelter.currentOccupancy / activeShelter.totalCapacity : 0;
  const occupancyPct = Math.round(occupancyRatio * 100);

  // Helper for resource status
  const getResourceStatus = (avail: number, req: number) => {
    if (req <= 0) return { label: 'OPTIMAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    const pct = (avail / req) * 100;
    if (pct < 20) return { label: 'CRITICAL', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40 animate-pulse' };
    if (pct < 60) return { label: 'LOW', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
    return { label: 'SUFFICIENT', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  };

  const handleOpenEditResource = (key: keyof Shelter['resources']) => {
    setEditingResourceKey(key);
    setEditResourceValue(activeShelter.resources[key].available);
  };

  const handleSaveResource = () => {
    if (editingResourceKey) {
      updateShelterResource(activeShelter.id, editingResourceKey, editResourceValue);
      setEditingResourceKey(null);
    }
  };

  const handleOpenSupplyRequest = (resourceName: string, defaultQty: number) => {
    setRequestingResourceKey(resourceName);
    setRequestQty(defaultQty);
    setRequestPriority('HIGH');
    setRequestNotes('');
  };

  const handleSubmitSupplyRequest = () => {
    if (requestingResourceKey) {
      createResourceRequest({
        shelterId: activeShelter.id,
        shelterName: activeShelter.name,
        resourceName: requestingResourceKey,
        quantity: requestQty,
        unit: 'units',
        priority: requestPriority,
        requestedBy: `${activeShelter.managerName} (${activeShelter.managerRole})`,
        notes: requestNotes
      });
      setRequestingResourceKey(null);
    }
  };

  return (
    <div id="shelter-manager-dashboard" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Top Shelter Switcher & Header */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#243656]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                SHELTER MANAGER WORKSTATION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {activeShelter.name}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Facility ID: <span className="font-mono text-blue-300">{activeShelter.id}</span> &bull; {activeShelter.address}, {activeShelter.city}
            </p>
          </div>

          {/* Shelter Selector dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#94A3B8] font-mono hidden sm:inline">Switch Shelter:</label>
            <select
              value={activeShelter.id}
              onChange={e => {
                setSelectedShelterId(e.target.value);
                const s = shelters.find(item => item.id === e.target.value);
                if (s) setManualOccupancy(s.currentOccupancy);
              }}
              className="bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none focus:border-blue-500 font-medium"
            >
              {countryShelters.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Manager Banner Info */}
        <div className="flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-[#CBD5E1] font-semibold">Camp Warden: {activeShelter.managerName}</span>
            <span className="text-[#94A3B8]">({activeShelter.managerRole})</span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-[#94A3B8]">Status:</span>
            <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${
              activeShelter.status === 'CRITICAL' || activeShelter.status === 'FULL'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : activeShelter.status === 'LIMITED'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {activeShelter.status}
            </span>
            <span className="text-[#94A3B8] text-[11px]">&bull; Updated: {activeShelter.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Top Metric Cards (Capacity, Occupancy, Available, %) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-mono uppercase text-[#94A3B8] block">TOTAL CAPACITY</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-white">{activeShelter.totalCapacity}</span>
            <Building2 className="w-5 h-5 text-[#94A3B8]" />
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Approved max beds</span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-mono uppercase text-[#94A3B8] block">CURRENT OCCUPANCY</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-white">{activeShelter.currentOccupancy}</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Verified registered</span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-mono uppercase text-[#94A3B8] block">AVAILABLE BEDS</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-emerald-400">{activeShelter.availableBeds}</span>
            <Bed className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] text-emerald-500/80 font-mono mt-0.5 block">Immediate intake buffer</span>
        </div>

        <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-mono uppercase text-[#94A3B8] block">OCCUPANCY %</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className={`text-3xl font-black font-mono ${
              occupancyPct >= 90 ? 'text-rose-400' : occupancyPct >= 70 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {occupancyPct}%
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              occupancyPct >= 90 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {activeShelter.status}
            </span>
          </div>
          <span className="text-[11px] text-[#94A3B8] font-mono mt-0.5 block">Load factor</span>
        </div>
      </div>

      {/* Large Visual Occupancy Indicator & Live Controls */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
              LIVE CAPACITY OCCUPANCY MONITOR
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-5xl font-black font-mono text-white">
                {activeShelter.currentOccupancy} <span className="text-[#94A3B8] text-2xl sm:text-3xl">/ {activeShelter.totalCapacity}</span>
              </span>
              <span className={`text-2xl sm:text-4xl font-black font-mono ${
                occupancyPct >= 90 ? 'text-rose-400' : occupancyPct >= 70 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {occupancyPct}%
              </span>
              <span className={`px-3 py-1 rounded-full font-bold font-mono text-xs uppercase ${
                occupancyPct >= 90
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {activeShelter.status}
              </span>
            </div>
          </div>

          {/* Quick Counter Controls: [+ ADD PERSON], [- REMOVE PERSON] */}
          <div className="flex items-center gap-2">
            <button
              id="btn-remove-person"
              onClick={() => updateShelterOccupancy(activeShelter.id, -1)}
              disabled={activeShelter.currentOccupancy <= 0}
              className="px-4 py-2.5 rounded-xl bg-[#182742] hover:bg-[#243656] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
              <span>REMOVE PERSON</span>
            </button>

            <button
              id="btn-add-person"
              onClick={() => updateShelterOccupancy(activeShelter.id, 1)}
              disabled={activeShelter.currentOccupancy >= activeShelter.totalCapacity}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>ADD PERSON</span>
            </button>

            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="p-2.5 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] transition-colors"
              title="Manual Set Occupancy"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live-looking occupancy progress bar */}
        <div className="space-y-1.5">
          <div className="w-full h-5 bg-[#0A1120] rounded-full p-1 border border-[#243656] overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyPct >= 90
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600'
                  : occupancyPct >= 70
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, occupancyPct)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>0 Vacant</span>
            <span>70% Alert Threshold</span>
            <span>90% Critical Redirect</span>
            <span>{activeShelter.totalCapacity} Max</span>
          </div>
        </div>

        {/* Manual Direct Occupancy Edit Box */}
        {showManualInput && (
          <div className="bg-[#0A1120] p-4 rounded-2xl border border-blue-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[#CBD5E1] font-semibold">Set Exact Intake Count:</span>
              <input
                type="number"
                value={manualOccupancy}
                onChange={e => setManualOccupancy(Math.max(0, Math.min(activeShelter.totalCapacity, parseInt(e.target.value) || 0)))}
                className="w-24 bg-[#111C30] border border-[#243656] rounded-lg px-2.5 py-1.5 text-white font-mono text-center font-bold"
              />
              <span className="text-[#94A3B8]">/ {activeShelter.totalCapacity} Total</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShelterOccupancy(activeShelter.id, manualOccupancy);
                  setShowManualInput(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs"
              >
                UPDATE OCCUPANCY
              </button>
              <button
                onClick={() => setShowManualInput(false)}
                className="px-3 py-1.5 rounded-lg bg-[#182742] text-[#94A3B8] hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resource Cards (Beds, Food, Water, Medical, Blankets, Hygiene, Toilets, Power) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white">Shelter Resource Inventories</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Live consumption buffers & supplier dispatch requests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Beds */}
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-blue-400" />
                  <span>Beds / Cots</span>
                </span>
                {(() => {
                  const r = activeShelter.resources.beds;
                  const st = getResourceStatus(r.available, r.required);
                  return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${st.color}`}>{st.label}</span>;
                })()}
              </div>
              <div className="mt-2 text-xs font-mono text-[#CBD5E1]">
                <div>Available: <strong className="text-white">{activeShelter.resources.beds.available}</strong> {activeShelter.resources.beds.unit}</div>
                <div>Required: <strong className="text-[#94A3B8]">{activeShelter.resources.beds.required}</strong> {activeShelter.resources.beds.unit}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#243656] text-xs">
              <button
                onClick={() => handleOpenEditResource('beds')}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-center font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => handleOpenSupplyRequest('Folding Beds', 50)}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-center font-semibold"
              >
                Request Supply
              </button>
            </div>
          </div>

          {/* Clean Water */}
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-blue-400" />
                  <span>Clean Potable Water</span>
                </span>
                {(() => {
                  const r = activeShelter.resources.drinkingWater;
                  const st = getResourceStatus(r.available, r.required);
                  return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${st.color}`}>{st.label}</span>;
                })()}
              </div>
              <div className="mt-2 text-xs font-mono text-[#CBD5E1]">
                <div>Available: <strong className="text-white">{activeShelter.resources.drinkingWater.available}</strong> {activeShelter.resources.drinkingWater.unit}</div>
                <div>Required: <strong className="text-[#94A3B8]">{activeShelter.resources.drinkingWater.required}</strong> {activeShelter.resources.drinkingWater.unit}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#243656] text-xs">
              <button
                onClick={() => handleOpenEditResource('drinkingWater')}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-center font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => handleOpenSupplyRequest('Potable Water Tanker', 3000)}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-center font-semibold"
              >
                Request Supply
              </button>
            </div>
          </div>

          {/* Food / Rations */}
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>Food / Ration Kits</span>
                </span>
                {(() => {
                  const r = activeShelter.resources.foodRations;
                  const st = getResourceStatus(r.available, r.required);
                  return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${st.color}`}>{st.label}</span>;
                })()}
              </div>
              <div className="mt-2 text-xs font-mono text-[#CBD5E1]">
                <div>Available: <strong className="text-white">{activeShelter.resources.foodRations.available}</strong> {activeShelter.resources.foodRations.unit}</div>
                <div>Required: <strong className="text-[#94A3B8]">{activeShelter.resources.foodRations.required}</strong> {activeShelter.resources.foodRations.unit}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#243656] text-xs">
              <button
                onClick={() => handleOpenEditResource('foodRations')}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-center font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => handleOpenSupplyRequest('Ration Kits', 200)}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-center font-semibold"
              >
                Request Supply
              </button>
            </div>
          </div>

          {/* Medical Kits */}
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  <span>Medical / Trauma Kits</span>
                </span>
                {(() => {
                  const r = activeShelter.resources.medicalKits;
                  const st = getResourceStatus(r.available, r.required);
                  return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${st.color}`}>{st.label}</span>;
                })()}
              </div>
              <div className="mt-2 text-xs font-mono text-[#CBD5E1]">
                <div>Available: <strong className="text-white">{activeShelter.resources.medicalKits.available}</strong> {activeShelter.resources.medicalKits.unit}</div>
                <div>Required: <strong className="text-[#94A3B8]">{activeShelter.resources.medicalKits.required}</strong> {activeShelter.resources.medicalKits.unit}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#243656] text-xs">
              <button
                onClick={() => handleOpenEditResource('medicalKits')}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-center font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => handleOpenSupplyRequest('Trauma & First Aid Kits', 25)}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-center font-semibold"
              >
                Request Supply
              </button>
            </div>
          </div>

          {/* Blankets */}
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-purple-400" />
                  <span>Blankets & Linens</span>
                </span>
                {(() => {
                  const r = activeShelter.resources.blankets;
                  const st = getResourceStatus(r.available, r.required);
                  return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${st.color}`}>{st.label}</span>;
                })()}
              </div>
              <div className="mt-2 text-xs font-mono text-[#CBD5E1]">
                <div>Available: <strong className="text-white">{activeShelter.resources.blankets.available}</strong> {activeShelter.resources.blankets.unit}</div>
                <div>Required: <strong className="text-[#94A3B8]">{activeShelter.resources.blankets.required}</strong> {activeShelter.resources.blankets.unit}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#243656] text-xs">
              <button
                onClick={() => handleOpenEditResource('blankets')}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-[#CBD5E1] text-center font-semibold"
              >
                Update
              </button>
              <button
                onClick={() => handleOpenSupplyRequest('Thermal Blankets', 150)}
                className="py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-center font-semibold"
              >
                Request Supply
              </button>
            </div>
          </div>

          {/* Toilets & Power Status */}
          <div className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Power className="w-4 h-4 text-emerald-400" />
                  <span>Sanitation & Power Backup</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <div className="mt-2 text-xs font-mono text-[#CBD5E1] space-y-1">
                <div>Functional Toilets: <strong className="text-white">{activeShelter.facilities.toilets} Units</strong></div>
                <div>Generator Power: <strong className="text-emerald-400">{activeShelter.facilities.powerBackup ? 'Active Diesel Gen' : 'Grid Only'}</strong></div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#243656] text-xs flex justify-end">
              <button
                onClick={() => handleOpenSupplyRequest('Mobile Bio-Toilets', 5)}
                className="w-full py-1 px-2 rounded-lg bg-[#182742] hover:bg-[#243656] text-blue-400 border border-[#243656] text-center font-semibold"
              >
                Request Sanitation Unit
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 14. Shelter Manager Information Card (Exact Prompt Specification) */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono">
          WHO MANAGES THIS SHELTER?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656]">
            <span className="text-[#94A3B8] block mb-1">Managing Organization</span>
            <strong className="text-white font-sans text-sm block">{activeShelter.managingOrg}</strong>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">Government / Humanitarian Lead</span>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656]">
            <span className="text-[#94A3B8] block mb-1">Shelter Manager</span>
            <strong className="text-white font-sans text-sm block">{activeShelter.managerName}</strong>
            <span className="text-[11px] text-blue-400 mt-1 block">{activeShelter.managerRole}</span>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656]">
            <span className="text-[#94A3B8] block mb-1">Contact Hotline</span>
            <strong className="text-white font-mono text-sm block">{activeShelter.phone}</strong>
            <a href={`tel:${activeShelter.phone}`} className="text-[11px] text-emerald-400 hover:underline mt-1 block">
              Call Direct &rarr;
            </a>
          </div>

          <div className="bg-[#0A1120] p-4 rounded-2xl border border-[#243656]">
            <span className="text-[#94A3B8] block mb-1">Emergency Coordinator</span>
            <strong className="text-white font-sans text-sm block">{activeShelter.emergencyCoordinator}</strong>
            <span className="text-[11px] text-[#94A3B8] mt-1 block">Apex Disaster Authority</span>
          </div>
        </div>
      </div>

      {/* EDIT RESOURCE MODAL */}
      {editingResourceKey && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Update Inventory: {editingResourceKey}
            </h3>
            <div>
              <label className="text-xs text-[#94A3B8] block mb-1">Current In-Stock Quantity</label>
              <input
                type="number"
                value={editResourceValue}
                onChange={e => setEditResourceValue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingResourceKey(null)}
                className="px-4 py-2 rounded-xl bg-[#182742] text-[#CBD5E1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResource}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-600 text-white font-bold text-xs"
              >
                Save Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLY REQUEST MODAL */}
      {requestingResourceKey && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#243656] pb-3">
              <h3 className="text-base font-bold text-white">
                Request Supply: {requestingResourceKey}
              </h3>
              <button onClick={() => setRequestingResourceKey(null)} className="text-[#94A3B8] text-lg font-bold">
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Target Facility</label>
                <input
                  type="text"
                  disabled
                  value={activeShelter.name}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    value={requestQty}
                    onChange={e => setRequestQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-[#94A3B8] block mb-1">Dispatch Priority</label>
                  <select
                    value={requestPriority}
                    onChange={e => setRequestPriority(e.target.value as ResourcePriority)}
                    className="w-full bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="CRITICAL">Critical (Urgent)</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Operational Notes / Reason</label>
                <textarea
                  value={requestNotes}
                  onChange={e => setRequestNotes(e.target.value)}
                  placeholder="e.g. Surge in elderly patients, borewell water cloudy..."
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2.5 text-[#F8FAFC] text-xs h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#243656]">
              <button
                onClick={() => setRequestingResourceKey(null)}
                className="px-4 py-2 rounded-xl bg-[#182742] text-[#CBD5E1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSupplyRequest}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg"
              >
                Submit Supply Requisition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
