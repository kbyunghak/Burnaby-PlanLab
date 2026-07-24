import React from 'react';
import { facilityOptions } from '../constants/facilityDefinitions';
import { MAP_VIEW_MODES } from '../map/mapVisibility';
import './MapDisplayControls.css';

const viewOptions = [
  { value: MAP_VIEW_MODES.FOCUS, label: 'Focus' },
  { value: MAP_VIEW_MODES.FILTER, label: 'Filter' },
  { value: MAP_VIEW_MODES.ALL, label: 'All' },
];

function MapDisplayControls({
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
  visibleMarkerCount,
}) {
  const visibleFacilityLabels = facilityOptions
    .filter(({ name }) => visibleFacilityTypes.includes(name))
    .map(({ label }) => label);

  return (
    <section className="map-display" aria-labelledby="map-display-heading">
      <div className="map-display__topline">
        <div>
          <strong id="map-display-heading">Map display</strong>
          <span>{visibleMarkerCount} visible</span>
        </div>
        <div className="map-display__modes" aria-label="Map view mode">
          {viewOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              aria-pressed={viewMode === option.value}
              onClick={() => onViewModeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === MAP_VIEW_MODES.FOCUS && (
        <p className="map-display__context">
          {selectedBuildingLabel
            ? `Showing ${selectedBuildingLabel} facilities`
            : 'Select a facility type to use Focus view.'}
        </p>
      )}

      {viewMode === MAP_VIEW_MODES.FILTER && (
        <>
          <p className="map-display__context map-display__context--filter">
            <strong>Showing:</strong>{' '}
            {visibleFacilityLabels.length
              ? visibleFacilityLabels.join(', ')
              : 'No facility types'}
            <span aria-label={`${visibleFacilityLabels.length} facility types selected`}>
              × {visibleFacilityLabels.length}
            </span>
          </p>
          <fieldset className="map-display__filters">
            <legend>
              <span>Facility types</span>
              <span className="map-display__filter-actions">
                <button type="button" onClick={onSelectAllFacilityTypes}>
                  Select all
                </button>
                <button type="button" onClick={onClearFacilityTypes}>
                  Clear
                </button>
              </span>
            </legend>
            <div className="map-display__filter-grid">
              {facilityOptions.map((facility) => (
                <label key={facility.name}>
                  <input
                    type="checkbox"
                    checked={visibleFacilityTypes.includes(facility.name)}
                    onChange={() => onFacilityTypeToggle(facility.name)}
                  />
                  <img src={process.env.PUBLIC_URL + facility.icon} alt="" />
                  <span>{facility.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <fieldset className="map-display__layers">
        <legend>Layers</legend>
        <label>
          <input
            type="checkbox"
            checked={showExisting}
            onChange={(event) => onShowExistingChange(event.target.checked)}
          />
          Existing
        </label>
        <label>
          <input
            type="checkbox"
            checked={showProposed}
            onChange={(event) => onShowProposedChange(event.target.checked)}
          />
          My Plan
        </label>
      </fieldset>
    </section>
  );
}

export default MapDisplayControls;
