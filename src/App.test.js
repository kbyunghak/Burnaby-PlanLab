import { fireEvent, render, screen } from '@testing-library/react';
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
  expect(screen.getByText(/^Budget:/)).toHaveTextContent('$10000');
  expect(screen.getByRole('button', { name: /simulate/i })).toBeDisabled();
  expect(screen.getByText(/Total Used Budget:/)).toHaveTextContent('$0');
});

test('selects and deselects a building type', () => {
  render(<App />);

  const marketButton = screen.getByRole('button', { name: /Market\s+\$300/i });
  fireEvent.click(marketButton);
  expect(screen.getByText(/Selected Building:/)).toHaveTextContent('Market');

  fireEvent.click(marketButton);
  expect(screen.getByText(/Selected Building:/)).toHaveTextContent('No building selected');
});

test('charges the budget only for facilities added to the user plan', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Market\s+\$300/i }));
  fireEvent.click(screen.getByRole('button', { name: /place facility on map/i }));

  expect(screen.getByText(/^Budget:/)).toHaveTextContent('$9700');
  expect(screen.getByText(/Total Used Budget:/)).toHaveTextContent('$300');
  expect(screen.getByText(/Market: \$300/)).toHaveTextContent('1 × $300');
});
