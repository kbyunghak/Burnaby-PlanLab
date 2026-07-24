import { burnaby2025 } from '../constants/mapData';
import { calculateSimulation } from './calculateSimulation';

const facility = (buildingName) => ({
  buildingName,
  position: [49.25, -122.98],
});

describe('calculateSimulation', () => {
  test('returns a complete 2025-2050 timeline', () => {
    const result = calculateSimulation([]);

    expect(result).toHaveLength(26);
    expect(result[0]).toEqual(burnaby2025);
    expect(result[25].year).toBe(2050);
  });

  test('keeps baseline metrics unchanged when no facilities are provided', () => {
    const result = calculateSimulation([]);
    const finalYear = result.at(-1);

    expect(finalYear).toEqual({ ...burnaby2025, year: 2050 });
  });

  test('applies the current impact multipliers for one school', () => {
    const finalYear = calculateSimulation([facility('School')]).at(-1);

    expect(finalYear).toEqual(expect.objectContaining({
      year: 2050,
      population: 276198,
      housingSatisfaction: 32.24,
      housingSupplyRate: 65.13,
      airQualityIndex: 17.34,
      trafficAccidents: 8330,
      crimeRate: 10873,
      unemploymentRate: 6.014,
    }));
    expect(finalYear.inflationRate).toBeCloseTo(2.5025);
  });

  test('scales repeated facility impacts by facility count', () => {
    const twoMarkets = calculateSimulation([
      facility('Market'),
      facility('Market'),
    ]).at(-1);

    expect(twoMarkets.population).toBe(278829);
    expect(twoMarkets.trafficAccidents).toBe(9350);
  });

  test('ignores unknown facility types', () => {
    const result = calculateSimulation([facility('UnknownFacility')]);

    expect(result.at(-1)).toEqual({ ...burnaby2025, year: 2050 });
  });

  test('does not mutate its input facilities or the baseline data', () => {
    const facilities = [facility('Hospital')];
    const facilitiesSnapshot = JSON.parse(JSON.stringify(facilities));
    const baselineSnapshot = { ...burnaby2025 };

    calculateSimulation(facilities);

    expect(facilities).toEqual(facilitiesSnapshot);
    expect(burnaby2025).toEqual(baselineSnapshot);
  });

  test('constrains bounded metrics to their supported ranges', () => {
    const manyPoliceStations = Array.from(
      { length: 10 },
      () => facility('PoliceStation')
    );
    const finalYear = calculateSimulation(manyPoliceStations).at(-1);

    expect(finalYear.trafficAccidents).toBe(0);
    expect(finalYear.crimeRate).toBe(0);
    expect(finalYear.housingSatisfaction).toBeLessThanOrEqual(100);
    expect(finalYear.unemploymentRate).toBeGreaterThanOrEqual(0);
    expect(finalYear.airQualityIndex).toBeLessThanOrEqual(500);
  });
});
