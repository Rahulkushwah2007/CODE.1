import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Country,
  UserRole,
  Shelter,
  Family,
  ResourceRequest,
  AlertItem,
  VolunteerOpportunity,
  Incident,
  ShelterStatus,
  ShelterType,
  FamilyRequirements,
  AppLanguage
} from '../types';
import { translations, Translations } from '../i18n/translations';
import {
  INITIAL_SHELTERS,
  INITIAL_FAMILIES,
  INITIAL_RESOURCE_REQUESTS,
  INITIAL_ALERTS,
  INITIAL_VOLUNTEER_OPPORTUNITIES,
  INCIDENTS_DATA
} from '../data/mockData';
import { calculateDistanceKm } from '../utils/feedback';

export type NavigationTab =
  | 'landing'
  | 'finder'
  | 'map'
  | 'shelters'
  | 'register-shelter'
  | 'profile'
  | 'shelter-detail'
  | 'manager-dashboard'
  | 'intake'
  | 'command'
  | 'families'
  | 'resources'
  | 'alerts'
  | 'volunteers'
  | 'analytics'
  | 'settings';

interface AppNotification {
  id: string;
  title: string;
  desc: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  time: string;
  read: boolean;
}

interface AppContextType {
  country: Country;
  setCountry: (country: Country) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedShelterId: string | null;
  setSelectedShelterId: (id: string | null) => void;
  selectedShelter: Shelter | undefined;
  
  shelters: Shelter[];
  filteredShelters: Shelter[];
  families: Family[];
  resourceRequests: ResourceRequest[];
  alerts: AlertItem[];
  volunteerOps: VolunteerOpportunity[];
  currentIncident: Incident | undefined;
  
  // Actions
  registerShelter: (data: Partial<Shelter> & { name: string; type: ShelterType; city: string; state: string; totalCapacity: number; country: Country }) => Shelter;
  updateShelterOccupancy: (shelterId: string, delta: number) => void;
  setShelterOccupancy: (shelterId: string, count: number) => void;
  updateShelterResource: (shelterId: string, resourceKey: keyof Shelter['resources'], available: number) => void;
  createResourceRequest: (req: Omit<ResourceRequest, 'id' | 'requestedAt' | 'status'>) => void;
  updateResourceRequestStatus: (reqId: string, status: ResourceRequest['status']) => void;
  registerFamily: (family: Omit<Family, 'id' | 'registeredAt'>) => Family;
  transferFamily: (familyId: string, targetShelterId: string, reason: string) => boolean;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  enrollVolunteer: (opId: string) => void;
  
  // Simulation Mode
  simulationActive: boolean;
  toggleSimulation: () => void;
  triggerDemoSurgeScenario: () => void;
  
  // Offline Simulation
  offlineMode: boolean;
  toggleOfflineMode: () => void;
  lastSyncTime: string;
  
  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: AppNotification[];
  unreadNotifCount: number;
  markNotifRead: (id: string) => void;
  clearAllNotifs: () => void;
  
  // Theme (Paper White default vs Dark Mode)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Location & Radius Filtering (15km Nearby Main Dashboard)
  userLocation: { lat: number; lng: number };
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  onlyNearby15Km: boolean;
  setOnlyNearby15Km: (val: boolean) => void;
  locateUserAndFilterNearby: (onSuccess?: (coords: { lat: number; lng: number }, nearest: Shelter, distKm: number) => void) => void;
  isLocating: boolean;

  // Language Localization (English, Hindi, Gujarati)
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: keyof Translations) => string;

  // Reset demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<Country>('IND');
  const [role, setRole] = useState<UserRole>('district_admin');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('shelters');
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>('SH-IND-AHM-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationActive, setSimulationActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('10:46 AM (Live)');

  // Language state: 'en' | 'hi' | 'gu'
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('resqtech_lang');
    if (saved === 'hi' || saved === 'gu' || saved === 'en') return saved;
    return 'en';
  });

  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('resqtech_lang', lang);
  }, []);

  const t = useCallback((key: keyof Translations): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || (key as string);
  }, [language]);

  // Theme state: default to 'dark' (Ultra-dark tactical navy theme)
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('resqtech_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('resqtech_theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('resqtech_theme', next);
      return next;
    });
  }, []);

  // Synchronize document theme classes on mount & update
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('theme-paper-white');
      document.body.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-paper-white');
    }
  }, [theme]);

  // User GPS coordinates for distance calculation (default: central disaster node)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(() => ({
    lat: country === 'NPL' ? 27.7172 : 23.0338,
    lng: country === 'NPL' ? 85.3240 : 72.5850
  }));

  // Radius filter for main dashboard (Default: strictly within 15 km)
  const [onlyNearby15Km, setOnlyNearby15Km] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Data collections with local caching fallback
  const [shelters, setShelters] = useState<Shelter[]>(() => {
    const cached = localStorage.getItem('shelterx_shelters_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_SHELTERS.length) {
          return parsed;
        }
      } catch (e) {
        console.error('Error parsing cached shelters', e);
      }
    }
    return INITIAL_SHELTERS;
  });

  const [families, setFamilies] = useState<Family[]>(() => {
    const cached = localStorage.getItem('shelterx_families');
    return cached ? JSON.parse(cached) : INITIAL_FAMILIES;
  });

  const [resourceRequests, setResourceRequests] = useState<ResourceRequest[]>(() => {
    const cached = localStorage.getItem('shelterx_resource_requests');
    return cached ? JSON.parse(cached) : INITIAL_RESOURCE_REQUESTS;
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const cached = localStorage.getItem('shelterx_alerts');
    return cached ? JSON.parse(cached) : INITIAL_ALERTS;
  });

  const [volunteerOps, setVolunteerOps] = useState<VolunteerOpportunity[]>(() => {
    const cached = localStorage.getItem('shelterx_volunteer_ops');
    return cached ? JSON.parse(cached) : INITIAL_VOLUNTEER_OPPORTUNITIES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: 'High Inflow Alert',
      desc: 'Ahmedabad Riverfront Sector 3 evacuating 450 persons.',
      type: 'critical',
      time: '3m ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Water Tanker Dispatched',
      desc: '5000L bowser en route to Shanti Multi-Purpose Hall.',
      type: 'info',
      time: '12m ago',
      read: false
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shelterx_shelters_v2', JSON.stringify(shelters));
  }, [shelters]);

  useEffect(() => {
    localStorage.setItem('shelterx_families', JSON.stringify(families));
  }, [families]);

  useEffect(() => {
    localStorage.setItem('shelterx_resource_requests', JSON.stringify(resourceRequests));
  }, [resourceRequests]);

  useEffect(() => {
    localStorage.setItem('shelterx_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const setCountry = useCallback((c: Country) => {
    setCountryState(c);
    // When country changes, auto pick an active shelter from that country
    const firstMatch = shelters.find(s => s.country === c);
    if (firstMatch) {
      setSelectedShelterId(firstMatch.id);
    }
  }, [shelters]);

  // Helper to recompute shelter status
  const calculateStatus = (occupancy: number, total: number): ShelterStatus => {
    if (total <= 0) return 'AVAILABLE';
    const pct = (occupancy / total) * 100;
    if (pct >= 100) return 'FULL';
    if (pct >= 90) return 'CRITICAL';
    if (pct >= 70) return 'LIMITED';
    return 'AVAILABLE';
  };

  // Update shelter occupancy
  const updateShelterOccupancy = useCallback((shelterId: string, delta: number) => {
    setShelters(prev =>
      prev.map(s => {
        if (s.id !== shelterId) return s;
        const newOcc = Math.max(0, Math.min(s.totalCapacity, s.currentOccupancy + delta));
        const newAvailableBeds = Math.max(0, s.totalCapacity - newOcc);
        const newStatus = calculateStatus(newOcc, s.totalCapacity);
        
        // Auto trigger critical capacity alert if crossed 90%
        if (newOcc / s.totalCapacity >= 0.9 && s.status !== 'CRITICAL' && s.status !== 'FULL') {
          const newAlert: AlertItem = {
            id: `ALT-CAP-${Date.now()}`,
            category: 'Capacity',
            severity: 'CRITICAL',
            shelterId: s.id,
            location: `${s.name}, ${s.city}`,
            title: `Capacity Critical: ${Math.round((newOcc / s.totalCapacity) * 100)}% Occupied`,
            description: `Only ${newAvailableBeds} beds remaining. Immediate redirection advised.`,
            recommendedAction: 'Redirect incoming evacuees to adjacent facilities.',
            timestamp: new Date().toISOString(),
            status: 'active'
          };
          setAlerts(al => [newAlert, ...al]);
          setNotifications(nl => [
            {
              id: `notif-${Date.now()}`,
              title: `Critical Alert: ${s.name}`,
              desc: `Capacity surpassed 90% (${newOcc}/${s.totalCapacity})`,
              type: 'critical',
              time: 'Just now',
              read: false
            },
            ...nl
          ]);
        }

        return {
          ...s,
          currentOccupancy: newOcc,
          availableBeds: newAvailableBeds,
          status: newStatus,
          lastUpdated: 'Just now'
        };
      })
    );
  }, []);

  const setShelterOccupancy = useCallback((shelterId: string, count: number) => {
    setShelters(prev =>
      prev.map(s => {
        if (s.id !== shelterId) return s;
        const newOcc = Math.max(0, Math.min(s.totalCapacity, count));
        const newAvailableBeds = Math.max(0, s.totalCapacity - newOcc);
        return {
          ...s,
          currentOccupancy: newOcc,
          availableBeds: newAvailableBeds,
          status: calculateStatus(newOcc, s.totalCapacity),
          lastUpdated: 'Just now'
        };
      })
    );
  }, []);

  const updateShelterResource = useCallback((shelterId: string, resourceKey: keyof Shelter['resources'], available: number) => {
    setShelters(prev =>
      prev.map(s => {
        if (s.id !== shelterId) return s;
        const updated = { ...s.resources };
        updated[resourceKey] = {
          ...updated[resourceKey],
          available: Math.max(0, available)
        };
        return { ...s, resources: updated, lastUpdated: 'Just now' };
      })
    );
  }, []);

  const createResourceRequest = useCallback((req: Omit<ResourceRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: ResourceRequest = {
      ...req,
      id: `REQ-${Date.now().toString().slice(-4)}`,
      requestedAt: new Date().toISOString(),
      status: 'Pending'
    };
    setResourceRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Resource Requested: ${req.resourceName}`,
        desc: `${req.quantity} ${req.unit} for ${req.shelterName} (${req.priority})`,
        type: req.priority === 'CRITICAL' ? 'critical' : 'warning',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  }, []);

  const updateResourceRequestStatus = useCallback((reqId: string, status: ResourceRequest['status']) => {
    setResourceRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status } : r))
    );
  }, []);

  const registerShelter = useCallback((data: Partial<Shelter> & { name: string; type: ShelterType; city: string; state: string; totalCapacity: number; country: Country }): Shelter => {
    const isPriv = data.isPrivate ?? (data.ownership === 'Private' || data.type.startsWith('Private'));
    const ownership = data.ownership || (isPriv ? 'Private' : 'Public / Government');
    const id = data.id || `SH-${data.country}-${data.city.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')}-${Date.now().toString().slice(-4)}`;
    const cap = Math.max(10, data.totalCapacity || 100);

    const newShelter: Shelter = {
      id,
      name: data.name,
      type: data.type,
      address: data.address || `${data.city}, ${data.state}`,
      country: data.country,
      state: data.state,
      district: data.district || data.city,
      city: data.city,
      lat: data.lat || 23.0225 + (Math.random() - 0.5) * 0.08,
      lng: data.lng || 72.5714 + (Math.random() - 0.5) * 0.08,
      totalCapacity: cap,
      currentOccupancy: 0,
      availableBeds: data.availableBeds ?? cap,
      managerName: data.managerName || 'Shelter Officer',
      managerRole: data.managerRole || (isPriv ? 'Facility Keyholder / Host' : 'Relief Camp Incharge'),
      managingOrg: data.managingOrg || (isPriv ? 'Private Relief Partner' : 'District Disaster Management Authority'),
      phone: data.phone || '+91 98765 00000',
      email: data.email || 'shelter@resqtech.org',
      emergencyCoordinator: data.emergencyCoordinator || 'NDRF / Local Thana Coordinator',
      status: 'AVAILABLE',
      ownership,
      isPrivate: isPriv,
      lastUpdated: 'Just now',
      verification: data.verification || {
        aadhaarId: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        aadhaarHolderName: data.managerName || 'Shelter Authority',
        policeStation: `${data.city} Central Station`,
        policeVerificationId: `POL-${data.country}-${Math.floor(10000 + Math.random() * 90000)}`,
        policeStationPhone: '+91 11 2345 6789',
        verificationDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        verifiedByOfficer: 'SHO Inspector Incharge',
        isVerified: true,
        clearanceStatus: 'VERIFIED_ACTIVE'
      },
      facilities: data.facilities || {
        medicalSupport: false,
        foodAvailable: true,
        drinkingWater: true,
        beds: true,
        toilets: Math.max(4, Math.round(cap / 20)),
        powerBackup: true,
        wheelchairAccessible: true,
        childFriendly: true,
        womenSafeSpace: true,
        petFriendly: false
      },
      resources: data.resources || {
        beds: { available: cap, required: 0, unit: 'Beds' },
        foodRations: { available: Math.round(cap * 3), required: 0, unit: 'Meals/day' },
        drinkingWater: { available: Math.round(cap * 15), required: 0, unit: 'Liters/day' },
        medicalKits: { available: Math.max(5, Math.round(cap / 20)), required: 0, unit: 'Kits' },
        blankets: { available: cap, required: 0, unit: 'Units' },
        hygieneKits: { available: Math.round(cap * 0.8), required: 0, unit: 'Packs' }
      }
    };

    setShelters(prev => [newShelter, ...prev]);
    setSelectedShelterId(newShelter.id);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `Shelter Registered (${ownership})`,
        desc: `${newShelter.name} in ${newShelter.city} has been added to the RESQTECH safe zones directory.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return newShelter;
  }, []);

  const registerFamily = useCallback((familyData: Omit<Family, 'id' | 'registeredAt'>) => {
    const prefix = country === 'IND' ? 'SX-IND' : 'SX-NPL';
    const year = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const newFamily: Family = {
      ...familyData,
      id: `${prefix}-${year}-00${randomSeq}`,
      registeredAt: new Date().toISOString()
    };

    setFamilies(prev => [newFamily, ...prev]);

    // Automatically increase occupancy of assigned shelter
    if (newFamily.assignedShelterId) {
      updateShelterOccupancy(newFamily.assignedShelterId, newFamily.membersCount);
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Family Intake',
        desc: `${newFamily.headOfFamily} (${newFamily.membersCount} members) registered.`,
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return newFamily;
  }, [country, updateShelterOccupancy]);

  const transferFamily = useCallback((familyId: string, targetShelterId: string, reason: string) => {
    const fam = families.find(f => f.id === familyId);
    const target = shelters.find(s => s.id === targetShelterId);
    if (!fam || !target) return false;

    const available = target.totalCapacity - target.currentOccupancy;
    if (available < fam.membersCount) {
      return false;
    }

    const previousShelterId = fam.assignedShelterId;

    // Decrement previous shelter
    if (previousShelterId) {
      updateShelterOccupancy(previousShelterId, -fam.membersCount);
    }
    // Increment new shelter
    updateShelterOccupancy(targetShelterId, fam.membersCount);

    setFamilies(prev =>
      prev.map(f => {
        if (f.id !== familyId) return f;
        const history = f.transferHistory || [];
        return {
          ...f,
          assignedShelterId: targetShelterId,
          status: 'Transferred',
          transferHistory: [
            ...history,
            {
              fromShelterId: previousShelterId,
              toShelterId: targetShelterId,
              reason,
              timestamp: new Date().toISOString()
            }
          ]
        };
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Family Transferred',
        desc: `${fam.headOfFamily} relocated to ${target.name}.`,
        type: 'info',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return true;
  }, [families, shelters, updateShelterOccupancy]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  }, []);

  const escalateAlert = useCallback((alertId: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id !== alertId) return a;
        return {
          ...a,
          severity: 'CRITICAL',
          description: `[ESCALATED TO PROVINCE EOC] ${a.description}`
        };
      })
    );
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Alert Escalated to Apex EOC',
        desc: 'Incident escalated to State Disaster Relief Commissioner.',
        type: 'critical',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  }, []);

  const enrollVolunteer = useCallback((opId: string) => {
    setVolunteerOps(prev =>
      prev.map(op => {
        if (op.id !== opId) return op;
        return {
          ...op,
          volunteersEnrolled: Math.min(op.volunteersNeeded, op.volunteersEnrolled + 1)
        };
      })
    );
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Volunteer Enrolled',
        desc: 'Thank you for volunteering! The shelter coordinator will contact you.',
        type: 'success',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  }, []);

  // Emergency Surge Scenario: Flash Flood Inflow simulation in Ahmedabad or Kathmandu
  const triggerDemoSurgeScenario = useCallback(() => {
    // Pick the 5 key test shelters
    setShelters(prev => {
      const activeCountry = country;
      const filtered = prev.filter(s => s.country === activeCountry);
      if (filtered.length < 5) return prev;

      // Set emergency surge occupancy ratios:
      // Shelter A: 55%, Shelter B: 68%, Shelter C: 76%, Shelter D: 91%, Shelter E: 43%
      const ratios = [0.55, 0.68, 0.76, 0.91, 0.43];
      const updated = [...prev];
      filtered.slice(0, 5).forEach((targetShelter, idx) => {
        const globalIndex = updated.findIndex(s => s.id === targetShelter.id);
        if (globalIndex !== -1) {
          const occ = Math.round(updated[globalIndex].totalCapacity * ratios[idx]);
          const status = calculateStatus(occ, updated[globalIndex].totalCapacity);
          updated[globalIndex] = {
            ...updated[globalIndex],
            currentOccupancy: occ,
            availableBeds: updated[globalIndex].totalCapacity - occ,
            status,
            lastUpdated: 'Surge calibrated'
          };
        }
      });
      return updated;
    });

    // Add alert for the 91% shelter
    const newAlert: AlertItem = {
      id: `ALT-SURGE-${Date.now()}`,
      category: 'Capacity',
      severity: 'CRITICAL',
      location: country === 'IND' ? 'Shanti Community Multi-Purpose Hall, Ahmedabad' : 'Balkhu Community Disaster Camp, Kathmandu',
      title: 'OPERATIONAL SURGE: Flash Flood Inflow — Occupancy Reached 91%',
      description: 'Rapid intake surge triggered critical capacity threshold. Only a critical margin of beds remains.',
      recommendedAction: 'Execute smart diversion: route next arriving families to Navrangpura Primary or TransStadia Arena.',
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    setAlerts(prev => [newAlert, ...prev]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Emergency Flood Surge Simulation Triggered',
        desc: 'Calibrated 5 baseline shelters (55%, 68%, 76%, 91%, 43%) under high-stress intake.',
        type: 'critical',
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  }, [country]);

  // Periodic simulation ticks when simulation is turned on
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      // Pick random shelter and simulate small fluctuation (+1 to +3 persons or resource usage)
      setShelters(prev => {
        const countryShelters = prev.filter(s => s.country === country);
        if (countryShelters.length === 0) return prev;
        const randomShelter = countryShelters[Math.floor(Math.random() * countryShelters.length)];
        const delta = Math.floor(Math.random() * 4) + 1; // +1 to +4 people arriving
        
        return prev.map(s => {
          if (s.id !== randomShelter.id) return s;
          const newOcc = Math.min(s.totalCapacity, s.currentOccupancy + delta);
          const newBeds = Math.max(0, s.totalCapacity - newOcc);
          const newStatus = calculateStatus(newOcc, s.totalCapacity);
          
          return {
            ...s,
            currentOccupancy: newOcc,
            availableBeds: newBeds,
            status: newStatus,
            lastUpdated: 'Simulated just now'
          };
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [simulationActive, country]);

  const toggleSimulation = () => {
    setSimulationActive(prev => !prev);
  };

  const toggleOfflineMode = () => {
    setOfflineMode(prev => {
      const next = !prev;
      if (next) {
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Offline Cache)');
      } else {
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (Live Synced)');
      }
      return next;
    });
  };

  const resetDemoData = () => {
    localStorage.removeItem('shelterx_shelters');
    localStorage.removeItem('shelterx_families');
    localStorage.removeItem('shelterx_resource_requests');
    localStorage.removeItem('shelterx_alerts');
    localStorage.removeItem('shelterx_volunteer_ops');
    setShelters(INITIAL_SHELTERS);
    setFamilies(INITIAL_FAMILIES);
    setResourceRequests(INITIAL_RESOURCE_REQUESTS);
    setAlerts(INITIAL_ALERTS);
    setVolunteerOps(INITIAL_VOLUNTEER_OPPORTUNITIES);
    setNotifications([
      {
        id: `notif-${Date.now()}`,
        title: 'Regional Baseline Reset',
        desc: 'All shelters and operational registers reset to baseline state.',
        type: 'info',
        time: 'Just now',
        read: false
      }
    ]);
  };

  const markNotifRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifs = () => {
    setNotifications([]);
  };

  const locateUserAndFilterNearby = useCallback((onSuccess?: (coords: { lat: number; lng: number }, nearest: Shelter, distKm: number) => void) => {
    setIsLocating(true);

    const applyLocation = (lat: number, lng: number) => {
      setUserLocation({ lat, lng });
      setOnlyNearby15Km(true);
      setCurrentTab('shelters');
      setSearchQuery('');
      setIsLocating(false);

      // Find nearest shelter
      const activeShelters = shelters.filter(s => country === 'ALL' || s.country === country);
      if (activeShelters.length > 0) {
        let nearest = activeShelters[0];
        let minDist = calculateDistanceKm(lat, lng, nearest.lat, nearest.lng);
        for (let i = 1; i < activeShelters.length; i++) {
          const d = calculateDistanceKm(lat, lng, activeShelters[i].lat, activeShelters[i].lng);
          if (d < minDist) {
            minDist = d;
            nearest = activeShelters[i];
          }
        }
        setSelectedShelterId(nearest.id);
        if (onSuccess) {
          onSuccess({ lat, lng }, nearest, minDist);
        }
      }
    };

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          applyLocation(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to primary disaster node if permission denied or timeout
          const fallbackLat = country === 'NPL' ? 27.7172 : 23.0338;
          const fallbackLng = country === 'NPL' ? 85.3240 : 72.5850;
          applyLocation(fallbackLat, fallbackLng);
        },
        { timeout: 4000, maximumAge: 30000 }
      );
    } else {
      const fallbackLat = country === 'NPL' ? 27.7172 : 23.0338;
      const fallbackLng = country === 'NPL' ? 85.3240 : 72.5850;
      applyLocation(fallbackLat, fallbackLng);
    }
  }, [shelters, country]);

  const filteredShelters = useMemo(() => {
    return shelters.filter(s => {
      if (country !== 'ALL' && s.country !== country) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.managerName.toLowerCase().includes(q)
      );
    });
  }, [shelters, country, searchQuery]);

  const selectedShelter = useMemo(() => {
    return shelters.find(s => s.id === selectedShelterId);
  }, [shelters, selectedShelterId]);

  const currentIncident = useMemo(() => {
    return INCIDENTS_DATA.find(i => i.country === country) || INCIDENTS_DATA[0];
  }, [country]);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <AppContext.Provider
      value={{
        country,
        setCountry,
        role,
        setRole,
        currentTab,
        setCurrentTab,
        selectedShelterId,
        setSelectedShelterId,
        selectedShelter,
        shelters,
        filteredShelters,
        families,
        resourceRequests,
        alerts,
        volunteerOps,
        currentIncident,
        registerShelter,
        updateShelterOccupancy,
        setShelterOccupancy,
        updateShelterResource,
        createResourceRequest,
        updateResourceRequestStatus,
        registerFamily,
        transferFamily,
        acknowledgeAlert,
        resolveAlert,
        escalateAlert,
        enrollVolunteer,
        simulationActive,
        toggleSimulation,
        triggerDemoSurgeScenario,
        offlineMode,
        toggleOfflineMode,
        lastSyncTime,
        searchQuery,
        setSearchQuery,
        notifications,
        unreadNotifCount,
        markNotifRead,
        clearAllNotifs,
        theme,
        setTheme,
        toggleTheme,
        userLocation,
        setUserLocation,
        onlyNearby15Km,
        setOnlyNearby15Km,
        locateUserAndFilterNearby,
        isLocating,
        language,
        setLanguage,
        t,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
