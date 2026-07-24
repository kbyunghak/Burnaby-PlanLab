# Burnaby PlanLab

[![CI](https://github.com/kbyunghak/Burnaby-PlanLab/actions/workflows/ci.yml/badge.svg)](https://github.com/kbyunghak/Burnaby-PlanLab/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-3157c8)](https://kbyunghak.github.io/Burnaby-PlanLab/)

**2026–2050 City Development Simulator**

Burnaby PlanLab is an interactive React application for exploring how a
facility investment plan could affect a reference scenario for Burnaby,
British Columbia. Users place proposed facilities inside the Burnaby planning
boundary, manage a CAD budget, inspect existing infrastructure, and compare
their plan with a no-plan 2050 scenario.

> Burnaby PlanLab is an educational planning tool, not an official City of
> Burnaby forecasting or policy system. Official reference values, model
> estimates, and illustrative assumptions are identified separately in the
> project documentation.

## Live Application

[Open Burnaby PlanLab](https://kbyunghak.github.io/Burnaby-PlanLab/)

[![Burnaby PlanLab interface showing the Burnaby planning boundary, facility markers, map controls, and investment panel](doc/assets/burnaby-plan-lab-overview.png)](https://kbyunghak.github.io/Burnaby-PlanLab/)

*Burnaby-focused planning map with existing facilities, proposed-plan controls,
and CAD budget tracking.*

The former `/city-sim/` URL is retained as a redirect to the current
application.

## Key Features

- Burnaby-focused interactive map with a highlighted municipal boundary.
- Existing and proposed facilities displayed as separate visual layers.
- Focus, multi-select Filter, and All map display modes.
- Zoom-responsive facility markers and a precise map-detail slider.
- Resizable desktop workspace with keyboard-accessible controls.
- Eight facility types with centralized cost and impact definitions.
- CAD budget tracking, undo, selected-item removal, and plan reset actions.
- Simulation support for empty, partially funded, and fully allocated plans.
- 2026 model start, 2050 no-plan reference, user-plan result, and net-impact
  comparisons.
- Versioned Burnaby 2050 reference scenario with documented provenance.
- Responsive controls for desktop, tablet, and mobile layouts.

## Technology Stack

| Area | Technology |
| --- | --- |
| UI | React 19, React DOM 19 |
| Mapping | React Leaflet 5, Leaflet 1.9, OpenStreetMap tiles |
| Visualization | Recharts |
| Styling | CSS Grid, Flexbox, design tokens, responsive media queries |
| State and model | React hooks, reducer-based plan state, JavaScript ES6+ |
| Testing | Jest, React Testing Library, jest-dom |
| CI | GitHub Actions with Node.js 20 |
| Deployment | Create React App production build and GitHub Pages |

GitHub reports the repository language as JavaScript because React is a
JavaScript UI library rather than a separate programming language.

## Scenario Model

The results distinguish four concepts:

1. **2026 Model Start** — an interpolated simulator starting point.
2. **2050 Without Plan** — the reference scenario without user facilities.
3. **2050 With Your Plan** — the reference scenario plus modeled plan effects.
4. **Net Impact** — the difference attributed to the user plan.

The official reference series currently covers population, dwelling units,
and jobs. Other urban indicators are explicitly classified as illustrative
model assumptions until suitable observed or projected sources are integrated.
Facility impacts remain simplified educational coefficients and should not be
interpreted as causal forecasts.

See [Simulation Methodology](doc/SimulationMethodology.md) and
[Simulation Data Sources](doc/DataSources.md) for formulas, classifications,
sources, and limitations.

## Getting Started

### Requirements

- Node.js 20
- npm

### Installation

```bash
git clone https://github.com/kbyunghak/Burnaby-PlanLab.git
cd Burnaby-PlanLab
npm ci
```

### Local Development

```bash
npm start
```

Open `http://localhost:3000`.

### Tests

```bash
npm test -- --watchAll=false
```

The current suite covers simulation calculations, reference data, facility
definitions, plan state, map visibility, modal accessibility, map behavior,
budget usage, and primary user workflows.

### Production Build

```bash
npm run build
```

The production build uses the `/Burnaby-PlanLab/` base path.

### GitHub Pages Deployment

```bash
npm run deploy
```

This publishes the generated `build/` directory to the `gh-pages` branch.
Application source remains on `master`; `gh-pages` contains deployment output
only.

## How to Use

1. Choose a facility type from the planning panel.
2. Place one or more facilities inside the highlighted Burnaby boundary.
3. Use Focus, Filter, or All mode to review surrounding facilities.
4. Toggle Existing and My Plan layers independently.
5. Review the allocated and remaining CAD budget.
6. Run the simulation at any time. Spending the entire budget is optional.
7. Compare the no-plan reference with the result and net impact of the plan.

Running the simulation without placing a facility displays the no-plan
reference scenario and produces a net plan impact of zero.

## Project Structure

```text
src/
├── components/       UI, map, legend, usage, and result components
├── constants/        Facility definitions, map data, metrics, and references
├── map/              Facility visibility rules
├── planning/         Plan reducer and immutable simulation snapshots
├── simulation/       Simulation calculation logic
├── styles/           Shared design tokens
└── utils/            Summary helpers

doc/
├── DataSources.md
├── Plan.md
└── SimulationMethodology.md
```

## Documentation

- [Development Plan](doc/Plan.md) — delivery roadmap, maintenance standards,
  testing, CI/CD, and planned enhancements.
- [Simulation Data Sources](doc/DataSources.md) — official references, model
  estimates, assumptions, provenance, and update rules.
- [Simulation Methodology](doc/SimulationMethodology.md) — scenario contracts,
  calculations, terminology, and known limitations.

## CI and Maintenance

GitHub Actions runs the following checks on every push and pull request:

```bash
npm ci
npm test -- --watchAll=false
npm run build
```

The application currently uses Create React App and `react-scripts`. These
tools remain functional but are no longer the preferred foundation for new
React applications. Migration to Vite is tracked in the development plan.

## Known Limitations

- Several non-demographic indicators use illustrative assumptions.
- Facility impacts are simplified and currently accumulate linearly.
- Spatial accessibility, service capacity, land use, operating costs, and
  facility interactions are not yet modeled.
- Existing-facility coordinates are maintained as a project dataset and
  require a formal provenance audit.
- Create React App introduces legacy dependency and audit warnings.

## Data and Map Attribution

- Reference scenario: City of Burnaby, *Burnaby 2050 Official Community Plan*.
- Base map: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).
- Mapping libraries: Leaflet and React Leaflet.

## Contact

[kbyunghak@gmail.com](mailto:kbyunghak@gmail.com)
