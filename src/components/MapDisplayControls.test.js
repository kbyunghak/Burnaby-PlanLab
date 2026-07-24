import { fireEvent, render, screen } from '@testing-library/react';
import MapDisplayControls from './MapDisplayControls';
import { MAP_VIEW_MODES } from '../map/mapVisibility';

const defaultProps = {
  viewMode: MAP_VIEW_MODES.ALL,
  onViewModeChange: jest.fn(),
  selectedBuildingLabel: null,
  visibleFacilityTypes: ['School', 'PoliceStation'],
  onFacilityTypeToggle: jest.fn(),
  onSelectAllFacilityTypes: jest.fn(),
  onClearFacilityTypes: jest.fn(),
  showExisting: true,
  onShowExistingChange: jest.fn(),
  showProposed: true,
  onShowProposedChange: jest.fn(),
  visibleMarkerCount: 12,
};

beforeEach(() => {
  Object.values(defaultProps)
    .filter((value) => typeof value === 'function')
    .forEach((callback) => callback.mockClear());
});

test('changes between focus filter and all modes', () => {
  render(<MapDisplayControls {...defaultProps} />);

  expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
  fireEvent.click(screen.getByRole('button', { name: 'Focus' }));
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));

  expect(defaultProps.onViewModeChange).toHaveBeenNthCalledWith(
    1,
    MAP_VIEW_MODES.FOCUS
  );
  expect(defaultProps.onViewModeChange).toHaveBeenNthCalledWith(
    2,
    MAP_VIEW_MODES.FILTER
  );
});

test('supports multiple facility filters', () => {
  render(
    <MapDisplayControls
      {...defaultProps}
      viewMode={MAP_VIEW_MODES.FILTER}
    />
  );

  expect(screen.getByRole('checkbox', { name: 'School' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Police Station' })).toBeChecked();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Market' }));

  expect(defaultProps.onFacilityTypeToggle).toHaveBeenCalledWith('Market');
});

test('selects or clears all facility filters with one action', () => {
  render(
    <MapDisplayControls
      {...defaultProps}
      viewMode={MAP_VIEW_MODES.FILTER}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'Select all' }));
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

  expect(defaultProps.onSelectAllFacilityTypes).toHaveBeenCalledTimes(1);
  expect(defaultProps.onClearFacilityTypes).toHaveBeenCalledTimes(1);
});

test('toggles existing and proposed layers independently', () => {
  render(<MapDisplayControls {...defaultProps} />);

  fireEvent.click(screen.getByRole('checkbox', { name: 'Existing' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'My Plan' }));

  expect(defaultProps.onShowExistingChange).toHaveBeenCalledWith(false);
  expect(defaultProps.onShowProposedChange).toHaveBeenCalledWith(false);
});
