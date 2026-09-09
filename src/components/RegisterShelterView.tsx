import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Navigation,
  FileCheck2,
  Lock,
  ArrowRight,
  Plus,
  Home,
  AlertTriangle
} from 'lucide-react';
import { ShelterType, ShelterOwnership, Country } from '../types';
import { triggerHaptic } from '../utils/feedback';

export const RegisterShelterView: React.FC = () => {
  const { registerShelter, setCurrentTab, setSelectedShelterId, userLocation } = useApp();

  // Step state
  const [submittedShelterId, setSubmittedShelterId] = useState<string | null>(null);

  // Form states
  const [ownership, setOwnership] = useState<ShelterOwnership>('Private');
  const [name, setName] = useState('');
  const [shelterType, setShelterType] = useState<ShelterType>('Private Hotel / Resort');
  const [country, setCountry] = useState<Country>('IND');
  const [stateName, setStateName] = useState('Gujarat');
  const [district, setDistrict] = useState('Ahmedabad');
  const [city, setCity] = useState('Ahmedabad');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(userLocation.lat || 23.0225);
  const [lng, setLng] = useState<number>(userLocation.lng || 72.5714);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  // Capacity & Resources
  const [totalCapacity, setTotalCapacity] = useState<number>(120);
  const [availableBeds, setAvailableBeds] = useState<number>(100);

  // Verification & Authority
  const [managerName, setManagerName] = useState('');
  const [managerRole, setManagerRole] = useState('Owner / Facility Administrator');
  const [managingOrg, setManagingOrg] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [email, setEmail] = useState('');
  const [aadhaarId, setAadhaarId] = useState('9876 5432 1098');
  const [policeStation, setPoliceStation] = useState('City Central Police Station');
  const [policeStationPhone, setPoliceStationPhone] = useState('+91 11 2345 6789');

  // Facilities
  const [facilities, setFacilities] = useState({
    drinkingWater: true,
    foodAvailable: true,
    powerBackup: true,
    medicalSupport: false,
    beds: true,
    wheelchairAccessible: true,
    childFriendly: true,
    womenSafeSpace: true,
    petFriendly: false,
    toilets: 8
  });

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setIsGpsLoading(false);
        triggerHaptic(20);
      },
      err => {
        console.warn('GPS retrieval error:', err);
        setIsGpsLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide the shelter or facility name.');
      return;
    }

    triggerHaptic(30);

    const isPriv = ownership === 'Private';
    const registered = registerShelter({
      name: name.trim(),
      type: shelterType,
      ownership,
      isPrivate: isPriv,
      country,
      state: stateName,
      district,
      city,
      address: address || `${city}, ${stateName}`,
      lat,
      lng,
      totalCapacity: Number(totalCapacity) || 50,
      availableBeds: Number(availableBeds) || Number(totalCapacity) || 50,
      managerName: managerName || 'Shelter Officer',
      managerRole: managerRole || (isPriv ? 'Private Facility Manager' : 'Relief Superintendent'),
      managingOrg: managingOrg || (isPriv ? 'Private Facility Host' : 'District Disaster Management Authority'),
      phone,
      email: email || 'contact@resqtech.org',
      emergencyCoordinator: isPriv ? `${managerName || 'Keyholder'} (Private Contact)` : 'DDMA Nodal Officer',
      facilities: {
        ...facilities,
        toilets: Number(facilities.toilets) || 6
      },
      verification: {
        aadhaarId: aadhaarId ? aadhaarId.replace(/(\d{4})/g, '$1 ').trim() : 'XXXX-XXXX-9124',
        aadhaarHolderName: managerName || 'Authorized Facility In-Charge',
        policeStation: policeStation || `${city} Police Thana`,
        policeVerificationId: `POL-${country}-${Math.floor(10000 + Math.random() * 90000)}`,
        policeStationPhone: policeStationPhone || '+91 11 2345 6789',
        verificationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        verifiedByOfficer: 'Station House Officer (Clearance Validated)',
        isVerified: true,
        clearanceStatus: 'VERIFIED_ACTIVE'
      }
    });

    setSubmittedShelterId(registered.id);
  };

  if (submittedShelterId) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-8 space-y-6">
        <div className="bg-white dark:bg-[#0F172A] border-2 border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-6 sm:p-10 text-center shadow-lg space-y-6">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>REGISTRATION CODE: {submittedShelterId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">
              {ownership} Shelter Successfully Registered!
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              <strong>{name}</strong> is now live in the RESQTECH safe zone database. It has been provisioned with Aadhaar UIDAI verification records and local police clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-[#1E293B] rounded-2xl text-left border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Classification</div>
              <div className="text-xs font-bold text-[#0F172A] dark:text-white mt-0.5">{ownership} Safe Hub</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Capacity / Beds</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{availableBeds} Available ({totalCapacity} Max)</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Location Coordinates</div>
              <div className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-0.5">{lat.toFixed(4)}, {lng.toFixed(4)}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedShelterId(submittedShelterId);
                setCurrentTab('shelters');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold text-sm shadow hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View in Shelters Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedShelterId(submittedShelterId);
                setCurrentTab('map');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#EA580C]" />
              <span>Locate on GIS Map</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EA580C]/10 text-[#EA580C] mb-2">
              <Plus className="w-3.5 h-3.5" />
              <span>FACILITY ONBOARDING &bull; PUBLIC &amp; PRIVATE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Register New Relief Shelter
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Add any verified safe haven to RESQTECH. Private entities (hotels, community halls, marriage palaces, school campuses, corporate auditoriums) can offer emergency shelter alongside official government relief camps.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-slate-50 dark:bg-[#1E293B] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
              Mandatory Aadhaar &amp; Police Verification Check
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Classification (Private vs Public / Government) */}
        <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] flex items-center justify-center font-black text-xs">
              1
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white">
              Shelter Ownership &amp; Facility Type
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Private Option */}
            <button
              type="button"
              onClick={() => {
                setOwnership('Private');
                if (!shelterType.startsWith('Private')) {
                  setShelterType('Private Hotel / Resort');
                }
                triggerHaptic(10);
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                ownership === 'Private'
                  ? 'border-[#EA580C] bg-[#EA580C]/5 dark:bg-[#EA580C]/10 ring-2 ring-[#EA580C]/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#1E293B]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#EA580C]">
                  <Home className="w-6 h-6" />
                </div>
                {ownership === 'Private' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EA580C] text-white">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mt-3">
                Private Shelter / Commercial Facility
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Hotels, resorts, marriage halls, private schools, corporate auditoriums, warehouses, and non-governmental facilities offering safe refuge during disaster.
              </p>
            </button>

            {/* Public Option */}
            <button
              type="button"
              onClick={() => {
                setOwnership('Public / Government');
                if (shelterType.startsWith('Private')) {
                  setShelterType('Government Relief Camp');
                }
                triggerHaptic(10);
              }}
              className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                ownership === 'Public / Government'
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#1E293B]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Building2 className="w-6 h-6" />
                </div>
                {ownership === 'Public / Government' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-[#0F172A] dark:text-white mt-3">
                Public / Government Relief Camp
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                State evacuation shelters, government colleges, municipal stadiums, panchayat bhavans, and civil defence centers operated under disaster protocols.
              </p>
            </button>
          </div>

          {/* Detailed Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Facility Name *
              </label>
              <input
                type="text"
                required
                placeholder={ownership === 'Private' ? 'e.g., Grand Palace Hotel & Safe Refuge' : 'e.g., Municipal High School Safe Camp'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-[#0F172A] dark:text-white font-medium focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Specific Shelter Category *
              </label>
              <select
                value={shelterType}
                onChange={e => setShelterType(e.target.value as ShelterType)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-[#0F172A] dark:text-white font-medium focus:outline-none focus:border-[#EA580C]"
              >
                {ownership === 'Private' ? (
                  <>
                    <option value="Private Hotel / Resort">Private Hotel / Resort</option>
                    <option value="Private Marriage Hall / Banquet">Private Marriage Hall / Banquet</option>
                    <option value="Private Residential / Corporate Facility">Private Residential / Corporate Campus</option>
                    <option value="NGO shelter">NGO Shelter Facility</option>
                    <option value="School">Private Educational Institution</option>
                    <option value="Hospital-supported shelter">Hospital-Supported Care Facility</option>
                    <option value="Religious / Community Facility">Religious / Community Trust Hall</option>
                  </>
                ) : (
                  <>
                    <option value="Government Relief Camp">Government Relief Camp</option>
                    <option value="School">Government School / College</option>
                    <option value="Community Hall">Municipal Community Hall</option>
                    <option value="Stadium">Public Sports Stadium</option>
                    <option value="Emergency evacuation center">District Evacuation Center</option>
                    <option value="Temporary camp">Temporary Evacuation Camp</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & GPS Mapping */}
        <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] flex items-center justify-center font-black text-xs">
                2
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white">
                Location &amp; Geocoding
              </h2>
            </div>

            <button
              type="button"
              onClick={handleUseGps}
              disabled={isGpsLoading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-[#0F172A] dark:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 text-[#EA580C] ${isGpsLoading ? 'animate-spin' : ''}`} />
              <span>{isGpsLoading ? 'Getting Coordinates...' : 'Auto-Fill My Live GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Country
              </label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value as Country)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              >
                <option value="IND">India (IND)</option>
                <option value="NPL">Nepal (NPL)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                State / Province *
              </label>
              <input
                type="text"
                required
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                City / Town *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              Full Physical Address / Landmark
            </label>
            <input
              type="text"
              placeholder="e.g., Plot 14, Ring Road, Near Highway Junction"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Latitude (GIS Coordinate)
              </label>
              <input
                type="number"
                step="0.000001"
                value={lat}
                onChange={e => setLat(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] dark:text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Longitude (GIS Coordinate)
              </label>
              <input
                type="number"
                step="0.000001"
                value={lng}
                onChange={e => setLng(parseFloat(e.target.value) || 0)}
                className="w-full bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#0F172A] dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Aadhaar ID & Police Verification Check */}
        <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] flex items-center justify-center font-black text-xs">
                3
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white">
                Government Identity &amp; Police Verification Check
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
              Mandatory Protocol
            </span>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span>
              All shelter managers and private facility keyholders must provide valid Aadhaar credentials and designate their local jurisdictional police station. These records are hidden from public view and only accessible during authorized verification audits.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Facility In-Charge / Host Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name of Primary Keyholder"
                value={managerName}
                onChange={e => setManagerName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Host Role / Designation *
              </label>
              <input
                type="text"
                value={managerRole}
                onChange={e => setManagerRole(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Aadhaar Number (UIDAI) *
              </label>
              <input
                type="text"
                required
                placeholder="12-digit Aadhaar Number"
                value={aadhaarId}
                onChange={e => setAadhaarId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-[#0F172A] dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Managing Entity / Organization Name
              </label>
              <input
                type="text"
                placeholder={ownership === 'Private' ? 'e.g., Sharma Hospitality Pvt Ltd' : 'e.g., Dist. Disaster Cell'}
                value={managingOrg}
                onChange={e => setManagingOrg(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Local Police Station (Jurisdiction Thana) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Navrangpura Police Station"
                value={policeStation}
                onChange={e => setPoliceStation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Police Station Contact / Control Room
              </label>
              <input
                type="text"
                value={policeStationPhone}
                onChange={e => setPoliceStationPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                24x7 Emergency Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-[#0F172A] dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                placeholder="coordinator@shelter.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-[#0F172A] dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Capacity & On-Site Amenities */}
        <div className="bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] flex items-center justify-center font-black text-xs">
              4
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white">
              Capacity &amp; Critical Emergency Amenities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Total Evacuee Capacity (People) *
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                required
                value={totalCapacity}
                onChange={e => {
                  const val = parseInt(e.target.value) || 10;
                  setTotalCapacity(val);
                  setAvailableBeds(val);
                }}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono font-bold text-[#0F172A] dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                Initial Available Beds / Sleeping Cots *
              </label>
              <input
                type="number"
                min="0"
                max={totalCapacity}
                required
                value={availableBeds}
                onChange={e => setAvailableBeds(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono font-bold text-[#0F172A] dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              On-Site Support &amp; Safe Zone Capabilities
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: 'drinkingWater', label: 'Potable Drinking Water' },
                { key: 'foodAvailable', label: 'Cooked Food / Dry Rations' },
                { key: 'powerBackup', label: 'Power Backup / Generator' },
                { key: 'medicalSupport', label: 'On-Site Medical Triage' },
                { key: 'wheelchairAccessible', label: 'Wheelchair Ramps / Access' },
                { key: 'womenSafeSpace', label: 'Dedicated Women Safe Space' },
                { key: 'childFriendly', label: 'Child Friendly Area' },
                { key: 'petFriendly', label: 'Pet Friendly / Accommodating' },
                { key: 'beds', label: 'Mattresses & Bedding Ready' }
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={facilities[item.key as keyof typeof facilities] as boolean}
                    onChange={e => {
                      setFacilities(prev => ({
                        ...prev,
                        [item.key]: e.target.checked
                      }));
                    }}
                    className="w-4 h-4 rounded text-[#EA580C] focus:ring-[#EA580C]"
                  />
                  <span className="text-xs font-medium text-[#0F172A] dark:text-slate-200">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#0F172A] border-2 border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            By registering, this shelter becomes discoverable on the RESQTECH live map and available for proximity routing.
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Complete {ownership} Registration</span>
          </button>
        </div>

      </form>
    </div>
  );
};
