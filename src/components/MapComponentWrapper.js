import React from 'react';
import MapComponent from './MapComponent';
import MapDisplayControls from './MapDisplayControls';
import './MapComponentWrapper.css';

const MapComponentWrapper = ({
  viewMode,
  onViewModeChange,
  selectedBuildingLabel,
  visibleFacilityTypes,
  onFacilityTypeToggle,
  onSelectAllFacilityTypes,
  onClearFacilityTypes,
  showExisting,
  onShowExistingChange,
  showProposed,
  onShowProposedChange,
  ...mapProps
}) => {
  const visibleMarkerCount = mapProps.markers.length;

  return (
    <section className="map-panel" aria-labelledby="map-heading">
      <header className="map-panel__header">
        <p>Burnaby, British Columbia</p>
        <h1 id="map-heading">City Development Simulation</h1>
      </header>
      <div className="map-key" aria-label="Map symbols">
        <span><i className="map-key__boundary" />Highlighted Burnaby planning area</span>
        <span><i className="map-key__existing" />Existing facility</span>
        <span><i className="map-key__proposed" />Your proposed facility</span>
      </div>
      <MapDisplayControls
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        selectedBuildingLabel={selectedBuildingLabel}
        visibleFacilityTypes={visibleFacilityTypes}
        onFacilityTypeToggle={onFacilityTypeToggle}
        onSelectAllFacilityTypes={onSelectAllFacilityTypes}
        onClearFacilityTypes={onClearFacilityTypes}
        showExisting={showExisting}
        onShowExistingChange={onShowExistingChange}
        showProposed={showProposed}
        onShowProposedChange={onShowProposedChange}
        visibleMarkerCount={visibleMarkerCount}
      />
      <div className="map-panel__canvas">
        <MapComponent {...mapProps} />
      </div>
    </section>
  );
};

export default MapComponentWrapper;
