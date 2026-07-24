export const initialPlanState = {
  facilities: [],
  nextFacilityId: 1,
  selectedFacilityId: null,
};

export function planReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const facility = {
        ...action.facility,
        id: `plan-${state.nextFacilityId}`,
      };

      return {
        facilities: [...state.facilities, facility],
        nextFacilityId: state.nextFacilityId + 1,
        selectedFacilityId: facility.id,
      };
    }
    case 'select':
      return {
        ...state,
        selectedFacilityId: state.facilities.some(
          ({ id }) => id === action.facilityId
        )
          ? action.facilityId
          : null,
      };
    case 'undo': {
      if (state.facilities.length === 0) return state;

      const removedFacility = state.facilities[state.facilities.length - 1];

      return {
        ...state,
        facilities: state.facilities.slice(0, -1),
        selectedFacilityId:
          state.selectedFacilityId === removedFacility.id
            ? null
            : state.selectedFacilityId,
      };
    }
    case 'remove-selected':
      if (!state.selectedFacilityId) return state;

      return {
        ...state,
        facilities: state.facilities.filter(
          ({ id }) => id !== state.selectedFacilityId
        ),
        selectedFacilityId: null,
      };
    case 'remove-latest-by-type': {
      let facilityIndex = -1;
      for (let index = state.facilities.length - 1; index >= 0; index -= 1) {
        if (state.facilities[index].buildingName === action.buildingName) {
          facilityIndex = index;
          break;
        }
      }
      if (facilityIndex === -1) return state;

      const removedFacility = state.facilities[facilityIndex];

      return {
        ...state,
        facilities: state.facilities.filter(
          (_, index) => index !== facilityIndex
        ),
        selectedFacilityId:
          state.selectedFacilityId === removedFacility.id
            ? null
            : state.selectedFacilityId,
      };
    }
    case 'remove-all-by-type': {
      const facilities = state.facilities.filter(
        ({ buildingName }) => buildingName !== action.buildingName
      );
      if (facilities.length === state.facilities.length) return state;

      return {
        ...state,
        facilities,
        selectedFacilityId: facilities.some(
          ({ id }) => id === state.selectedFacilityId
        )
          ? state.selectedFacilityId
          : null,
      };
    }
    case 'reset':
      return initialPlanState;
    default:
      return state;
  }
}
