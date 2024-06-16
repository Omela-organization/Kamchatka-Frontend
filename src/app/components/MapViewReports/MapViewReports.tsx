import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: '/leaflet/images/marker-icon.png',
  iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

interface MapViewReportsProps {
  selectedCoordinates: { latitude: number; longitude: number } | null;
}

const MapViewReports: React.FC<MapViewReportsProps> = ({ selectedCoordinates }) => {
  const mapRef = useRef<any>(null); 

  const CenterMap = ({ coords }: { coords: [number, number] }) => {
    const map = useMap();
    map.setView(coords, map.getZoom());
    return null;
  };

  useEffect(() => {
    if (selectedCoordinates) {
      const { latitude, longitude } = selectedCoordinates;
      mapRef.current?.panTo([latitude, longitude]);
    }
  }, [selectedCoordinates]);

  const defaultPosition = { latitude: 53.2521, longitude: 50.1898 }; 
  return (
    <MapContainer center={[defaultPosition.latitude, defaultPosition.longitude]} zoom={13} style={{ height: '300px', width: '100%' , zIndex: '0'}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {selectedCoordinates && (
        <Marker position={[selectedCoordinates.latitude, selectedCoordinates.longitude]} icon={customIcon}>
          <Popup>
            Координаты: {selectedCoordinates.latitude}, {selectedCoordinates.longitude}
          </Popup>
        </Marker>
      )}
      {selectedCoordinates && <CenterMap coords={[selectedCoordinates.latitude, selectedCoordinates.longitude]} />}
    </MapContainer>
  );
};

export default MapViewReports;
