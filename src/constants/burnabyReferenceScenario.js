const OFFICIAL_START_YEAR = 2021;
const MODEL_START_YEAR = 2026;
const FIRST_FORECAST_YEAR = 2030;

const interpolate = (startValue, endValue) => {
  const elapsedYears = MODEL_START_YEAR - OFFICIAL_START_YEAR;
  const forecastInterval = FIRST_FORECAST_YEAR - OFFICIAL_START_YEAR;

  return Math.round(
    startValue + (endValue - startValue) * (elapsedYears / forecastInterval)
  );
};

const officialSeries = {
  2021: {
    population: 261810,
    dwellingUnits: 106170,
    jobs: 160330,
  },
  2030: {
    population: 311510,
    dwellingUnits: 128330,
    jobs: 185490,
  },
  2040: {
    population: 361630,
    dwellingUnits: 151860,
    jobs: 209940,
  },
  2050: {
    population: 408150,
    dwellingUnits: 174060,
    jobs: 231820,
  },
};

export const burnabyReferenceScenario = {
  id: 'burnaby-2050-ocp-high-growth-2025',
  label: 'Burnaby 2050 OCP High-Growth Reference Scenario',
  status: 'official-reference',
  adoptedDate: '2025-12-09',
  source: {
    organization: 'City of Burnaby',
    publication: 'Burnaby 2050 Official Community Plan',
    scenario: 'Metro Vancouver high-growth scenario',
    url: 'https://www.burnaby.ca/sites/default/files/acquiadam/2025-12/Burnaby%202050%20Official%20Community%20Plan.pdf',
  },
  officialSeries,
  modelStart2026: {
    population: interpolate(
      officialSeries[2021].population,
      officialSeries[2030].population
    ),
    dwellingUnits: interpolate(
      officialSeries[2021].dwellingUnits,
      officialSeries[2030].dwellingUnits
    ),
    jobs: interpolate(
      officialSeries[2021].jobs,
      officialSeries[2030].jobs
    ),
    method: 'Linear interpolation between official 2021 and 2030 values',
    status: 'model-estimate',
  },
};

export const illustrativeBaseline2026 = {
  trafficAccidents: 8500,
  crimeRate: 11445,
  housingSatisfaction: 31,
  unemploymentRate: 6.2,
  housingSupplyRate: 65,
  airQualityIndex: 17,
  inflationRate: 2.5,
};

export const illustrativeProjection2050 = {
  trafficAccidents: 5050,
  crimeRate: 8500,
  housingSatisfaction: 45,
  unemploymentRate: 4.2,
  housingSupplyRate: 85,
  airQualityIndex: 17,
  inflationRate: 3.2,
};
