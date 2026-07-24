import { fireEvent, render, screen } from '@testing-library/react';
import MapComponent from './MapComponent';

const mockMap = {
  fitBounds: jest.fn(),
  getZoom: jest.fn(() => 12),
  setZoom: jest.fn(),
};

jest.mock('leaflet', () => ({
  Icon: class MockIcon {
    constructor(options) {
      this.options = options;
    }
  },
}));

jest.mock('react-leaflet', () => ({
  MapContainer: ({
    children,
    minZoom,
    maxZoom,
    maxBounds,
    maxBoundsViscosity,
  }) => (
    <div
      data-testid="leaflet-map"
      data-min-zoom={minZoom}
      data-max-zoom={maxZoom}
      data-max-bounds={JSON.stringify(maxBounds)}
      data-bounds-viscosity={maxBoundsViscosity}
    >
      {children}
    </div>
  ),
  Marker: ({ children, icon, opacity, alt, title }) => (
    <div
      data-testid="facility-marker"
      data-icon-class={icon.options.className || 'default'}
      data-icon-size={icon.options.iconSize?.join('x') || 'default'}
      data-opacity={opacity}
      data-alt={alt}
      data-title={title}
    >
      {children}
    </div>
  ),
  Polygon: ({ pathOptions }) => (
    <div
      data-testid={pathOptions.className}
      data-interactive={pathOptions.interactive}
      data-fill-rule={pathOptions.fillRule}
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
  mockMap.getZoom.mockReset();
  mockMap.getZoom.mockReturnValue(12);
  mockMap.setZoom.mockClear();
});

test('highlights Burnaby and connects Reset View to its bounds', async () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[]}
      onMapClick={jest.fn()}
      existingFacilities={[]}
      selectedBuildingName={null}
      selectedUserFacilityId={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const resetButton = await screen.findByRole('button', { name: 'Reset View' });
  expect(resetButton).toBeEnabled();
  expect(screen.getByTestId('burnaby-boundary')).toHaveAttribute(
    'data-interactive',
    'false'
  );
  expect(screen.getByTestId('burnaby-map-mask')).toHaveAttribute(
    'data-fill-rule',
    'evenodd'
  );

  fireEvent.click(resetButton);

  expect(mockMap.fitBounds).toHaveBeenLastCalledWith(
    expect.any(Array),
    { animate: false, padding: [12, 12] }
  );
  expect(mockMap.setZoom).toHaveBeenLastCalledWith(
    12.5,
    { animate: false }
  );
});

test('limits navigation to the Burnaby context', () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[]}
      onMapClick={jest.fn()}
      existingFacilities={[]}
      selectedBuildingName={null}
      selectedUserFacilityId={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const map = screen.getByTestId('leaflet-map');

  expect(map).toHaveAttribute('data-min-zoom', '11.5');
  expect(map).toHaveAttribute('data-max-zoom', '16');
  expect(map).toHaveAttribute('data-bounds-viscosity', '0.8');
  expect(JSON.parse(map.getAttribute('data-max-bounds'))).toEqual([
    [49.1556, -123.0584],
    [49.3245, -122.8572],
  ]);
});

test('provides quarter-step map detail control without changing the center', () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[]}
      onMapClick={jest.fn()}
      existingFacilities={[]}
      selectedBuildingName={null}
      selectedUserFacilityId={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const detailControl = screen.getByRole('slider', {
    name: 'Map detail level',
  });

  expect(detailControl).toHaveAttribute('step', '0.25');
  fireEvent.change(detailControl, { target: { value: '13.25' } });

  expect(mockMap.setZoom).toHaveBeenCalledWith(13.25);
});

test('keeps facility icons and distinguishes existing and proposed markers', () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[existingMarket, proposedMarket]}
      onMapClick={jest.fn()}
      existingFacilities={[existingMarket]}
      selectedBuildingName={null}
      selectedUserFacilityId={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const markers = screen.getAllByTestId('facility-marker');

  expect(markers[0]).toHaveAttribute(
    'data-icon-class',
    'facility-marker facility-marker--existing'
  );
  expect(markers[0]).toHaveAttribute('data-icon-size', '24x24');
  expect(markers[0]).toHaveAttribute('data-alt', 'Existing Market');
  expect(markers[0]).toHaveAttribute('data-title', 'Existing Market');
  expect(markers[0]).toHaveAttribute('data-opacity', '0.82');
  expect(markers[1]).toHaveAttribute(
    'data-icon-class',
    'facility-marker facility-marker--proposed'
  );
  expect(markers[1]).toHaveAttribute('data-opacity', '1');
  expect(markers[1]).toHaveAttribute('data-alt', 'Your plan Market');
  expect(markers[1]).toHaveAttribute('data-title', 'Your plan Market');
});

test('highlights markers that match the currently selected facility type', () => {
  render(
    <MapComponent
      center={[49.2488, -122.9805]}
      zoom={12}
      markers={[existingMarket, proposedMarket]}
      onMapClick={jest.fn()}
      existingFacilities={[existingMarket]}
      selectedBuildingName="Market"
      selectedUserFacilityId={null}
      onUserFacilitySelect={jest.fn()}
    />
  );

  const markers = screen.getAllByTestId('facility-marker');

  expect(markers[0]).toHaveAttribute(
    'data-icon-class',
    expect.stringContaining('facility-marker--active-type')
  );
  expect(markers[1]).toHaveAttribute(
    'data-icon-class',
    expect.stringContaining('facility-marker--active-type')
  );
});
