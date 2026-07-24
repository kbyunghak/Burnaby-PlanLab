import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

jest.mock('./components/MapComponentWrapper', () => function MockMap({
  markers,
  onMapClick,
}) {
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
    </div>
  );
});

jest.mock('./components/SimulationModal', () => function MockSimulationModal() {
  return null;
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
  expect(screen.getByRole('button', { name: /simulate/i })).toBeDisabled();
  expect(screen.getByText('$0 used')).toBeInTheDocument();
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
  expect(within(usageSection).getByText(/1 × \$300/)).toHaveTextContent('= $300');
});
