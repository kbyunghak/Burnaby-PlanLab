import fs from 'fs';
import path from 'path';
import {
  facilityDefinitions,
  facilityImpactData,
  facilityOptions,
} from './facilityDefinitions';

const requiredImpactKeys = [
  'populationPercent',
  'trafficPercent',
  'crimePercent',
  'housingSatisfactionPercent',
  'unemploymentPercent',
  'housingSupplyPercent',
  'airQualityPercent',
  'inflationPercent',
];

describe('facilityDefinitions', () => {
  test.each(Object.entries(facilityDefinitions))(
    '%s has a complete and valid definition',
    (name, definition) => {
      expect(name).toMatch(/^[A-Z][A-Za-z]+$/);
      expect(definition.label).toEqual(expect.any(String));
      expect(definition.cost).toBeGreaterThan(0);
      expect(definition.icon).toMatch(/^\/icons\/.+\.png$/);
      expect(
        fs.existsSync(path.join(process.cwd(), 'public', definition.icon))
      ).toBe(true);
      expect(definition.description).toEqual(expect.any(String));
      expect(definition.benefits).toEqual(expect.any(String));
      expect(definition.drawbacks).toEqual(expect.any(String));
      expect(Object.keys(definition.impacts)).toEqual(requiredImpactKeys);

      Object.values(definition.impacts).forEach((impact) => {
        expect(Number.isFinite(impact)).toBe(true);
      });
    }
  );

  test('derives UI options and impact rows from every facility definition', () => {
    const facilityNames = Object.keys(facilityDefinitions);

    expect(facilityOptions.map(({ name }) => name)).toEqual(facilityNames);
    expect(facilityImpactData.map(({ facility }) => facility)).toEqual(facilityNames);
  });
});
