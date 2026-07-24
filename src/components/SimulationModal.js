// src/components/SimulationModal.js
import React from 'react';
import Modal from 'react-modal';
import SimulationSummary from '../components/SimulationSummary';
import SimulationSummary2 from '../components/SimulationSummary2';
import { facilityImpactData } from '../constants/facilityDefinitions';
import {
  formatMetricValue,
  isFavorableChange,
  metricEntries,
} from '../constants/metricDefinitions';
const SimulationModal = ({
  isOpen,
  onRequestClose,
  simulationData,
  facilitiesInstalled,
}) => {
  if (!simulationData) return null;

  const filteredFacilityImpact = facilityImpactData.filter(f =>
    facilitiesInstalled.includes(f.facility)
  );
  const {
    baseline2025,
    projection2050,
    userPlan2050,
    netImpact,
  } = simulationData;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Simulation Results"
      ariaHideApp={false}
      style={{
        overlay: { zIndex: 10000, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: { maxWidth: '1000px', margin: 'auto', width: 'auto', height: 'auto', borderRadius: '10px', padding: '20px', maxHeight: '80vh', overflowY: 'auto' },
      }}
    >
      <h2>City Growth Simulation Results (2025-2050)</h2>
      <div style={{ marginTop: '0px' }}>
        <SimulationSummary simulationData={simulationData} facilitiesInstalled={facilitiesInstalled} />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0px', fontSize: '1rem' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid #444', textAlign: 'left', padding: '8px' }}>Indicator</th>
            <th style={{ borderBottom: '2px solid #444', textAlign: 'right', padding: '8px' }}>2025 (Baseline)</th>
            <th style={{ borderBottom: '2px solid #444', textAlign: 'right', padding: '8px' }}>2050 (Projected)</th>
            <th style={{ borderBottom: '2px solid #444', textAlign: 'right', padding: '8px' }}>2050 (With Your Plan)</th>
            <th style={{ borderBottom: '2px solid #444', textAlign: 'right', padding: '0px' }}>Difference (User - Projected)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>Year</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>2025</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>2050</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>2050</td>
            <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }} />
          </tr>
          {metricEntries.map(({ key: dataKey, label }) => {
            const currentValue = baseline2025[dataKey] ?? 0;
            const forecastValue = projection2050[dataKey] ?? 0;
            const userTrendValue = userPlan2050[dataKey] ?? 0;
            const difference = netImpact[dataKey] ?? 0;
            const favorable = isFavorableChange(dataKey, difference);

            return (
              <tr key={dataKey}>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>{label}</td>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>{formatMetricValue(dataKey, currentValue)}</td>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>{formatMetricValue(dataKey, forecastValue)}</td>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>{formatMetricValue(dataKey, userTrendValue)}</td>
                <td style={{
                  borderBottom: '1px solid #ccc',
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: difference !== 0 ? 'bold' : 'normal',
                  color: favorable === null ? 'inherit' : favorable ? '#2e7d32' : '#c62828',
                }}>
                  {difference > 0 ? '+' : ''}
                  {formatMetricValue(dataKey, difference)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 style={{ marginTop: '10px' }}>Facility Impact Details
        <SimulationSummary2 simulationData={simulationData} facilitiesInstalled={facilitiesInstalled} />
      </h3>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Facility</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Population Change (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Traffic Change (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Crime Change (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Housing Satisfaction (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Unemployment Change (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Housing Supply Rate (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Air Quality Change (%)</th>
            <th style={{ border: '1px solid #ccc', padding: '6px' }}>Inflation Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {filteredFacilityImpact.map(({
            facility,
            populationChange,
            trafficChange,
            crimeChange,
            housingSatisfaction,
            unemploymentChange,
            housingSupplyRate,
            airQualityChange,
            inflationRate,
          }) => (
            <tr key={facility}>
              <td style={{ border: '1px solid #ccc', padding: '6px', fontWeight: 'bold' }}>{facility}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{populationChange}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{trafficChange}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{crimeChange}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{housingSatisfaction}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{unemploymentChange}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{housingSupplyRate}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{airQualityChange}</td>
              <td style={{ border: '1px solid #ccc', padding: '6px' }}>{inflationRate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={onRequestClose}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          float: 'right',
        }}
      >
        Close
      </button>
    </Modal>
  );
};

export default SimulationModal;
