import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { facilityDefinitions } from '../constants/facilityDefinitions';
import {
  formatMetricValue,
  isFavorableChange,
  metricEntries,
} from '../constants/metricDefinitions';
import SimulationSummary from './SimulationSummary';
import SimulationSummary2 from './SimulationSummary2';
import AppModal from './AppModal';
import './SimulationModal.css';

const featuredMetricKeys = [
  'population',
  'trafficAccidents',
  'crimeRate',
  'housingSatisfaction',
];

const formatSignedMetric = (key, value) => {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${formatMetricValue(key, value)}`;
};

const getChangeClassName = (key, value) => {
  const favorable = isFavorableChange(key, value);
  if (favorable === null) return 'impact-neutral';
  return favorable ? 'impact-positive' : 'impact-negative';
};

const formatImpactPercent = (value) => {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  })}%`;
};

const SimulationModal = ({
  isOpen,
  onRequestClose,
  simulationData,
  facilitiesInstalled,
}) => {
  if (!simulationData) return null;

  const {
    baseline2026,
    projection2050,
    userPlan2050,
    netImpact,
    yearlyTrend,
    planSnapshot,
  } = simulationData;

  const installedDefinitions = facilitiesInstalled
    .map((facilityName) => ({
      name: facilityName,
      ...facilityDefinitions[facilityName],
    }))
    .filter(({ impacts }) => impacts);

  const populationTrend = yearlyTrend.map(({ year, projection, withPlan }) => ({
    year,
    projection: Math.round(projection.population),
    withPlan: Math.round(withPlan.population),
  }));

  return (
    <AppModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Simulation Results"
      overlayClassName="simulation-modal-overlay"
      className="simulation-modal"
    >
      <header className="simulation-modal__header">
        <div>
          <p className="simulation-modal__eyebrow">Your 2050 city plan</p>
          <h2>Simulation Results</h2>
          <p>
            Compare Burnaby&apos;s projected future with the measurable impact
            of your facility plan.
          </p>
        </div>
        <button
          type="button"
          className="simulation-modal__close-icon"
          onClick={onRequestClose}
          aria-label="Close simulation results"
        >
          ×
        </button>
      </header>

      {planSnapshot && (
        <aside
          className="simulation-plan-snapshot"
          aria-label="Simulated plan snapshot"
        >
          <strong>
            {planSnapshot.facilityCount}{' '}
            {planSnapshot.facilityCount === 1
              ? 'proposed facility'
              : 'proposed facilities'}
          </strong>
          <span>${planSnapshot.totalCost.toLocaleString()} allocated</span>
          <span>
            ${planSnapshot.remainingBudget.toLocaleString()} unallocated
          </span>
        </aside>
      )}

      <section aria-labelledby="net-impact-heading">
        <div className="simulation-section-heading">
          <div>
            <p className="simulation-section-heading__kicker">Plan outcome</p>
            <h3 id="net-impact-heading">Net Impact by 2050</h3>
          </div>
          <p>Changes shown against the 2050 projection without your plan.</p>
        </div>

        <div className="impact-card-grid">
          {featuredMetricKeys.map((key) => {
            const metric = metricEntries.find((entry) => entry.key === key);
            const change = netImpact[key];

            return (
              <article className="impact-card" key={key}>
                <p>{metric.label}</p>
                <strong className={getChangeClassName(key, change)}>
                  {formatSignedMetric(key, change)}
                </strong>
                <span>
                  {formatMetricValue(key, projection2050[key])}
                  {' → '}
                  {formatMetricValue(key, userPlan2050[key])}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="comparison-heading">
        <div className="simulation-section-heading">
          <div>
            <p className="simulation-section-heading__kicker">Scenario comparison</p>
            <h3 id="comparison-heading">Baseline and Plan Comparison</h3>
          </div>
        </div>

        <div className="simulation-table-scroll">
          <table className="simulation-table">
            <thead>
              <tr>
                <th scope="col">Indicator</th>
                <th scope="col">2026 Baseline</th>
                <th scope="col">2050 Without Plan</th>
                <th scope="col">2050 With Your Plan</th>
                <th scope="col">Net Impact</th>
              </tr>
            </thead>
            <tbody>
              {metricEntries.map(({ key, label }) => {
                const difference = netImpact[key];

                return (
                  <tr key={key}>
                    <th scope="row">{label}</th>
                    <td>{formatMetricValue(key, baseline2026[key])}</td>
                    <td>{formatMetricValue(key, projection2050[key])}</td>
                    <td>{formatMetricValue(key, userPlan2050[key])}</td>
                    <td className={getChangeClassName(key, difference)}>
                      {formatSignedMetric(key, difference)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="trend-heading">
        <div className="simulation-section-heading">
          <div>
            <p className="simulation-section-heading__kicker">Population outlook</p>
            <h3 id="trend-heading">Projected Growth</h3>
          </div>
          <p>Facility effects are introduced gradually from 2026 to 2050.</p>
        </div>

        <div className="simulation-chart" role="img" aria-label="Population projection chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={populationTrend} margin={{ top: 8, right: 20, left: 12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe3ee" />
              <XAxis dataKey="year" tick={{ fill: '#526173', fontSize: 12 }} />
              <YAxis
                width={76}
                tick={{ fill: '#526173', fontSize: 12 }}
                tickFormatter={(value) => `${Math.round(value / 1000)}k`}
              />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Line
                type="monotone"
                dataKey="projection"
                name="Without Plan"
                stroke="#7a8798"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="withPlan"
                name="With Your Plan"
                stroke="#3157c8"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section aria-labelledby="policy-heading">
        <div className="simulation-section-heading">
          <div>
            <p className="simulation-section-heading__kicker">Interpretation</p>
            <h3 id="policy-heading">Policy Summary</h3>
          </div>
        </div>
        <SimulationSummary simulationData={simulationData} />
      </section>

      <section aria-labelledby="facility-impact-heading">
        <div className="simulation-section-heading">
          <div>
            <p className="simulation-section-heading__kicker">Plan inputs</p>
            <h3 id="facility-impact-heading">Facility Impact Details</h3>
          </div>
        </div>

        <SimulationSummary2 facilitiesInstalled={facilitiesInstalled} />

        <div className="simulation-table-scroll">
          <table className="simulation-table simulation-table--compact">
            <thead>
              <tr>
                <th scope="col">Facility</th>
                <th scope="col">Population</th>
                <th scope="col">Traffic</th>
                <th scope="col">Crime</th>
                <th scope="col">Housing Satisfaction</th>
                <th scope="col">Unemployment</th>
                <th scope="col">Housing Supply</th>
                <th scope="col">Air Quality</th>
                <th scope="col">Inflation</th>
              </tr>
            </thead>
            <tbody>
              {installedDefinitions.map(({ name, label, impacts }) => (
                <tr key={name}>
                  <th scope="row">{label}</th>
                  <td>{formatImpactPercent(impacts.populationPercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.trafficPercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.crimePercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.housingSatisfactionPercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.unemploymentPercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.housingSupplyPercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.airQualityPercent * 100)}</td>
                  <td>{formatImpactPercent(impacts.inflationPercent * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="simulation-modal__footer">
        <p>
          Illustrative planning model. See the simulation methodology for
          assumptions and limitations.
        </p>
        <button
          type="button"
          className="simulation-modal__close-button"
          onClick={onRequestClose}
        >
          Close Results
        </button>
      </footer>
    </AppModal>
  );
};

export default SimulationModal;
