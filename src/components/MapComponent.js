import React, { useEffect, useState, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polygon,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { burnabyPolygon } from '../constants/mapData';

const createIcon = (iconUrl) =>
  new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconMap = {
  Market: createIcon(process.env.PUBLIC_URL + '/icons/market.png'),
  School: createIcon(process.env.PUBLIC_URL + '/icons/school.png'),
  CommunityCentre: createIcon(process.env.PUBLIC_URL + '/icons/communitycentre.png'),
  Hospital: createIcon(process.env.PUBLIC_URL + '/icons/hospital.png'),
  PoliceStation: createIcon(process.env.PUBLIC_URL + '/icons/policestation.png'),
  NonProfitHousing: createIcon(process.env.PUBLIC_URL + '/icons/nonprofithousing.png'),
  Daycare: createIcon(process.env.PUBLIC_URL + '/icons/daycare.png'),
  SeniorCentre: createIcon(process.env.PUBLIC_URL + '/icons/seniorcentre.png'),
};

const MapEventHandler = React.memo(({ onUserMove }) => {
  useMapEvents({
    move: onUserMove,
    zoom: onUserMove,
  });
  return null;
});

function LocationSelector({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

function FitBounds({ polygon }) {
  const map = useMap();
  useEffect(() => {
    if (polygon && polygon.length) {
      map.fitBounds(polygon);
    }
  }, [map, polygon]);
  return null;
}

const MapComponent = ({
  markers,
  onMapClick,
  selectedBuilding,
  center,
  zoom,
  showAllIcons,
  initialMarkers,
}) => {
  const [map, setMap] = useState(null);
  const [isResetDisabled, setIsResetDisabled] = useState(true);

  const filteredMarkers = selectedBuilding && !showAllIcons
    ? markers.filter((m) => m.buildingName === selectedBuilding.name)
    : markers;

  const initialCenter = center;
  const initialZoom = zoom;

  const onUserInteraction = useCallback(() => {
    console.log('User moved or zoomed map');
    if (map && isResetDisabled) {
      setIsResetDisabled(false);
    }
  }, [map, isResetDisabled]);

  const handleResetView = () => {
    if (!map) {
      alert('Map instance is not ready yet.');
      return;
    }
    map.setView(initialCenter, initialZoom);
    setIsResetDisabled(true);
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        whenCreated={setMap}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
        zoomSnap={0.25}
        zoomDelta={0.25}
      >
        <MapEventHandler onUserMove={onUserInteraction} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds polygon={burnabyPolygon} />
        <LocationSelector onClick={onMapClick} />
        <Polygon
          positions={burnabyPolygon}
          pathOptions={{ color: '#3f51b5', weight: 3, fillOpacity: 0.1 }}
        />
        {filteredMarkers.map((marker, idx) => {
        // Determine which icon to use based on selectedBuilding and showAllIcons     
        // If selectedBuilding is set and showAllIcons is false, use the specific icon for that building
        // If showAllIcons is true, use the default icon for all markers
        const iconToUse = (selectedBuilding && !showAllIcons)
          ? iconMap[marker.buildingName] || defaultIcon
          : defaultIcon;

           const isInitial = initialMarkers.some(
          (im) =>
            im.position[0] === marker.position[0] &&
            im.position[1] === marker.position[1] &&
            im.buildingName === marker.buildingName
        );
        
        // If no selectedBuilding and showAllIcons is false, don't show any markers
        if (!selectedBuilding && !showAllIcons) return null;
        // If selectedBuilding is set and showAllIcons is false, show only the specific building's icon
        return (
          <Marker
            key={idx}
            position={marker.position}
            icon={iconToUse}
            opacity={isInitial ? 0.4 : 1}
          >
            <Popup>{marker.popup}</Popup>
          </Marker>
        );
    })}
      </MapContainer>

      <button
        onClick={handleResetView}
        disabled={isResetDisabled || !map}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '6px 12px',
          backgroundColor: isResetDisabled || !map ? '#999' : '#3f51b5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isResetDisabled || !map ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
        title="Reset View"
      >
        Reset View
      </button>
    </div>
  );
};

export default MapComponent;
