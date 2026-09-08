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
  FamilyRequirements
} from '../types';
import {
  INITIAL_SHELTERS,
  INITIAL_FAMILIES,
  INITIAL_RESOURCE_REQUESTS,
  INITIAL_ALERTS,
  INITIAL_VOLUNTEER_OPPORTUNITIES,
  INCIDENTS_DATA
} from '../data/mockData';

export type NavigationTab =
  | 'landing'
  | 'finder'
  | 'map'
  | 'shelters'
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
  
  // Reset demo data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<Country>('IND');
  const [role, setRole] = useState<UserRole>('district_admin');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('command');
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>('SH-IND-AHM-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [simulationActive, setSimulationActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('10:46 AM (Live)');

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
