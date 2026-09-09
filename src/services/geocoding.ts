/**
 * Geocoding Service for RESQTECH
 * Supports live geocoding of ANY location, city, neighborhood, or address in India, Nepal, and worldwide.
 * Uses Google Maps Geocoding API if key is available, with instant Nominatim OpenStreetMap fallback.
 */

export interface GeocodedLocation {
  displayName: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lng: number;
}

// In-memory cache to avoid duplicate network queries
const geocodeCache = new Map<string, GeocodedLocation[]>();

export async function searchLocations(query: string, apiKey: string = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '')): Promise<GeocodedLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = `${trimmed.toLowerCase()}_${apiKey ? 'g' : 'osm'}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // 1. Try Google Maps Geocoding API if an API key is available
  if (apiKey) {
    try {
      const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        trimmed
      )}&key=${apiKey}`;
      const res = await fetch(googleUrl);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const results: GeocodedLocation[] = data.results.slice(0, 6).map((item: any) => {
            const loc = item.geometry.location;
            return {
              displayName: item.formatted_address,
              name: item.address_components?.[0]?.long_name || item.formatted_address.split(',')[0],
              lat: loc.lat,
              lng: loc.lng
            };
          });
          geocodeCache.set(cacheKey, results);
          return results;
        }
      }
    } catch (e) {
      console.warn('Google Geocoding error, falling back to OSM:', e);
    }
  }

  // 2. OpenStreetMap Nominatim Live Geocoding
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      trimmed
    )}&limit=6&addressdetails=1`;
    const res = await fetch(osmUrl, {
      headers: {
        'Accept-Language': 'en'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const results: GeocodedLocation[] = data.map((item: any) => {
          const addr = item.address || {};
          const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
          const state = addr.state || '';
          const country = addr.country || '';
          const shortName = item.name || city || item.display_name.split(',')[0];
          return {
            displayName: item.display_name,
            name: shortName,
            city,
            state,
            country,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          };
        });
        geocodeCache.set(cacheKey, results);
        return results;
      }
    }
  } catch (err) {
    console.warn('Live geocoding lookup failed:', err);
  }

  return [];
}
