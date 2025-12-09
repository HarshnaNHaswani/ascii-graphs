import { GraphDataPoint } from "@/types/graph";
import { escapeHtml, NBSP } from "../utils";

export function generateVerticalBarChart(
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
  const barWidth = 3; // Width for each bar
  const barSpacing = 3; // Space between bars (increased to prevent collision)
  const chartWidth = Math.max(
    data.length * barWidth + (data.length - 1) * barSpacing + 4,
    50
  );
  const chartHeight = 15;

  let graphContent = "";
  let legendContent = "";

  // Build the chart from top to bottom
  const chart: string[][] = Array(chartHeight)
    .fill(null)
    .map(() => Array(chartWidth).fill(NBSP));

  // Calculate bar positions with even spacing
  const totalBarSpace = data.length * barWidth + (data.length - 1) * barSpacing;
  const startOffset = Math.floor((chartWidth - totalBarSpace) / 2);

  data.forEach(({ value }, dataIndex) => {
    const xStart = startOffset + dataIndex * (barWidth + barSpacing);
    const xEnd = xStart + barWidth - 1;
    const height = Math.max(1, Math.round((value / maxValue) * chartHeight));

    // Draw the bar
    for (let row = 0; row < height; row++) {
      const y = chartHeight - 1 - row;
      if (y >= 0 && y < chartHeight) {
        for (let x = xStart; x <= xEnd; x++) {
          if (x >= 0 && x < chartWidth) {
            chart[y][x] = barChar;
          }
        }
      }
    }
  });

  // Draw Y-axis labels and chart
  const yAxisWidth = 6;
  for (let row = 0; row < chartHeight; row++) {
    const yValue = maxValue - (row / chartHeight) * maxValue;
    const yLabel = yValue.toFixed(0).padStart(yAxisWidth - 1);
    graphContent += `${yLabel}│`;
    for (let col = 0; col < chartWidth; col++) {
      graphContent += chart[row][col];
    }
    graphContent += "\n";
  }

  // X-axis
  graphContent += " ".repeat(yAxisWidth) + "└";
  graphContent += "─".repeat(chartWidth) + "\n";

  // X-axis labels (centered under each bar with proper spacing)
  // Build label line as an array, then convert to string
  const labelLine: string[] = Array(yAxisWidth + 1 + chartWidth).fill(NBSP);
  data.forEach(({ label }, index) => {
    const barCenter =
      startOffset + index * (barWidth + barSpacing) + Math.floor(barWidth / 2);
    // Limit label length to prevent overlap
    const maxLabelLength = barWidth + Math.floor(barSpacing / 2);
    const labelText = label.substring(
      0,
      Math.min(label.length, maxLabelLength)
    );
    const labelStart =
      yAxisWidth + 1 + barCenter - Math.floor(labelText.length / 2);

    // Check if label would overlap with previous label
    let canPlace = true;
    if (index > 0) {
      const prevBarCenter =
        startOffset +
        (index - 1) * (barWidth + barSpacing) +
        Math.floor(barWidth / 2);
      const prevLabelEnd = prevBarCenter + Math.floor(maxLabelLength / 2);
      if (labelStart <= prevLabelEnd + 1) {
        canPlace = false;
      }
    }

    if (canPlace) {
      for (let i = 0; i < labelText.length; i++) {
        const pos = labelStart + i;
        if (pos >= yAxisWidth + 1 && pos < labelLine.length) {
          // Only place if position is empty or we're overwriting with same char
          if (labelLine[pos] === NBSP || labelLine[pos] === labelText[i]) {
            labelLine[pos] = labelText[i];
          }
        }
      }
    }
  });
  graphContent += labelLine.join("") + "\n";

  // Legend
  data.forEach(({ label, value }) => {
    legendContent += `<div class="legend-item"><span class="legend-label">${escapeHtml(label)}</span>: <span class="legend-value">${value}</span></div>`;
  });

  return `
    <div class="graph-wrapper" style="background-color: ${backgroundColor}; color: ${textColor};">
      <h1 class="graph-heading">Vertical Bar Chart</h1>
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
