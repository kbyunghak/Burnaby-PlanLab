import React, { useState } from 'react';
import MapComponentWrapper from './components/MapComponentWrapper';
import SimulationModal from './components/SimulationModal';
import { initialMarkers, burnabyPolygon } from './constants/mapData';
import { facilityOptions } from './constants/facilityDefinitions';
import LegendModal from './components/LegendModal';
import { calculateSimulation } from './simulation/calculateSimulation';

// Function to check if a point is inside a polygon using the ray-casting algorithm
// Reference: https://stackoverflow.com/questions/22521982/how-to-check-if-a-point-is-inside-a-polygon
// This function assumes the polygon is defined in a clockwise or counter-clockwise order
// and that the polygon is closed (the first and last points are the same).
// The function takes a point (lat, lng) and a polygon (array of [lat, lng] pairs) as input
// and returns true if the point is inside the polygon, false otherwise.
function pointInPolygon(point, polygon) {
  const [x, y] = [point.lng, point.lat];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    const intersect =
      ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function isInsideBurnaby(latlng) {
  return pointInPolygon(latlng, burnabyPolygon);
}

function App() {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [budget, setBudget] = useState(10000);
  const [markers, setMarkers] = useState(initialMarkers);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState([]);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [showAllIcons, setShowAllIcons] = useState(false);

  // Filter out markers that are not in the initialMarkers
  const newMarkers = markers.filter(
    m =>
      !initialMarkers.some(
        im =>
          im.position[0] === m.position[0] &&
          im.position[1] === m.position[1] &&
          im.buildingName === m.buildingName
      )
  );

  const buildingUsage = facilityOptions.map(b => {
    const count = newMarkers.filter(m => m.buildingName === b.name).length;
    return {
      name: b.name,
      costPerUnit: b.cost,
      count,
      totalCost: b.cost * count,
    };
  });

  const totalUsedBudget = buildingUsage.reduce((sum, b) => sum + b.totalCost, 0);

  const displayedMarkers = selectedBuilding
    ? markers.filter(marker => marker.buildingName === selectedBuilding.name)
    : markers;

  const center = [49.2488, -122.9805];
  const zoom = 12;

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
    setBudget(prev => prev - selectedBuilding.cost);
    const newMarker = {
      position: [latlng.lat, latlng.lng],
      popup: selectedBuilding.popup,
      buildingName: selectedBuilding.name,
    };
    setMarkers(prev => [...prev, newMarker]);
  };

  const simulateCityGrowth = () => {
    setLoading(true);
    setToastMessage('');
    setTimeout(() => {
      const results = calculateSimulation(markers);
      setSimulationData(results);
      setIsModalOpen(true);
      setLoading(false);
      setToastMessage('Simulation completed! Population and safety status updated.');
      setTimeout(() => setToastMessage(''), 4000);
      setShowAllIcons(true);
    }, 1500);
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          height: '100vh',
          gap: '24px',
          padding: '24px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: '#f7f9fc',
          color: '#333',
          position: 'relative',
        }}
      >
        {/* Left MAP Panel*/}
        <MapComponentWrapper
          center={center}
          zoom={zoom}
          markers={displayedMarkers}
          onMapClick={handleMapClick}
          selectedBuilding={selectedBuilding}
          showAllIcons={showAllIcons}
          style={{ height: '100%' }}
          createIcon={null}
          initialMarkers={initialMarkers} 
        />

        {/* Right Control Panel */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#222', flexGrow: 1 }}>Select Building</h2>
            <button
              onClick={() => setIsLegendOpen(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3f51b5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Show Legend
            </button>
          </div>
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '24px',
                maxHeight: 'calc(100vh - 300px)',
                overflowY: 'auto',
              }}
            >
              {facilityOptions.map((b) => (
                <button
                  key={b.name}
                  onClick={() => {
                    setSelectedBuilding(selectedBuilding?.label === b.label ? null : b);
                  }}
                  style={{
                    flex: '1 0 45%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: selectedBuilding?.name === b.name ? '2px solid #3f51b5' : '1px solid #ccc',
                    backgroundColor: selectedBuilding?.name === b.name ? '#3f51b5' : '#fafafa',
                    color: selectedBuilding?.name === b.name ? '#fff' : '#333',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: selectedBuilding?.name === b.name ? '0 4px 12px rgba(63,81,181,0.6)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBuilding?.name !== b.name)
                      e.currentTarget.style.backgroundColor = '#e8eaf6';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBuilding?.name !== b.name)
                      e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                >
                  <img
                    src={process.env.PUBLIC_URL + b.icon}
                    alt={b.name}
                    style={{ width: 24, height: 24 }}
                  />
                  {b.label}
                  <span style={{ marginLeft: 'auto', fontWeight: 'normal', color: '#ddd' }}>
                    ${b.cost}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Building and Budget */}
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#222',
            }}
          >
            <div>
              Selected Building:{' '}
              <span style={{ color: '#3f51b5', fontWeight: '700' }}>
                {selectedBuilding ? selectedBuilding.name : 'No building selected'}
              </span>
              {selectedBuilding && (
                <span
                  style={{
                    marginLeft: '8px',
                    fontWeight: 'normal',
                    color: '#666',
                    fontSize: '0.9rem',
                  }}
                >
                  (Used: $
                  {newMarkers.filter(m => m.buildingName === selectedBuilding.name).length *
                    selectedBuilding.cost}
                  )
                </span>
              )}
            </div>
            <div>
              Budget: <span style={{ color: '#388e3c', fontWeight: '700' }}>${budget}</span>
            </div>
          </div>

          {/* Simulate Button */}
          <button
            onClick={simulateCityGrowth}
            disabled={budget !== 0 || loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: budget === 0 && !loading ? '#3f51b5' : '#999',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              cursor: budget === 0 && !loading ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s ease',
              position: 'relative',
              marginTop: '12px',
            }}
            onMouseEnter={e => {
              if (budget === 0 && !loading) e.currentTarget.style.backgroundColor = '#303f9f';
            }}
            onMouseLeave={e => {
              if (budget === 0 && !loading) e.currentTarget.style.backgroundColor = '#3f51b5';
            }}
          >
            {loading ? (
              <>
                <span
                  className="loader"
                  style={{
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'inline-block',
                    marginRight: '8px',
                    animation: 'spin 1s linear infinite',
                    verticalAlign: 'middle',
                  }}
                ></span>
                Simulating...
              </>
            ) : (
              'Simulate'
            )}
          </button>
          {/* Budget Usage */}           
          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#222' }}>
            <h3 style={{ marginBottom: '8px' }}>Building Usage</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {buildingUsage.map((b) => (
                <li key={b.name}>
                  {b.name}: ${b.totalCost} ({b.count} × ${b.costPerUnit})
                </li>
              ))}
            </ul>
            <div style={{ fontWeight: '700', marginTop: '8px' }}>
              Total Used Budget: ${totalUsedBudget}
            </div>
          </div>

          {/* Toast Message */}
          {toastMessage && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                backgroundColor: '#e0f2f1',
                borderRadius: '6px',
                color: '#004d40',
                fontWeight: '600',
                textAlign: 'center',
                boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
              }}
            >
              {toastMessage}
            </div>
          )}
        </div>
      </div>
      <LegendModal isOpen={isLegendOpen} onRequestClose={() => setIsLegendOpen(false)} />
      <SimulationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        simulationData={simulationData}
        facilitiesInstalled={buildingUsage.filter(b => b.count > 0).map(b => b.name)}
      />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}

export default App;
