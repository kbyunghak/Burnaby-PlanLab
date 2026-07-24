import { burnaby2025 } from '../constants/mapData';

export const facilityImpactMultipliers = {
  Market: { populationPercent: 0.03, trafficPercent: 0.05, crimePercent: 0.02, housingSatisfactionPercent: 0.01, unemploymentPercent: -0.02, housingSupplyPercent: 0.005, airQualityPercent: -0.03, inflationPercent: 0.002 },
  School: { populationPercent: 0.05, trafficPercent: -0.02, crimePercent: -0.05, housingSatisfactionPercent: 0.04, unemploymentPercent: -0.03, housingSupplyPercent: 0.002, airQualityPercent: 0.02, inflationPercent: 0.001 },
  CommunityCentre: { populationPercent: 0.02, trafficPercent: -0.01, crimePercent: -0.03, housingSatisfactionPercent: 0.07, unemploymentPercent: -0.01, housingSupplyPercent: 0.001, airQualityPercent: 0.04, inflationPercent: 0.001 },
  Hospital: { populationPercent: 0.03, trafficPercent: -0.10, crimePercent: -0.02, housingSatisfactionPercent: 0.03, unemploymentPercent: -0.01, housingSupplyPercent: 0, airQualityPercent: 0.05, inflationPercent: 0.001 },
  PoliceStation: { populationPercent: 0.01, trafficPercent: -0.15, crimePercent: -0.20, housingSatisfactionPercent: 0.05, unemploymentPercent: 0, housingSupplyPercent: 0, airQualityPercent: 0.01, inflationPercent: 0 },
  NonProfitHousing: { populationPercent: 0.08, trafficPercent: 0.02, crimePercent: 0.01, housingSatisfactionPercent: 0.10, unemploymentPercent: -0.05, housingSupplyPercent: 0.02, airQualityPercent: -0.05, inflationPercent: 0.002 },
  Daycare: { populationPercent: 0.04, trafficPercent: 0, crimePercent: 0, housingSatisfactionPercent: 0.03, unemploymentPercent: -0.01, housingSupplyPercent: 0, airQualityPercent: 0, inflationPercent: 0.001 },
  SeniorCentre: { populationPercent: 0.02, trafficPercent: 0, crimePercent: -0.01, housingSatisfactionPercent: 0.06, unemploymentPercent: 0, housingSupplyPercent: 0, airQualityPercent: 0.01, inflationPercent: 0 },
};

const aggregateImpacts = (facilities) => {
  const facilityCounts = facilities.reduce((counts, facility) => {
    counts[facility.buildingName] = (counts[facility.buildingName] || 0) + 1;
    return counts;
  }, {});

  return Object.entries(facilityCounts).reduce((total, [facilityName, count]) => {
    const impact = facilityImpactMultipliers[facilityName];
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
      housingSatisfaction: Math.min(100, Math.max(
        0,
        baseData.housingSatisfaction
          * (1 + (totalImpactPercent.housingSatisfactionPercent || 0) * fraction)
      )),
      housingSupplyRate: Math.min(100, Math.max(
        0,
        baseData.housingSupplyRate
          * (1 + (totalImpactPercent.housingSupplyPercent || 0) * fraction)
      )),
      airQualityIndex: Math.min(500, Math.max(
        0,
        baseData.airQualityIndex
          * (1 + (totalImpactPercent.airQualityPercent || 0) * fraction)
      )),
      inflationRate: Math.max(
        0,
        baseData.inflationRate
          * (1 + (totalImpactPercent.inflationPercent || 0) * fraction)
      ),
      trafficAccidents: Math.max(0, Math.round(
        baseData.trafficAccidents
          * (1 + (totalImpactPercent.trafficPercent || 0) * fraction)
      )),
      crimeRate: Math.max(0, Math.round(
        baseData.crimeRate
          * (1 + (totalImpactPercent.crimePercent || 0) * fraction)
      )),
      unemploymentRate: Math.max(0, Math.min(
        100,
        baseData.unemploymentRate
          * (1 + (totalImpactPercent.unemploymentPercent || 0) * fraction)
      )),
    };

    data.push(newEntry);
  }

  return data;
};
