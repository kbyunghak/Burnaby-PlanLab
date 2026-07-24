import { fireEvent, render, screen } from '@testing-library/react';
import LegendModal from './LegendModal';

test('shows facility costs, measured impacts, and model status', () => {
  render(<LegendModal isOpen onRequestClose={jest.fn()} />);

  expect(
    screen.getByRole('heading', { name: 'Facility Impact Legend' })
  ).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'School' })).toBeInTheDocument();
  expect(screen.getByText('$500 plan cost')).toBeInTheDocument();
  expect(screen.getAllByText('+5%').length).toBeGreaterThan(0);
  expect(screen.getByText(/educational assumptions/i)).toBeInTheDocument();
  expect(screen.getByText(/direction, not whether/i)).toBeInTheDocument();
});

test('closes from the visible dialog action', () => {
  const onRequestClose = jest.fn();
  render(<LegendModal isOpen onRequestClose={onRequestClose} />);

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(onRequestClose).toHaveBeenCalledTimes(1);
});
