'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon asset path errors
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userLocationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1782/1782894.png', // Pulsing/dot icon for user location
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

const pharmacyIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png', // Medical green pin
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

interface PharmacyMarker {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  distance?: number | null;
}

interface MapProps {
  mode: 'view' | 'route' | 'pick';
  pharmacies?: PharmacyMarker[];
  selectedPharmacyId?: string | null;
  onSelectPharmacy?: (id: string) => void;
  userLat?: number;
  userLng?: number;
  pharmacyLat?: number;
  pharmacyLng?: number;
  onLocationSelected?: (lat: number, lng: number) => void;
  onRouteCalculated?: (distance: number, duration: number) => void;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

// 1. Controller component to auto-pan and zoom the map when center/markers change
function MapController({ center, zoom, bounds }: { center?: [number, number]; zoom?: number; bounds?: L.LatLngBoundsExpression }) {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [map, center, zoom, bounds]);
  
  return null;
}

// 2. Click handler component for coordinate picking mode
function LocationPickerHandler({ onLocationSelected, pickerCoords, setPickerCoords }: { 
  onLocationSelected?: (lat: number, lng: number) => void;
  pickerCoords: [number, number] | null;
  setPickerCoords: (coords: [number, number]) => void;
}) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));
      setPickerCoords([roundedLat, roundedLng]);
      if (onLocationSelected) {
        onLocationSelected(roundedLat, roundedLng);
      }
      map.panTo(e.latlng);
    },
  });

  return pickerCoords ? (
    <Marker position={pickerCoords} icon={defaultIcon} draggable
      eventHandlers={{
        dragend(e) {
          const marker = e.target;
          const position = marker.getLatLng();
          const roundedLat = parseFloat(position.lat.toFixed(6));
          const roundedLng = parseFloat(position.lng.toFixed(6));
          setPickerCoords([roundedLat, roundedLng]);
          if (onLocationSelected) {
            onLocationSelected(roundedLat, roundedLng);
          }
        }
      }}
    />
  ) : null;
}

export default function LeafletMap({
  mode,
  pharmacies = [],
  selectedPharmacyId,
  onSelectPharmacy,
  userLat,
  userLng,
  pharmacyLat,
  pharmacyLng,
  onLocationSelected,
  onRouteCalculated,
  centerLat = 9.9723, // Kochi MG Road default
  centerLng = 76.2801,
  zoom = 13,
}: MapProps) {
  const [pickerCoords, setPickerCoords] = useState<[number, number] | null>(null);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([centerLat, centerLng]);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | undefined>(undefined);

  // Initialize picker coords if in picker mode and centerLat/centerLng provided
  useEffect(() => {
    if (mode === 'pick' && centerLat && centerLng) {
      setPickerCoords([centerLat, centerLng]);
    }
  }, [mode, centerLat, centerLng]);

  // Adjust center based on props
  useEffect(() => {
    if (mode === 'view') {
      if (userLat && userLng) {
        setMapCenter([userLat, userLng]);
      } else {
        setMapCenter([centerLat, centerLng]);
      }
    }
  }, [mode, userLat, userLng, centerLat, centerLng]);

  // Route drawing logic using free OSRM API
  useEffect(() => {
    if (mode === 'route' && userLat && userLng && pharmacyLat && pharmacyLng) {
      const fetchRoute = async () => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${pharmacyLng},${pharmacyLat}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const data = await res.json();
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
            setRoutePolyline(coordinates);

            // Notify parent about route metadata (distance in km, duration in mins)
            if (onRouteCalculated) {
              const distanceKm = parseFloat((route.distance / 1000).toFixed(2));
              const durationMin = Math.ceil(route.duration / 60);
              onRouteCalculated(distanceKm, durationMin);
            }

            // Create map bounds to fit both points nicely
            const latBounds = [userLat, pharmacyLat];
            const lngBounds = [userLng, pharmacyLng];
            setMapBounds([
              [Math.min(...latBounds), Math.min(...lngBounds)],
              [Math.max(...latBounds), Math.max(...lngBounds)]
            ]);
          }
        } catch (error) {
          console.error('OSRM route fetch failed, falling back to straight line:', error);
          // Fallback to a straight line if API fails
          setRoutePolyline([[userLat, userLng], [pharmacyLat, pharmacyLng]]);
          if (onRouteCalculated) {
            // Straight line distance
            const R = 6371;
            const dLat = ((pharmacyLat - userLat) * Math.PI) / 180;
            const dLon = ((pharmacyLng - userLng) * Math.PI) / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(userLat*Math.PI/180) * Math.cos(pharmacyLat*Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            onRouteCalculated(parseFloat(dist.toFixed(2)), Math.ceil(dist * 2.5)); // Approx driving speed
          }
        }
      };

      fetchRoute();
    }
  }, [mode, userLat, userLng, pharmacyLat, pharmacyLng, onRouteCalculated]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ width: '100%', height: '100%', minHeight: '300px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Controller for panning/zooming dynamically */}
        <MapController center={mapCenter} bounds={mapBounds} />

        {/* 2. Mode: COORDINATE PICKER */}
        {mode === 'pick' && (
          <LocationPickerHandler 
            onLocationSelected={onLocationSelected} 
            pickerCoords={pickerCoords} 
            setPickerCoords={setPickerCoords} 
          />
        )}

        {/* 3. Mode: ROUTING VIEW */}
        {mode === 'route' && userLat && userLng && pharmacyLat && pharmacyLng && (
          <>
            {/* User Location Pin */}
            <Marker position={[userLat, userLng]} icon={userLocationIcon}>
              <Popup>
                <div className="font-semibold text-xs">Your Current Location</div>
              </Popup>
            </Marker>

            {/* Pharmacy Location Pin */}
            <Marker position={[pharmacyLat, pharmacyLng]} icon={pharmacyIcon}>
              <Popup>
                <div className="font-semibold text-xs text-emerald-700">Destination Pharmacy</div>
              </Popup>
            </Marker>

            {/* Glowing route line */}
            {routePolyline.length > 0 && (
              <Polyline
                positions={routePolyline}
                pathOptions={{
                  color: '#10b981',
                  weight: 5,
                  opacity: 0.8,
                  lineJoin: 'round',
                  dashArray: '0',
                }}
              />
            )}
          </>
        )}

        {/* 4. Mode: PHARMACY LIST VIEW */}
        {mode === 'view' && (
          <>
            {/* User current location dot if active */}
            {userLat && userLng && (
              <Marker position={[userLat, userLng]} icon={userLocationIcon}>
                <Popup>
                  <div className="font-semibold text-xs text-blue-600">നിങ്ങളുടെ സ്ഥാനം (You are here)</div>
                </Popup>
              </Marker>
            )}

            {/* Pharmacy pins */}
            {pharmacies.map((pharmacy) => (
              <Marker
                key={pharmacy.id}
                position={[pharmacy.latitude, pharmacy.longitude]}
                icon={pharmacyIcon}
                eventHandlers={{
                  click: () => {
                    if (onSelectPharmacy) {
                      onSelectPharmacy(pharmacy.id);
                    }
                  },
                }}
              >
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{pharmacy.name}</h4>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{pharmacy.address}</p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                      <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        ⭐ {pharmacy.rating > 0 ? pharmacy.rating : 'New'}
                      </span>
                      {pharmacy.distance !== undefined && pharmacy.distance !== null && (
                        <span className="text-[10px] font-medium text-slate-600">
                          {pharmacy.distance} KM away
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
}
