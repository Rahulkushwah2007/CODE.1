import { Shelter, FamilyRequirements, ShelterScoreResult } from '../types';

/**
 * Calculates distance in kilometers between two lat/lng coordinates using Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateTravelTime(distanceKm: number): string {
  if (distanceKm <= 0.5) return '4–6 mins (walk)';
  if (distanceKm <= 1.5) return '12–18 mins (walk)';
  if (distanceKm <= 3.0) return '8–12 mins (vehicle/bus)';
  if (distanceKm <= 6.0) return '15–20 mins (vehicle)';
  const mins = Math.round(distanceKm * 4.5);
  return `~${mins} mins (emergency transit)`;
}

export interface RecommendationCriteria {
  userLat: number;
  userLng: number;
  familySize: number;
  requirements: FamilyRequirements;
  emergencyOverride?: boolean;
}

/**
 * Evaluates shelters using the transparent 5-tier scoring algorithm:
 * 40% Capacity availability
 * 25% Distance
 * 15% Required facilities match
 * 10% Family-size compatibility
 * 10% Occupancy stability (lower occupancy = higher stability)
 */
export function evaluateShelterSuitability(
  shelter: Shelter,
  criteria: RecommendationCriteria
): ShelterScoreResult {
  const distance = calculateDistanceKm(criteria.userLat, criteria.userLng, shelter.lat, shelter.lng);
  const availableCapacity = shelter.totalCapacity - shelter.currentOccupancy;
  const occupancyRatio = shelter.totalCapacity > 0 ? shelter.currentOccupancy / shelter.totalCapacity : 1;
  const capacityFit = availableCapacity >= criteria.familySize;

  const matchReasons: string[] = [];
  const warningFlags: string[] = [];

  // 1. Capacity availability score (40 points max)
  let capacityScore = 0;
  if (availableCapacity > 0) {
    if (availableCapacity >= criteria.familySize * 4) {
      capacityScore = 40;
    } else if (availableCapacity >= criteria.familySize * 2) {
      capacityScore = 32;
    } else if (availableCapacity >= criteria.familySize) {
      capacityScore = 24;
    } else {
      capacityScore = 5;
    }
  }

  // 2. Distance score (25 points max)
  let distanceScore = 0;
  if (distance <= 1.5) {
    distanceScore = 25;
  } else if (distance <= 4.0) {
    distanceScore = 20;
  } else if (distance <= 8.0) {
    distanceScore = 14;
  } else if (distance <= 15.0) {
    distanceScore = 8;
  } else {
    distanceScore = 3;
  }

  // 3. Required facilities match (15 points max)
  let requestedCount = 0;
  let matchedCount = 0;

  if (criteria.requirements.medicalAssistance) {
    requestedCount++;
    if (shelter.facilities.medicalSupport) {
      matchedCount++;
      matchReasons.push('Medical aid on-site with triage personnel');
    } else {
      warningFlags.push('No dedicated medical team stationed');
    }
  }

  if (criteria.requirements.wheelchairAccessible) {
    requestedCount++;
    if (shelter.facilities.wheelchairAccessible) {
      matchedCount++;
      matchReasons.push('Ramp and wheelchair accessibility confirmed');
    } else {
      warningFlags.push('Limited accessibility / step access');
    }
  }

  if (criteria.requirements.childFriendly) {
    requestedCount++;
    if (shelter.facilities.childFriendly) {
      matchedCount++;
      matchReasons.push('Designated child safe and nutritional zone');
    }
  }

  if (criteria.requirements.womenSafeSpace) {
    requestedCount++;
    if (shelter.facilities.womenSafeSpace) {
      matchedCount++;
      matchReasons.push('Dedicated women & family partitioned enclosure');
    }
  }

  if (criteria.requirements.food) {
    requestedCount++;
    if (shelter.facilities.foodAvailable && shelter.resources.foodRations.available > 50) {
      matchedCount++;
      matchReasons.push('Community kitchen & hot meals serving');
    } else {
      warningFlags.push('Food stocks running limited');
    }
  }

  if (criteria.requirements.water) {
    requestedCount++;
    if (shelter.facilities.drinkingWater && shelter.resources.drinkingWater.available > 300) {
      matchedCount++;
      matchReasons.push('Certified potable water supply available');
    } else {
      warningFlags.push('Drinking water supply constrained');
    }
  }

  if (criteria.requirements.beds) {
    requestedCount++;
    if (shelter.availableBeds >= criteria.familySize) {
      matchedCount++;
      matchReasons.push(`${shelter.availableBeds} beds currently unoccupied`);
    } else {
      warningFlags.push(`Only ${shelter.availableBeds} beds available (needed ${criteria.familySize})`);
    }
  }

  if (criteria.requirements.petFriendly) {
    requestedCount++;
    if (shelter.facilities.petFriendly) {
      matchedCount++;
      matchReasons.push('Designated pet shelter holding area');
    } else {
      warningFlags.push('Pets strictly prohibited by facility management');
    }
  }

  const facilityScore = requestedCount > 0 ? (matchedCount / requestedCount) * 15 : 15;

  // 4. Family-size compatibility (10 points max)
  let familyFitScore = 0;
  if (capacityFit) {
    familyFitScore = 10;
    matchReasons.push(`Can accommodate all ${criteria.familySize} family members together`);
  } else {
    familyFitScore = 0;
    warningFlags.push(`Insufficient capacity for family group (${availableCapacity} beds vs ${criteria.familySize} required)`);
  }

  // 5. Occupancy stability (10 points max)
  let stabilityScore = 0;
  const occupancyPct = Math.round(occupancyRatio * 100);
  if (occupancyPct < 50) {
    stabilityScore = 10;
    matchReasons.push(`Optimal vacancy buffer (${occupancyPct}% occupied)`);
  } else if (occupancyPct < 70) {
    stabilityScore = 8;
    matchReasons.push(`Balanced capacity (${occupancyPct}% occupied)`);
  } else if (occupancyPct < 90) {
    stabilityScore = 4;
    warningFlags.push(`Nearing capacity threshold (${occupancyPct}% occupied)`);
  } else {
    stabilityScore = 1;
    warningFlags.push(`Critical occupancy level (${occupancyPct}% occupied)`);
  }

  // Total Score
  let totalScore = Math.round(capacityScore + distanceScore + facilityScore + familyFitScore + stabilityScore);

  // If no capacity fit and no emergency override, penalize heavily
  if (!capacityFit && !criteria.emergencyOverride) {
    totalScore = Math.min(totalScore, 35);
  }

  matchReasons.push(`${distance} km distance (~${estimateTravelTime(distance)})`);

  return {
    shelter,
    score: totalScore,
    distanceKm: distance,
    estimatedTravelTime: estimateTravelTime(distance),
    matchReasons,
    warningFlags,
    capacityFit
  };
}

export function rankShelters(
  shelters: Shelter[],
  criteria: RecommendationCriteria
): ShelterScoreResult[] {
  return shelters
    .map(s => evaluateShelterSuitability(s, criteria))
    .sort((a, b) => b.score - a.score);
}
