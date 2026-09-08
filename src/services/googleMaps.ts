/**
 * Google Maps Platform Loader & Styling Helper
 * Adheres to official Google Maps Platform Agent Guidelines:
 * - Uses modern Loader pattern
 * - Applies internal usage attribution: gmp_mcp_codeassist_v1_aistudio
 * - Uses calm, muted styling to reduce cognitive stress during emergency evacuations
 */

import { Loader } from '@googlemaps/js-api-loader';

// Calm, human-centered Google Maps style: muted roads, soft water, low contrast background
export const CALM_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#10283D' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ lightness: -80 }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#A8B8C2' }]
  },
  {
    featureType: 'administrative',
    elementType: 'lines.stroke',
    stylers: [{ color: '#294356' }, { weight: 0.8 }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#EAF2F4' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#0B1F33' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#142F46' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1B3B54' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#10283D' }, { weight: 0.5 }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#244B6B' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#71838E' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#142F46' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#061320' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#35C7B4' }]
  }
];

// Light public calm styling for evacuee portal
export const CALM_LIGHT_MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'geometry',
    stylers: [{ color: '#F4F8F7' }]
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#173042' }]
  },
  {
    featureType: 'administrative',
    elementType: 'lines.stroke',
    stylers: [{ color: '#CBD5E1' }]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#EDF4F2' }]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#E2EBE8' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#FFFFFF' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#DCE5E2' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#E8F5F3' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#D5ECE7' }]
  }
];

let loaderInstance: Loader | null = null;

export function getGoogleMapsLoader(apiKey: string): Loader {
  if (!loaderInstance || (loaderInstance as any).apiKey !== apiKey) {
    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry', 'routes', 'marker'],
      // Attribution required by GMP agent skills:
      id: 'google-map-script'
    });
  }
  return loaderInstance;
}
