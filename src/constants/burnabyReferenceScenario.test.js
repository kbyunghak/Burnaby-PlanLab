import { burnabyReferenceScenario } from './burnabyReferenceScenario';

test('stores the published Burnaby 2050 high-growth reference values', () => {
  expect(burnabyReferenceScenario).toEqual(expect.objectContaining({
    id: 'burnaby-2050-ocp-high-growth-2025',
    status: 'official-reference',
    officialSeries: expect.objectContaining({
      2021: expect.objectContaining({ population: 261810 }),
      2030: expect.objectContaining({ population: 311510 }),
      2040: expect.objectContaining({ population: 361630 }),
      2050: expect.objectContaining({
        population: 408150,
        dwellingUnits: 174060,
        jobs: 231820,
      }),
    }),
  }));
});

test('identifies the 2026 value as an interpolated model estimate', () => {
  expect(burnabyReferenceScenario.modelStart2026).toEqual({
    population: 289421,
    dwellingUnits: 118481,
    jobs: 174308,
    method: 'Linear interpolation between official 2021 and 2030 values',
    status: 'model-estimate',
  });
});
