import React from 'react';
import './BuildingUsage.css';

const formatCurrency = (value) => `$${value.toLocaleString()}`;

function BuildingUsage({
  facilities,
  totalUsedBudget,
  budgetLimit,
  onLocate,
  onRemoveOne,
  onRemoveAll,
}) {
  const usedFacilities = facilities.filter(({ count }) => count > 0);
  const unusedFacilities = facilities.filter(({ count }) => count === 0);
  const usedPercentage = Math.min(
    100,
    Math.round((totalUsedBudget / budgetLimit) * 100)
  );

  return (
    <section className="usage-summary" aria-labelledby="usage-heading">
      <div className="usage-summary__header">
        <div>
          <h3 id="usage-heading">Building Usage</h3>
          <p>Review and edit the facilities in your plan.</p>
        </div>
        <strong>{formatCurrency(totalUsedBudget)} used</strong>
      </div>

      <div className="budget-progress">
        <div className="budget-progress__labels">
          <span>{usedPercentage}% allocated</span>
          <span>{formatCurrency(budgetLimit)} budget</span>
        </div>
        <progress
          aria-label="Budget allocated"
          max={budgetLimit}
          value={totalUsedBudget}
        />
      </div>

      {usedFacilities.length === 0 ? (
        <p className="usage-summary__empty">
          Select a facility and place it on the map to start your plan.
        </p>
      ) : (
        <ul className="usage-list">
          {usedFacilities.map((facility) => (
            <li className="usage-card" key={facility.name}>
              <img
                src={process.env.PUBLIC_URL + facility.icon}
                alt=""
                className="usage-card__icon"
              />
              <div className="usage-card__details">
                <div className="usage-card__title">
                  <strong>{facility.label}</strong>
                  <span className="usage-card__count">{facility.count}</span>
                </div>
                <span>
                  {formatCurrency(facility.costPerUnit)} each ·{' '}
                  <strong>{formatCurrency(facility.totalCost)} total</strong>
                </span>
              </div>
              <div className="usage-card__actions">
                <button
                  type="button"
                  onClick={() => onLocate(facility.name)}
                >
                  Locate
                  <span className="sr-only"> {facility.label}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveOne(facility.name)}
                >
                  Remove one
                  <span className="sr-only"> {facility.label}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveAll(facility.name)}
                >
                  Remove all
                  <span className="sr-only"> {facility.label}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <details className="unused-facilities">
        <summary>Unused facility types ({unusedFacilities.length})</summary>
        <ul>
          {unusedFacilities.map((facility) => (
            <li key={facility.name}>
              <span>{facility.label}</span>
              <span>{formatCurrency(facility.costPerUnit)}</span>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export default BuildingUsage;
