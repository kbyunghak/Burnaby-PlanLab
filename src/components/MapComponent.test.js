import { fireEvent, render, screen } from '@testing-library/react';
import MapComponent from './MapComponent';

const mockMap = {
  fitBounds: jest.fn(),
  panTo: jest.fn(),
  setView: jest.fn(),
};

jest.mock('leaflet', () => ({
  Icon: class MockIcon {
    constructor(options) {
      this.options = options;
    }
  },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="leaflet-map">{children}</div>,
  Marker: ({ children, icon, opacity }) => (
    <div
      data-testid="facility-marker"
      data-icon-class={icon.options.className || 'default'}
      data-opacity={opacity}
    >
      {children}
    </div>
  ),
  Polygon: ({ pathOptions }) => (
    <div
      data-testid="burnaby-boundary"
      data-interactive={pathOptions.interactive}
    />
  ),
  Popup: ({ children }) => <div>{children}</div>,
  TileLayer: () => null,
  useMap: () => mockMap,
  useMapEvents: () => mockMap,
}));

const existingMarket = {
  position: [49.25, -122.98],
  popup: 'Existing market',
  buildingName: 'Market',
};

const proposedMarket = {
  position: [49.24, -122.97],
  popup: 'Proposed market',
  buildingName: 'Market',
};

beforeEach(() => {
  mockMap.fitBounds.mockClear();
  mockMap.panTo.mockClear();
  mockMap.setView.mockClear();
});

test('connects Reset View to the initialized Leaflet map', async () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[]}
      onMapClick={jest.fn()}
      selectedBuilding={null}
      showAllIcons={false}
      existingFacilities={[]}
      selectedUserFacilityId={null}
      selectedUserFacility={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const resetButton = await screen.findByRole('button', { name: 'Reset View' });
  expect(resetButton).toBeEnabled();
  expect(screen.getByTestId('burnaby-boundary')).toHaveAttribute(
    'data-interactive',
    'false'
  );

  fireEvent.click(resetButton);

  expect(mockMap.setView).toHaveBeenCalledWith([49.2488, -122.9805], 12);
});

test('keeps facility icons and distinguishes existing and proposed markers', () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[existingMarket, proposedMarket]}
      onMapClick={jest.fn()}
      selectedBuilding={null}
      showAllIcons
      existingFacilities={[existingMarket]}
      selectedUserFacilityId={null}
      selectedUserFacility={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const markers = screen.getAllByTestId('facility-marker');

  expect(markers[0]).toHaveAttribute(
    'data-icon-class',
    'facility-marker facility-marker--existing'
  );
  expect(markers[0]).toHaveAttribute('data-opacity', '0.55');
  expect(markers[1]).toHaveAttribute(
    'data-icon-class',
    'facility-marker facility-marker--proposed'
  );
  expect(markers[1]).toHaveAttribute('data-opacity', '1');
});

test('pans to a selected user-plan facility', () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[{ ...proposedMarket, id: 'plan-1' }]}
      onMapClick={jest.fn()}
      selectedBuilding={null}
      showAllIcons
      existingFacilities={[]}
      selectedUserFacilityId="plan-1"
      selectedUserFacility={{ ...proposedMarket, id: 'plan-1' }}
      onUserFacilitySelect={jest.fn()}
    />
  );

  expect(mockMap.panTo).toHaveBeenCalledWith(proposedMarket.position);
});
