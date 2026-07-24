import { facilityDefinitions } from '../constants/facilityDefinitions';
import {
  constrainMetric,
  metricEntries,
} from '../constants/metricDefinitions';
import { burnaby2026, burnabyForecast2050 } from '../constants/mapData';

const START_YEAR = 2026;
const END_YEAR = 2050;

export const aggregateFacilityImpacts = (facilities) =>
  facilities.reduce((total, facility) => {
    const impacts = facilityDefinitions[facility.buildingName]?.impacts;
    if (!impacts) return total;

    Object.entries(impacts).forEach(([impactKey, value]) => {
      total[impactKey] = (total[impactKey] || 0) + value;
    });

    return total;
  }, {});

const mapMetrics = (createValue, constrain = true) =>
  Object.fromEntries(
    metricEntries.map(({ key, impactKey }) => {
      const value = createValue(key, impactKey);
      return [key, constrain ? constrainMetric(key, value) : value];
    })
  );

export const calculateSimulation = (facilities) => {
  const baseline2026 = { ...burnaby2026 };
  const projection2050 = { ...burnabyForecast2050 };
  const totalImpacts = aggregateFacilityImpacts(facilities);

  const userPlan2050 = {
    year: END_YEAR,
    ...mapMetrics(
      (key, impactKey) =>
        projection2050[key] * (1 + (totalImpacts[impactKey] || 0))
    ),
  };

  const netImpact = mapMetrics(
    (key) => userPlan2050[key] - projection2050[key],
    false
  );

  const yearlyTrend = Array.from(
    { length: END_YEAR - START_YEAR + 1 },
    (_, index) => {
      const year = START_YEAR + index;
      const fraction = index / (END_YEAR - START_YEAR);

      const projection = mapMetrics(
        (key) =>
          baseline2026[key]
          + (projection2050[key] - baseline2026[key]) * fraction
      );
      const withPlan = mapMetrics(
        (key, impactKey) =>
          projection[key] * (1 + (totalImpacts[impactKey] || 0) * fraction)
      );

      return { year, projection, withPlan };
    }
  );

  return {
    baseline2026,
    projection2050,
    userPlan2050,
    netImpact,
    yearlyTrend,
  };
};
