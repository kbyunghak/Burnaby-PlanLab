// src/components/SimulationModal.js
import React from 'react';
import Modal from 'react-modal';
import SimulationSummary from '../components/SimulationSummary';
import SimulationSummary2 from '../components/SimulationSummary2';
import { burnabyForecast2050, burnaby2025 } from '../constants/mapData';
import { facilityImpactData } from '../constants/facilityDefinitions';

const headers = [
  "Year",
  "Population",
  "Traffic Accidents",
  "Crime Incidents",
  "Housing Satisfaction (%)",
  "Unemployment Rate (%)",
  "Housing Supply Rate (%)",   
  "Air Quality Index",
  "Inflation Rate (%)",        
];
const SimulationModal = ({
  isOpen,
  onRequestClose,
  simulationData,
  facilitiesInstalled,
}) => {
  if (!simulationData || simulationData.length === 0) return null;

  // Filter facility impacts based on installed facilities
  const filteredFacilityImpact = facilityImpactData.filter(f =>
    facilitiesInstalled.includes(f.facility)
  );

  // Calculate the total impact of the facilities
  const totalImpact = filteredFacilityImpact.reduce(
    (totals, facility) => {
      totals.populationChange += Number(facility.populationChange);
      totals.trafficChange += Number(facility.trafficChange);
      totals.crimeChange += Number(facility.crimeChange);
      totals.housingSatisfaction += Number(facility.housingSatisfaction);
      totals.unemploymentChange += Number(facility.unemploymentChange);
      totals.housingSupplyRate += Number(facility.housingSupplyRate);
      totals.airQualityChange += Number(facility.airQualityChange);
      totals.inflationRate += Number(facility.inflationRate);
      return totals;
    },
    {
      populationChange: 0,
      trafficChange: 0,
      crimeChange: 0,
      housingSatisfaction: 0,
      unemploymentChange: 0,
      housingSupplyRate: 0,
      airQualityChange: 0,
      inflationRate: 0,
    }
  );

  const base = burnaby2025;
  
  // Calculate the simulation value based on the base and total impact
  const simulationValue = {
    year: 2050,
    population: Math.round(base.population * (1 + totalImpact.populationChange / 100)),
    trafficAccidents: Math.round(base.trafficAccidents * (1 + totalImpact.trafficChange / 100)),
    crimeRate: Math.round(base.crimeRate * (1 + totalImpact.crimeChange / 100)),
    housingSatisfaction: Math.min(100, Math.max(0, base.housingSatisfaction + totalImpact.housingSatisfaction)),
    unemploymentRate: Math.min(100, Math.max(0, base.unemploymentRate + totalImpact.unemploymentChange)),
    housingSupplyRate: Math.min(100, Math.max(0, base.housingSupplyRate + totalImpact.housingSupplyRate)),
    airQualityIndex: Math.min(500, Math.max(0, base.airQualityIndex * (1 + totalImpact.airQualityChange / 100))),
    inflationRate: Math.min(100, Math.max(0, base.inflationRate + totalImpact.inflationRate)),
  };

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
            <th style={{ borderBottom: '2px solid #444', textAlign: 'right', padding: '8px' }}>2050 (User Senario)</th>
            <th style={{ borderBottom: '2px solid #444', textAlign: 'right', padding: '0px' }}>Difference (User - Projected)</th>
          </tr>
        </thead>
        <tbody>
          {headers.map((key) => {
            const dataKey = {
              Year: 'year',
              Population: 'population',
              "Traffic Accidents": 'trafficAccidents',
              "Crime Incidents": 'crimeRate',
              "Housing Satisfaction (%)": 'housingSatisfaction',
              "Unemployment Rate (%)": 'unemploymentRate',
              "Housing Supply Rate (%)": 'housingSupplyRate',
              "Air Quality Index": 'airQualityIndex',
              "Inflation Rate (%)": 'inflationRate',
            }[key];

            const currentValue = burnaby2025[dataKey] ?? 0;
            const forecastValue = burnabyForecast2050[dataKey] ?? 0;
            const userTrendValue = simulationValue[dataKey] ?? 0;
            const difference = userTrendValue - forecastValue;

            return (
              <tr key={key}>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px' }}>{key}</td>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>{currentValue.toLocaleString()}</td>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>{forecastValue.toLocaleString()}</td>
                <td style={{ borderBottom: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>{userTrendValue.toLocaleString()}</td>
                <td style={{
                  borderBottom: '1px solid #ccc',
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: difference !== 0 ? 'bold' : 'normal',
                  color: difference < 0 ? 'red' : 'inherit',
                }}>
                   {key === "Year" ? "" : (difference > 0 ? `+${difference.toLocaleString()}` : difference.toLocaleString())}
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
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>Total Impact</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.populationChange.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.trafficChange.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.crimeChange.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.housingSatisfaction.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.unemploymentChange.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.housingSupplyRate.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.airQualityChange.toFixed(1)}</td>
            <td style={{ border: '1px solid #ccc', padding: '6px' }}>{totalImpact.inflationRate.toFixed(2)}</td>
          </tr>
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
