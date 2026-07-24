export function createPlanSnapshot(facilities, budgetLimit) {
  const snapshotFacilities = facilities.map((facility) =>
    Object.freeze({
      ...facility,
      position: Object.freeze([...facility.position]),
    })
  );
  const totalCost = snapshotFacilities.reduce(
    (total, facility) => total + facility.cost,
    0
  );

  return Object.freeze({
    facilities: Object.freeze(snapshotFacilities),
    facilityCount: snapshotFacilities.length,
    totalCost,
    remainingBudget: budgetLimit - totalCost,
  });
}
