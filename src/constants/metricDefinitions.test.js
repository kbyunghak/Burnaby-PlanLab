import {
  constrainMetric,
  formatMetricValue,
  isFavorableChange,
  metricDefinitions,
  metricEntries,
} from './metricDefinitions';

describe('metricDefinitions', () => {
  test.each(Object.entries(metricDefinitions))(
    '%s has complete display and constraint metadata',
    (key, definition) => {
      expect(key).toMatch(/^[a-z][A-Za-z]+$/);
      expect(definition.label).toEqual(expect.any(String));
      expect(definition.unit).toEqual(expect.any(String));
      expect(definition.decimals).toBeGreaterThanOrEqual(0);
      expect(definition.min).toEqual(expect.any(Number));
      expect(['increase', 'decrease']).toContain(definition.favorableDirection);
    }
  );

  test('preserves the configured metric order', () => {
    expect(metricEntries.map(({ key }) => key)).toEqual(
      Object.keys(metricDefinitions)
    );
  });

  test('constrains values using shared metric ranges', () => {
    expect(constrainMetric('population', -1)).toBe(0);
    expect(constrainMetric('housingSatisfaction', 110)).toBe(100);
    expect(constrainMetric('airQualityIndex', 501)).toBe(500);
    expect(constrainMetric('unknownMetric', 123)).toBe(123);
  });

  test('formats values using metric precision and units', () => {
    expect(formatMetricValue('population', 263046)).toBe('263,046');
    expect(formatMetricValue('housingSatisfaction', 31.25)).toBe('31.3%');
    expect(formatMetricValue('inflationRate', 2.5, { fixed: true })).toBe('2.50%');
  });

  test('evaluates change using each metric favorable direction', () => {
    expect(isFavorableChange('population', 100)).toBe(true);
    expect(isFavorableChange('crimeRate', -100)).toBe(true);
    expect(isFavorableChange('crimeRate', 100)).toBe(false);
    expect(isFavorableChange('population', 0)).toBeNull();
  });
});
