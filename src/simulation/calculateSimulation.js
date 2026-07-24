import { burnaby2025 } from '../constants/mapData';
import { facilityDefinitions } from '../constants/facilityDefinitions';
import { constrainMetric } from '../constants/metricDefinitions';

const aggregateImpacts = (facilities) => {
  const facilityCounts = facilities.reduce((counts, facility) => {
    counts[facility.buildingName] = (counts[facility.buildingName] || 0) + 1;
    return counts;
  }, {});

  return Object.entries(facilityCounts).reduce((total, [facilityName, count]) => {
    const impact = facilityDefinitions[facilityName]?.impacts;
    if (!impact) return total;

    Object.entries(impact).forEach(([metric, value]) => {
      total[metric] = (total[metric] || 0) + value * count;
    });

    return total;
  }, {});
};

export const calculateSimulation = (facilities) => {
  const baseData = { ...burnaby2025 };
  const data = [baseData];
  const totalImpactPercent = aggregateImpacts(facilities);
  const yearsToSimulate = 2050 - 2025;

  for (let year = 2026; year <= 2050; year++) {
    const fraction = (year - 2025) / yearsToSimulate;
    const newEntry = {
      year,
      population: Math.round(
        baseData.population * (1 + (totalImpactPercent.populationPercent || 0) * fraction)
      ),
      housingSatisfaction: constrainMetric(
        'housingSatisfaction',
        baseData.housingSatisfaction
          * (1 + (totalImpactPercent.housingSatisfactionPercent || 0) * fraction)
      ),
      housingSupplyRate: constrainMetric(
        'housingSupplyRate',
        baseData.housingSupplyRate
          * (1 + (totalImpactPercent.housingSupplyPercent || 0) * fraction)
      ),
      airQualityIndex: constrainMetric(
        'airQualityIndex',
        baseData.airQualityIndex
          * (1 + (totalImpactPercent.airQualityPercent || 0) * fraction)
      ),
      inflationRate: constrainMetric(
        'inflationRate',
        baseData.inflationRate
          * (1 + (totalImpactPercent.inflationPercent || 0) * fraction)
      ),
      trafficAccidents: constrainMetric('trafficAccidents', Math.round(
        baseData.trafficAccidents
          * (1 + (totalImpactPercent.trafficPercent || 0) * fraction)
      )),
      crimeRate: constrainMetric('crimeRate', Math.round(
        baseData.crimeRate
          * (1 + (totalImpactPercent.crimePercent || 0) * fraction)
      )),
      unemploymentRate: constrainMetric(
        'unemploymentRate',
        baseData.unemploymentRate
          * (1 + (totalImpactPercent.unemploymentPercent || 0) * fraction)
      ),
    };

    data.push(newEntry);
  }

  return data;
};
