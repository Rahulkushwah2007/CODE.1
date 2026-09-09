import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Shelter, ShelterType, ShelterStatus } from '../types';
import L from 'leaflet';
import {
  Navigation,
  Layers,
  Filter,
  Info,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ArrowUpRight,
  Crosshair,
  ShieldAlert,
  Building,
  Activity,
  HeartPulse,
  Utensils,
  Droplet,
  Compass,
  Search,
  X,
  MapPin,
  Car,
  Footprints,
  Bus,
  Share2,
  Star,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  Award,
  Loader2,
  Radio
} from 'lucide-react';
import { searchLocations } from '../services/geocoding';

interface ShelterMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  highlightShelterId?: string | null;
  onSelectShelter?: (shelter: Shelter) => void;
  onOpenSOS?: () => void;
}

type MapLayerType = 'street' | 'satellite' | 'terrain' | 'dark';

interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'shelter' | 'city' | 'province';
  lat: number;
  lng: number;
  shelter?: Shelter;
}

export const ShelterMap: React.FC<ShelterMapProps> = ({
  initialCenter,
  initialZoom,
  highlightShelterId,
  onSelectShelter,
  onOpenSOS
}) => {
  const { country, setCountry, shelters, setSelectedShelterId, setCurrentTab } = useApp();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Active Map View State
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('street');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Region Scope Filter: 'ALL' | 'IND' | 'NPL'
  const [regionScope, setRegionScope] = useState<'ALL' | 'IND' | 'NPL'>('ALL');

  // Search and Autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [liveGeocodedResults, setLiveGeocodedResults] = useState<SearchSuggestion[]>([]);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchedMarkerRef = useRef<L.Marker | null>(null);

  // Selected Place / Shelter Drawer
  const [selectedPlace, setSelectedPlace] = useState<Shelter | null>(null);

  // Route & Directions State
  const [directionsActive, setDirectionsActive] = useState<boolean>(false);
  const [targetDirectionsShelter, setTargetDirectionsShelter] = useState<Shelter | null>(null);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bus'>('driving');
  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMins: number;
    originCoords: [number, number];
    destCoords: [number, number];
  } | null>(null);

  // Filter Chips & Drawer
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [filterMedical, setFilterMedical] = useState<boolean>(false);
  const [filterFood, setFilterFood] = useState<boolean>(false);
  const [filterWater, setFilterWater] = useState<boolean>(false);
  const [filterWheelchair, setFilterWheelchair] = useState<boolean>(false);
  const [filterPets, setFilterPets] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // User Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base Tile Layer Configurations
  const TILE_CONFIGS: Record<MapLayerType, { url: string; attribution: string; maxZoom: number; hasLabelsOverlay?: boolean }> = {
    street: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap, &copy; CARTO Voyager',
      maxZoom: 20
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
      maxZoom: 19,
      hasLabelsOverlay: true
    },
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
      maxZoom: 17
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }
  };

  // Filter Shelters by Region Scope and Facilities
  const activeShelters = useMemo(() => {
    return shelters.filter(s => {
      // Region filter
      if (regionScope === 'IND' && s.country !== 'IND') return false;
      if (regionScope === 'NPL' && s.country !== 'NPL') return false;
      
      // Type & Status
      if (selectedType !== 'ALL' && s.type !== selectedType) return false;
      if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
      
      // Amenities
      if (filterMedical && !s.facilities.medicalSupport) return false;
      if (filterFood && !s.facilities.foodAvailable) return false;
      if (filterWater && !s.facilities.drinkingWater) return false;
      if (filterWheelchair && !s.facilities.wheelchairAccessible) return false;
      if (filterPets && !s.facilities.petFriendly) return false;
      
      return true;
    });
  }, [
    shelters,
    regionScope,
    selectedType,
    selectedStatus,
    filterMedical,
    filterFood,
    filterWater,
    filterWheelchair,
    filterPets
  ]);

  // Major Cities & Disaster Hubs Directory for Quick Jump & Autocomplete
  const STRATEGIC_CITIES = useMemo(() => [
    // India Cities
    { name: 'New Delhi / NCR', state: 'Delhi NCR', country: 'IND', lat: 28.6139, lng: 77.2090, desc: 'National Capital Region & Yamuna Floodplain' },
    { name: 'Mumbai', state: 'Maharashtra', country: 'IND', lat: 19.0760, lng: 72.8777, desc: 'Financial Capital, Coastal & Mithi River Zone' },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'IND', lat: 23.0225, lng: 72.5714, desc: 'Sabarmati Basin Disaster Management Command' },
    { name: 'Kolkata', state: 'West Bengal', country: 'IND', lat: 22.5726, lng: 88.3639, desc: 'Hooghly Basin & Sundarbans Cyclone Gateway' },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'IND', lat: 13.0827, lng: 80.2707, desc: 'Coromandel Coastal & Adyar River Inundation Area' },
    { name: 'Bengaluru', state: 'Karnataka', country: 'IND', lat: 12.9716, lng: 77.5946, desc: 'Urban Valley Rain & Disaster Response Depot' },
    { name: 'Guwahati', state: 'Assam', country: 'IND', lat: 26.1445, lng: 91.7362, desc: 'Brahmaputra Flood Plain Command & Logistics Base' },
    { name: 'Patna', state: 'Bihar', country: 'IND', lat: 25.5941, lng: 85.1376, desc: 'Ganga-Gandak-Kosi Flood Inundation Center' },
    { name: 'Bhubaneswar', state: 'Odisha', country: 'IND', lat: 20.2961, lng: 85.8245, desc: 'State EOC & Bay of Bengal Cyclone Resilience Center' },
    { name: 'Kochi', state: 'Kerala', country: 'IND', lat: 9.9312, lng: 76.2673, desc: 'Arabian Sea Coastal & Monsoon Inundation Hub' },
    { name: 'Srinagar', state: 'Jammu & Kashmir', country: 'IND', lat: 34.0837, lng: 74.7973, desc: 'Jhelum River Basin Flood Control' },
    { name: 'Shimla', state: 'Himachal Pradesh', country: 'IND', lat: 31.1048, lng: 77.1734, desc: 'Himalayan Ridge Cloudburst & Landslide Response' },
    { name: 'Rishikesh / Dehradun', state: 'Uttarakhand', country: 'IND', lat: 30.0869, lng: 78.2676, desc: 'Ganga Basin Disaster & Flash Flood Command' },
    { name: 'Surat', state: 'Gujarat', country: 'IND', lat: 21.1702, lng: 72.8311, desc: 'Tapi River Basin Flood Mitigation Hub' },
    { name: 'Pune', state: 'Maharashtra', country: 'IND', lat: 18.5204, lng: 73.8567, desc: 'Western Ghats Inundation Relief Complex' },
    { name: 'Hyderabad', state: 'Telangana', country: 'IND', lat: 17.3850, lng: 78.4867, desc: 'Musi River Flood Refuge & Logistics Depot' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'IND', lat: 17.6868, lng: 83.2185, desc: 'Eastern Seaboard Cyclone Refuge Citadel' },

    // Nepal Cities
    { name: 'Kathmandu Valley', state: 'Bagmati Province', country: 'NPL', lat: 27.7172, lng: 85.3240, desc: 'Central Capital, Bagmati & Bishnumati River Basins' },
    { name: 'Pokhara', state: 'Gandaki Province', country: 'NPL', lat: 28.2096, lng: 83.9856, desc: 'Annapurna Mountain Foothills & Seti River Basin' },
    { name: 'Lalitpur (Patan)', state: 'Bagmati Province', country: 'NPL', lat: 27.6644, lng: 85.3188, desc: 'Historical Valley Urban Resilience Area' },
    { name: 'Bhaktapur', state: 'Bagmati Province', country: 'NPL', lat: 27.6710, lng: 85.4298, desc: 'Eastern Kathmandu Valley Relief Sector' },
    { name: 'Biratnagar', state: 'Koshi Province', country: 'NPL', lat: 26.4525, lng: 87.2718, desc: 'Koshi Floodplain & Eastern Terai Emergency Center' },
    { name: 'Dharan', state: 'Koshi Province', country: 'NPL', lat: 26.8124, lng: 87.2835, desc: 'BPKIHS Regional Medical Disaster Relief Base' },
    { name: 'Janakpur', state: 'Madhesh Province', country: 'NPL', lat: 26.7297, lng: 85.9248, desc: 'Southern Terai Embankment & Flood Relief Center' },
    { name: 'Birgunj', state: 'Madhesh Province', country: 'NPL', lat: 27.0134, lng: 84.8783, desc: 'Narayani Commercial Border Disaster Corridor' },
    { name: 'Butwal', state: 'Lumbini Province', country: 'NPL', lat: 27.7006, lng: 83.4484, desc: 'Tinau River Basin Flood Evacuation Center' },
    { name: 'Nepalgunj', state: 'Lumbini Province', country: 'NPL', lat: 28.0500, lng: 81.6167, desc: 'Mid-Western Terai Border Evacuation Hub' },
    { name: 'Surkhet (Birendranagar)', state: 'Karnali Province', country: 'NPL', lat: 28.5906, lng: 81.6289, desc: 'Karnali Air-Bridge Disaster Logistics Depot' },
    { name: 'Dhangadhi', state: 'Sudurpashchim Province', country: 'NPL', lat: 28.6944, lng: 80.5908, desc: 'Mahakali River Basin Flood Emergency Camp' },
    { name: 'Gorkha', state: 'Gandaki Province', country: 'NPL', lat: 28.0054, lng: 84.6294, desc: 'Historical Seismic Resilience Relief Station' }
  ], []);

  // Debounced live geocoding for ANY searched location across India, Nepal, or globally
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setLiveGeocodedResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      try {
        const locations = await searchLocations(searchQuery);
        const geoSuggestions: SearchSuggestion[] = locations.map((loc, idx) => ({
          id: `live-geo-${idx}-${loc.lat}`,
          title: loc.name,
          subtitle: loc.displayName,
          type: 'city',
          lat: loc.lat,
          lng: loc.lng
        }));
        setLiveGeocodedResults(geoSuggestions);
      } catch (err) {
        console.warn('Geocoding lookup error:', err);
      } finally {
        setIsGeocoding(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Live Autocomplete Suggestions combining live geocoding, verified shelters, and strategic cities
  const searchSuggestions = useMemo<SearchSuggestion[]>(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: SearchSuggestion[] = [];

    // 1. Live Geocoded Places
    liveGeocodedResults.forEach(item => {
      results.push(item);
    });

    // 2. Match Shelters
    shelters.forEach(s => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      ) {
        results.push({
          id: s.id,
          title: s.name,
          subtitle: `${s.type} • ${s.city}, ${s.state} (${s.country === 'IND' ? 'India' : 'Nepal'})`,
          type: 'shelter',
          lat: s.lat,
          lng: s.lng,
          shelter: s
        });
      }
    });

    // 3. Match Strategic Cities (fallback / quick landmarks)
    STRATEGIC_CITIES.forEach((c, idx) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
      ) {
        if (!results.some(r => Math.abs(r.lat - c.lat) < 0.05 && Math.abs(r.lng - c.lng) < 0.05)) {
          results.push({
            id: `city-${idx}`,
            title: c.name,
            subtitle: `${c.desc} • ${c.country === 'IND' ? 'India' : 'Nepal'}`,
            type: 'city',
            lat: c.lat,
            lng: c.lng
          });
        }
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, shelters, STRATEGIC_CITIES, liveGeocodedResults]);

  // Handle Geolocation with High Accuracy
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1.5 });

          // Update user location marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
          } else {
            const userIcon = L.divIcon({
              className: 'custom-user-marker',
              html: `
                <div class="relative flex items-center justify-center">
                  <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-blue-500 opacity-60"></span>
                  <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-2xl"></div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });
            userMarkerRef.current = L.marker([coords.lat, coords.lng], { icon: userIcon })
              .addTo(mapInstanceRef.current)
              .bindPopup('<b>Your Current Location</b><br/><span class="text-xs text-[#CBD5E1]">GPS high accuracy fix</span>')
              .openPopup();
          }
        }
        showToast('📍 Centered on your current location');
      },
      err => {
        setIsLocating(false);
        if (err.code === 1) {
          setLocationError('Location access was denied. You can select a city from the quick jump menu.');
        } else {
          setLocationError('Could not retrieve current location.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Reset Map View to Subcontinent, India, or Nepal
  const handleSetRegion = (scope: 'ALL' | 'IND' | 'NPL') => {
    setRegionScope(scope);
    if (!mapInstanceRef.current) return;

    if (scope === 'ALL') {
      // Subcontinent Center (covers India and Nepal)
      mapInstanceRef.current.flyTo([23.5937, 81.9629], 5, { duration: 1.2 });
      showToast('🌏 Viewing all shelters across India & Nepal');
    } else if (scope === 'IND') {
      // India Center
      mapInstanceRef.current.flyTo([22.5937, 78.9629], 5.5, { duration: 1.2 });
      showToast('🇮🇳 Filtered to shelters across India (NDMA)');
    } else if (scope === 'NPL') {
      // Nepal Center
      mapInstanceRef.current.flyTo([28.3949, 84.1240], 7.5, { duration: 1.2 });
      showToast('🇳🇵 Filtered to shelters across Nepal (NDRRMA)');
    }
  };

  // Fly to specific coordinates with optional shelter selection
  const handleFlyToLocation = (lat: number, lng: number, zoom: number = 14, shelterToSelect?: Shelter) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.4 });
    setShowSuggestions(false);
    setSearchQuery('');

    if (shelterToSelect) {
      setSelectedPlace(shelterToSelect);
      setSelectedShelterId(shelterToSelect.id);
    }
  };

  // Handle suggestion selection from search dropdown
  const handleSelectSuggestion = (item: SearchSuggestion) => {
    if (item.shelter) {
      handleFlyToLocation(item.lat, item.lng, 15, item.shelter);
    } else {
      // Place / City / Geocoded search result
      handleFlyToLocation(item.lat, item.lng, 13);
      if (mapInstanceRef.current) {
        if (searchedMarkerRef.current) {
          mapInstanceRef.current.removeLayer(searchedMarkerRef.current);
        }
        const searchIcon = L.divIcon({
          className: 'searched-place-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-[#3B82F6] opacity-30"></span>
              <div class="w-8 h-8 rounded-full bg-[#3B82F6] border-2 border-[#0A1120] shadow-xl flex items-center justify-center text-[#0A1120] font-bold text-xs">
                📍
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        searchedMarkerRef.current = L.marker([item.lat, item.lng], { icon: searchIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<div style="padding:4px;"><strong style="color:#0A1120;font-size:13px;">${item.title}</strong><br/><span style="font-size:11px;color:#94A3B8;">${item.subtitle}</span></div>`)
          .openPopup();
      }
      showToast(`📍 Located: ${item.title}`);
    }
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // Submit search query directly (e.g. on Enter key)
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchSuggestions.length > 0) {
      handleSelectSuggestion(searchSuggestions[0]);
    } else {
      setIsGeocoding(true);
      try {
        const locations = await searchLocations(searchQuery);
        if (locations.length > 0) {
          const first = locations[0];
          handleSelectSuggestion({
            id: 'direct-geo',
            title: first.name,
            subtitle: first.displayName,
            type: 'city',
            lat: first.lat,
            lng: first.lng
          });
        } else {
          showToast(`No coordinates found for "${searchQuery}". Please check spelling.`);
        }
      } catch {
        showToast('Search lookup error. Please try again.');
      } finally {
        setIsGeocoding(false);
      }
    }
  };

  // Switch Map Tile Layer (Street, Satellite, Terrain, Dark)
  const switchBaseLayer = (layerType: MapLayerType) => {
    if (!mapInstanceRef.current) return;
    setActiveLayer(layerType);
    setShowLayerMenu(false);

    // Remove existing tile layer
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    if (labelLayerRef.current) {
      mapInstanceRef.current.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    const config = TILE_CONFIGS[layerType];
    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: 'abcd',
      attribution: config.attribution
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;

    // For Satellite imagery, add crisp hybrid road labels overlay so street names stay readable
    if (config.hasLabelsOverlay) {
      const labelLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        opacity: 0.95
      }).addTo(mapInstanceRef.current);
      labelLayerRef.current = labelLayer;
    }

    showToast(`Switched to ${layerType.toUpperCase()} map mode`);
  };

  // Calculate & Render Google-style Directions Route
  const startDirections = (shelter: Shelter) => {
    setTargetDirectionsShelter(shelter);
    setDirectionsActive(true);

    // Default origin: User GPS if available, else approximate regional capital
    let originLat = userLocation ? userLocation.lat : shelter.country === 'IND' ? 28.6139 : 27.7172;
    let originLng = userLocation ? userLocation.lng : shelter.country === 'IND' ? 77.2090 : 85.3240;

    // If user has not enabled GPS, calculate relative route from local dispatch staging area
    if (!userLocation) {
      originLat = shelter.lat + 0.045;
      originLng = shelter.lng - 0.035;
    }

    const destLat = shelter.lat;
    const destLng = shelter.lng;

    // Distance calculation using Haversine with a 1.28x road tortuosity factor
    const R = 6371; // Earth radius in km
    const dLat = ((destLat - originLat) * Math.PI) / 180;
    const dLng = ((destLng - originLng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originLat * Math.PI) / 180) *
        Math.cos((destLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;
    const roadKm = Math.max(1.2, Math.round(straightKm * 1.28 * 10) / 10);

    // Travel time estimates
    let speedKmh = 38; // Driving
    if (travelMode === 'walking') speedKmh = 4.5;
    if (travelMode === 'bus') speedKmh = 25;

    const durationMins = Math.max(5, Math.round((roadKm / speedKmh) * 60));

    setRouteInfo({
      distanceKm: roadKm,
      durationMins,
      originCoords: [originLat, originLng],
      destCoords: [destLat, destLng]
    });

    // Draw Route on Map
    if (mapInstanceRef.current && routeLayerRef.current) {
      routeLayerRef.current.clearLayers();

      // Synthesize realistic intermediate road bend coordinates
      const midLat = (originLat + destLat) / 2 + 0.008;
      const midLng = (originLng + destLng) / 2 - 0.006;
      const waypoints: [number, number][] = [
        [originLat, originLng],
        [originLat + (midLat - originLat) * 0.5, originLng + (midLng - originLng) * 0.4],
        [midLat, midLng],
        [midLat + (destLat - midLat) * 0.6, midLng + (destLng - midLng) * 0.7],
        [destLat, destLng]
      ];

      // Route Outer Border (Navy / Blue Shadow)
      const borderLine = L.polyline(waypoints, {
        color: '#1e3a8a',
        weight: 8,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Route Inner Core (Vibrant Blue Google style)
      const innerLine = L.polyline(waypoints, {
        color: '#3b82f6',
        weight: 5,
        opacity: 1.0,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Origin Marker Icon
      const startIcon = L.divIcon({
        className: 'route-start-marker',
        html: `
          <div class="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl text-white font-bold text-xs">
            A
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      // Destination Marker Icon
      const endIcon = L.divIcon({
        className: 'route-dest-marker',
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-xl text-white font-bold text-xs">
            B
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const startMarker = L.marker([originLat, originLng], { icon: startIcon }).bindPopup('<b>Starting Location</b><br/>Safe evacuation departure point');
      const endMarker = L.marker([destLat, destLng], { icon: endIcon }).bindPopup(`<b>${shelter.name}</b><br/>${shelter.address}`);

      routeLayerRef.current.addLayer(borderLine);
      routeLayerRef.current.addLayer(innerLine);
      routeLayerRef.current.addLayer(startMarker);
      routeLayerRef.current.addLayer(endMarker);

      // Fit map bounds to view both points
      const bounds = L.latLngBounds(waypoints);
      mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  };

  // Clear directions route
  const clearDirections = () => {
    setDirectionsActive(false);
    setTargetDirectionsShelter(null);
    setRouteInfo(null);
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
    showToast('Directions cleared');
  };

  // Initialize Map Engine
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Subcontinent overview coordinates
      const defaultCenter: [number, number] = initialCenter || [23.5937, 81.9629];
      const defaultZoom = initialZoom || 5;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false, // We supply custom Google Maps styled zoom buttons
        attributionControl: false
      });

      // Street default layer
      const config = TILE_CONFIGS.street;
      const tileLayer = L.tileLayer(config.url, {
        maxZoom: config.maxZoom,
        subdomains: 'abcd',
        attribution: config.attribution
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Attribution
      L.control
        .attribution({ position: 'bottomright' })
        .addAttribution('&copy; <a href="https://openstreetmap.org" target="_blank">OSM</a> &copy; <a href="https://carto.com/" target="_blank">CARTO</a>')
        .addTo(map);

      // Scale control in bottom-left like Google Maps
      L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

      // Markers & Route layers
      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;

      const routeGroup = L.layerGroup().addTo(map);
      routeLayerRef.current = routeGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when country context changes outside this component
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (country === 'ALL') {
      setRegionScope('ALL');
      mapInstanceRef.current.flyTo([23.5937, 81.9629], 5, { duration: 1.2 });
    } else if (country === 'IND') {
      setRegionScope('IND');
      mapInstanceRef.current.flyTo([22.5937, 78.9629], 5.5, { duration: 1.2 });
    } else if (country === 'NPL') {
      setRegionScope('NPL');
      mapInstanceRef.current.flyTo([28.3949, 84.1240], 7.5, { duration: 1.2 });
    }
  }, [country]);

  // Render Google-style Pins on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    activeShelters.forEach(shelter => {
      const occupancyRatio = shelter.totalCapacity > 0 ? shelter.currentOccupancy / shelter.totalCapacity : 0;
      const occupancyPct = Math.round(occupancyRatio * 100);

      // Calm Color System Status Colors
      // Green #35B779 (< 70%), Amber #E5B84B (70-90%), Red #E85D5D (>= 90%)
      let pinColor = '#35B779';
      let pulseHtml = '';
      if (occupancyPct >= 90) {
        pinColor = '#E85D5D';
        // Soft marker halo rather than jarring flashing, subtle pulse
        pulseHtml = '<span class="animate-pulse absolute inline-flex h-10 w-10 rounded-full bg-[#E85D5D] opacity-30"></span>';
      } else if (occupancyPct >= 70) {
        pinColor = '#E5B84B';
      }

      const isSelected = selectedPlace?.id === shelter.id || highlightShelterId === shelter.id;

      // Google Maps Teardrop Marker with Occupancy % inside
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${pulseHtml}
          <div class="relative flex flex-col items-center transition-transform group-hover:scale-125 ${
            isSelected ? 'scale-125 z-50' : ''
          }">
            <div 
              style="background-color: ${pinColor}; border-color: #ffffff;" 
              class="w-8 h-8 rounded-full border-2 shadow-xl flex items-center justify-center font-mono text-[10px] font-bold text-white ${
                isSelected ? 'ring-4 ring-[#3B82F6]' : ''
              }"
            >
              ${occupancyPct}%
            </div>
            <div 
              style="border-top-color: ${pinColor};" 
              class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-0.5"
            ></div>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'google-shelter-pin',
        html: markerHtml,
        iconSize: [32, 40],
        iconAnchor: [16, 38]
      });

      const marker = L.marker([shelter.lat, shelter.lng], { icon });

      // Click pin: open Google Maps place drawer
      marker.on('click', () => {
        setSelectedPlace(shelter);
        setSelectedShelterId(shelter.id);
        if (onSelectShelter) {
          onSelectShelter(shelter);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([shelter.lat, shelter.lng], { animate: true });
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [activeShelters, selectedPlace, highlightShelterId, onSelectShelter, setSelectedShelterId]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    const container = document.getElementById('gis-shelter-map-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      id="gis-shelter-map-container"
      className="relative w-full h-[620px] lg:h-[720px] rounded-2xl overflow-hidden border border-[#243656] bg-[#0A1120] shadow-2xl font-sans select-none"
    >
      {/* Map Leaflet Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* ============================================================ */}
      {/* GOOGLE MAPS TOP FLOATING SEARCH & FILTER BAR */}
      {/* ============================================================ */}
      <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[420px] z-30 flex flex-col gap-2">
        {/* Google Maps Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full bg-[#111C30]/95 backdrop-blur-xl border border-[#243656] rounded-2xl shadow-xl p-1.5 flex items-center gap-2 text-[#F8FAFC]"
        >
          <div className="p-2 text-[#3B82F6]">
            {isGeocoding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>

          <input
            ref={searchInputRef}
            id="map-google-search-input"
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search any location, city, neighborhood, or shelter..."
            className="w-full bg-transparent border-none text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-0"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-full transition-colors cursor-pointer"
              title="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="h-6 w-px bg-[#243656] my-1"></div>

          {/* Quick Directions Shortcut in Search Bar */}
          <button
            type="button"
            onClick={() => {
              if (selectedPlace) {
                startDirections(selectedPlace);
              } else if (activeShelters.length > 0) {
                startDirections(activeShelters[0]);
              }
            }}
            className="p-2 text-[#3B82F6] hover:text-[#2563EB] hover:bg-[#182742] rounded-xl transition-colors cursor-pointer"
            title="Directions"
          >
            <Navigation className="w-5 h-5" />
          </button>
        </form>

        {/* Search Autocomplete Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div
            id="map-search-suggestions-dropdown"
            className="w-full bg-[#111C30]/98 backdrop-blur-xl border border-[#243656] rounded-2xl shadow-2xl overflow-hidden divide-y divide-[#243656] animate-in fade-in slide-in-from-top-2"
          >
            {searchSuggestions.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-[#182742] transition-colors flex items-start gap-3 cursor-pointer"
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-[#0A1120] border border-[#243656] shrink-0">
                  {item.type === 'shelter' ? (
                    <Building className="w-4 h-4 text-[#3B82F6]" />
                  ) : (
                    <MapPin className="w-4 h-4 text-[#E5B84B]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-[#F8FAFC] truncate">{item.title}</div>
                  <div className="text-[11px] text-[#CBD5E1] truncate">{item.subtitle}</div>
                </div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#0A1120] text-[#CBD5E1] border border-[#243656] shrink-0">
                  {item.type}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Quick Filter Chips (Google Maps Style) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pointer-events-auto">
          {/* Scope Pills */}
          <button
            onClick={() => handleSetRegion('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all cursor-pointer ${
              regionScope === 'ALL'
                ? 'bg-[#3B82F6] text-[#0A1120] font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            🌏 All Subcontinent
          </button>
          <button
            onClick={() => handleSetRegion('IND')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all cursor-pointer ${
              regionScope === 'IND'
                ? 'bg-[#3B82F6] text-[#0A1120] font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            🇮🇳 India (NDMA)
          </button>
          <button
            onClick={() => handleSetRegion('NPL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all cursor-pointer ${
              regionScope === 'NPL'
                ? 'bg-[#3B82F6] text-[#0A1120] font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            🇳🇵 Nepal (NDRRMA)
          </button>

          {/* Quick Facility Chips */}
          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all flex items-center gap-1 cursor-pointer ${
              filterMedical
                ? 'bg-[#E85D5D] text-white font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-[#E85D5D]" />
            <span>Medical</span>
          </button>

          <button
            onClick={() => setFilterFood(!filterFood)}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all flex items-center gap-1 cursor-pointer ${
              filterFood
                ? 'bg-[#E5B84B] text-[#0A1120] font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-[#E5B84B]" />
            <span>Food</span>
          </button>

          <button
            onClick={() => setFilterWater(!filterWater)}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all flex items-center gap-1 cursor-pointer ${
              filterWater
                ? 'bg-[#3B82F6] text-[#0A1120] font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Water</span>
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg transition-all flex items-center gap-1 cursor-pointer ${
              showFilters
                ? 'bg-[#3B82F6] text-[#0A1120] font-bold'
                : 'bg-[#111C30]/95 text-[#CBD5E1] hover:text-[#F8FAFC] border border-[#243656]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* GOOGLE MAPS CONTROLS (TOP RIGHT / BOTTOM RIGHT) */}
      {/* ============================================================ */}
      <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
        {/* SOS Broadcast Button in Map View: #EA580C (Signal Amber) solid button */}
        <button
          id="map-sos-broadcast-btn"
          type="button"
          onClick={() => {
            if (onOpenSOS) {
              onOpenSOS();
            } else {
              setCurrentTab('alerts');
            }
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full clay-btn-signal bg-[#EA580C] hover:bg-[#C2410C] text-[#FFFFFF] font-black text-xs uppercase tracking-wider shadow-2xl border-2 border-white/40 cursor-pointer transition-all ripple-container"
          title="SOS Emergency Distress Broadcast"
        >
          <Radio className="w-4 h-4 text-white animate-pulse" />
          <span>SOS Broadcast</span>
        </button>

        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            id="map-btn-layers"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2.5 rounded-xl bg-[#111C30]/95 hover:bg-[#182742] text-[#F8FAFC] border border-[#243656] shadow-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Map Views (Streets, Satellite, Terrain, Dark)"
          >
            <Layers className="w-5 h-5 text-[#3B82F6]" />
            <span className="text-xs font-semibold hidden sm:inline capitalize">{activeLayer}</span>
          </button>

          {/* Layer Selection Dropdown */}
          {showLayerMenu && (
            <div
              id="map-layer-menu"
              className="absolute right-0 top-12 w-48 bg-[#111C30]/98 backdrop-blur-xl border border-[#243656] rounded-2xl shadow-2xl p-2 z-40 animate-in fade-in slide-in-from-top-2 space-y-1"
            >
              <div className="text-[10px] font-mono uppercase text-[#94A3B8] px-2 py-1">Map Type</div>
              
              <button
                onClick={() => switchBaseLayer('street')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeLayer === 'street'
                    ? 'bg-[#182742] text-[#3B82F6] border border-[#3B82F6]/40'
                    : 'text-[#CBD5E1] hover:bg-[#182742] hover:text-[#F8FAFC]'
                }`}
              >
                <span>🗺️ Street (Default)</span>
                {activeLayer === 'street' && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
              </button>

              <button
                onClick={() => switchBaseLayer('satellite')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeLayer === 'satellite'
                    ? 'bg-[#182742] text-[#3B82F6] border border-[#3B82F6]/40'
                    : 'text-[#CBD5E1] hover:bg-[#182742] hover:text-[#F8FAFC]'
                }`}
              >
                <span>🛰️ Satellite (Hybrid)</span>
                {activeLayer === 'satellite' && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
              </button>

              <button
                onClick={() => switchBaseLayer('terrain')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeLayer === 'terrain'
                    ? 'bg-[#182742] text-[#3B82F6] border border-[#3B82F6]/40'
                    : 'text-[#CBD5E1] hover:bg-[#182742] hover:text-[#F8FAFC]'
                }`}
              >
                <span>⛰️ Terrain (Elevation)</span>
                {activeLayer === 'terrain' && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
              </button>

              <button
                onClick={() => switchBaseLayer('dark')}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeLayer === 'dark'
                    ? 'bg-[#182742] text-[#3B82F6] border border-[#3B82F6]/40'
                    : 'text-[#CBD5E1] hover:bg-[#182742] hover:text-[#F8FAFC]'
                }`}
              >
                <span>🌙 Calm Dark</span>
                {activeLayer === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
              </button>
            </div>
          )}
        </div>

        {/* Locate Me (GPS) Button */}
        <button
          id="map-btn-locate"
          onClick={handleGetLocation}
          disabled={isLocating}
          className="p-2.5 rounded-xl bg-[#111C30]/95 hover:bg-[#182742] text-[#F8FAFC] border border-[#243656] shadow-xl transition-all cursor-pointer"
          title="Your Location"
        >
          <Crosshair className={`w-5 h-5 text-[#3B82F6] ${isLocating ? 'animate-spin' : ''}`} />
        </button>

        {/* Compass Button (Snaps to North) */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setBearing?.(0);
              showToast('Oriented to True North');
            }
          }}
          className="p-2.5 rounded-xl bg-[#111C30]/95 hover:bg-[#182742] text-[#F8FAFC] border border-[#243656] shadow-xl transition-all cursor-pointer"
          title="Reset Bearing (North)"
        >
          <Compass className="w-5 h-5 text-[#E5B84B]" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-[#111C30]/95 hover:bg-[#182742] text-[#F8FAFC] border border-[#243656] shadow-xl transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Google-style Zoom Controls in Bottom Right */}
      <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-1 bg-[#111C30]/95 backdrop-blur-xl border border-[#243656] rounded-xl shadow-xl overflow-hidden">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2.5 hover:bg-[#182742] text-[#F8FAFC] transition-colors cursor-pointer border-b border-[#243656] font-mono font-bold text-base flex items-center justify-center w-10 h-10"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2.5 hover:bg-[#182742] text-[#F8FAFC] transition-colors cursor-pointer font-mono font-bold text-base flex items-center justify-center w-10 h-10"
          title="Zoom Out"
        >
          &minus;
        </button>
      </div>

      {/* Quick City Hotspots Bar (Bottom Middle) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 bg-[#0A1120]/95 backdrop-blur-xl border border-[#243656] rounded-full px-3 py-1.5 shadow-xl text-xs max-w-xl overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider shrink-0 mr-1">
          Quick Jump:
        </span>
        {[
          { label: 'Delhi', lat: 28.6139, lng: 77.2090 },
          { label: 'Kathmandu', lat: 27.7172, lng: 85.3240 },
          { label: 'Mumbai', lat: 19.0760, lng: 72.8777 },
          { label: 'Pokhara', lat: 28.2096, lng: 83.9856 },
          { label: 'Kolkata', lat: 22.5726, lng: 88.3639 },
          { label: 'Chennai', lat: 13.0827, lng: 80.2707 },
          { label: 'Guwahati', lat: 26.1445, lng: 91.7362 },
          { label: 'Patna', lat: 25.5941, lng: 85.1376 },
          { label: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
          { label: 'Birgunj', lat: 27.0134, lng: 84.8773 }
        ].map(city => (
          <button
            key={city.label}
            onClick={() => handleFlyToLocation(city.lat, city.lng, 12)}
            className="px-2.5 py-1 rounded-full bg-[#182742] hover:bg-[#1B3B54] text-[#CBD5E1] hover:text-[#3B82F6] text-[11px] font-medium transition-colors shrink-0 cursor-pointer"
          >
            {city.label}
          </button>
        ))}
      </div>

      {/* Geolocation feedback / toast */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#111C30]/98 border border-[#3B82F6] text-[#F8FAFC] text-xs px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 font-medium">
          <Sparkles className="w-4 h-4 text-[#3B82F6] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {locationError && (
        <div className="absolute top-20 left-4 z-40 bg-[#111C30]/98 border border-[#E85D5D] text-[#F8FAFC] text-xs px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 max-w-md animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-[#E85D5D] shrink-0" />
          <span>{locationError}</span>
          <button onClick={() => setLocationError(null)} className="ml-auto text-[#E85D5D] hover:text-white font-bold p-1">
            &times;
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* GOOGLE MAPS PLACE DETAIL SHEET (SIDE DRAWER / BOTTOM SHEET) */}
      {/* ============================================================ */}
      {selectedPlace && !directionsActive && (
        <div
          id="google-place-sheet"
          className="absolute top-0 bottom-0 left-0 w-full sm:w-[380px] lg:w-[420px] bg-[#0A1120]/98 backdrop-blur-2xl border-r border-[#243656] z-40 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200 overflow-y-auto"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 bg-[#0A1120]/95 backdrop-blur-md border-b border-[#243656] p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#182742] text-[#3B82F6] border border-[#243656] text-[10px] font-mono font-bold">
                {selectedPlace.country === 'IND' ? 'NDMA INDIA' : 'NDRRMA NEPAL'}
              </span>
              <span className="text-xs text-[#94A3B8] font-mono">{selectedPlace.id}</span>
            </div>
            <button
              onClick={() => setSelectedPlace(null)}
              className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-full hover:bg-[#182742] transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Place Visual Card */}
          <div className="relative h-40 bg-gradient-to-br from-[#111C30] via-[#0A1120] to-[#182742] p-4 flex flex-col justify-end text-white overflow-hidden border-b border-[#243656]">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#0A1120]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#243656] text-xs">
              <Star className="w-3.5 h-3.5 text-[#E5B84B] fill-[#E5B84B]" />
              <span className="font-bold text-[#F8FAFC]">4.9</span>
              <span className="text-[#94A3B8] text-[10px]">(Verified)</span>
            </div>
            <div className="relative z-10">
              <span className="text-xs font-mono uppercase text-[#3B82F6] font-semibold tracking-wider block mb-1">
                {selectedPlace.type}
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC] leading-tight">
                {selectedPlace.name}
              </h2>
              <p className="text-xs text-[#CBD5E1] mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3B82F6] shrink-0" />
                <span className="truncate">{selectedPlace.address}, {selectedPlace.city}</span>
              </p>
            </div>
          </div>

          {/* Quick Google Maps Action Buttons */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-[#111C30]/70 border-b border-[#243656] text-center">
            <button
              onClick={() => startDirections(selectedPlace)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-[#0A1120] font-bold text-xs transition-colors shadow-md cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </button>

            <a
              href={`tel:${selectedPlace.phone}`}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#182742] hover:bg-[#1B3B54] text-[#F8FAFC] font-semibold text-xs transition-colors border border-[#243656] cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#35B779]" />
              <span>Call</span>
            </a>

            <button
              onClick={() => {
                setSelectedShelterId(selectedPlace.id);
                setCurrentTab('intake');
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#182742] hover:bg-[#1B3B54] text-[#F8FAFC] font-semibold text-xs transition-colors border border-[#243656] cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E5B84B]" />
              <span>Intake Pass</span>
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#182742] hover:bg-[#1B3B54] text-[#F8FAFC] font-semibold text-xs transition-colors border border-[#243656] cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-[#3B82F6]" />
              <span>Google Maps</span>
            </a>
          </div>

          {/* Place Body & Details */}
          <div className="p-4 space-y-4 flex-1">
            {/* Live Occupancy Gauge */}
            <div className="bg-[#111C30] p-3.5 rounded-2xl border border-[#243656]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#CBD5E1]">Live Shelter Occupancy</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    selectedPlace.status === 'CRITICAL'
                      ? 'bg-[#E85D5D]/20 text-[#E85D5D] border border-[#E85D5D]/40'
                      : selectedPlace.status === 'LIMITED'
                      ? 'bg-[#E5B84B]/20 text-[#E5B84B] border border-[#E5B84B]/40'
                      : 'bg-[#35B779]/20 text-[#35B779] border border-[#35B779]/40'
                  }`}
                >
                  {Math.round((selectedPlace.currentOccupancy / selectedPlace.totalCapacity) * 100)}% ({selectedPlace.status})
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#0A1120] rounded-full overflow-hidden mb-2">
                <div
                  style={{
                    width: `${Math.min(100, Math.round((selectedPlace.currentOccupancy / selectedPlace.totalCapacity) * 100))}%`
                  }}
                  className={`h-full rounded-full transition-all ${
                    selectedPlace.status === 'CRITICAL'
                      ? 'bg-[#E85D5D]'
                      : selectedPlace.status === 'LIMITED'
                      ? 'bg-[#E5B84B]'
                      : 'bg-[#35B779]'
                  }`}
                />
              </div>

              <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
                <span>Occupied: <strong className="text-[#F8FAFC]">{selectedPlace.currentOccupancy}</strong></span>
                <span>Available: <strong className="text-[#3B82F6]">{selectedPlace.availableBeds} beds</strong></span>
                <span>Total: <strong className="text-[#F8FAFC]">{selectedPlace.totalCapacity}</strong></span>
              </div>
            </div>

            {/* Facilities & Amenities Checklist */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2 font-mono">
                Verified Facilities
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                  selectedPlace.facilities.medicalSupport
                    ? 'bg-[#182742] border-[#243656] text-[#35B779]'
                    : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
                }`}>
                  <HeartPulse className="w-4 h-4 shrink-0" />
                  <span>Medical Triage</span>
                </div>

                <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                  selectedPlace.facilities.drinkingWater
                    ? 'bg-[#182742] border-[#243656] text-[#3B82F6]'
                    : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
                }`}>
                  <Droplet className="w-4 h-4 shrink-0" />
                  <span>Drinking Water</span>
                </div>

                <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                  selectedPlace.facilities.foodAvailable
                    ? 'bg-[#182742] border-[#243656] text-[#E5B84B]'
                    : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
                }`}>
                  <Utensils className="w-4 h-4 shrink-0" />
                  <span>Hot Meals / Food</span>
                </div>

                <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                  selectedPlace.facilities.powerBackup
                    ? 'bg-[#182742] border-[#243656] text-[#CBD5E1]'
                    : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
                }`}>
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Generator Backup</span>
                </div>

                <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                  selectedPlace.facilities.wheelchairAccessible
                    ? 'bg-[#182742] border-[#243656] text-[#3B82F6]'
                    : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
                }`}>
                  <Building className="w-4 h-4 shrink-0" />
                  <span>Wheelchair Ramp</span>
                </div>

                <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                  selectedPlace.facilities.petFriendly
                    ? 'bg-[#182742] border-[#243656] text-[#35B779]'
                    : 'bg-[#0A1120] border-[#243656] text-[#94A3B8]'
                }`}>
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Pet Safe Zone</span>
                </div>
              </div>
            </div>

            {/* Warden & Emergency Coordinator */}
            <div className="bg-[#111C30] p-3.5 rounded-2xl border border-[#243656] text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
                <span>Facility Administration</span>
                <span className="text-[#3B82F6] font-mono">Updated {selectedPlace.lastUpdated}</span>
              </div>
              <div className="font-semibold text-[#F8FAFC]">
                {selectedPlace.managerName} ({selectedPlace.managerRole})
              </div>
              <div className="text-[#CBD5E1] text-[11px]">
                Managing Agency: <strong className="text-[#F8FAFC]">{selectedPlace.managingOrg}</strong>
              </div>
              <div className="text-[#CBD5E1] text-[11px]">
                Emergency Coordinator: <strong className="text-[#F8FAFC]">{selectedPlace.emergencyCoordinator}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* GOOGLE MAPS ROUTE & DIRECTIONS CARD */}
      {/* ============================================================ */}
      {directionsActive && targetDirectionsShelter && routeInfo && (
        <div
          id="google-directions-card"
          className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[420px] bg-[#0A1120]/98 backdrop-blur-2xl border border-[#243656] rounded-2xl shadow-2xl p-4 z-40 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#243656] mb-3">
            <div className="flex items-center gap-2 text-[#F8FAFC] font-bold text-sm">
              <Navigation className="w-4 h-4 text-[#3B82F6]" />
              <span>Evacuation Route Planner</span>
            </div>
            <button
              onClick={clearDirections}
              className="text-[#94A3B8] hover:text-[#F8FAFC] p-1 rounded-lg hover:bg-[#182742]"
              title="Close Directions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Travel Mode Toggle */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#111C30] rounded-xl mb-3 border border-[#243656]">
            <button
              onClick={() => {
                setTravelMode('driving');
                startDirections(targetDirectionsShelter);
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                travelMode === 'driving' ? 'bg-[#3B82F6] text-[#0A1120] font-bold' : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Drive</span>
            </button>
            <button
              onClick={() => {
                setTravelMode('walking');
                startDirections(targetDirectionsShelter);
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                travelMode === 'walking' ? 'bg-[#3B82F6] text-[#0A1120] font-bold' : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk</span>
            </button>
            <button
              onClick={() => {
                setTravelMode('bus');
                startDirections(targetDirectionsShelter);
              }}
              className={`py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                travelMode === 'bus' ? 'bg-[#3B82F6] text-[#0A1120] font-bold' : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Convoy</span>
            </button>
          </div>

          {/* Route Info Stats */}
          <div className="bg-[#111C30] border border-[#243656] rounded-xl p-3 mb-3 flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-[#F8FAFC] font-mono">{routeInfo.durationMins} min</span>
              <span className="text-xs text-[#3B82F6] ml-2 font-mono">({routeInfo.distanceKm} km)</span>
              <div className="text-[11px] text-[#35B779] flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fastest Evacuation Corridor • Clear Road</span>
              </div>
            </div>
          </div>

          {/* Waypoints summary */}
          <div className="space-y-2 text-xs mb-3 text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6] shrink-0"></span>
              <span className="text-[#CBD5E1] truncate">
                From: <strong className="text-[#F8FAFC]">{userLocation ? 'Your Current Location' : 'Regional Evacuation Point'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E85D5D] shrink-0"></span>
              <span className="text-[#CBD5E1] truncate">
                To: <strong className="text-[#F8FAFC]">{targetDirectionsShelter.name}</strong>
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${routeInfo.originCoords[0]},${routeInfo.originCoords[1]}&destination=${routeInfo.destCoords[0]},${routeInfo.destCoords[1]}&travelmode=${travelMode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-[#0A1120] font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-colors cursor-pointer"
            >
              <span>Open in Google Maps App ↗</span>
            </a>
            <button
              onClick={clearDirections}
              className="px-3 py-2 rounded-xl bg-[#182742] hover:bg-[#1B3B54] text-[#F8FAFC] text-xs font-semibold cursor-pointer border border-[#243656]"
            >
              Exit
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* FILTER DRAWER POPUP */}
      {/* ============================================================ */}
      {showFilters && (
        <div
          id="map-extended-filter-drawer"
          className="absolute top-16 right-4 z-40 w-80 bg-[#0A1120]/98 backdrop-blur-xl border border-[#243656] rounded-2xl shadow-2xl p-4 text-xs text-[#F8FAFC] animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#243656] mb-3">
            <span className="font-bold text-[#F8FAFC] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#3B82F6]" />
              <span>GIS Layer Filters</span>
            </span>
            <button
              onClick={() => {
                setSelectedType('ALL');
                setSelectedStatus('ALL');
                setFilterMedical(false);
                setFilterFood(false);
                setFilterWater(false);
                setFilterWheelchair(false);
                setFilterPets(false);
              }}
              className="text-[11px] text-[#3B82F6] hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Shelter Type */}
          <div className="mb-3">
            <label className="block text-[11px] text-[#94A3B8] font-medium mb-1">Facility Classification</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full bg-[#111C30] border border-[#243656] rounded-lg px-2.5 py-1.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#3B82F6]"
            >
              <option value="ALL">All Shelter Types</option>
              <option value="Government Relief Camp">Government Relief Camp</option>
              <option value="School">School</option>
              <option value="Community Hall">Community Hall</option>
              <option value="Stadium">Stadium</option>
              <option value="Hospital-supported shelter">Hospital Supported</option>
              <option value="Emergency evacuation center">Emergency Evacuation Center</option>
              <option value="Religious / Community Facility">Religious Facility</option>
            </select>
          </div>

          {/* Occupancy Status */}
          <div className="mb-3">
            <label className="block text-[11px] text-[#94A3B8] font-medium mb-1">Capacity Range</label>
            <div className="grid grid-cols-4 gap-1">
              {[
                { label: 'All', val: 'ALL' },
                { label: '<70%', val: 'AVAILABLE' },
                { label: '70-90%', val: 'LIMITED' },
                { label: '>90%', val: 'CRITICAL' }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setSelectedStatus(opt.val)}
                  className={`py-1 px-1 rounded-lg border text-[10px] font-semibold transition-all ${
                    selectedStatus === opt.val
                      ? 'bg-[#182742] border-[#3B82F6] text-[#3B82F6] font-bold'
                      : 'bg-[#111C30] border-[#243656] text-[#CBD5E1] hover:text-[#F8FAFC]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Facility Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-[#243656]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterWheelchair}
                onChange={e => setFilterWheelchair(e.target.checked)}
                className="rounded border-[#243656] text-[#3B82F6] focus:ring-0 accent-[#3B82F6]"
              />
              <span className="text-[#CBD5E1]">Wheelchair & Ramp Accessible</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterPets}
                onChange={e => setFilterPets(e.target.checked)}
                className="rounded border-[#243656] text-[#3B82F6] focus:ring-0 accent-[#3B82F6]"
              />
              <span className="text-[#CBD5E1]">Pet Accommodating Camp</span>
            </label>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MAP LEGEND (BOTTOM LEFT) */}
      {/* ============================================================ */}
      <div
        id="gis-map-legend"
        className="absolute bottom-4 left-4 z-20 bg-[#0A1120]/95 backdrop-blur-xl border border-[#243656] rounded-xl px-3.5 py-2 shadow-xl text-[11px] hidden sm:flex items-center gap-3.5"
      >
        <span className="font-bold text-[#F8FAFC] uppercase tracking-wider text-[10px] font-mono">
          {activeShelters.length} Shelters
        </span>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#35B779] border border-[#35B779]/60"></span>
          <span className="text-[#CBD5E1]">&lt; 70% (Available)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E5B84B] border border-[#E5B84B]/60"></span>
          <span className="text-[#CBD5E1]">70–90% (Limited)</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E85D5D] border border-[#E85D5D]/60"></span>
          <span className="text-[#E85D5D] font-medium">&gt; 90% (Critical)</span>
        </div>
      </div>
    </div>
  );
};
