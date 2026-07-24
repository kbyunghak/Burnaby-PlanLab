import React, { useEffect, useState } from 'react';
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
import { facilityDefinitions } from '../constants/facilityDefinitions';

const createIcon = (iconUrl, className) =>
  new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className,
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

const proposedIconMap = Object.fromEntries(
  Object.entries(facilityDefinitions).map(([name, definition]) => [
    name,
    createIcon(
      process.env.PUBLIC_URL + definition.icon,
      'facility-marker facility-marker--proposed'
    ),
  ])
);

const selectedIconMap = Object.fromEntries(
  Object.entries(facilityDefinitions).map(([name, definition]) => [
    name,
    createIcon(
      process.env.PUBLIC_URL + definition.icon,
      'facility-marker facility-marker--proposed facility-marker--selected'
    ),
  ])
);

const existingIconMap = Object.fromEntries(
  Object.entries(facilityDefinitions).map(([name, definition]) => [
    name,
    createIcon(
      process.env.PUBLIC_URL + definition.icon,
      'facility-marker facility-marker--existing'
    ),
  ])
);

function MapController({ onReady }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

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
  existingFacilities,
  selectedUserFacilityId,
  onUserFacilitySelect,
}) => {
  const [map, setMap] = useState(null);

  const filteredMarkers = selectedBuilding && !showAllIcons
    ? markers.filter((m) => m.buildingName === selectedBuilding.name)
    : markers;

  const initialCenter = center;
  const initialZoom = zoom;

  const handleResetView = () => {
    if (!map) return;

    map.setView(initialCenter, initialZoom);
  };

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
        zoomSnap={0.25}
        zoomDelta={0.25}
      >
        <MapController onReady={setMap} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds polygon={burnabyPolygon} />
        <LocationSelector onClick={onMapClick} />
        <Polygon
          positions={burnabyPolygon}
          pathOptions={{
            color: '#3f51b5',
            weight: 3,
            fillOpacity: 0.1,
            interactive: false,
          }}
        />
        {filteredMarkers.map((marker, idx) => {
          const isExisting = existingFacilities.some(
            (existingFacility) =>
              existingFacility.position[0] === marker.position[0]
              && existingFacility.position[1] === marker.position[1]
              && existingFacility.buildingName === marker.buildingName
          );
          const isSelected = marker.id === selectedUserFacilityId;
          const facilityIcons = isExisting
            ? existingIconMap
            : isSelected
              ? selectedIconMap
              : proposedIconMap;
          const icon = facilityIcons[marker.buildingName] || defaultIcon;

          if (!selectedBuilding && !showAllIcons) return null;

          return (
            <Marker
              key={`${marker.buildingName}-${marker.position.join('-')}-${idx}`}
              position={marker.position}
              icon={icon}
              opacity={isExisting ? 0.55 : 1}
              eventHandlers={
                isExisting
                  ? undefined
                  : {
                      click: (event) => {
                        if (event.originalEvent) {
                          L.DomEvent.stopPropagation(event.originalEvent);
                        }
                        onUserFacilitySelect(marker.id);
                      },
                    }
              }
            >
              <Popup>
                <strong>{isExisting ? 'Existing facility' : 'Your plan'}</strong>
                <br />
                {marker.popup}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <button
        type="button"
        onClick={handleResetView}
        disabled={!map}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '6px 12px',
          backgroundColor: !map ? '#999' : '#3f51b5',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: !map ? 'not-allowed' : 'pointer',
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
