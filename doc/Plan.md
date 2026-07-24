# Burnaby PlanLab Delivery Plan

## 1. Purpose

This document is the authoritative delivery plan for Burnaby PlanLab, a 2026–2050 city development simulator for Burnaby, British Columbia.

The project must progress through focused, reviewable commits. Every implementation step must leave automated tests and the production build passing.

If work reveals conflicting official data, an incompatible geographic scope, a security-sensitive migration, an external repository change, or a requirement that materially changes the agreed product direction, implementation must stop for review before continuing.

## 2. Confirmed Product Identity

The agreed product identity is:

| Item | Confirmed value |
|---|---|
| Product name | Burnaby PlanLab |
| Subtitle | 2026–2050 City Development Simulator |
| Repository name | `Burnaby-PlanLab` |
| Deployment path | `/Burnaby-PlanLab/` |
| Browser title | Burnaby PlanLab \| 2026–2050 City Simulator |

Local branding can be implemented in the repository. Renaming the remote GitHub repository and changing the production URL are external operations and must be handled as a separate deployment step.

## 3. Current Project Status

### Quality baseline

- Branch: `agent/results-redesign`
- Automated tests: 78 passing tests across 14 suites.
- Production build: passing.
- Browser validation: completed for the primary desktop workflow, map display modes, responsive layout, empty-plan simulation, and map zoom behavior.
- Working tree at the start of this plan revision: clean.

### Product readiness assessment

| Area | Status | Notes |
|---|---|---|
| Planning workflow | Strong | Selection, placement, editing, budget tracking, and simulation are functional. |
| Map usability | Strong | Burnaby highlighting, display modes, filters, layers, reset, and detailed zoom are implemented. |
| Result clarity | Improved | Baseline, reference, user-plan, and Net Impact are separated. |
| Data provenance | Partial | Population is source-backed; other long-range indicators remain illustrative. |
| Algorithm realism | Needs redesign | Facility coefficients are still linear, large, and not calibrated. |
| Maintainability | Moderate | Definitions and calculations are centralized, but application responsibilities need further separation. |
| CI | Basic | Unit tests and build checks exist; browser workflows and stronger quality gates are pending. |
| CD | Pending | Verified deployment has not been finalized. |
| Portfolio readiness | Approximately 80% | The interface is presentable, but model realism, branding, tooling, and deployment still need work. |

## 4. Completed Work

### 4.1 Foundation, tests, and result structure

- [x] Replace the default CRA test with application tests.
- [x] Configure Jest to work with the React Leaflet dependency chain.
- [x] Remove the initial unused-variable warnings.
- [x] Make unit tests and the production build pass.
- [x] Centralize facility definitions and metric definitions.
- [x] Separate the 2026 model start, 2050 reference, user-plan result, and Net Impact.
- [x] Add yearly projection data and result comparison views.

### 4.2 Plan creation and editing

- [x] Add a reducer-based plan state model.
- [x] Allow placement only inside the Burnaby boundary.
- [x] Allow simulation with a partially used budget.
- [x] Allow an empty plan to run as a no-plan scenario.
- [x] Add Undo Last, Remove Selected, Remove One, Remove All, and Reset Plan.
- [x] Keep budget and facility usage synchronized after edits.
- [x] Invalidate stale simulation results when the plan changes.
- [x] Preserve an immutable plan snapshot for each result.

### 4.3 Map and facility visibility

- [x] Keep map center and zoom stable when selecting or placing a facility.
- [x] Restore the Burnaby view through Reset View.
- [x] Highlight the Burnaby planning area and dim surrounding municipalities.
- [x] Add `Focus`, `Filter`, and `All` display modes.
- [x] Keep the selected display mode when the facility selection changes.
- [x] Add independent Existing and My Plan layers.
- [x] Add multi-select facility filters with Select All and Clear actions.
- [x] Display the number of visible facilities.
- [x] Use reduced opacity and grayscale for existing facilities.
- [x] Highlight the active facility type and selected proposed marker.
- [x] Add a quarter-step map detail slider.
- [x] Change marker size by zoom level.
- [x] Fix marker displacement by changing Leaflet icon size and anchors instead of scaling CSS transforms.

### 4.4 UI and accessibility

- [x] Add first-use planning guidance and contextual feedback.
- [x] Improve facility selector icon, label, price, and spacing hierarchy.
- [x] Redesign Building Usage as a plan-management summary.
- [x] Improve map filter readability and long-label wrapping.
- [x] Add keyboard focus styles and accessible labels.
- [x] Replace `react-modal` with an accessible portal modal.
- [x] Remove the duplicate modal registration warning under React Strict Mode.
- [x] Refresh the browser favicon.

### 4.5 Reference scenario and data transparency

- [x] Add a versioned Burnaby 2050 OCP high-growth reference scenario.
- [x] Store official population, dwelling-unit, and job reference points for 2021, 2030, 2040, and 2050.
- [x] Derive the 2026 model-start population through documented interpolation.
- [x] Update the 2050 population reference from 360,000 to 408,150.
- [x] Label the 2026 population as a model estimate.
- [x] Label the 2050 population as OCP-based.
- [x] Label unsourced long-range indicators as illustrative assumptions.
- [x] Add a source link to the no-plan result.
- [x] Show 2026 Model Start, 2050 Official Reference, Projected Growth, facility count, and Plan Impact for an empty plan.
- [x] Define Official Reference, Model Estimate, Observed Baseline, Illustrative Assumption, and User Plan Impact.
- [x] Require structured calculation data instead of image-derived values.
- [x] Create `doc/DataSources.md`.
- [x] Update the simulation methodology and tests.

### 4.6 Relevant completed commits

| Commit | Outcome |
|---|---|
| `148058d` | Stabilized map controls and markers. |
| `7f190e7` | Added editable planning controls. |
| `590fde5` | Redesigned Building Usage. |
| `716c6b7` | Added planning guidance and contextual feedback. |
| `dcc8737` | Allowed partial-budget and empty-plan simulation. |
| `dc061ad` | Added Focus, Filter, All, and layer controls. |
| `c50fa19` | Highlighted the Burnaby planning area. |
| `b81867b` | Clarified active map facility context. |
| `f3c1a1a` | Added detailed map zoom control. |
| `61ae1e0` | Improved planning-control readability. |
| `1c8d03f` | Fixed marker positions across zoom levels. |
| `dccb4c5` | Replaced `react-modal` with an accessible portal. |
| `4a14679` | Added the sourced Burnaby reference scenario. |

## 5. Known Limitations and Risks

### Simulation model

- Facility effects are still applied as additive proportional changes.
- A single facility can create an unrealistically large city-wide effect.
- Repeated facilities can create uncontrolled linear growth until metric limits are reached.
- Percentage changes and percentage-point changes are not modeled separately.
- Facility location does not yet affect the calculation.
- Facility capacity, service radius, construction time, and operating cost are not modeled.
- Uncertainty ranges are not provided.

### Data

- Only the population outlook currently uses a source-backed long-range reference series.
- Traffic, crime, satisfaction, unemployment, housing supply, AQI, and inflation projections remain illustrative.
- Facility costs and the total budget are not yet realistic CAD capital and operating budgets.
- Some existing facility records need geographic and naming verification.
- A full UTF-8 corruption scan and repair is still required.

### Tooling and delivery

- Create React App and `react-scripts` are obsolete and retain audit findings in the build dependency chain.
- The browser compatibility database is outdated and produces a build warning.
- Automated Playwright workflow tests are not committed.
- CI does not yet run browser tests or upload useful artifacts.
- Verified continuous deployment is not configured.
- The remote repository and GitHub Pages path still use the old project identity.

## 6. Delivery Rules

Every implementation step must:

1. Remain focused enough to review independently.
2. Include tests for changed behavior.
3. Pass `npm test -- --watchAll=false`.
4. Pass `npm run build`.
5. Pass `git diff --check`.
6. Receive real-browser verification when it changes UI, map, modal, or responsive behavior.
7. Update documentation when it changes data, calculations, setup, or deployment.
8. End in a dedicated commit with no unrelated changes.

Do not use `npm audit fix --force` as a substitute for an intentional tooling migration.

## 7. Next Delivery Sequence

## Release 0.3 — Identity and Tooling Stability

### Step 1 — Apply Burnaby PlanLab Branding

- [ ] Change visible product headings to Burnaby PlanLab.
- [ ] Add the confirmed subtitle.
- [ ] Update the browser title and metadata.
- [ ] Update the package name where safe.
- [x] Replace old `city-sim` and generic City Simulation references in documentation.
- [x] Update local deployment configuration to `/Burnaby-PlanLab/`.
- [ ] Replace the placeholder clone URL after the remote repository is renamed.
- [ ] Verify favicon, manifest, links, and production asset paths.

Stop condition:

- Do not rename the remote repository or change GitHub Pages settings without confirming the exact remote operation and redirect implications.

Planned commits:

```text
refactor: apply Burnaby PlanLab branding
docs: update repository identity and links
```

### Step 2 — Migrate from CRA to Vite

- [ ] Add Vite and the React plugin.
- [ ] Replace `react-scripts` commands.
- [ ] Move environment and public-path handling to Vite conventions.
- [x] Preserve the `/Burnaby-PlanLab/` base path.
- [ ] Migrate Jest tests to Vitest or retain a documented compatible runner.
- [ ] Remove unused CRA-only dependencies.
- [ ] Re-run the dependency audit without forced upgrades.
- [ ] Verify map assets, icons, modals, tests, and the production build.

Acceptance criteria:

- Development, test, and build commands work from a clean install.
- The production bundle loads from the confirmed base path.
- CRA-specific audit findings are removed from the dependency tree.

Stop condition:

- Stop if a test migration changes application behavior or if the deployment base path cannot be verified.

Planned commit:

```text
build: migrate Burnaby PlanLab from CRA to Vite
```

### Step 3 — Repair Encoding and Repository Hygiene

- [ ] Scan all source and documentation files for damaged Unicode.
- [ ] Repair corrupted facility names, separators, symbols, and formula operators.
- [ ] Confirm UTF-8 encoding and line-ending policy.
- [ ] Update the browser compatibility database after the Vite migration.
- [ ] Remove unused packages, including marker clustering if it remains unused.
- [ ] Verify a clean `npm ci`.

Planned commit:

```text
chore: repair encoding and dependency hygiene
```

## Release 0.4 — Credible Simulation Model

### Step 4 — Define the Simulation Metric Contract

- [ ] Decide which indicators remain in the core result.
- [ ] Define every metric's unit, geographic scope, data class, source status, and favorable direction.
- [ ] Separate observed values, official references, model estimates, and illustrative assumptions.
- [ ] Define percentage versus percentage-point calculations explicitly.
- [ ] Remove or rename ambiguous metrics such as Housing Supply Rate.
- [ ] Add dwelling units and jobs where they improve the official reference comparison.
- [ ] Add schema and provenance tests.

Stop condition:

- Do not present a value as an official Burnaby forecast unless a compatible source and definition are recorded.

Planned commit:

```text
refactor: define simulation metrics and provenance
```

### Step 5 — Introduce Realistic CAD Budgeting

- [ ] Define whether the plan represents capital cost, annual operating cost, or both.
- [ ] Replace game-scale values with documented CAD estimates or explicitly labeled budget units.
- [ ] Display CAD consistently through `Intl.NumberFormat`.
- [ ] Add facility capacity and cost metadata.
- [ ] Add budget presets if a single city-wide budget is misleading.
- [ ] Document the source or assumption behind every cost.
- [ ] Add cost and formatting tests.

Stop condition:

- Stop when facility cost scopes are incompatible, such as mixing construction cost with annual operating cost, until a common model is selected.

Planned commit:

```text
feat: add documented CAD planning budgets
```

### Step 6 — Implement Simulation Model v2

- [ ] Replace direct city-wide percentage multipliers with bounded contributions.
- [ ] Add diminishing returns for repeated facilities.
- [ ] Separate absolute changes, proportional changes, and percentage points.
- [ ] Prevent a single facility from producing implausible city-wide population growth.
- [ ] Add low, reference, and high impact ranges where uncertainty is material.
- [ ] Produce a per-facility contribution breakdown.
- [ ] Keep displayed descriptions and calculation coefficients in one definition.
- [ ] Version coefficient sets for reproducibility.
- [ ] Add empty, single, repeated, mixed, boundary, and regression tests.

Acceptance criteria:

- Repeated facilities cannot reduce crime or traffic to zero through uncontrolled linear stacking.
- Every result identifies its coefficient set and assumptions.
- Identical inputs always produce identical results.

Planned commit:

```text
feat: implement bounded simulation model v2
```

### Step 7 — Add a Spatial Demand and Coverage Model

- [ ] Select a neighbourhood or grid analysis unit.
- [ ] Add population or demand values to each analysis area.
- [ ] Define service radius or travel assumptions by facility type.
- [ ] Calculate existing-facility coverage.
- [ ] Calculate proposed-facility coverage.
- [ ] Detect service overlap and underserved areas.
- [ ] Make facility placement location affect the result.
- [ ] Display service areas and coverage changes on the map.
- [ ] Add deterministic geospatial tests.

Acceptance criteria:

- Moving the same facility to a materially different location can change its coverage result.
- Spatial inputs and assumptions are visible and testable.

Planned commit:

```text
feat: add spatial demand and service coverage
```

### Step 8 — Expand Scenario Results

- [ ] Add official population, dwelling-unit, and job trend views.
- [ ] Allow users to select result metrics.
- [ ] Add before-and-after map comparison.
- [ ] Show neighbourhood-level coverage changes.
- [ ] Separate favorable, unfavorable, uncertain, and no-change effects.
- [ ] Link result contributions to relevant facilities and locations.
- [ ] Add local scenario save, load, and comparison.
- [ ] Keep methodology and source links available inside results.

Planned commit:

```text
feat: add comparative and spatial scenario results
```

## Release 0.5 — Maintainability, CI, and Deployment

### Step 9 — Separate Application Responsibilities

- [ ] Reduce `App.js` to top-level composition.
- [ ] Extract planning actions into a dedicated hook or domain service.
- [ ] Separate map state from plan state.
- [ ] Split budget, selector, usage, and feedback sections.
- [ ] Replace temporary names such as `SimulationSummary2`.
- [ ] Keep calculations independent from React.
- [ ] Add shared presentation primitives only where repetition justifies them.

Planned commit:

```text
refactor: separate planning simulation and presentation
```

### Step 10 — Add Browser Workflow Coverage

- [ ] Add Playwright.
- [ ] Test selection, placement, invalid placement, removal, reset, filtering, zoom, empty-plan simulation, and populated-plan results.
- [ ] Test desktop and mobile viewports.
- [ ] Stub remote map tiles to prevent flaky tests.
- [ ] Add an accessibility smoke test.

Planned commit:

```text
test: add planning workflow browser coverage
```

### Step 11 — Strengthen CI

- [ ] Run unit and component tests.
- [ ] Run browser workflow tests.
- [ ] Build the production bundle.
- [ ] Add realistic coverage thresholds.
- [ ] Upload test reports and build artifacts.
- [ ] Configure minimal workflow permissions.
- [ ] Prevent deployment when any quality gate fails.

Planned commit:

```text
ci: add browser tests and quality gates
```

### Step 12 — Add Verified Continuous Deployment

- [x] Confirm the remote repository is named `Burnaby-PlanLab`.
- [ ] Confirm the production URL and GitHub Pages base path.
- [ ] Deploy only from the protected default branch.
- [ ] Deploy the exact artifact produced by the verified build job.
- [ ] Prevent overlapping production deployments.
- [ ] Add manual deployment support.
- [ ] Run a production smoke test after deployment.

Stop condition:

- Do not rename the repository, change Pages settings, or publish a new production URL without explicit confirmation immediately before the external change.

Planned commit:

```text
ci: deploy verified builds to GitHub Pages
```

## Release 1.0 — Portfolio Release

### Step 13 — Complete Portfolio Documentation

- [ ] Rewrite the README around Burnaby PlanLab.
- [ ] Document architecture, setup, testing, build, and deployment.
- [ ] Explain the official reference scenario and illustrative model layer.
- [ ] Add current screenshots or a short demonstration.
- [ ] Document limitations and future development.
- [ ] Add CI and deployment badges.
- [ ] Verify every local and external link.

Planned commit:

```text
docs: complete Burnaby PlanLab portfolio documentation
```

### Step 14 — Release Review

- [ ] Verify a clean install.
- [ ] Run every automated test.
- [ ] Build the production artifact.
- [ ] Verify the deployed application.
- [ ] Check browser console output.
- [ ] Verify links, icons, images, map assets, and source citations.
- [ ] Review desktop, tablet, and mobile layouts.
- [ ] Review keyboard navigation, modal behavior, and focus visibility.
- [ ] Confirm displayed impacts match calculation definitions.
- [ ] Confirm the repository is clean and release documentation is current.

Planned commit:

```text
chore: complete Burnaby PlanLab release review
```

Target release tag:

```text
v1.0.0
```

## 8. Nice to Have

These items must not delay simulation correctness, accessibility, or a verified deployment.

- [ ] Import and export scenarios as JSON.
- [ ] Shareable scenario URLs.
- [ ] Multiple budget and policy presets.
- [ ] Construction phases between 2026 and 2050.
- [ ] Transit, zoning, climate-risk, and accessibility map layers.
- [ ] Marker clustering at low zoom if facility volume materially increases.
- [ ] Dark mode.
- [ ] Localization.
- [ ] Printable or downloadable scenario reports.

## 9. Definition of Done

A step is complete only when:

- Its acceptance criteria are satisfied.
- Relevant tests pass.
- The production build succeeds.
- Browser verification is complete where required.
- Data and methodology documentation are current.
- The checklist reflects the result.
- The work is committed independently.

Burnaby PlanLab is ready for a portfolio release when:

- The project uses the confirmed identity and production URL.
- The no-plan scenario has transparent provenance.
- User-plan impacts are bounded and explainable.
- Placement location has a documented spatial effect.
- CI and deployment are verified.
- A new contributor can install, test, build, and understand the project without hidden instructions.
