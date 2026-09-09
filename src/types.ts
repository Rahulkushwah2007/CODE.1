export type Country = 'IND' | 'NPL' | 'ALL';

export type UserRole = 
  | 'public' 
  | 'staff' 
  | 'manager' 
  | 'volunteer' 
  | 'district_admin' 
  | 'super_admin';

export type ShelterOwnership = 'Public / Government' | 'Private';

export type ShelterType = 
  | 'Government Relief Camp' 
  | 'School' 
  | 'Community Hall' 
  | 'Stadium' 
  | 'Hospital-supported shelter' 
  | 'NGO shelter' 
  | 'Temporary camp' 
  | 'Emergency evacuation center' 
  | 'Religious / Community Facility'
  | 'Private Hotel / Resort'
  | 'Private Marriage Hall / Banquet'
  | 'Private Residential / Corporate Facility';

export type ShelterStatus = 'AVAILABLE' | 'LIMITED' | 'CRITICAL' | 'FULL';

export interface ShelterFacilities {
  medicalSupport: boolean;
  foodAvailable: boolean;
  drinkingWater: boolean;
  beds: boolean;
  toilets: number;
  powerBackup: boolean;
  wheelchairAccessible: boolean;
  childFriendly: boolean;
  womenSafeSpace: boolean;
  petFriendly: boolean;
}

export interface ResourceDetail {
  available: number;
  required: number;
  unit: string;
}

export interface ShelterResources {
  beds: ResourceDetail;
  foodRations: ResourceDetail;
  drinkingWater: ResourceDetail;
  medicalKits: ResourceDetail;
  blankets: ResourceDetail;
  hygieneKits: ResourceDetail;
}

export interface ShelterVerification {
  aadhaarId: string;
  aadhaarHolderName: string;
  policeStation: string;
  policeVerificationId: string;
  policeStationPhone: string;
  verificationDate: string;
  verifiedByOfficer: string;
  isVerified: boolean;
  clearanceStatus?: 'VERIFIED_ACTIVE' | 'AUDIT_PASSED';
}

export interface Shelter {
  id: string;
  name: string;
  type: ShelterType;
  address: string;
  country: Country;
  state: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  totalCapacity: number;
  currentOccupancy: number;
  availableBeds: number;
  managerName: string;
  managerRole: string;
  managingOrg: string;
  phone: string;
  email: string;
  emergencyCoordinator: string;
  facilities: ShelterFacilities;
  resources: ShelterResources;
  status: ShelterStatus;
  ownership?: ShelterOwnership;
  isPrivate?: boolean;
  lastUpdated: string;
  verification?: ShelterVerification;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  category: 'Adult' | 'Child' | 'Elderly';
  hasDisability: boolean;
  medicalCondition: string;
}

export interface FamilyRequirements {
  food: boolean;
  water: boolean;
  beds: boolean;
  medicalAssistance: boolean;
  wheelchairAccessible: boolean;
  childFriendly: boolean;
  womenSafeSpace: boolean;
  petFriendly: boolean;
}

export type FamilyStatus = 'Registered' | 'Awaiting Shelter' | 'Sheltered' | 'Transferred' | 'Exited';

export interface Family {
  id: string;
  headOfFamily: string;
  mobile: string;
  membersCount: number;
  members: FamilyMember[];
  requirements: FamilyRequirements;
  assignedShelterId: string;
  registeredAt: string;
  status: FamilyStatus;
  transferHistory?: {
    fromShelterId: string;
    toShelterId: string;
    reason: string;
    timestamp: string;
  }[];
}

export type ResourcePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ResourceRequestStatus = 'Pending' | 'Approved' | 'Dispatched' | 'Delivered';

export interface ResourceRequest {
  id: string;
  shelterId: string;
  shelterName: string;
  resourceName: string;
  quantity: number;
  unit: string;
  priority: ResourcePriority;
  requestedBy: string;
  requestedAt: string;
  status: ResourceRequestStatus;
  notes?: string;
}

export type AlertCategory = 
  | 'Emergency' 
  | 'Capacity' 
  | 'Resource' 
  | 'Medical' 
  | 'Weather' 
  | 'Infrastructure' 
  | 'Evacuation';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface AlertItem {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  shelterId?: string;
  location: string;
  title: string;
  description: string;
  recommendedAction: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface VolunteerOpportunity {
  id: string;
  shelterId: string;
  shelterName: string;
  location: string;
  title: string;
  urgency: 'URGENT' | 'HIGH' | 'NORMAL';
  neededRoles: string[];
  volunteersNeeded: number;
  volunteersEnrolled: number;
  description: string;
  contact: string;
}

export interface Incident {
  id: string;
  name: string;
  type: 'Flood' | 'Earthquake' | 'Cyclone' | 'Landslide';
  country: Country;
  region: string;
  severity: 'HIGH' | 'CRITICAL' | 'EXTREME';
  affectedPopulationEst: string;
  activeSince: string;
  evacuationOrders: string;
}

export interface ShelterScoreResult {
  shelter: Shelter;
  score: number;
  distanceKm: number;
  estimatedTravelTime: string;
  matchReasons: string[];
  warningFlags: string[];
  capacityFit: boolean;
}
