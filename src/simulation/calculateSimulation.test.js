import { burnaby2025, burnabyForecast2050 } from '../constants/mapData';
import {
  aggregateFacilityImpacts,
  calculateSimulation,
} from './calculateSimulation';

const facility = (buildingName) => ({
  buildingName,
  position: [49.25, -122.98],
});

describe('aggregateFacilityImpacts', () => {
  test('adds repeated facility impacts and ignores unknown facilities', () => {
    const impacts = aggregateFacilityImpacts([
      facility('Market'),
      facility('Market'),
      facility('UnknownFacility'),
    ]);

    expect(impacts.populationPercent).toBeCloseTo(0.06);
    expect(impacts.trafficPercent).toBeCloseTo(0.10);
  });
});

describe('calculateSimulation', () => {
  test('returns the complete scenario comparison model', () => {
    const result = calculateSimulation([]);

    expect(result).toEqual({
      baseline2025: burnaby2025,
      projection2050: burnabyForecast2050,
      userPlan2050: burnabyForecast2050,
      netImpact: expect.any(Object),
      yearlyTrend: expect.any(Array),
    });
    expect(result.yearlyTrend).toHaveLength(26);
    expect(result.yearlyTrend[0]).toEqual({
      year: 2025,
      projection: expect.objectContaining({ population: burnaby2025.population }),
      withPlan: expect.objectContaining({ population: burnaby2025.population }),
    });
    expect(result.yearlyTrend.at(-1)).toEqual({
      year: 2050,
      projection: expect.objectContaining({ population: burnabyForecast2050.population }),
      withPlan: expect.objectContaining({ population: burnabyForecast2050.population }),
    });
  });

  test('produces zero net impact when the user plan is empty', () => {
    const { netImpact } = calculateSimulation([]);

    Object.values(netImpact).forEach((value) => expect(value).toBe(0));
  });

  test('applies one school to the no-plan 2050 projection', () => {
    const { userPlan2050, netImpact } = calculateSimulation([
      facility('School'),
    ]);

    expect(userPlan2050).toEqual(expect.objectContaining({
      year: 2050,
      population: 378000,
      trafficAccidents: 4949,
      crimeRate: 8075,
      unemploymentRate: 4.074,
      housingSupplyRate: 85.17,
      airQualityIndex: 17.34,
      inflationRate: 3.2032,
    }));
    expect(userPlan2050.housingSatisfaction).toBeCloseTo(46.8);
    expect(netImpact.population).toBe(18000);
    expect(netImpact.crimeRate).toBe(-425);
  });

  test('scales repeated facilities and constrains supported ranges', () => {
    const manyPoliceStations = Array.from(
      { length: 10 },
      () => facility('PoliceStation')
    );
    const { userPlan2050 } = calculateSimulation(manyPoliceStations);

    expect(userPlan2050.population).toBeCloseTo(396000);
    expect(userPlan2050.trafficAccidents).toBe(0);
    expect(userPlan2050.crimeRate).toBe(0);
    expect(userPlan2050.housingSatisfaction).toBeLessThanOrEqual(100);
  });

  test('does not mutate facilities or source datasets', () => {
    const facilities = [facility('Hospital')];
    const facilitiesSnapshot = JSON.parse(JSON.stringify(facilities));
    const baselineSnapshot = { ...burnaby2025 };
    const projectionSnapshot = { ...burnabyForecast2050 };

    calculateSimulation(facilities);

    expect(facilities).toEqual(facilitiesSnapshot);
    expect(burnaby2025).toEqual(baselineSnapshot);
    expect(burnabyForecast2050).toEqual(projectionSnapshot);
  });
});
