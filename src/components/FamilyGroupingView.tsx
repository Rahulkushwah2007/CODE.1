import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  ArrowRightLeft,
  ShieldCheck,
  HeartPulse,
  Baby,
  Building2,
  Phone,
  AlertCircle,
  FileCheck,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { Family } from '../types';

export const FamilyGroupingView: React.FC = () => {
  const { families, shelters, country, transferFamily, setCurrentTab, setSelectedShelterId } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Transfer modal
  const [transferringFamily, setTransferringFamily] = useState<Family | null>(null);
  const [targetShelterId, setTargetShelterId] = useState<string>('');

  const countryShelters = useMemo(() => {
    return shelters.filter(s => country === 'ALL' || s.country === country);
  }, [shelters, country]);

  const filteredFamilies = useMemo(() => {
    return families.filter(f => {
      if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          f.headOfFamily.toLowerCase().includes(q) ||
          f.id.toLowerCase().includes(q) ||
          f.mobile.includes(q)
        );
      }
      return true;
    });
  }, [families, filterStatus, searchTerm]);

  const handleExecuteTransfer = () => {
    if (!transferringFamily || !targetShelterId) return;
    transferFamily(transferringFamily.id, targetShelterId);
    setTransferringFamily(null);
    setTargetShelterId('');
  };

  return (
    <div id="family-grouping-view" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Header */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
              PROTECTION & REUNIFICATION DESK
            </span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
            Family Unit Registry & Inter-Shelter Transfer
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl">
            Strict Non-Separation Protocol: Families, dependents, and medical caregivers are sheltered as intact units in designated family bays.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('intake')}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Family</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111C30]/80 border border-[#243656] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Family ID, Head, Phone..."
            className="w-full pl-9 pr-3 py-2 bg-[#0A1120] border border-[#243656] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline">Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-[#0A1120] border border-[#243656] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Sheltered">Sheltered (Confirmed)</option>
            <option value="In Transit">In Transit</option>
            <option value="Relocated">Relocated</option>
            <option value="Departed">Departed</option>
          </select>
          <span className="text-xs font-mono text-blue-300 ml-2">
            {filteredFamilies.length} Families
          </span>
        </div>
      </div>

      {/* Family Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFamilies.map(fam => {
          const shelterObj = shelters.find(s => s.id === fam.assignedShelterId);
          const childCount = fam.members.filter(m => m.category === 'Child').length;
          const elderlyCount = fam.members.filter(m => m.category === 'Elderly').length;
          const specialMeds = fam.members.filter(m => m.medicalCondition && m.medicalCondition !== 'None');

          return (
            <div
              key={fam.id}
              className="bg-[#111C30] border border-[#243656] rounded-2xl p-5 shadow-xl space-y-4 hover:border-[#243656] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#243656]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-300">{fam.id}</span>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        fam.status === 'Sheltered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {fam.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-1">{fam.headOfFamily}</h3>
                    <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5 font-mono">
                      <Phone className="w-3 h-3 text-blue-400" />
                      <span>{fam.mobile}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#94A3B8] font-mono block">Unit Size</span>
                    <strong className="text-xl font-mono text-white font-black">{fam.membersCount}</strong>
                    <span className="text-[10px] text-[#94A3B8] block font-mono">Persons</span>
                  </div>
                </div>

                {/* Sub-demographics & medical indicators */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono my-3">
                  <div className="bg-[#0A1120] p-2 rounded-xl border border-[#243656] text-center">
                    <span className="text-[#94A3B8] block text-[10px]">Children</span>
                    <strong className="text-amber-400">{childCount}</strong>
                  </div>
                  <div className="bg-[#0A1120] p-2 rounded-xl border border-[#243656] text-center">
                    <span className="text-[#94A3B8] block text-[10px]">Elderly</span>
                    <strong className="text-purple-400">{elderlyCount}</strong>
                  </div>
                  <div className="bg-[#0A1120] p-2 rounded-xl border border-[#243656] text-center">
                    <span className="text-[#94A3B8] block text-[10px]">Medical Needs</span>
                    <strong className={specialMeds.length > 0 ? 'text-rose-400' : 'text-[#94A3B8]'}>
                      {specialMeds.length}
                    </strong>
                  </div>
                </div>

                {/* Assigned Shelter Details */}
                <div className="bg-[#0A1120] p-3 rounded-xl border border-[#243656] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] font-mono uppercase text-[10px]">Assigned Shelter</span>
                    <button
                      onClick={() => {
                        if (shelterObj) {
                          setSelectedShelterId(shelterObj.id);
                          setCurrentTab('shelter-detail');
                        }
                      }}
                      className="text-blue-400 hover:underline text-[11px] font-semibold"
                    >
                      View facility &rarr;
                    </button>
                  </div>
                  <div className="font-bold text-[#F8FAFC] mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{shelterObj?.name || 'Unassigned'}</span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">
                    {shelterObj?.city}, {shelterObj?.state}
                  </div>
                </div>

                {/* Special Medical conditions list */}
                {specialMeds.length > 0 && (
                  <div className="mt-2 text-[11px] text-rose-300 bg-rose-950/30 p-2 rounded-lg border border-rose-900/40">
                    <strong className="block font-semibold">Care flags:</strong>
                    {specialMeds.map(m => (
                      <span key={m.id} className="block text-[#CBD5E1]">
                        &bull; {m.name}: {m.medicalCondition}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons: [TRANSFER FAMILY] */}
              <div className="pt-3 border-t border-[#243656] flex items-center justify-between gap-2">
                <span className="text-[10px] text-[#94A3B8] font-mono">
                  Registered: {fam.registeredAt.split('T')[0]}
                </span>

                <button
                  onClick={() => {
                    setTransferringFamily(fam);
                    const diffShelters = countryShelters.filter(s => s.id !== fam.assignedShelterId);
                    if (diffShelters.length > 0) {
                      setTargetShelterId(diffShelters[0].id);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#182742] hover:bg-[#243656] text-blue-300 border border-[#243656] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>TRANSFER FAMILY</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TRANSFER FAMILY MODAL */}
      {transferringFamily && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#243656] pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">
                  Transfer Family Unit ({transferringFamily.id})
                </h3>
              </div>
              <button
                onClick={() => setTransferringFamily(null)}
                className="text-[#94A3B8] hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#CBD5E1]">
              Transfer <strong>{transferringFamily.headOfFamily}</strong> ({transferringFamily.membersCount} members) to a new facility. Both shelters' real-time occupancy counts will automatically adjust.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Current Facility</label>
                <div className="p-2.5 rounded-xl bg-[#0A1120] border border-[#243656] text-[#CBD5E1] font-mono">
                  {shelters.find(s => s.id === transferringFamily.assignedShelterId)?.name}
                </div>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Select Destination Shelter</label>
                <select
                  value={targetShelterId}
                  onChange={e => setTargetShelterId(e.target.value)}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {countryShelters
                    .filter(s => s.id !== transferringFamily.assignedShelterId)
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.availableBeds} beds available &bull; {s.status})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-[#243656]">
              <button
                onClick={() => setTransferringFamily(null)}
                className="px-4 py-2 rounded-xl bg-[#182742] text-[#CBD5E1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                disabled={!targetShelterId}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Execute Inter-Shelter Transfer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
