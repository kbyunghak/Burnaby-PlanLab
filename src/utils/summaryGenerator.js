import { metricDefinitions } from '../constants/metricDefinitions';

export const indicatorTemplates = {
  population: {
    up: "Population growth strengthens the labor force and economic vitality, attracting investments and improving city services.",
    down: "A decline in population may signal economic challenges and reduced workforce availability, requiring targeted revitalization strategies."
  },
  trafficAccidents: {
    up: "An increase in traffic accidents calls for enhanced road safety measures and public awareness campaigns to protect citizens.",
    down: "Reduced traffic accidents improve public safety and lower healthcare costs."
  },
  crimeRate: {
    up: "Rising crime rates necessitate increased law enforcement resources and community engagement to ensure safety.",
    down: "Lower crime rates contribute to higher quality of life and attract new residents and businesses."
  },
  housingSatisfaction: {
    up: "Improved housing satisfaction promotes social stability and community well-being.",
    down: "Declining housing satisfaction could lead to social unrest and increased mobility, demanding affordable housing initiatives."
  },
  unemploymentRate: {
    up: "Higher unemployment rates risk social challenges and economic stagnation, highlighting the need for job creation programs.",
    down: "Lower unemployment strengthens the economy and citizen welfare."
  },
  airQualityIndex: {
    up: "Worsening air quality poses health risks and requires environmental regulations and green initiatives.",
    down: "Improved air quality enhances public health and environmental sustainability."
  },
  inflationRate: {
    up: "Rising inflation can erode purchasing power and requires fiscal and monetary policy adjustments.",
    down: "Stable or decreasing inflation supports economic stability and consumer confidence."
  }
};

export const facilityPolicySuggestions = {
  Market: "Market expansion boosts the economy but may increase traffic and pollution. Investments in public transit and environmental controls are advised.",
  School: "School development raises education levels and long-term growth potential. Adequate funding and facility maintenance are essential.",
  CommunityCentre: "Community centres enhance social cohesion but require sustainable operational budgets.",
  Hospital: "Hospitals improve health outcomes; ensure capacity matches population growth.",
  PoliceStation: "Police presence reduces crime but must balance community trust and engagement.",
  NonProfitHousing: "Non-profit housing improves affordability but demands integration policies to maintain neighborhood harmony.",
  Daycare: "Daycare services support working families, increasing labor participation rates.",
  SeniorCentre: "Senior centres address aging population needs and promote active aging."
};

// Summary of policy simulation results
export function generatePolicySummary(simulationData) {
  if (!simulationData || simulationData.length === 0) return "";

  const latest = simulationData[simulationData.length - 1];
  const first = simulationData[0];
  const positiveMsgs = [];
  const cautionMsgs = [];

  for (const key in indicatorTemplates) {
    if (!(key in latest) || !(key in first)) continue;
    const change = latest[key] - first[key];
    const favorableDirection = metricDefinitions[key]?.favorableDirection;

    if (favorableDirection === 'increase') {
      if (change > 0) positiveMsgs.push(indicatorTemplates[key].up);
      else if (change < 0) cautionMsgs.push(indicatorTemplates[key].down);
    } else if (favorableDirection === 'decrease') {
      if (change < 0) positiveMsgs.push(indicatorTemplates[key].down);
      else if (change > 0) cautionMsgs.push(indicatorTemplates[key].up);
    }
  }

  let summary = "";

  if (positiveMsgs.length > 0) {
    summary += "Overall Positive Changes:\n";
    summary += positiveMsgs.map(msg => `- ${msg}`).join("\n") + "\n\n";
  }

  if (cautionMsgs.length > 0) {
    summary += "Considerations and Cautions:\n";
    summary += cautionMsgs.map(msg => `- ${msg}`).join("\n");
  }

  return summary.trim();
}
// Summary of facilities installed
export function generateFacilitySummary(facilities) {
  if (!facilities || facilities.length === 0) return "No facilities installed.";
  return "Facilities and Policy Suggestions:\n" + facilities
    .map(f => `- ${f}: ${facilityPolicySuggestions[f] || "No suggestions available."}`)
    .join("\n");
}
