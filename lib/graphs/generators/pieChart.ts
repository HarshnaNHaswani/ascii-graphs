import { GraphDataPoint } from "@/types/graph";
import { escapeHtml, NBSP } from "../utils";

export function generatePieChart(
  data: GraphDataPoint[],
  pieChars: string[] = [
    "█",
    "▓",
    "▒",
    "░",
    "▄",
    "▀",
    "▌",
    "▐",
    "■",
    "□",
    "▪",
    "▫",
  ],
  backgroundColor: string = "#1e293b",
  textColor: string = "#4ade80"
): string {
  if (pieChars.length === 0) {
    return "<div class='graph-wrapper'><p>Error: At least one character is required for pie chart.</p></div>";
  }
  if (pieChars.length < data.length) {
    return `<div class='graph-wrapper'><p>Error: Please select at least ${data.length} character${data.length > 1 ? "s" : ""} for ${data.length} data point${data.length > 1 ? "s" : ""}. You have ${pieChars.length} selected.</p></div>`;
  }
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const maxLabelLength = Math.max(...data.map((d) => d.label.length), 20);
  const pieSize = 24;

  let graphContent = "";
  let legendContent = "";

  // Calculate percentages
  const percentages = data.map((d) => ({
    label: d.label,
    value: d.value,
    percentage: (d.value / total) * 100,
  }));

  // Use provided characters, or cycle through if more data points than characters
  const chars = pieChars.length > 0 ? pieChars : ["█"];

  // Legend
  percentages.forEach((item, index) => {
    const char = chars[index % chars.length];
    const padding = " ".repeat(maxLabelLength - item.label.length);
    const valueStr = Number.isInteger(item.value)
      ? item.value.toString()
      : item.value.toFixed(1);
    legendContent += `<div class="legend-item"><span class="legend-char">${escapeHtml(char)}</span> <span class="legend-label">${escapeHtml(item.label)}</span>${padding} <span class="legend-value">${valueStr}</span> (<span class="legend-percentage">${item.percentage.toFixed(1)}%</span>)</div>`;
  });

  // Create a pie visualization
  // Account for monospace font aspect ratio (characters are taller than wide)
  // Adjust aspect ratio to make circle appear round (typically around 1.5-1.8 for monospace fonts)
  const aspectRatio = 2.0;
  const centerX = pieSize / 2 - 0.5;
  const centerY = pieSize / 2 - 0.5;
  const radius = pieSize / 2 - 2;

  for (let row = 0; row < pieSize; row++) {
    for (let col = 0; col < pieSize; col++) {
      const dx = col - centerX;
      // Scale dy by aspect ratio to make circle appear round
      const dy = (row - centerY) * aspectRatio;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= radius) {
        // Use unscaled dy for angle calculation to get correct slice angles
        const unscaledDy = row - centerY;
        let angle = Math.atan2(unscaledDy, dx);
        if (angle < 0) angle += 2 * Math.PI;

        let cumulativeAngle = 0;
        let charIndex = 0;
        for (let i = 0; i < percentages.length; i++) {
          const sliceAngle = (percentages[i].percentage / 100) * 2 * Math.PI;
          if (
            angle >= cumulativeAngle &&
            angle < cumulativeAngle + sliceAngle
          ) {
            charIndex = i;
            break;
          }
          cumulativeAngle += sliceAngle;
        }

        graphContent += chars[charIndex % chars.length];
      } else {
        graphContent += NBSP;
      }
    }
    graphContent += "\n";
  }

  return `
    <div class="graph-wrapper" style="background-color: ${backgroundColor}; color: ${textColor};">
      <h1 class="graph-heading">Pie Chart</h1>
      <section class="legend-section">
        <h2 class="legend-heading">Legend</h2>
        <div class="legend-content">${legendContent}</div>
      </section>
      <section class="graph-section">
        <h2 class="graph-section-heading">Graph</h2>
        <div class="graph-content">${escapeHtml(graphContent)}</div>
      </section>
    </div>
  `;
}
