# City Sim Project Plan

## 1. Purpose

City Sim is an interactive urban-planning simulation for Burnaby, British Columbia. It allows users to allocate a fixed budget, place new public facilities on a map, and compare the projected effects of their plan against a no-plan 2050 scenario.

This plan defines how the project will be developed into a reliable and maintainable portfolio application. It prioritizes correctness, transparent simulation rules, readable code, automated quality checks, and a dependable deployment process.

## 2. Product Goals

The project should:

- Clearly separate Burnaby's existing facilities from facilities proposed by the user.
- Explain the difference between the 2025 baseline, the 2050 projection without a plan, and the 2050 projection with the user's plan.
- Display the net impact caused by the user's choices.
- Use one source of truth for facility costs, labels, icons, descriptions, and impact coefficients.
- Provide a responsive and accessible planning experience.
- Protect important behavior with automated tests.
- Deploy only verified builds through CI/CD.
- Remain easy to review, extend, and explain as a portfolio project.

## 3. Scope and Priorities

### Must Have

- Passing unit and component tests.
- A passing production build in CI.
- Consistent UTF-8 source files and user-facing text.
- Separate existing facilities and user-plan facilities.
- A documented and testable simulation model.
- A single source of truth for facility and metric definitions.
- A results view that shows baseline, no-plan projection, user-plan projection, and net impact.
- A verified GitHub Pages deployment.
- Updated project documentation.

### Should Have

- Reusable component and style structure.
- Plan editing, facility removal, and budget restoration.
- Responsive layouts for desktop, tablet, and mobile.
- Keyboard-friendly controls and visible focus states.
- Integration tests for the primary planning workflow.
- Test coverage reporting in CI.

### Nice to Have

- Playwright end-to-end smoke tests.
- Scenario save and load support using local storage.
- Multiple budget presets.
- Map layers or neighborhood-level analysis.
- Tooltips that explain formulas and assumptions.
- Charts comparing multiple user plans.
- Import and export of scenarios as JSON.
- Shareable scenario URLs.
- Dark mode.
- Localization support.
- A future migration from Create React App to Vite.

Nice-to-have items must not delay simulation correctness, accessibility, test reliability, or deployment stability.

## 4. Engineering Principles

### Maintainability

- Keep business logic independent from React components.
- Prefer pure functions for calculations and formatting.
- Store domain definitions in centralized configuration modules.
- Give components names based on their responsibility rather than their position.
- Keep commits focused on one purpose.
- Avoid mixing feature changes, styling changes, and build-system changes in one commit.
- Remove unused state and code unless it is connected to a documented feature.

### Readability

- Use consistent terminology throughout code and UI.
- Prefer `existingFacilities` and `userPlanFacilities` over a combined mutable marker collection.
- Prefer `projection2050` and `userPlan2050` over ambiguous names such as `simulationValue`.
- Use metric metadata to control labels, units, formatting, and positive-change direction.
- Add comments only where they explain a policy decision, formula, or non-obvious constraint.

### Styling

- Move large inline style objects into component-level CSS Modules.
- Define shared color, spacing, typography, and radius tokens.
- Use CSS states for hover, focus, and disabled behavior.
- Do not communicate positive or negative results through color alone.
- Keep result tables readable at narrow widths.
- Use semantic HTML before adding custom ARIA attributes.

### Data Integrity

- Store every facility's cost and impact coefficients in one definition.
- Distinguish percentage changes from percentage-point changes.
- Apply user-plan effects to the documented 2050 no-plan projection.
- Avoid rounding intermediate results.
- Validate metric ranges in shared calculation helpers.
- Document assumptions and limitations alongside the model.

## 5. Target Architecture

```text
src/
  components/
    BuildingSelector/
    BudgetSummary/
    CityMap/
    PlanControls/
    SimulationResults/
      FacilityImpactTable/
      ImpactSummary/
      MetricComparisonTable/
      TrendChart/
  constants/
    baselineData.js
    facilityDefinitions.js
    metricDefinitions.js
  simulation/
    calculateSimulation.js
    calculateSimulation.test.js
    facilityAggregation.js
    metricFormatting.js
  styles/
    tokens.css
  App.js
doc/
  Plan.md
  SimulationMethodology.md
```

The exact folder structure may change during implementation, but domain logic should remain separate from presentation components.

## 6. Delivery Plan

Each step should be implemented, tested, reviewed, and committed independently.

### Phase 1: Quality Baseline

#### Step 1: Stabilize Tests and CI

Work:

- Replace the default Create React App test with application-specific tests.
- Isolate the Leaflet rendering boundary during component tests.
- Remove unused variables and resolve lint warnings.
- Run tests and the production build in GitHub Actions.

Validation:

- `npm test -- --watchAll=false` passes.
- `CI=true npm run build` passes without lint warnings.
- The GitHub Actions workflow passes on pushes and pull requests.

Commit:

```text
test: stabilize app tests and add CI workflow
```

#### Step 2: Protect Existing Simulation Behavior

Work:

- Extract the current calculation code from `App.js`.
- Add unit tests before changing the formula.
- Test empty plans, single facilities, repeated facilities, range limits, and input immutability.

Validation:

- Simulation tests run without rendering React.
- Existing behavior is documented by tests.

Commit:

```text
test: add coverage for simulation calculations
```

### Phase 2: Domain Model Consolidation

#### Step 3: Centralize Facility Definitions

Work:

- Combine facility labels, costs, icons, descriptions, and impacts.
- Make the selector, legend, map, and simulation consume the same definitions.
- Add definition validation tests.

Validation:

- No duplicate impact table remains.
- Every facility has a valid ID, label, cost, icon, description, and impact object.

Commit:

```text
refactor: centralize facility definitions
```

#### Step 4: Centralize Metric Definitions

Work:

- Define labels, units, decimal precision, valid ranges, and favorable direction for each metric.
- Use the metadata in tables, summaries, and formatting helpers.

Validation:

- Metric labels and formatting are not repeated across result components.
- Positive and negative result styling respects the meaning of each metric.

Commit:

```text
refactor: centralize simulation metric metadata
```

### Phase 3: Simulation Model

#### Step 5: Separate Existing Facilities from the User Plan

Work:

- Store existing facilities and newly placed facilities separately.
- Combine them only for map display.
- Use only user-plan facilities for budget and impact calculations.

Validation:

- Existing facilities do not consume the user's budget.
- Existing facilities do not create user-plan impact.
- Both facility groups remain visible with clear visual differences.

Commit:

```text
refactor: separate existing facilities from user plan
```

#### Step 6: Implement Scenario Comparison

Return a result model similar to:

```js
{
  baseline2025,
  projection2050,
  userPlan2050,
  netImpact,
  yearlyTrend,
}
```

Work:

- Treat the published 2050 projection as the no-plan scenario.
- Apply only user-plan effects to that projection.
- Calculate net impact as the difference between the two 2050 scenarios.
- Apply range constraints through shared helpers.
- Round only for display.

Validation:

- An empty plan has zero net impact.
- Repeated facilities scale according to the documented formula.
- Boundary and representative scenario tests pass.

Commit:

```text
feat: calculate baseline projection and user plan net impact
```

#### Step 7: Document the Model

Create `doc/SimulationMethodology.md` containing:

- Data definitions and sources.
- Formula descriptions.
- Percentage versus percentage-point rules.
- A worked example.
- Assumptions and known limitations.
- A statement that this is an educational planning model, not an official forecast.

Commit:

```text
docs: document simulation methodology
```

### Phase 4: Results and User Interface

#### Step 8: Redesign the Results View

Display:

- 2025 Baseline.
- 2050 Without Plan.
- 2050 With Your Plan.
- Net Impact.
- Facility-level contributions.
- A yearly trend where meaningful.

Work:

- Replace ambiguous terminology such as "User Scenario."
- Present the most important net impacts first.
- Make favorable and unfavorable changes accessible without relying only on color.

Commit:

```text
feat: redesign simulation results around net impact
```

#### Step 9: Establish a Maintainable Style System

Work:

- Introduce shared design tokens.
- Extract inline styles into CSS Modules.
- Add responsive breakpoints.
- Add visible keyboard focus states.
- Standardize buttons, panels, tables, and modal spacing.

Validation:

- Desktop, tablet, and mobile layouts remain usable.
- Primary actions are keyboard accessible.
- Direct DOM style mutation is removed.

Commit:

```text
refactor: extract reusable layout and style primitives
```

#### Step 10: Split Large Components

Work:

- Reduce `App.js` to state orchestration and top-level composition.
- Split selectors, budget details, plan controls, and result sections.
- Replace generic names such as `SimulationSummary2`.

Validation:

- Each component has a clear responsibility.
- Calculation logic is not duplicated in UI components.
- Existing tests continue to pass.

Commit:

```text
refactor: split app and simulation result components
```

### Phase 5: Planning Workflow

#### Step 11: Support Plan Editing

Work:

- Remove a newly placed facility.
- Restore its cost to the available budget.
- Reset the full user plan.
- Prevent deletion of existing facilities.

Validation:

- Add, remove, and reset behavior updates both budget and facility counts.
- Budget invariants are covered by tests.

Commit:

```text
feat: allow users to edit and reset facility plans
```

#### Step 12: Expand Integration Coverage

Cover:

- Facility selection.
- Valid and invalid placement.
- Budget changes.
- Simulation button state.
- Scenario result rendering.
- Plan removal and reset.

Commit:

```text
test: cover city planning and simulation workflows
```

### Phase 6: CI/CD

#### Step 13: Add End-to-End Smoke Tests

Use Playwright to verify:

- Application startup.
- Facility selection and placement.
- Budget updates.
- Simulation execution.
- Result display.
- A basic mobile viewport.

External map tiles should be mocked or blocked where needed to keep tests deterministic.

Commit:

```text
test: add Playwright smoke tests
```

#### Step 14: Strengthen CI Quality Gates

Work:

- Use Node.js 20 and `npm ci`.
- Run unit, component, and end-to-end tests.
- Build the production bundle.
- Upload useful test and build artifacts.
- Add coverage reporting with realistic initial thresholds.
- Configure minimal workflow permissions.

Suggested initial coverage thresholds:

| Metric | Threshold |
|---|---:|
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

Commit:

```text
ci: add coverage and end-to-end quality gates
```

#### Step 15: Add Verified GitHub Pages Deployment

Deployment flow:

```text
Pull request
  -> Test
  -> Build
  -> End-to-end smoke test

Merge to master
  -> Test
  -> Build
  -> Deploy build artifact
  -> Production smoke check
```

Requirements:

- Deploy only from the protected default branch.
- Deploy the exact artifact created by the verified build job.
- Prevent overlapping production deployments.
- Support manual deployment with `workflow_dispatch`.
- Use GitHub's official Pages actions and minimal permissions.

Commit:

```text
ci: deploy verified builds to GitHub Pages
```

### Phase 7: Portfolio Documentation and Release

#### Step 16: Improve the README

Include:

- Project purpose and live demo.
- Accurate clone instructions.
- Key features.
- Technology choices.
- Setup, test, and build commands.
- A short explanation of the simulation.
- Screenshots or an animated demonstration.
- CI and deployment badges.
- Links to this plan and the simulation methodology.
- Known limitations and future work.

Commit:

```text
docs: rewrite README for portfolio presentation
```

#### Step 17: Complete the Release Review

Validate:

- A clean clone installs with `npm ci`.
- All automated tests pass.
- The production build succeeds.
- GitHub Pages serves the latest verified version.
- There are no browser console errors.
- Links, icons, and images load correctly.
- Primary workflows work on desktop and mobile.
- Keyboard navigation covers primary controls.
- Source files contain no damaged Unicode characters.
- Displayed impacts match the calculation definitions.

Commit:

```text
chore: complete portfolio release quality checks
```

Release tag:

```text
v1.0.0
```

## 7. Testing Strategy

### Unit Tests

Test pure domain behavior:

- Facility aggregation.
- Budget calculations.
- Point-in-polygon checks.
- Simulation formulas.
- Metric constraints.
- Formatting helpers.

### Component Tests

Test visible behavior:

- Facility selection.
- Budget and usage summaries.
- Button enabled and disabled states.
- Result tables and summaries.
- Plan editing controls.

Leaflet should be isolated at this level so component tests do not depend on browser layout behavior or remote map tiles.

### Integration Tests

Test the main application workflow across components while keeping external network dependencies controlled.

### End-to-End Tests

Use a small number of high-value Playwright scenarios against the production build. E2E tests should validate integration and deployment behavior rather than repeat every unit-test case.

### Manual Verification

Before each release:

- Review desktop, tablet, and mobile layouts.
- Verify keyboard navigation and focus visibility.
- Check color contrast and non-color status indicators.
- Inspect the browser console.
- Compare representative calculation results against documented examples.

## 8. CI/CD Strategy

### Continuous Integration

CI should run on every pull request and push:

1. Install locked dependencies with `npm ci`.
2. Run unit and component tests.
3. Enforce coverage thresholds when the test suite is mature enough.
4. Create a production build with warnings treated as errors.
5. Run end-to-end smoke tests against the production bundle.
6. Preserve relevant reports and build artifacts.

### Continuous Deployment

CD should run only after all required checks pass on the default branch. The deployment job must use the verified build artifact instead of rebuilding independently.

### Branch Protection

Recommended repository settings:

- Require a pull request before merging.
- Require the CI workflow to pass.
- Prevent force pushes to the default branch.
- Require branches to be up to date before merging when practical.
- Keep GitHub Pages deployment permissions limited to the deployment job.

## 9. Commit and Review Strategy

Every commit should:

- Have one clear purpose.
- Leave tests and the build passing.
- Avoid unrelated formatting changes.
- Include tests for changed behavior.
- Be small enough to review without reconstructing multiple design decisions.

Before committing:

```bash
npm test -- --watchAll=false
CI=true npm run build
git diff --check
```

For steps that add Playwright:

```bash
npm run test:e2e
```

The Create React App to Vite migration should be completed after the stable `v1.0.0` release in a separate branch and pull request. It should not be combined with domain-model or UI refactoring.

## 10. Risks and Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Displayed impacts differ from calculated impacts | Loss of user trust | Use centralized facility definitions and contract tests |
| Existing facilities affect the user scenario | Misleading results | Store existing and user-plan facilities separately |
| Percent and percentage-point changes are mixed | Incorrect calculations | Define calculation types in metric metadata and methodology |
| Map tests depend on remote services | Flaky CI | Mock Leaflet boundaries and remote tiles in automated tests |
| Large refactors hide behavior changes | Difficult review and rollback | Use small phase-based commits with passing tests |
| Styling changes reduce accessibility | Poor usability | Add keyboard, focus, contrast, and responsive checks |
| Deployment rebuild differs from CI build | Unverified production artifact | Deploy the exact artifact produced by the verified build job |
| CRA migration disrupts stabilization | Delayed release | Defer Vite migration until after `v1.0.0` |

## 11. Definition of Done

A development step is complete when:

- Its acceptance criteria are met.
- Relevant automated tests exist and pass.
- The production build succeeds with warnings treated as errors.
- User-facing behavior has been manually checked when applicable.
- Documentation is updated when behavior or assumptions change.
- The change is committed independently with a descriptive message.

The portfolio release is complete when all must-have items are delivered, CI and CD are green, the live application matches the documented simulation model, and the repository can be understood and run by a new contributor without additional guidance.
