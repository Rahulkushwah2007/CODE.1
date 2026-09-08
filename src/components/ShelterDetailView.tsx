import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  HeartPulse,
  Utensils,
  Droplet,
  Bed,
  Accessibility,
  Baby,
  Dog,
  Power,
  Layers,
  ArrowLeft,
  Navigation,
  UserPlus,
  AlertTriangle,
  Send,
  CheckCircle2,
  Package,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { calculateDistanceKm } from '../utils/scoring';

export const ShelterDetailView: React.FC = () => {
  const {
    selectedShelterId,
    setSelectedShelterId,
    shelters,
    country,
    setCurrentTab,
    createResourceRequest,
    addAlert
  } = useApp();

  const shelter = shelters.find(s => s.id === selectedShelterId) || shelters[0];

  const [issueModalOpen, setIssueModalOpen] = useState<boolean>(false);
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [issueReported, setIssueReported] = useState<boolean>(false);

  const [supplyModalOpen, setSupplyModalOpen] = useState<boolean>(false);
  const [supplyItem, setSupplyItem] = useState<string>('Potable Water Tanker');
  const [supplyQuantity, setSupplyQuantity] = useState<number>(100);

  if (!shelter) {
    return <div className="p-8 text-center text-[#94A3B8]">No shelter selected.</div>;
  }

  const occupancyRatio = shelter.totalCapacity > 0 ? shelter.currentOccupancy / shelter.totalCapacity : 0;
  const occupancyPct = Math.round(occupancyRatio * 100);

  // Nearby alternative shelters
  const alternatives = shelters
    .filter(s => s.id !== shelter.id && s.country === shelter.country)
    .map(s => ({
      ...s,
      dist: calculateDistanceKm(shelter.lat, shelter.lng, s.lat, s.lng)
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  const handleReportIssue = () => {
    if (!issueDescription) return;
    addAlert({
      shelterId: shelter.id,
      shelterName: shelter.name,
      type: 'CAPACITY',
      severity: 'HIGH',
      message: `Citizen / Staff Field Report: ${issueDescription}`,
      actionRequired: 'Investigate shelter condition'
    });
    setIssueReported(true);
    setTimeout(() => {
      setIssueReported(false);
      setIssueModalOpen(false);
      setIssueDescription('');
    }, 1500);
  };

  const handleSendSupplyRequest = () => {
    createResourceRequest({
      shelterId: shelter.id,
      shelterName: shelter.name,
      resourceName: supplyItem,
      quantity: supplyQuantity,
      unit: 'units',
      priority: 'HIGH',
      requestedBy: 'Emergency Command Relay',
      notes: `Dispatched via Shelter Details Quick Requisition`
    });
    setSupplyModalOpen(false);
    alert(`Requisition for ${supplyQuantity} units of ${supplyItem} dispatched to logistics.`);
  };

  return (
    <div id="shelter-detail-view" className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8 text-[#F8FAFC]">
      
      {/* Back navigation & Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentTab('roster')}
          className="px-3.5 py-1.5 rounded-xl bg-[#111C30] hover:bg-[#182742] text-[#CBD5E1] border border-[#243656] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shelters Roster</span>
        </button>

        <span className="text-xs font-mono text-[#94A3B8]">
          Last verified sync: {shelter.lastUpdated}
        </span>
      </div>

      {/* Main Shelter Hero Banner */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold uppercase">
                {shelter.type} &bull; {shelter.country === 'IND' ? 'INDIA' : 'NEPAL'}
              </span>
              <span className="font-mono text-xs text-[#94A3B8]">{shelter.id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-2">
              {shelter.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#CBD5E1] flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{shelter.address}, {shelter.city}, {shelter.state}</span>
            </p>
          </div>

          <div className="text-right font-mono self-start md:self-auto bg-[#0A1120] p-4 rounded-2xl border border-[#243656]">
            <span className="text-xs text-[#94A3B8] block">Live Status</span>
            <span className={`text-sm sm:text-base font-black px-2.5 py-1 rounded-lg inline-block mt-1 ${
              occupancyPct >= 90 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
              occupancyPct >= 70 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {shelter.status} ({occupancyPct}%)
            </span>
          </div>
        </div>

        {/* Live Occupancy Gauge */}
        <div className="bg-[#0A1120] p-5 rounded-2xl border border-[#243656] space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs font-mono">
            <span className="text-[#94A3B8]">
              Current Occupants: <strong className="text-white text-sm">{shelter.currentOccupancy}</strong> / {shelter.totalCapacity}
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              {shelter.availableBeds} Available Beds
            </span>
          </div>

          <div className="w-full h-4 bg-[#182742] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPct >= 90 ? 'bg-rose-500' : occupancyPct >= 70 ? 'bg-amber-500' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, occupancyPct)}%` }}
            />
          </div>
        </div>

        {/* Quick Actions Bar (Prompt: CALL MANAGER, GET DIRECTIONS, REGISTER FAMILY HERE, REPORT ISSUE, REQUEST SUPPLY) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          
          <a
            href={`tel:${shelter.phone}`}
            className="p-3 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>CALL MANAGER</span>
          </a>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors"
          >
            <Navigation className="w-4 h-4 text-blue-400" />
            <span>GET DIRECTIONS</span>
          </a>

          <button
            onClick={() => setCurrentTab('intake')}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex flex-col items-center justify-center gap-1 text-center shadow-lg transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>REGISTER FAMILY</span>
          </button>

          <button
            onClick={() => setIssueModalOpen(true)}
            className="p-3 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>REPORT ISSUE</span>
          </button>

          <button
            onClick={() => setSupplyModalOpen(true)}
            className="p-3 rounded-xl bg-[#182742] hover:bg-[#243656] text-[#F8FAFC] text-xs font-bold flex flex-col items-center justify-center gap-1 text-center transition-colors cursor-pointer col-span-2 sm:col-span-1"
          >
            <Send className="w-4 h-4 text-purple-400" />
            <span>REQUEST SUPPLY</span>
          </button>
        </div>
      </div>

      {/* Facilities & Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Facilities Checklist */}
        <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
            Verified On-Site Facilities
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center gap-2.5">
              <HeartPulse className={`w-4 h-4 ${shelter.facilities.medicalSupport ? 'text-emerald-400' : 'text-[#64748B]'}`} />
              <div>
                <span className="font-semibold block text-[#F8FAFC]">Medical Support</span>
                <span className="text-[11px] text-[#94A3B8]">{shelter.facilities.medicalSupport ? 'Doctor on site' : 'Off-site referral'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center gap-2.5">
              <ShieldCheck className={`w-4 h-4 ${shelter.facilities.separateWomenSection ? 'text-emerald-400' : 'text-[#64748B]'}`} />
              <div>
                <span className="font-semibold block text-[#F8FAFC]">Women / Family Bay</span>
                <span className="text-[11px] text-[#94A3B8]">{shelter.facilities.separateWomenSection ? 'Private partition' : 'Communal floor'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center gap-2.5">
              <Accessibility className={`w-4 h-4 ${shelter.facilities.wheelchairAccessible ? 'text-emerald-400' : 'text-[#64748B]'}`} />
              <div>
                <span className="font-semibold block text-[#F8FAFC]">Wheelchair Accessible</span>
                <span className="text-[11px] text-[#94A3B8]">{shelter.facilities.wheelchairAccessible ? 'Ramps & ground access' : 'Steps present'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center gap-2.5">
              <Baby className={`w-4 h-4 ${shelter.facilities.childFriendlySpace ? 'text-emerald-400' : 'text-[#64748B]'}`} />
              <div>
                <span className="font-semibold block text-[#F8FAFC]">Child-Friendly Zone</span>
                <span className="text-[11px] text-[#94A3B8]">{shelter.facilities.childFriendlySpace ? 'Monitored play area' : 'General space'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center gap-2.5">
              <Power className={`w-4 h-4 ${shelter.facilities.powerBackup ? 'text-emerald-400' : 'text-[#64748B]'}`} />
              <div>
                <span className="font-semibold block text-[#F8FAFC]">Power Backup</span>
                <span className="text-[11px] text-[#94A3B8]">{shelter.facilities.powerBackup ? 'Diesel Generator' : 'Standard Grid'}</span>
              </div>
            </div>

            <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center gap-2.5">
              <Dog className={`w-4 h-4 ${shelter.facilities.petSupport ? 'text-emerald-400' : 'text-[#64748B]'}`} />
              <div>
                <span className="font-semibold block text-[#F8FAFC]">Pet Support</span>
                <span className="text-[11px] text-[#94A3B8]">{shelter.facilities.petSupport ? 'Designated pen' : 'No animals'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Management & Contacts */}
        <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
            Camp Management & Authority
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#0A1120] rounded-xl border border-[#243656]">
              <span className="text-[#94A3B8] block text-[11px]">Managing Agency</span>
              <strong className="text-white text-sm block mt-0.5">{shelter.managingOrg}</strong>
              <span className="text-[#94A3B8] text-[11px] mt-0.5 block">Municipal disaster management team</span>
            </div>

            <div className="p-3.5 bg-[#0A1120] rounded-xl border border-[#243656] flex items-center justify-between">
              <div>
                <span className="text-[#94A3B8] block text-[11px]">Camp Warden / Manager</span>
                <strong className="text-white text-sm block mt-0.5">{shelter.managerName}</strong>
                <span className="text-blue-400 text-[11px] block">{shelter.managerRole}</span>
              </div>
              <a
                href={`tel:${shelter.phone}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
            </div>

            <div className="p-3.5 bg-[#0A1120] rounded-xl border border-[#243656]">
              <span className="text-[#94A3B8] block text-[11px]">Apex Emergency Coordinator</span>
              <strong className="text-white text-sm block mt-0.5">{shelter.emergencyCoordinator}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Inventory Breakdown */}
      <div className="bg-[#111C30] border border-[#243656] rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white uppercase font-mono tracking-wider">
          Resource Stock Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] text-center">
            <span className="text-[#94A3B8] block text-[10px]">Canvas Beds</span>
            <strong className="text-lg text-white font-sans">{shelter.resources.beds.available}</strong>
            <span className="text-[#94A3B8] block text-[10px]">Req: {shelter.resources.beds.required}</span>
          </div>

          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] text-center">
            <span className="text-[#94A3B8] block text-[10px]">Rations Kits</span>
            <strong className="text-lg text-amber-400 font-sans">{shelter.resources.foodRations.available}</strong>
            <span className="text-[#94A3B8] block text-[10px]">Req: {shelter.resources.foodRations.required}</span>
          </div>

          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] text-center">
            <span className="text-[#94A3B8] block text-[10px]">Clean Water</span>
            <strong className="text-lg text-blue-300 font-sans">{shelter.resources.drinkingWater.available} L</strong>
            <span className="text-[#94A3B8] block text-[10px]">Req: {shelter.resources.drinkingWater.required} L</span>
          </div>

          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] text-center">
            <span className="text-[#94A3B8] block text-[10px]">Medical Kits</span>
            <strong className="text-lg text-rose-400 font-sans">{shelter.resources.medicalKits.available}</strong>
            <span className="text-[#94A3B8] block text-[10px]">Req: {shelter.resources.medicalKits.required}</span>
          </div>

          <div className="p-3 bg-[#0A1120] rounded-xl border border-[#243656] text-center col-span-2 sm:col-span-1">
            <span className="text-[#94A3B8] block text-[10px]">Thermal Blankets</span>
            <strong className="text-lg text-purple-400 font-sans">{shelter.resources.blankets.available}</strong>
            <span className="text-[#94A3B8] block text-[10px]">Req: {shelter.resources.blankets.required}</span>
          </div>
        </div>
      </div>

      {/* Nearby Alternative Shelters */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
          Nearby Alternative Shelters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {alternatives.map(alt => (
            <div
              key={alt.id}
              className="bg-[#111C30] border border-[#243656] rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{alt.name}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-1">{alt.city} &bull; {alt.dist.toFixed(1)} km away</p>
                <div className="mt-2 text-xs font-mono text-blue-300">
                  {alt.availableBeds} beds available
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedShelterId(alt.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-1.5 rounded-lg bg-[#182742] hover:bg-[#243656] text-xs font-semibold text-[#F8FAFC]"
              >
                Switch to this Shelter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REPORT ISSUE MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Report Facility Incident / Issue</h3>
            <p className="text-xs text-[#CBD5E1]">
              Submit immediate field observations regarding water cleanliness, overcrowding, or medical shortages to the disaster command center.
            </p>
            <textarea
              value={issueDescription}
              onChange={e => setIssueDescription(e.target.value)}
              placeholder="Describe issue (e.g. power cut, broken toilet block, shortage of baby formula...)"
              className="w-full h-24 bg-[#0A1120] border border-[#243656] rounded-xl p-3 text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIssueModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#182742] text-[#CBD5E1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReportIssue}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs"
              >
                {issueReported ? 'Report Submitted!' : 'Send Incident Alert'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLY REQUISITION MODAL */}
      {supplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1120]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111C30] border border-[#243656] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Request Emergency Logistics Dispatch</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Item Required</label>
                <select
                  value={supplyItem}
                  onChange={e => setSupplyItem(e.target.value)}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2 text-white"
                >
                  <option value="Potable Water Tanker (5000L)">Potable Water Tanker (5000L)</option>
                  <option value="Canvas Folding Cots">Canvas Folding Cots</option>
                  <option value="Emergency Food Rations">Emergency Food Rations</option>
                  <option value="Pediatric First Aid Kits">Pediatric First Aid Kits</option>
                  <option value="Sanitary & Hygiene Kits">Sanitary & Hygiene Kits</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Quantity</label>
                <input
                  type="number"
                  value={supplyQuantity}
                  onChange={e => setSupplyQuantity(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#0A1120] border border-[#243656] rounded-xl p-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSupplyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#182742] text-[#CBD5E1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSupplyRequest}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
