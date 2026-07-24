import React from 'react';
import MapComponent from './MapComponent';
import './MapComponentWrapper.css';

const MapComponentWrapper = (props) => (
  <section className="map-panel" aria-labelledby="map-heading">
    <header className="map-panel__header">
      <p>Burnaby, British Columbia</p>
      <h1 id="map-heading">City Development Simulation</h1>
    </header>
    <div className="map-key" aria-label="Map symbols">
      <span><i className="map-key__boundary" />Burnaby placement boundary</span>
      <span><i className="map-key__existing" />Existing facility</span>
      <span><i className="map-key__proposed" />Your proposed facility</span>
    </div>
    <div className="map-panel__canvas">
      <MapComponent {...props} />
    </div>
  </section>
);

export default MapComponentWrapper;
