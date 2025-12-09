import { GraphDataPoint } from "@/types/graph";
import { escapeHtml, NBSP } from "../utils";

export function generateAreaChart(
  data: GraphDataPoint[],
  areaChars: [string, string] = ["█", "▓"],
  backgroundColor: string = "#1e293b",
  textColor: string = "#4ade80"
): string {
  if (!areaChars[0] || !areaChars[1]) {
    return "<div class='graph-wrapper'><p>Error: Both line and fill characters are required.</p></div>";
  }
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxLabelLength = Math.max(...data.map((d) => d.label.length), 20);
  const chartWidth = Math.max(data.length * 4, 40);
  const chartHeight = 15;

  let graphContent = "";
  let legendContent = "";

  // Build the chart from top to bottom
  const chart: string[][] = Array(chartHeight)
    .fill(null)
    .map(() => Array(chartWidth).fill(NBSP));

  // Calculate Y positions for each data point (interpolated across width)
  const dataPoints: Array<{ x: number; y: number }> = [];
  data.forEach(({ value }, dataIndex) => {
    const x = Math.round(
      (dataIndex / (data.length - 1 || 1)) * (chartWidth - 1)
    );
    const y = chartHeight - 1 - Math.round((value / maxValue) * chartHeight);
    dataPoints.push({ x, y });
  });

  // Draw the line and fill area below
  for (let col = 0; col < chartWidth; col++) {
    // Find which segment this column belongs to
    let segmentIndex = 0;
    for (let i = 0; i < dataPoints.length - 1; i++) {
      if (col >= dataPoints[i].x && col <= dataPoints[i + 1].x) {
        segmentIndex = i;
        break;
      }
    }

    // Interpolate Y value for this column
    const p1 = dataPoints[segmentIndex];
    const p2 = dataPoints[segmentIndex + 1];
    let y: number;
    if (p1.x === p2.x) {
      y = p1.y;
    } else {
      const t = (col - p1.x) / (p2.x - p1.x);
      y = Math.round(p1.y + t * (p2.y - p1.y));
    }

    // Draw the line point
    if (y >= 0 && y < chartHeight) {
      chart[y][col] = areaChars[0];
    }

    // Fill area below the line
    for (let row = y + 1; row < chartHeight; row++) {
      if (row >= 0 && row < chartHeight) {
        chart[row][col] = areaChars[1];
      }
    }
  }

  // Draw Y-axis labels and chart
  const yAxisWidth = 6;
  let lastYLabel = -1;
  for (let row = 0; row < chartHeight; row++) {
    const yValue = maxValue - (row / chartHeight) * maxValue;
    const roundedYValue = Math.round(yValue);

    // Only show label if the value changed or at specific intervals
    let yLabel = " ".repeat(yAxisWidth - 1);
    if (roundedYValue !== lastYLabel) {
      yLabel = roundedYValue.toFixed(0).padStart(yAxisWidth - 1);
      lastYLabel = roundedYValue;
    }

    graphContent += `${yLabel}│`;
    for (let col = 0; col < chartWidth; col++) {
      graphContent += chart[row][col];
    }
    graphContent += "\n";
  }

  // X-axis
  graphContent += " ".repeat(yAxisWidth) + "└";
  graphContent += "─".repeat(chartWidth) + "\n";

  // X-axis labels (aligned with data points, avoiding overlaps)
  const labelLine: string[] = Array(yAxisWidth + 1 + chartWidth).fill(NBSP);

  // Calculate label positions with overlap detection
  const labelData = data.map(({ label }, index) => {
    const x = Math.round((index / (data.length - 1 || 1)) * (chartWidth - 1));
    // Truncate label to fit better
    const maxLabelLen = Math.max(4, Math.floor(chartWidth / data.length) - 1);
    const labelText = label.substring(0, Math.min(label.length, maxLabelLen));
    return { x, label: labelText, index };
  });

  // Place labels, adjusting for overlaps
  const placedLabels: Array<{ start: number; end: number }> = [];

  labelData.forEach(({ x, label }) => {
    // Try to center label at x coordinate
    let labelStart = yAxisWidth + 1 + x - Math.floor(label.length / 2);

    // Check for overlaps with already placed labels
    let adjusted = false;
    for (const placed of placedLabels) {
      if (
        (labelStart >= placed.start && labelStart < placed.end) ||
        (labelStart + label.length > placed.start &&
          labelStart + label.length <= placed.end) ||
        (labelStart <= placed.start && labelStart + label.length >= placed.end)
      ) {
        // Overlap detected, place after the previous label
        labelStart = placed.end + 1;
        adjusted = true;
      }
    }

    // If adjusted, try to get closer to x coordinate if possible
    if (adjusted) {
      const idealStart = yAxisWidth + 1 + x - Math.floor(label.length / 2);
      if (labelStart < idealStart) {
        // Check if we can move closer without overlapping
        let canMove = true;
        for (const placed of placedLabels) {
          if (
            idealStart < placed.end &&
            idealStart + label.length > placed.start
          ) {
            canMove = false;
            break;
          }
        }
        if (canMove) {
          labelStart = idealStart;
        }
      }
    }

    // Ensure label stays within bounds
    labelStart = Math.max(yAxisWidth + 1, labelStart);
    labelStart = Math.min(
      labelStart,
      yAxisWidth + 1 + chartWidth - label.length
    );

    // Place the label
    for (let i = 0; i < label.length; i++) {
      const pos = labelStart + i;
      if (pos >= yAxisWidth + 1 && pos < labelLine.length) {
        if (labelLine[pos] === NBSP) {
          labelLine[pos] = label[i];
        }
      }
    }

    // Record this label's position
    placedLabels.push({ start: labelStart, end: labelStart + label.length });
  });

  graphContent += labelLine.join("") + "\n";

  // Legend
  data.forEach(({ label, value }) => {
    legendContent += `<div class="legend-item"><span class="legend-label">${escapeHtml(label)}</span>: <span class="legend-value">${value}</span></div>`;
  });

  return `
    <div class="graph-wrapper" style="background-color: ${backgroundColor}; color: ${textColor};">
      <h1 class="graph-heading">Area Chart</h1>
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
