# City Simulation Delivery Plan

## 1. Purpose

This document is the authoritative delivery checklist for the Burnaby city-planning simulation. Work must proceed in order, one reviewable commit at a time. Every step must leave tests and the production build passing.

If a step reveals an unexpected data issue, architectural conflict, broken dependency, or requirement that changes the agreed scope, implementation must stop and the issue must be reviewed before continuing.

## 2. Current Baseline

The current version provides:

- A responsive React and Leaflet interface.
- Facility selection and map placement within the Burnaby boundary.
- Budget tracking and a facility usage summary.
- A 2026 baseline, 2050 no-plan projection, user-plan projection, and net-impact results view.
- Central facility and metric definitions.
- Unit and component tests.
- GitHub Actions checks for tests and the production build.

Known product limitations:

- Facility location does not affect simulation outcomes.
- A placed facility cannot be removed or undone.
- The full plan cannot be reset.
- The map reset control is not reliably connected to the Leaflet instance.
- Facility-specific marker icons are lost after simulation.
- Building Usage is a read-only list rather than a plan-management tool.
- User guidance and model explanations are limited.
- Baseline and projection values still require authoritative source validation.
- Continuous deployment and real-browser workflow tests are not configured.

## 3. Delivery Rules

Each checklist item must:

- Be implemented as a focused change.
- Include tests for changed behavior.
- Pass `npm test -- --watchAll=false`.
- Pass `npm run build` with CI warnings treated as errors.
- Pass `git diff --check`.
- Be manually verified when it changes map behavior or responsive layout.
- Be committed independently with the listed commit message.
- Update this checklist in the same commit or an immediately following documentation commit.

## 4. Release 0.2 — Usable Planning Experience

Goal: A user can understand, create, edit, and simulate a plan without being trapped by an accidental action.

### Step 1 — Stabilize Map Controls and Markers

- [x] Replace the obsolete map-instance callback with a React Leaflet v5-compatible controller.
- [x] Make Reset View reliably restore the initial center and zoom.
- [x] Preserve facility-specific icons before and after simulation.
- [x] Visually distinguish existing facilities from user-plan facilities.
- [x] Invalidate an existing result when the plan changes.
- [x] Add or update focused tests.
- [x] Manually verify reset, filtering, placement, and post-simulation markers.

Acceptance criteria:

- Reset View works after map initialization.
- Existing and proposed facilities remain distinguishable.
- Every visible marker retains its facility identity.
- A result is never presented as current after its input plan changes.

Commit:

```text
fix: stabilize map controls and facility markers
```

### Step 2 — Add Plan Editing

- [x] Introduce a plan reducer or equivalent isolated state model.
- [x] Add Undo Last Placement.
- [x] Allow a selected user-plan marker to be removed.
- [x] Add Reset Plan.
- [x] Restore budget and usage counts after removal.
- [x] Prevent existing facilities from being removed.
- [x] Add reducer and integration tests for add, undo, remove, and reset.

Acceptance criteria:

- Every user placement is reversible.
- Budget and usage totals remain consistent.
- Existing facility data remains immutable.

Commit:

```text
feat: add editable planning controls
```

### Step 3 — Redesign Building Usage

- [x] Add a used-budget progress indicator.
- [x] Show user-facing labels instead of internal facility IDs.
- [x] List used facilities before unused facility types.
- [x] Collapse or hide zero-count facilities by default.
- [x] Show icon, count, unit cost, and total cost separately.
- [x] Add Locate, Remove One, and Remove All actions.
- [x] Provide a mobile card layout without horizontal overflow.
- [x] Add component and responsive behavior tests.

Acceptance criteria:

- Building Usage functions as a plan-management panel.
- Internal domain keys are not exposed to users.
- The panel remains readable at desktop and mobile widths.

Commit:

```text
feat: redesign building usage as a plan summary
```

### Step 4 — Add Guidance and Contextual Feedback

- [x] Add a three-step first-use guide.
- [x] Explain the Burnaby placement boundary.
- [x] Explain existing and proposed marker styles.
- [x] Replace native alerts with contextual messages or toasts.
- [x] Explain why an action or Simulate button is unavailable.
- [x] Improve the facility legend with costs, measured impacts, and units.
- [x] Verify keyboard focus and screen-reader labels.

Acceptance criteria:

- The primary workflow can be understood without opening the README.
- Every rejected action provides visible, contextual feedback.
- Important status is not communicated by color alone.

Commit:

```text
feat: add planning guidance and contextual feedback
```

### Step 5 — Simplify Simulation Execution

- [x] Allow simulation when at least one valid user facility exists.
- [x] Treat remaining budget as unused budget.
- [x] Remove the artificial fixed loading delay.
- [x] Capture an immutable plan snapshot for each result.
- [x] Mark or close stale results after plan changes.
- [x] Handle empty and invalid plans explicitly.
- [x] Add full workflow integration tests.

Acceptance criteria:

- Users are not required to spend the budget exactly.
- Results identify the plan from which they were calculated.
- Execution state reflects real work rather than a cosmetic timer.

Commit:

```text
refactor: simplify simulation execution flow
```

## 5. Release 0.3 — Credible Simulation Model

Goal: Facility type and placement location both contribute to an explainable result.

### Step 6 — Validate Data Sources and Assumptions

- [ ] Create `doc/DataSources.md`.
- [ ] Verify the 2026 baseline against authoritative sources.
- [ ] Verify or define the 2050 no-plan projection methodology.
- [ ] Record source organization, URL, publication date, geographic scope, unit, and retrieval date.
- [ ] Label assumed, derived, and official values separately.
- [ ] Define a repeatable data-update procedure.
- [ ] Update the methodology and UI with data-status language.

Stop condition:

- Do not replace current values when authoritative sources conflict, use incompatible geographic scopes, or require a policy decision. Document the conflict and request review.

Commit:

```text
docs: define simulation data sources and assumptions
```

### Step 7 — Add a Spatial Demand Model

- [ ] Choose and document a neighbourhood or grid analysis unit.
- [ ] Add population or demand values for each analysis area.
- [ ] Define a service radius or travel assumption for each facility.
- [ ] Calculate existing-facility coverage.
- [ ] Calculate proposed-facility coverage.
- [ ] Detect overlapping coverage.
- [ ] Display service areas and underserved areas on the map.
- [ ] Add deterministic spatial calculation tests.

Acceptance criteria:

- Moving the same facility to a meaningfully different location can change its result.
- Spatial inputs and assumptions are visible and testable.

Commit:

```text
feat: add spatial demand and service coverage model
```

### Step 8 — Implement Simulation Model v2

- [ ] Add diminishing returns for overlapping or repeated facilities.
- [ ] Separate construction cost from recurring operating cost.
- [ ] Add construction timing where supported.
- [ ] Define supported facility interactions.
- [ ] Produce low, base, and high scenarios where uncertainty exists.
- [ ] Generate a contribution breakdown by facility and location.
- [ ] Keep display text and calculation coefficients in the same definitions.
- [ ] Add boundary, regression, immutability, and representative-scenario tests.

Acceptance criteria:

- Every result can be traced to documented inputs and assumptions.
- Repeated facilities do not create uncontrolled linear growth.
- Identical inputs produce identical outputs.

Commit:

```text
feat: implement explainable simulation model v2
```

### Step 9 — Expand Results and Scenario Comparison

- [ ] Allow the user to select a metric for trend visualization.
- [ ] Add before-and-after spatial comparison.
- [ ] Show neighbourhood-level coverage changes.
- [ ] Show count and total contribution for each facility type.
- [ ] Separate favorable, unfavorable, and uncertain effects.
- [ ] Link result details back to relevant map locations.
- [ ] Add local scenario save, load, and comparison.
- [ ] Explain assumptions and limitations inside the result view.

Acceptance criteria:

- The result explains what was placed, where it was placed, why it matters, and how it changes the scenario.

Commit:

```text
feat: add spatial and comparative simulation results
```

## 6. Release 0.4 — Maintainability and Delivery

Goal: Make the project safe to extend, verify, deploy, and present.

### Step 10 — Separate Application Responsibilities

- [ ] Reduce `App.js` to top-level composition.
- [ ] Extract planning state and actions.
- [ ] Split map controls, plan controls, budget summary, usage summary, and result sections.
- [ ] Replace temporary names such as `SimulationSummary2`.
- [ ] Keep calculations independent from React presentation code.
- [ ] Consolidate repeated styles into shared components or CSS modules.

Commit:

```text
refactor: separate planning simulation and presentation layers
```

### Step 11 — Add Browser Workflow Coverage

- [ ] Add Playwright.
- [ ] Test selection, valid placement, invalid placement, removal, reset, simulation, and result display.
- [ ] Test a mobile viewport.
- [ ] Prevent remote map tiles from making tests flaky.
- [ ] Add an automated accessibility smoke check.

Commit:

```text
test: add planning workflow and browser coverage
```

### Step 12 — Strengthen CI

- [ ] Run unit and component tests.
- [ ] Run browser smoke tests.
- [ ] Build the production bundle.
- [ ] Add realistic coverage thresholds.
- [ ] Upload useful test reports and build artifacts.
- [ ] Configure minimal workflow permissions.

Commit:

```text
ci: add browser tests and quality gates
```

### Step 13 — Add Verified Continuous Deployment

- [ ] Confirm the final repository name and production URL.
- [ ] Deploy only from the protected default branch.
- [ ] Deploy the exact artifact produced by the verified build job.
- [ ] Prevent overlapping production deployments.
- [ ] Add manual deployment support.
- [ ] Run a production smoke check.

Stop condition:

- Do not change the repository name, GitHub Pages URL, or external GitHub settings without explicit confirmation of the final name and URL.

Commit:

```text
ci: deploy verified builds to GitHub Pages
```

### Step 14 — Complete Portfolio Documentation

- [ ] Replace the placeholder clone URL.
- [ ] Repair damaged README separators and text.
- [ ] Update the project name after naming is confirmed.
- [ ] Document purpose, features, architecture, setup, test, and build commands.
- [ ] Link this plan, methodology, and data-source documentation.
- [ ] Add current screenshots or a short demonstration.
- [ ] Document limitations and future development.
- [ ] Add CI and deployment badges.

Commit:

```text
docs: complete portfolio documentation
```

### Step 15 — Release Review

- [ ] Verify a clean install with `npm ci`.
- [ ] Run all automated tests.
- [ ] Build the production bundle.
- [ ] Verify the deployed application.
- [ ] Check browser console output.
- [ ] Verify links, icons, images, and map assets.
- [ ] Review desktop, tablet, and mobile layouts.
- [ ] Review keyboard navigation and focus visibility.
- [ ] Scan source files for damaged Unicode.
- [ ] Confirm that displayed impacts match calculation definitions.

Commit:

```text
chore: complete portfolio release quality checks
```

Target release tag:

```text
v1.0.0
```

## 7. Nice to Have

These items must not delay simulation correctness, accessibility, or deployment stability.

- [ ] Import and export scenarios as JSON.
- [ ] Shareable scenario URLs.
- [ ] Multiple budget and policy presets.
- [ ] Construction phases between 2026 and 2050.
- [ ] Additional map layers for transit, zoning, and climate risk.
- [ ] Dark mode.
- [ ] Localization.
- [ ] Migrate from Create React App to Vite after the stable release.

## 8. Definition of Done

A step is complete only when:

- Every acceptance criterion is met.
- Relevant automated tests pass.
- The production build succeeds.
- Manual verification is complete where required.
- Documentation reflects changed behavior.
- The checklist is updated.
- The change is committed independently.

The portfolio release is complete when the application is usable without hidden instructions, the simulation is explainable, CI and CD are green, data provenance is documented, and a new contributor can run and understand the repository without additional guidance.
