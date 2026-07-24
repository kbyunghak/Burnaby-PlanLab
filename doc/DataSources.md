# Simulation Data Sources

## Data Classification

The simulator separates its inputs into three classes:

- **Official reference:** values reproduced from an identified public planning source.
- **Model estimate:** a value calculated by the project from official reference points.
- **Illustrative assumption:** an unsourced value retained for educational simulation and clearly identified as non-official.

These classifications describe data provenance. They do not imply that the facility-impact model is an official City of Burnaby model.

## Burnaby 2050 Official Reference Scenario

| Field | Value |
|---|---|
| Source organization | City of Burnaby |
| Publication | Burnaby 2050 Official Community Plan |
| Scenario | Metro Vancouver high-growth scenario |
| Adoption date | December 9, 2025 |
| Source URL | [Burnaby 2050 Official Community Plan](https://www.burnaby.ca/sites/default/files/acquiadam/2025-12/Burnaby%202050%20Official%20Community%20Plan.pdf) |
| Geographic scope | City of Burnaby |
| Repository snapshot ID | `burnaby-2050-ocp-high-growth-2025` |

The application stores the following published reference series:

| Year | Population | Dwelling Units | Jobs |
|---:|---:|---:|---:|
| 2021 | 261,810 | 106,170 | 160,330 |
| 2030 | 311,510 | 128,330 | 185,490 |
| 2040 | 361,630 | 151,860 | 209,940 |
| 2050 | 408,150 | 174,060 | 231,820 |

The values are stored as a versioned repository snapshot so that saved simulations and automated tests remain reproducible if the external publication changes.

## 2026 Model Start

The cited OCP series does not publish a 2026 value. The simulator derives its 2026 model start by linear interpolation between the official 2021 and 2030 reference points:

```text
2026 estimate =
  2021 value
  + (2030 value - 2021 value) × (2026 - 2021) / (2030 - 2021)
```

Rounded model-start values:

| Metric | 2026 Model Estimate |
|---|---:|
| Population | 289,421 |
| Dwelling Units | 118,481 |
| Jobs | 174,308 |

These are project calculations, not values published by the City of Burnaby.

## Illustrative Indicators

The following current baseline and projection inputs do not yet have compatible, city-level, long-range official sources in the repository:

- Traffic accidents.
- Crime incidents.
- Housing satisfaction.
- Unemployment rate.
- Housing supply rate.
- Air quality index.
- Inflation rate.

They are retained as illustrative assumptions so the existing educational interface remains functional. The results interface labels them as illustrative and must not describe them as official Burnaby forecasts.

## Facility Impacts

Facility costs and impact coefficients are project assumptions. They are not extracted from the Burnaby OCP and are not calibrated causal estimates.

The official reference scenario supplies the no-plan population outlook. User facilities are applied as a separate illustrative model layer, and Net Impact represents only the difference produced by that layer.

## Maintenance Rules

When updating a source-backed value:

1. Create a new scenario ID rather than silently changing the existing snapshot.
2. Record the organization, publication, scenario, publication or adoption date, URL, geographic scope, and units.
3. Document every transformation or interpolation.
4. Update endpoint and immutability tests.
5. Keep official values, model estimates, and illustrative assumptions visually distinct.
