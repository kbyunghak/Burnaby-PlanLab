import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

jest.mock('./components/MapComponentWrapper', () => function MockMap({
  markers,
  onMapClick,
  onUserFacilitySelect,
  onViewModeChange,
  onShowExistingChange,
  onShowProposedChange,
}) {
  const userFacility = markers.find(({ id }) => id);

  return (
    <div>
      <div data-testid="city-map" data-marker-count={markers.length}>
        City map
      </div>
      <button
        type="button"
        onClick={() => onMapClick({ lat: 49.25, lng: -122.98 })}
      >
        Place facility on map
      </button>
      <button type="button" onClick={() => onViewModeChange('focus')}>
        Use focus view
      </button>
      <button type="button" onClick={() => onViewModeChange('all')}>
        Use all view
      </button>
      <button type="button" onClick={() => onShowExistingChange(false)}>
        Hide existing layer
      </button>
      <button type="button" onClick={() => onShowProposedChange(false)}>
        Hide proposed layer
      </button>
      {userFacility && (
        <button
          type="button"
          onClick={() => onUserFacilitySelect(userFacility.id)}
        >
          Select proposed facility
        </button>
      )}
    </div>
  );
});

jest.mock('./components/SimulationModal', () => function MockSimulationModal({
  isOpen,
  simulationData,
}) {
  return isOpen ? (
    <div role="dialog" aria-label="Simulation Results">
      {simulationData.planSnapshot.facilityCount} facilities simulated
    </div>
  ) : null;
});

jest.mock('./components/LegendModal', () => function MockLegendModal() {
  return null;
});

test('renders the city planning controls with the initial budget', () => {
  render(<App />);

  expect(screen.getByTestId('city-map')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /select building/i })).toBeInTheDocument();
  const planStatus = screen.getByRole('region', { name: /plan status/i });
  expect(within(planStatus).getByText('$10,000')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /simulate/i })).toBeEnabled();
  expect(screen.getByText('$0 used')).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Create your plan' })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/empty plan to view Burnaby's no-plan 2050 scenario/i)
  ).toBeInTheDocument();
});

test('shows contextual feedback when placement is attempted without a facility', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Select a facility before placing it on the map.'
  );
});

test('selects and deselects a building type', () => {
  render(<App />);

  const marketButton = screen.getByRole('button', { name: /Market\s+\$300/i });
  fireEvent.click(marketButton);
  expect(
    within(screen.getByRole('region', { name: /plan status/i }))
      .getByText('Market')
  ).toBeInTheDocument();

  fireEvent.click(marketButton);
  expect(screen.getByText('No building selected')).toBeInTheDocument();
});

test('charges the budget only for facilities added to the user plan', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));

  expect(screen.getByText('$9,700')).toBeInTheDocument();
  expect(screen.getByText('$300 used')).toBeInTheDocument();

  const usageSection = screen
    .getByRole('heading', { name: /building usage/i })
    .closest('section');
  expect(within(usageSection).getByText('$300 each ·')).toBeInTheDocument();
  expect(within(usageSection).getByText('$300 total')).toBeInTheDocument();
});

test('undoes the latest placement and restores its budget', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  expect(screen.getByText('$9,400')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Undo Last' }));

  expect(screen.getByText('$9,700')).toBeInTheDocument();
  expect(screen.getByText('$300 used')).toBeInTheDocument();
});

test('removes a selected proposed facility without affecting existing facilities', () => {
  render(<App />);

  const initialMarkerCount = Number(
    screen.getByTestId('city-map').getAttribute('data-marker-count')
  );
  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  expect(screen.getByTestId('city-map')).toHaveAttribute(
    'data-marker-count',
    String(initialMarkerCount + 1)
  );

  fireEvent.click(
    screen.getByRole('button', { name: 'Select proposed facility' })
  );
  fireEvent.click(screen.getByRole('button', { name: 'Remove Selected' }));

  expect(screen.getByText('$10,000')).toBeInTheDocument();
  expect(screen.getByTestId('city-map')).toHaveAttribute(
    'data-marker-count',
    String(initialMarkerCount)
  );
});

test('switches between all and focused map facilities without changing the plan', () => {
  render(<App />);

  const allMarkerCount = Number(
    screen.getByTestId('city-map').getAttribute('data-marker-count')
  );
  fireEvent.click(screen.getByRole('button', { name: /School\s+\$500/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Use focus view' }));
  const focusedMarkerCount = Number(
    screen.getByTestId('city-map').getAttribute('data-marker-count')
  );

  expect(focusedMarkerCount).toBeGreaterThan(0);
  expect(focusedMarkerCount).toBeLessThan(allMarkerCount);
  expect(screen.getByText('$10,000')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Use all view' }));
  expect(screen.getByTestId('city-map')).toHaveAttribute(
    'data-marker-count',
    String(allMarkerCount)
  );
});

test('hides existing and proposed facility layers independently', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Hide existing layer' }));
  expect(screen.getByTestId('city-map')).toHaveAttribute(
    'data-marker-count',
    '1'
  );

  fireEvent.click(screen.getByRole('button', { name: 'Hide proposed layer' }));
  expect(screen.getByTestId('city-map')).toHaveAttribute(
    'data-marker-count',
    '0'
  );
});

test('resets the full user plan and restores the initial budget', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset Plan' }));

  expect(screen.getByText('$10,000')).toBeInTheDocument();
  expect(screen.getByText('$0 used')).toBeInTheDocument();
});

test('locates a facility by selecting its type and map marker', () => {
  render(<App />);

  fireEvent.click(
    screen.getByRole('button', { name: /Community Centre\s+\$400/i })
  );
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(
    screen.getByRole('button', { name: 'Locate Community Centre' })
  );

  const planStatus = screen.getByRole('region', { name: /plan status/i });
  expect(within(planStatus).getByText('Community Centre')).toBeInTheDocument();
});

test('simulates a partially allocated plan and captures its facility count', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));

  const simulateButton = screen.getByRole('button', { name: 'Simulate' });
  expect(simulateButton).toBeEnabled();
  expect(screen.getByText('$9,700 will remain unallocated in this plan.'))
    .toBeInTheDocument();

  fireEvent.click(simulateButton);

  expect(
    screen.getByRole('dialog', { name: 'Simulation Results' })
  ).toHaveTextContent('1 facilities simulated');
});

test('simulates an empty plan as the no-plan comparison scenario', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Simulate' }));

  expect(
    screen.getByRole('dialog', { name: 'Simulation Results' })
  ).toHaveTextContent('0 facilities simulated');
});

test('invalidates an open result when the plan changes', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Simulate' }));
  expect(
    screen.getByRole('dialog', { name: 'Simulation Results' })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));

  expect(
    screen.queryByRole('dialog', { name: 'Simulation Results' })
  ).not.toBeInTheDocument();
});
