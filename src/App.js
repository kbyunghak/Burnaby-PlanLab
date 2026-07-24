import React, { useReducer, useState } from 'react';
import './App.css';
import BuildingUsage from './components/BuildingUsage';
import LegendModal from './components/LegendModal';
import MapComponentWrapper from './components/MapComponentWrapper';
import SimulationModal from './components/SimulationModal';
import { facilityOptions } from './constants/facilityDefinitions';
import { burnabyPolygon, existingFacilities } from './constants/mapData';
import { initialPlanState, planReducer } from './planning/planReducer';
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
  const [feedback, setFeedback] = useState(null);
  const [planState, dispatchPlan] = useReducer(planReducer, initialPlanState);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [showAllIcons, setShowAllIcons] = useState(false);

  const { facilities: userPlanFacilities, selectedFacilityId } = planState;
  const displayedFacilities = [...existingFacilities, ...userPlanFacilities];
  const totalUsedBudget = userPlanFacilities.reduce(
    (total, facility) => total + facility.cost,
    0
  );
  const budget = 10000 - totalUsedBudget;
  const buildingUsage = facilityOptions.map((facility) => {
    const count = userPlanFacilities.filter(
      ({ buildingName }) => buildingName === facility.name
    ).length;

    return {
      name: facility.name,
      label: facility.label,
      icon: facility.icon,
      costPerUnit: facility.cost,
      count,
      totalCost: facility.cost * count,
    };
  });
  const displayedMarkers = selectedBuilding
    ? displayedFacilities.filter(
        ({ buildingName }) => buildingName === selectedBuilding.name
      )
    : displayedFacilities;

  const invalidateSimulationResult = () => {
    setSimulationData(null);
    setIsModalOpen(false);
    setShowAllIcons(false);
  };

  const updatePlan = (action) => {
    dispatchPlan(action);
    invalidateSimulationResult();
  };

  const locateFacilityType = (buildingName) => {
    for (let index = userPlanFacilities.length - 1; index >= 0; index -= 1) {
      if (userPlanFacilities[index].buildingName === buildingName) {
        setSelectedBuilding(
          facilityOptions.find(({ name }) => name === buildingName) || null
        );
        updatePlan({
          type: 'select',
          facilityId: userPlanFacilities[index].id,
        });
        return;
      }
    }
  };

  const handleMapClick = (latlng) => {
    if (!selectedBuilding) {
      setFeedback({
        type: 'error',
        message: 'Select a facility before placing it on the map.',
      });
      return;
    }
    if (!isInsideBurnaby(latlng)) {
      setFeedback({
        type: 'error',
        message: 'Place facilities inside the highlighted Burnaby boundary.',
      });
      return;
    }
    if (budget < selectedBuilding.cost) {
      setFeedback({
        type: 'error',
        message: `You need $${selectedBuilding.cost.toLocaleString()} to place ${selectedBuilding.label}.`,
      });
      return;
    }

    setFeedback(null);
    updatePlan({
      type: 'add',
      facility: {
        position: [latlng.lat, latlng.lng],
        popup: selectedBuilding.popup,
        buildingName: selectedBuilding.name,
        cost: selectedBuilding.cost,
      },
    });
  };

  const simulateCityGrowth = () => {
    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setSimulationData(calculateSimulation(userPlanFacilities));
      setIsModalOpen(true);
      setLoading(false);
      setFeedback({
        type: 'success',
        message: 'Simulation complete. Review the 2050 comparison and net impact.',
      });
      setTimeout(() => setFeedback(null), 4000);
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
          selectedUserFacilityId={selectedFacilityId}
          selectedUserFacility={userPlanFacilities.find(
            ({ id }) => id === selectedFacilityId
          )}
          onUserFacilitySelect={(facilityId) =>
            updatePlan({ type: 'select', facilityId })
          }
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

          <section className="quick-start" aria-labelledby="quick-start-heading">
            <h3 id="quick-start-heading">Create your plan</h3>
            <ol>
              <li><strong>1</strong><span>Select a facility.</span></li>
              <li><strong>2</strong><span>Place it inside Burnaby.</span></li>
              <li><strong>3</strong><span>Review the budget and simulate.</span></li>
            </ol>
          </section>

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

          <div className="plan-actions" aria-label="Plan editing">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => updatePlan({ type: 'undo' })}
              disabled={userPlanFacilities.length === 0}
            >
              Undo Last
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => updatePlan({ type: 'remove-selected' })}
              disabled={!selectedFacilityId}
            >
              Remove Selected
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => updatePlan({ type: 'reset' })}
              disabled={userPlanFacilities.length === 0}
            >
              Reset Plan
            </button>
          </div>

          {feedback && (
            <div
              className={`feedback-message feedback-message--${feedback.type}`}
              role={feedback.type === 'error' ? 'alert' : 'status'}
            >
              {feedback.message}
            </div>
          )}

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
            <p className="simulate-hint">
              {userPlanFacilities.length === 0
                ? 'Place at least one facility to begin allocating the plan.'
                : `Allocate the remaining $${budget.toLocaleString()} to unlock simulation.`}
            </p>
          )}

          <BuildingUsage
            facilities={buildingUsage}
            totalUsedBudget={totalUsedBudget}
            budgetLimit={10000}
            onLocate={locateFacilityType}
            onRemoveOne={(buildingName) =>
              updatePlan({ type: 'remove-latest-by-type', buildingName })
            }
            onRemoveAll={(buildingName) =>
              updatePlan({ type: 'remove-all-by-type', buildingName })
            }
          />

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
