import { filterMapFacilities, MAP_VIEW_MODES } from './mapVisibility';

const facilities = [
  { buildingName: 'School', position: [1, 1] },
  { buildingName: 'PoliceStation', position: [2, 2] },
  { id: 'plan-1', buildingName: 'School', position: [3, 3] },
  { id: 'plan-2', buildingName: 'Market', position: [4, 4] },
];

const baseOptions = {
  facilities,
  selectedBuildingName: 'School',
  visibleFacilityTypes: ['School', 'PoliceStation'],
  showExisting: true,
  showProposed: true,
};

test('all mode shows every enabled map layer', () => {
  expect(
    filterMapFacilities({ ...baseOptions, viewMode: MAP_VIEW_MODES.ALL })
  ).toEqual(facilities);
});

test('focus mode shows existing and proposed facilities of the selected type', () => {
  expect(
    filterMapFacilities({ ...baseOptions, viewMode: MAP_VIEW_MODES.FOCUS })
  ).toEqual([facilities[0], facilities[2]]);
});

test('focus mode shows no markers without a selected facility type', () => {
  expect(
    filterMapFacilities({
      ...baseOptions,
      viewMode: MAP_VIEW_MODES.FOCUS,
      selectedBuildingName: null,
    })
  ).toEqual([]);
});

test('filter mode supports multiple facility types', () => {
  expect(
    filterMapFacilities({ ...baseOptions, viewMode: MAP_VIEW_MODES.FILTER })
  ).toEqual([facilities[0], facilities[1], facilities[2]]);
});

test('existing and proposed layers can be hidden independently', () => {
  expect(
    filterMapFacilities({
      ...baseOptions,
      viewMode: MAP_VIEW_MODES.ALL,
      showExisting: false,
    })
  ).toEqual([facilities[2], facilities[3]]);
  expect(
    filterMapFacilities({
      ...baseOptions,
      viewMode: MAP_VIEW_MODES.ALL,
      showProposed: false,
    })
  ).toEqual([facilities[0], facilities[1]]);
});
