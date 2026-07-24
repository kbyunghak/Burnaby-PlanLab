import React from 'react';
import MapComponent from './MapComponent';
import './MapComponentWrapper.css';

const MapComponentWrapper = (props) => (
  <section className="map-panel" aria-labelledby="map-heading">
    <header className="map-panel__header">
      <p>Burnaby, British Columbia</p>
      <h1 id="map-heading">City Development Simulation</h1>
    </header>
    <div className="map-panel__canvas">
      <MapComponent {...props} />
    </div>
  </section>
);

export default MapComponentWrapper;
