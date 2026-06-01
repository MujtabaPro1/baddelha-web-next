'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '../contexts/LanguageContext';

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcons = () => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    // @ts-expect-error Leaflet's internal _getIconUrl is not in the public typings
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }
};

// Custom marker icons
const createCustomIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to recenter map when user location changes
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MAX_FIT_DISTANCE_KM = 300;

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) *
      Math.cos((b[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function FitSelectedBounds({
  userLocation,
  selectedBranchLocation,
}: {
  userLocation: [number, number] | null;
  selectedBranchLocation: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedBranchLocation) return;
    
    // If we have both user location and branch location
    if (userLocation) {
      const dist = haversineKm(userLocation, selectedBranchLocation);
      if (dist > MAX_FIT_DISTANCE_KM) {
        // Too far — just center on branch instead of zooming way out
        map.setView(selectedBranchLocation, 13, { animate: true });
        return;
      }
      // Fit both markers in view with route line
      const bounds = L.latLngBounds([userLocation, selectedBranchLocation]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true });
    } else {
      // No user location, just center on branch
      map.setView(selectedBranchLocation, 15, { animate: true });
    }
  }, [map, userLocation, selectedBranchLocation]);

  return null;
}

interface Branch {
  id: string;
  name: string;
  enName: string;
  arName: string;
  address: string;
  location?: string;
  distance?: string;
  latitude?: number;
  longitude?: number;
}

interface BranchMapProps {
  branches: Branch[];
  selectedBranchId: string;
  onBranchSelect: (branchId: string) => void;
  onUserLocation?: (location: [number, number]) => void;
}

const BranchMap: React.FC<BranchMapProps> = ({ branches, selectedBranchId, onBranchSelect, onUserLocation }) => {
  const { language } = useLanguage();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.7207364, 46.7705267]); // Default to Riyadh
  const [mapZoom, setMapZoom] = useState(11);
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [selectedBranchLocation, setSelectedBranchLocation] = useState<[number, number] | null>(null);

  // Fix Leaflet icon issues
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Get user's location — only for distance labels and the marker, never move the map center
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc: [number, number] = [latitude, longitude];
          setUserLocation(loc);
          onUserLocation?.(loc);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  // Center map on selected branch and draw route line
  useEffect(() => {
    const selectedBranch = branches.find(branch => branch.id === selectedBranchId);
    if (selectedBranch?.latitude && selectedBranch?.longitude) {
      const branchLoc: [number, number] = [selectedBranch.latitude, selectedBranch.longitude];
      setSelectedBranchLocation(branchLoc);
      setRouteLine(userLocation ? [userLocation, branchLoc] : []);
      
      // Always center on selected branch when it changes
      // The FitSelectedBounds component will handle fitting both markers if user location exists
      if (!userLocation) {
        setMapCenter(branchLoc);
        setMapZoom(15);
      }
    } else {
      setSelectedBranchLocation(null);
      setRouteLine([]);
    }
  }, [selectedBranchId, branches, userLocation]);

  // distances are computed in the parent and passed in via `branches`

  if (typeof window === 'undefined') {
    return <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="relative z-0 h-[400px] w-full rounded-xl overflow-hidden shadow-md">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createCustomIcon('blue')}>
            <Popup>{language === 'en' ? 'Your location' : 'موقعك'}</Popup>
          </Marker>
        )}

        {/* Branch markers */}
        {branches.map((branch) => {
          // Skip branches without coordinates
          if (!branch.latitude || !branch.longitude) return null;
          
          const isSelected = branch.id === selectedBranchId;
          
          return (
            <Marker 
              key={branch.id}
              position={[branch.latitude, branch.longitude]}
              icon={createCustomIcon(isSelected ? 'red' : 'green')}
              eventHandlers={{
                click: () => {
                  onBranchSelect(branch.id);
                },
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{language === 'en' ? branch.enName : branch.arName}</h3>
                  <p className="text-sm">{branch.address}</p>
                  {branch.distance && (
                    <p className="text-xs mt-1 text-gray-500">{branch.distance}</p>
                  )}
                  <button 
                    className="mt-2 px-3 py-1 bg-primaryBtn text-white text-xs rounded-md hover:bg-primaryBtn-600 transition"
                    onClick={() => onBranchSelect(branch.id)}
                  >
                    {language === 'en' ? 'Select Branch' : 'اختر الفرع'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Route line from user location to selected branch */}
        {routeLine.length === 2 && (
          <Polyline positions={routeLine} color="#ef4444" weight={3} opacity={0.8} dashArray="8 6" />
        )}

        <ChangeMapView center={mapCenter} zoom={mapZoom} />
        <FitSelectedBounds userLocation={userLocation} selectedBranchLocation={selectedBranchLocation} />
      </MapContainer>
    </div>
  );
};

export default BranchMap;
