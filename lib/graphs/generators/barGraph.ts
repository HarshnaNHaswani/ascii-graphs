import { GraphDataPoint } from "@/types/graph";
import { escapeHtml } from "../utils";

export function generateBarGraph(
  data: GraphDataPoint[],
  barChar: string = "█",
  backgroundColor: string = "#1e293b",
  textColor: string = "#4ade80"
): string {
  if (!barChar) {
    return "<div class='graph-wrapper'><p>Error: Bar character is required.</p></div>";
  }
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxLabelLength = Math.max(...data.map((d) => d.label.length), 20);
  const barWidth = 50;
  const scale = barWidth / maxValue;

  let graphContent = "";
  let legendContent = "";

  // Bars
  data.forEach(({ label, value }) => {
    const barLength = Math.max(1, Math.round(value * scale));
    const bar = barChar.repeat(barLength);
    const padding = " ".repeat(maxLabelLength - label.length);
    const valueStr = value.toString();
    const rowContent = `${escapeHtml(label)}${padding} │${escapeHtml(bar)} ${valueStr}`;
    graphContent += `<div class="graph-row">${rowContent}</div>`;
    legendContent += `<div class="legend-item"><span class="legend-label">${escapeHtml(label)}</span>: <span class="legend-value">${valueStr}</span></div>`;
  });

  // Add scale indicator
  const scaleContent = `${" ".repeat(maxLabelLength + 2)}0${" ".repeat(barWidth - 1)}${maxValue}`;
  graphContent += `<div class="graph-scale">${scaleContent}</div>`;

  return `
    <div class="graph-wrapper" style="background-color: ${backgroundColor}; color: ${textColor};">
      <h1 class="graph-heading">Bar Graph</h1>
      <section class="legend-section">
        <h2 class="legend-heading">Legend</h2>
        <div class="legend-content">${legendContent}</div>
      </section>
      <section class="graph-section">
        <h2 class="graph-section-heading">Graph</h2>
        <div class="graph-content">${graphContent}</div>
      </section>
    </div>
  `;
}
