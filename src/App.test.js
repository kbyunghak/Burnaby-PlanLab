import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/MapComponentWrapper', () => function MockMap() {
  return <div data-testid="city-map">City map</div>;
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
});

test('selects and deselects a building type', () => {
  render(<App />);

  const marketButton = screen.getByRole('button', { name: /Market\s+\$300/i });
  fireEvent.click(marketButton);
  expect(screen.getByText(/Selected Building:/)).toHaveTextContent('Market');

  fireEvent.click(marketButton);
  expect(screen.getByText(/Selected Building:/)).toHaveTextContent('No building selected');
});
