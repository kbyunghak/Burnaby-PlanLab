import { createPlanSnapshot } from './createPlanSnapshot';

test('captures an immutable plan and its budget totals', () => {
  const facilities = [{
    id: 'plan-1',
    buildingName: 'Market',
    cost: 300,
    position: [49.25, -122.98],
  }];

  const snapshot = createPlanSnapshot(facilities, 10000);

  expect(snapshot).toMatchObject({
    facilityCount: 1,
    totalCost: 300,
    remainingBudget: 9700,
  });
  expect(snapshot.facilities).not.toBe(facilities);
  expect(snapshot.facilities[0]).not.toBe(facilities[0]);
  expect(Object.isFrozen(snapshot)).toBe(true);
  expect(Object.isFrozen(snapshot.facilities)).toBe(true);
  expect(Object.isFrozen(snapshot.facilities[0].position)).toBe(true);
});

test('captures an empty plan with the full budget unallocated', () => {
  expect(createPlanSnapshot([], 10000)).toMatchObject({
    facilities: [],
    facilityCount: 0,
    totalCost: 0,
    remainingBudget: 10000,
  });
});
