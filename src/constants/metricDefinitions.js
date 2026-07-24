export const metricDefinitions = {
  population: {
    label: 'Population',
    unit: 'people',
    decimals: 0,
    min: 0,
    max: null,
    favorableDirection: 'increase',
    impactKey: 'populationPercent',
  },
  trafficAccidents: {
    label: 'Traffic Accidents',
    unit: 'incidents',
    decimals: 0,
    min: 0,
    max: null,
    favorableDirection: 'decrease',
    impactKey: 'trafficPercent',
  },
  crimeRate: {
    label: 'Crime Incidents',
    unit: 'incidents',
    decimals: 0,
    min: 0,
    max: null,
    favorableDirection: 'decrease',
    impactKey: 'crimePercent',
  },
  housingSatisfaction: {
    label: 'Housing Satisfaction',
    unit: '%',
    decimals: 1,
    min: 0,
    max: 100,
    favorableDirection: 'increase',
    impactKey: 'housingSatisfactionPercent',
  },
  unemploymentRate: {
    label: 'Unemployment Rate',
    unit: '%',
    decimals: 1,
    min: 0,
    max: 100,
    favorableDirection: 'decrease',
    impactKey: 'unemploymentPercent',
  },
  housingSupplyRate: {
    label: 'Housing Supply Rate',
    unit: '%',
    decimals: 1,
    min: 0,
    max: 100,
    favorableDirection: 'increase',
    impactKey: 'housingSupplyPercent',
  },
  airQualityIndex: {
    label: 'Air Quality Index',
    unit: 'AQI',
    decimals: 1,
    min: 0,
    max: 500,
    favorableDirection: 'decrease',
    impactKey: 'airQualityPercent',
  },
  inflationRate: {
    label: 'Inflation Rate',
    unit: '%',
    decimals: 2,
    min: 0,
    max: 100,
    favorableDirection: 'decrease',
    impactKey: 'inflationPercent',
  },
};

export const metricEntries = Object.entries(metricDefinitions).map(
  ([key, definition]) => ({ key, ...definition })
);

export const constrainMetric = (key, value) => {
  const definition = metricDefinitions[key];
  if (!definition) return value;

  const valueAboveMinimum = Math.max(definition.min, value);
  return definition.max === null
    ? valueAboveMinimum
    : Math.min(definition.max, valueAboveMinimum);
};

export const formatMetricValue = (key, value, options = {}) => {
  const definition = metricDefinitions[key];
  if (!definition || !Number.isFinite(value)) return String(value);

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: options.fixed ? definition.decimals : 0,
    maximumFractionDigits: definition.decimals,
  });

  return definition.unit === '%' ? `${formatted}%` : formatted;
};

export const isFavorableChange = (key, change) => {
  if (change === 0) return null;

  return metricDefinitions[key]?.favorableDirection === 'increase'
    ? change > 0
    : change < 0;
};
