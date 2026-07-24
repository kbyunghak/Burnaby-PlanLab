import React from 'react';
import { facilityDefinitions } from '../constants/facilityDefinitions';
import { metricEntries } from '../constants/metricDefinitions';
import AppModal from './AppModal';
import './LegendModal.css';

const legendData = Object.entries(facilityDefinitions).map(
  ([name, definition]) => ({ name, ...definition })
);

const formatImpact = (value) => {
  const percentage = value * 100;
  return `${percentage > 0 ? '+' : ''}${percentage.toLocaleString()}%`;
};

const LegendModal = ({ isOpen, onRequestClose }) => (
  <AppModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Facility Impact Legend"
    overlayClassName="legend-overlay"
    className="legend-modal"
  >
    <header className="legend-modal__header">
      <div>
        <p>Planning reference</p>
        <h2>Facility Impact Legend</h2>
      </div>
      <button
        type="button"
        className="button button--secondary"
        onClick={onRequestClose}
      >
        Close
      </button>
    </header>

    <p className="legend-modal__note">
      Impact values are preliminary percentage changes applied per facility to
      the 2050 no-plan projection. They are educational assumptions and will be
      replaced as the source-backed model is developed. A plus or minus sign
      shows direction, not whether the change is desirable.
    </p>

    <div className="legend-grid">
      {legendData.map((facility) => (
        <article className="legend-card" key={facility.name}>
          <header>
            <img src={process.env.PUBLIC_URL + facility.icon} alt="" />
            <div>
              <h3>{facility.label}</h3>
              <span>${facility.cost.toLocaleString()} plan cost</span>
            </div>
          </header>
          <p><strong>Benefit:</strong> {facility.benefits}</p>
          <p><strong>Trade-off:</strong> {facility.drawbacks}</p>
          <dl>
            {metricEntries.map((metric) => {
              const value = facility.impacts[metric.impactKey];
              if (!value) return null;

              return (
                <div key={metric.key}>
                  <dt>{metric.label}</dt>
                  <dd className={value > 0 ? 'impact-increase' : 'impact-decrease'}>
                    {formatImpact(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </article>
      ))}
    </div>
  </AppModal>
);

export default LegendModal;
