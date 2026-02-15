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

function FitSelectedBounds({
  userLocation,
  selectedBranchLocation,
}: {
  userLocation: [number, number] | null;
  selectedBranchLocation: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation || !selectedBranchLocation) return;

    const bounds = L.latLngBounds([userLocation, selectedBranchLocation]);
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 15,
      animate: true,
    });
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([24.7136, 46.6753]); // Default to Riyadh
  const [mapZoom, setMapZoom] = useState(10);
  const [routeLine, setRouteLine] = useState<[number, number][]>([]);
  const [selectedBranchLocation, setSelectedBranchLocation] = useState<[number, number] | null>(null);

  // Fix Leaflet icon issues
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc: [number, number] = [latitude, longitude];
          setUserLocation(loc);
          onUserLocation?.(loc);
          
          // If no branch is selected, center on user location
          if (!selectedBranchId) {
            setMapCenter([latitude, longitude]);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [selectedBranchId]);

  // Center map on selected branch
  useEffect(() => {
    const selectedBranch = branches.find(branch => branch.id === selectedBranchId);
    if (selectedBranch && selectedBranch.latitude && selectedBranch.longitude) {
      const branchLoc: [number, number] = [selectedBranch.latitude, selectedBranch.longitude];
      setSelectedBranchLocation(branchLoc);

      // Draw route line from user location to selected branch (solid red)
      if (userLocation) {
        setRouteLine([userLocation, branchLoc]);
      } else {
        setRouteLine([]);
      }

      // If we don't have user location, fallback to centering on branch
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
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md">
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
          <Marker 
            position={userLocation} 
            icon={createCustomIcon('blue')}
          >
            <Popup>
              {language === 'en' ? 'Your location' : 'موقعك'}
            </Popup>
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
        
        {/* Route line from user to selected branch */}
        {routeLine.length === 2 && (
          <Polyline 
            positions={routeLine}
            color="#ef4444"
            weight={4}
            opacity={0.85}
          />
        )}
        
        {/* Update map view when we don't have both points */}
        <ChangeMapView center={mapCenter} zoom={mapZoom} />

        {/* When both points exist, zoom out to show both markers */}
        <FitSelectedBounds userLocation={userLocation} selectedBranchLocation={selectedBranchLocation} />
      </MapContainer>
    </div>
  );
};

export default BranchMap;
