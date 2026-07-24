import React, { useState } from 'react';
import './App.css';
import LegendModal from './components/LegendModal';
import MapComponentWrapper from './components/MapComponentWrapper';
import SimulationModal from './components/SimulationModal';
import { facilityOptions } from './constants/facilityDefinitions';
import { burnabyPolygon, existingFacilities } from './constants/mapData';
import { calculateSimulation } from './simulation/calculateSimulation';

function pointInPolygon(point, polygon) {
  const [x, y] = [point.lng, point.lat];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [yi, xi] = polygon[i];
    const [yj, xj] = polygon[j];
    const intersects =
      ((yi > y) !== (yj > y))
      && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

    if (intersects) inside = !inside;
  }

  return inside;
}

const isInsideBurnaby = (latlng) => pointInPolygon(latlng, burnabyPolygon);

function App() {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [budget, setBudget] = useState(10000);
  const [userPlanFacilities, setUserPlanFacilities] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [showAllIcons, setShowAllIcons] = useState(false);

  const displayedFacilities = [...existingFacilities, ...userPlanFacilities];
  const buildingUsage = facilityOptions.map((facility) => {
    const count = userPlanFacilities.filter(
      ({ buildingName }) => buildingName === facility.name
    ).length;

    return {
      name: facility.name,
      costPerUnit: facility.cost,
      count,
      totalCost: facility.cost * count,
    };
  });
  const totalUsedBudget = buildingUsage.reduce(
    (total, facility) => total + facility.totalCost,
    0
  );
  const displayedMarkers = selectedBuilding
    ? displayedFacilities.filter(
        ({ buildingName }) => buildingName === selectedBuilding.name
      )
    : displayedFacilities;

  const handleMapClick = (latlng) => {
    if (!selectedBuilding) {
      alert('Please select a building first.');
      return;
    }
    if (!isInsideBurnaby(latlng)) {
      alert('You can only place buildings within Burnaby!');
      return;
    }
    if (budget < selectedBuilding.cost) {
      alert('Insufficient budget!');
      return;
    }

    setBudget((currentBudget) => currentBudget - selectedBuilding.cost);
    setUserPlanFacilities((currentFacilities) => [
      ...currentFacilities,
      {
        position: [latlng.lat, latlng.lng],
        popup: selectedBuilding.popup,
        buildingName: selectedBuilding.name,
      },
    ]);
  };

  const simulateCityGrowth = () => {
    setLoading(true);
    setToastMessage('');

    setTimeout(() => {
      setSimulationData(calculateSimulation(userPlanFacilities));
      setIsModalOpen(true);
      setLoading(false);
      setToastMessage('Simulation completed! Population and safety status updated.');
      setTimeout(() => setToastMessage(''), 4000);
      setShowAllIcons(true);
    }, 1500);
  };

  return (
    <>
      <main className="app-shell">
        <MapComponentWrapper
          center={[49.2488, -122.9805]}
          zoom={12}
          markers={displayedMarkers}
          onMapClick={handleMapClick}
          selectedBuilding={selectedBuilding}
          showAllIcons={showAllIcons}
          existingFacilities={existingFacilities}
        />

        <aside className="control-panel" aria-label="City plan controls">
          <header className="control-panel__header">
            <div>
              <p className="control-panel__eyebrow">Plan your investment</p>
              <h2>Select Building</h2>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setIsLegendOpen(true)}
            >
              Show Legend
            </button>
          </header>

          <div className="facility-grid" aria-label="Available facilities">
            {facilityOptions.map((facility) => {
              const isSelected = selectedBuilding?.name === facility.name;

              return (
                <button
                  type="button"
                  key={facility.name}
                  className={`facility-option${isSelected ? ' facility-option--selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedBuilding(isSelected ? null : facility)}
                >
                  <img
                    src={process.env.PUBLIC_URL + facility.icon}
                    alt=""
                    className="facility-option__icon"
                  />
                  <span>{facility.label}</span>
                  <span className="facility-option__cost">${facility.cost}</span>
                </button>
              );
            })}
          </div>

          <section className="plan-status" aria-label="Plan status">
            <div>
              <span className="plan-status__label">Selected</span>
              <strong>{selectedBuilding?.label || 'No building selected'}</strong>
              {selectedBuilding && (
                <span className="plan-status__used">
                  Used: $
                  {userPlanFacilities.filter(
                    ({ buildingName }) => buildingName === selectedBuilding.name
                  ).length * selectedBuilding.cost}
                </span>
              )}
            </div>
            <div className="plan-status__budget">
              <span className="plan-status__label">Budget remaining</span>
              <strong>${budget.toLocaleString()}</strong>
            </div>
          </section>

          <button
            type="button"
            className="button button--primary simulate-button"
            onClick={simulateCityGrowth}
            disabled={budget !== 0 || loading}
          >
            {loading && <span className="loader" aria-hidden="true" />}
            {loading ? 'Simulating...' : 'Simulate'}
          </button>
          {budget !== 0 && (
            <p className="simulate-hint">Allocate the full budget to run your plan.</p>
          )}

          <section className="usage-summary" aria-labelledby="usage-heading">
            <div className="usage-summary__header">
              <h3 id="usage-heading">Building Usage</h3>
              <strong>${totalUsedBudget.toLocaleString()} used</strong>
            </div>
            <ul>
              {buildingUsage.map((facility) => (
                <li key={facility.name}>
                  <span>{facility.name}</span>
                  <span>
                    {facility.count} × ${facility.costPerUnit}
                    {' = '}
                    <strong>${facility.totalCost}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {toastMessage && (
            <div className="toast-message" role="status">
              {toastMessage}
            </div>
          )}
        </aside>
      </main>

      <LegendModal
        isOpen={isLegendOpen}
        onRequestClose={() => setIsLegendOpen(false)}
      />
      <SimulationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        simulationData={simulationData}
        facilitiesInstalled={buildingUsage
          .filter(({ count }) => count > 0)
          .map(({ name }) => name)}
      />
    </>
  );
}

export default App;
