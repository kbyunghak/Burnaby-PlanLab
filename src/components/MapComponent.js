import React, { useEffect, useMemo, useState } from 'react';
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

const publicBaseUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
const getPublicAssetUrl = (assetPath) =>
  `${publicBaseUrl}/${assetPath.replace(/^\//, '')}`;

const createIcon = (iconUrl, className, size = 32) =>
  new L.Icon({
    iconUrl,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className,
  });

const defaultIcon = new L.Icon({
  iconUrl: getPublicAssetUrl('/city-sim-icon.svg'),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
  className: 'facility-marker facility-marker--fallback',
});

const createFacilityIconMap = (className, size) =>
  Object.fromEntries(
    Object.entries(facilityDefinitions).map(([name, definition]) => [
      name,
      createIcon(
        getPublicAssetUrl(definition.icon),
        className,
        size
      ),
    ])
  );

const mapMaskBounds = [
  [85, -180],
  [85, 180],
  [-85, 180],
  [-85, -180],
];

const burnabyViewOptions = {
  padding: [18, 18],
};

function MapController({ onReady }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
}

function ZoomObserver({ onZoomChange }) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

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
      map.fitBounds(polygon, burnabyViewOptions);
    }
  }, [map, polygon]);
  return null;
}

const MapComponent = ({
  markers,
  onMapClick,
  center,
  zoom,
  existingFacilities,
  selectedBuildingName,
  selectedUserFacilityId,
  onUserFacilitySelect,
}) => {
  const [map, setMap] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);

  const markerScale =
    currentZoom < 11.5
      ? 'far'
      : currentZoom < 13
        ? 'city'
        : currentZoom < 14.5
          ? 'district'
          : 'street';
  const markerSize = {
    far: 20,
    city: 24,
    district: 28,
    street: 32,
  }[markerScale];
  const iconMaps = useMemo(
    () => ({
      proposed: createFacilityIconMap(
        'facility-marker facility-marker--proposed',
        markerSize
      ),
      selected: createFacilityIconMap(
        'facility-marker facility-marker--proposed facility-marker--selected',
        markerSize
      ),
      existing: createFacilityIconMap(
        'facility-marker facility-marker--existing',
        markerSize
      ),
      activeProposed: createFacilityIconMap(
        'facility-marker facility-marker--proposed facility-marker--active-type',
        markerSize
      ),
      activeExisting: createFacilityIconMap(
        'facility-marker facility-marker--existing facility-marker--active-type',
        markerSize
      ),
    }),
    [markerSize]
  );

  const handleZoomChange = (event) => {
    if (!map) return;

    map.setZoom(Number(event.target.value));
  };

  const handleResetView = () => {
    if (!map) return;

    map.fitBounds(burnabyPolygon, burnabyViewOptions);
  };

  return (
    <div
      className={`map-canvas map-canvas--${markerScale}`}
      style={{ position: 'relative', height: '100%', width: '100%' }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        scrollWheelZoom={true}
        zoomSnap={0.25}
        zoomDelta={0.25}
      >
        <MapController onReady={setMap} />
        <ZoomObserver onZoomChange={setCurrentZoom} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds polygon={burnabyPolygon} />
        <LocationSelector onClick={onMapClick} />
        <Polygon
          positions={[mapMaskBounds, burnabyPolygon]}
          pathOptions={{
            className: 'burnaby-map-mask',
            color: 'transparent',
            fillColor: '#172554',
            fillOpacity: 0.38,
            fillRule: 'evenodd',
            interactive: false,
            stroke: false,
          }}
        />
        <Polygon
          positions={burnabyPolygon}
          pathOptions={{
            className: 'burnaby-boundary',
            color: '#2349c6',
            fillColor: '#dbeafe',
            fillOpacity: 0.12,
            lineCap: 'round',
            lineJoin: 'round',
            opacity: 1,
            weight: 4,
            interactive: false,
          }}
        />
        {markers.map((marker, idx) => {
          const isExisting = existingFacilities.some(
            (existingFacility) =>
              existingFacility.position[0] === marker.position[0]
              && existingFacility.position[1] === marker.position[1]
              && existingFacility.buildingName === marker.buildingName
          );
          const isSelected = marker.id === selectedUserFacilityId;
          const isActiveType = marker.buildingName === selectedBuildingName;
          const facilityIcons = isExisting
            ? isActiveType
              ? iconMaps.activeExisting
              : iconMaps.existing
            : isSelected
              ? iconMaps.selected
              : isActiveType
                ? iconMaps.activeProposed
                : iconMaps.proposed;
          const icon = facilityIcons[marker.buildingName] || defaultIcon;
          const facilityLabel =
            facilityDefinitions[marker.buildingName]?.label
            || marker.buildingName
            || 'Facility';
          const markerLabel = isExisting
            ? `Existing ${facilityLabel}`
            : `Your plan ${facilityLabel}`;

          return (
            <Marker
              key={`${marker.buildingName}-${marker.position.join('-')}-${idx}`}
              position={marker.position}
              icon={icon}
              alt={markerLabel}
              title={markerLabel}
              opacity={isExisting ? 0.82 : 1}
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

      <div className="burnaby-map-label" aria-hidden="true">
        <span>Planning area</span>
        <strong>Burnaby</strong>
      </div>

      <label className="map-detail-control">
        <span className="map-detail-control__heading">
          <strong>Map detail</strong>
          <output>{currentZoom.toFixed(2)}</output>
        </span>
        <span className="map-detail-control__slider">
          <span aria-hidden="true">City</span>
          <input
            type="range"
            min="10.5"
            max="16"
            step="0.25"
            value={currentZoom}
            onChange={handleZoomChange}
            disabled={!map}
            aria-label="Map detail level"
          />
          <span aria-hidden="true">Street</span>
        </span>
      </label>

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
