export const MAP_VIEW_MODES = {
  FOCUS: 'focus',
  FILTER: 'filter',
  ALL: 'all',
};

export function filterMapFacilities({
  facilities,
  viewMode,
  selectedBuildingName,
  visibleFacilityTypes,
  showExisting,
  showProposed,
}) {
  return facilities.filter((facility) => {
    const isProposed = Boolean(facility.id);
    if (isProposed ? !showProposed : !showExisting) return false;

    if (viewMode === MAP_VIEW_MODES.FOCUS) {
      return Boolean(selectedBuildingName)
        && facility.buildingName === selectedBuildingName;
    }

    if (viewMode === MAP_VIEW_MODES.FILTER) {
      return visibleFacilityTypes.includes(facility.buildingName);
    }

    return true;
  });
}
