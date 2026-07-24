# Simulation Methodology

## Purpose

City Sim is an educational urban-planning application. It demonstrates how a proposed mix of public facilities could be compared with a no-plan city projection.

The simulation is not an official City of Burnaby forecast, an engineering model, or a substitute for professional policy analysis. Its coefficients are simplified project assumptions designed to make user choices visible and comparable.

## Scenario Definitions

The application produces five related outputs:

### 2025 Baseline

The starting state of Burnaby stored in `burnaby2025`. Existing facilities are part of the map context but do not create user-plan impacts or consume the user's budget.

### 2050 Without Plan

The reference projection stored in `burnabyForecast2050`. This represents the expected 2050 state before the user's proposed facilities are applied.

### 2050 With Your Plan

The no-plan 2050 projection with the combined effects of facilities placed by the user.

### Net Impact

The difference attributable to the user plan:

```text
Net Impact = 2050 With Your Plan - 2050 Without Plan
```

### Yearly Trend

A 2025-2050 series used to compare a linearly interpolated no-plan projection with a user-plan scenario whose facility effects are gradually introduced over the same period.

## Data Status

The baseline and forecast values currently stored in the repository should be treated as project assumptions unless a source is explicitly added beside the dataset.

Before presenting the model as data-informed policy analysis, each baseline and forecast value should have:

- A source organization.
- A source URL or publication reference.
- A publication date.
- A geographic and statistical definition.
- A note describing any transformation applied by the project.

Until that work is complete, the application should describe its figures as illustrative rather than official.

## Facility Data

Every supported facility is defined in `src/constants/facilityDefinitions.js`. A definition contains:

- Internal facility ID.
- Display label.
- Cost.
- Icon path.
- Description.
- Qualitative benefits and drawbacks.
- Quantitative impact coefficients.

The building selector, map icons, legend, result details, and simulation engine consume this shared definition. This prevents displayed impacts from drifting away from calculated impacts.

## Metric Data

Every simulated metric is defined in `src/constants/metricDefinitions.js`. A definition contains:

- Display label.
- Unit.
- Display precision.
- Minimum and maximum supported values.
- Direction considered favorable.
- Facility impact key.

Current metrics:

| Metric | Unit | Favorable Direction | Supported Range |
|---|---|---|---|
| Population | People | Increase | 0 or greater |
| Traffic Accidents | Incidents | Decrease | 0 or greater |
| Crime Incidents | Incidents | Decrease | 0 or greater |
| Housing Satisfaction | Percent | Increase | 0-100 |
| Unemployment Rate | Percent | Decrease | 0-100 |
| Housing Supply Rate | Percent | Increase | 0-100 |
| Air Quality Index | AQI | Decrease | 0-500 |
| Inflation Rate | Percent | Decrease | 0-100 |

The favorable direction controls result interpretation. For example, a positive population net impact is favorable, while a positive crime net impact is unfavorable.

## Impact Coefficients

Facility impacts are stored as decimal proportional changes:

```text
0.05 = a 5% increase
-0.02 = a 2% decrease
```

All current coefficients use proportional percentage changes. The model does not currently use percentage-point changes.

If a future metric requires percentage points, its definition should explicitly declare that calculation type before the engine is extended. Percentage changes and percentage-point changes must not share an implicit formula.

## Calculation

### 1. Aggregate Facility Effects

For each impact key, the simulation sums the coefficient from every facility in the user plan:

```text
Total Facility Impact = Sum of matching coefficients for all user facilities
```

Repeated facilities repeat the coefficient. Unknown facility IDs are ignored.

### 2. Apply the Plan to the 2050 Projection

For each metric:

```text
2050 With Your Plan =
  2050 Without Plan × (1 + Total Facility Impact)
```

The result is constrained to the metric's supported range.

### 3. Calculate Net Impact

For each metric:

```text
Net Impact =
  2050 With Your Plan - 2050 Without Plan
```

Net impact is not constrained because a negative difference is meaningful.

### 4. Calculate the Yearly No-Plan Projection

The reference value for each intermediate year is linearly interpolated:

```text
Year Fraction =
  (Current Year - 2025) / (2050 - 2025)

Projected Value =
  2025 Baseline
  + (2050 Without Plan - 2025 Baseline) × Year Fraction
```

### 5. Introduce User-Plan Effects Over Time

The full facility effect is phased in linearly:

```text
With-Plan Value =
  Projected Value
  × (1 + Total Facility Impact × Year Fraction)
```

At 2025 the user-plan effect is zero. At 2050 the full effect is applied.

## Worked Example

Assume:

```text
2050 population without plan: 360,000
One School population coefficient: +0.05
```

The user-plan population is:

```text
360,000 × (1 + 0.05) = 378,000
```

The net population impact is:

```text
378,000 - 360,000 = +18,000
```

The application should therefore display:

| Scenario | Population |
|---|---:|
| 2025 Baseline | 263,046 |
| 2050 Without Plan | 360,000 |
| 2050 With Your Plan | 378,000 |
| Net Impact | +18,000 |

## Precision and Formatting

The calculation engine keeps JavaScript numeric precision during calculations. It does not round intermediate values.

Rounding and units are applied at the presentation layer using metric metadata. This avoids compounding display rounding across the yearly trend.

Small floating-point representations such as `46.800000000000004` may exist internally and are formatted according to the metric's configured precision.

## Range Constraints

The shared metric metadata applies the following constraints:

- Counts and rates cannot be below zero.
- Percent-based bounded indicators cannot exceed 100.
- Air Quality Index cannot exceed 500.

These constraints prevent impossible display values but do not make the coefficients empirically valid.

## Existing Facilities and User Facilities

Existing Burnaby facilities:

- Provide geographic context.
- Remain visible on the map.
- Use reduced marker opacity.
- Do not consume the user budget.
- Do not contribute to user-plan impacts.

User-plan facilities:

- Are placed during the current scenario.
- Consume the user budget.
- Appear in the building usage summary.
- Are the only facilities passed to the simulation engine.

This separation allows Net Impact to represent the user's choices rather than the city's pre-existing infrastructure.

## Known Limitations

- Baseline and forecast values do not yet include repository-level source citations.
- Facility coefficients are simplified assumptions rather than calibrated causal estimates.
- Effects are additive and do not model diminishing returns.
- Facilities do not interact with one another.
- Facility location does not affect the calculation after boundary validation.
- Neighborhood-level population and service capacity are not modeled.
- Construction time and operating costs are not modeled.
- The yearly projection and facility rollout are linear.
- Uncertainty ranges are not provided.
- Budget units are game values rather than documented real-world currency amounts.
- External economic, demographic, environmental, and policy events are excluded.

## Future Model Improvements

Model improvements should be introduced only with tests and documentation. Potential extensions include:

- Source-backed baseline and forecast datasets.
- Explicit percentage-point impact types.
- Diminishing returns for repeated facilities.
- Construction and operating time horizons.
- Facility capacity and service-area calculations.
- Neighborhood-level effects.
- Distance-based interaction between facilities.
- Confidence intervals or low, medium, and high scenarios.
- User-selectable policy assumptions.
- Versioned coefficient sets for reproducible saved scenarios.

## Verification Requirements

Changes to the model should include tests for:

- Empty plans.
- One facility.
- Repeated facilities.
- Mixed facility plans.
- Unknown facilities.
- Metric range constraints.
- Source data immutability.
- Net impact calculations.
- 2025 and 2050 trend endpoints.
- Representative worked examples documented here.

The production build and complete automated test suite must pass before a model change is merged or deployed.
