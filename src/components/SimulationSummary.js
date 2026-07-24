// src/components/SimulationSummary.js
import React from "react";
import { generatePolicySummary } from "../utils/summaryGenerator";

const SimulationSummary = ({ simulationData }) => {
  const policySummary = generatePolicySummary(simulationData);
  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h3>Overall Policy Summary</h3>
      <p style={{ whiteSpace: "pre-wrap", marginBottom: 24 }}>{policySummary}</p>
    </div>
  );
};

export default SimulationSummary;
