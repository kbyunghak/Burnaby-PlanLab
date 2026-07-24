import { initialPlanState, planReducer } from './planReducer';

const market = {
  position: [49.25, -122.98],
  popup: 'Market',
  buildingName: 'Market',
  cost: 300,
};

const school = {
  position: [49.24, -122.97],
  popup: 'School',
  buildingName: 'School',
  cost: 500,
};

test('adds facilities with stable plan IDs without mutating the previous state', () => {
  const firstState = planReducer(initialPlanState, {
    type: 'add',
    facility: market,
  });
  const secondState = planReducer(firstState, {
    type: 'add',
    facility: school,
  });

  expect(initialPlanState.facilities).toEqual([]);
  expect(firstState.facilities[0]).toMatchObject({ id: 'plan-1', ...market });
  expect(secondState.facilities[1]).toMatchObject({ id: 'plan-2', ...school });
  expect(secondState.selectedFacilityId).toBe('plan-2');
});

test('undo removes only the latest facility and clears its selection', () => {
  const withMarket = planReducer(initialPlanState, {
    type: 'add',
    facility: market,
  });
  const withSchool = planReducer(withMarket, {
    type: 'add',
    facility: school,
  });

  const result = planReducer(withSchool, { type: 'undo' });

  expect(result.facilities).toEqual(withMarket.facilities);
  expect(result.selectedFacilityId).toBeNull();
});

test('removes only the selected user-plan facility', () => {
  const withMarket = planReducer(initialPlanState, {
    type: 'add',
    facility: market,
  });
  const withSchool = planReducer(withMarket, {
    type: 'add',
    facility: school,
  });
  const selectedMarket = planReducer(withSchool, {
    type: 'select',
    facilityId: 'plan-1',
  });

  const result = planReducer(selectedMarket, { type: 'remove-selected' });

  expect(result.facilities).toEqual([
    expect.objectContaining({ id: 'plan-2', buildingName: 'School' }),
  ]);
  expect(result.selectedFacilityId).toBeNull();
});

test('reset clears the plan and restarts facility IDs', () => {
  const populatedState = planReducer(initialPlanState, {
    type: 'add',
    facility: market,
  });

  expect(planReducer(populatedState, { type: 'reset' })).toEqual(initialPlanState);
});

test('ignores invalid selection and editing actions on an empty plan', () => {
  expect(
    planReducer(initialPlanState, {
      type: 'select',
      facilityId: 'existing-1',
    })
  ).toEqual(initialPlanState);
  expect(planReducer(initialPlanState, { type: 'undo' })).toBe(initialPlanState);
  expect(planReducer(initialPlanState, { type: 'remove-selected' })).toBe(
    initialPlanState
  );
});
