"use client";

import { useState, useMemo } from "react";

interface GraphDisplayProps {
  data: Array<{ label: string; value: number }>;
  graphType: "bar" | "verticalBar" | "area" | "pie";
  backgroundColor?: string;
  textColor?: string;
  barChar?: string;
  areaChars?: [string, string];
  pieChars?: string[];
}

// Helper function to replace regular spaces with non-breaking spaces
const NBSP = "\u00A0";
const replaceSpaces = (str: string): string => {
  return str.replace(/ /g, NBSP);
};

export default function GraphDisplay({
  data,
  graphType,
  backgroundColor = "#1e293b",
  textColor = "#4ade80",
  barChar = "█",
  areaChars = ["█", "▓"],
  pieChars = ["█", "▓", "▒", "░", "▄", "▀", "▌", "▐", "■", "□", "▪", "▫"],
}: GraphDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [copiedGraphOnly, setCopiedGraphOnly] = useState(false);

  const graphOutput = useMemo(() => {
    if (data.length === 0) {
      return "No data to display. Please upload CSV data first.";
    }

    let output = "";
    switch (graphType) {
      case "bar":
        output = generateBarGraph(data, barChar);
        break;
      case "verticalBar":
        output = generateVerticalBarChart(data, barChar);
        break;
      case "area":
        output = generateAreaChart(data, areaChars);
        break;
      case "pie":
        output = generatePieChart(data, pieChars);
        break;
      default:
        output = "";
    }
    // Replace all regular spaces with non-breaking spaces
    return replaceSpaces(output);
  }, [data, graphType, barChar, areaChars, pieChars]);

  // Extract just the graph portion (without title, separator, and values list)
  const extractGraphOnly = (output: string): string => {
    const lines = output.split("\n");
    // Find the separator line (usually "=" line)
    let separatorIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("=") && lines[i].length > 10) {
        separatorIndex = i;
        break;
      }
    }

    if (separatorIndex === -1) {
      // No separator found, return as-is
      return output;
    }

    // Start after separator, skip empty lines
    let graphStartIndex = separatorIndex + 1;
    while (
      graphStartIndex < lines.length &&
      lines[graphStartIndex].trim() === ""
    ) {
      graphStartIndex++;
    }

    // Find where values list starts (lines like "Label: Value")
    let valuesStartIndex = lines.length;
    for (let i = graphStartIndex; i < lines.length; i++) {
      // Check if this looks like a values line (contains ": " followed by digits)
      if (lines[i].trim().match(/^[^:]+:\s*\d+/)) {
        valuesStartIndex = i;
        break;
      }
    }

    // Extract graph portion (from graph start to values start, excluding empty lines at end)
    const graphLines = lines.slice(graphStartIndex, valuesStartIndex);

    // Remove trailing empty lines
    while (
      graphLines.length > 0 &&
      graphLines[graphLines.length - 1].trim() === ""
    ) {
      graphLines.pop();
    }

    return graphLines.join("\n");
  };

  const copyToClipboard = async (content: string) => {
    // Escape HTML entities for safe HTML copying
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Create HTML version with preserved formatting
    const htmlContent = `<pre style="font-family: monospace; background-color: ${backgroundColor}; color: ${textColor}; white-space: pre; word-break: keep-all; margin: 0; padding: 0; line-height: 1.2;">${escapeHtml(content)}</pre>`;
    const textContent = content;

    // Try to copy as HTML with fallback to plain text
    if (navigator.clipboard && navigator.clipboard.write) {
      try {
        const clipboardItem = new ClipboardItem({
          "text/html": new Blob([htmlContent], { type: "text/html" }),
          "text/plain": new Blob([textContent], { type: "text/plain" }),
        });
        await navigator.clipboard.write([clipboardItem]);
      } catch (htmlError) {
        // Fallback to plain text if HTML clipboard API fails
        await navigator.clipboard.writeText(textContent);
      }
    } else {
      // Fallback for older browsers
      await navigator.clipboard.writeText(textContent);
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(graphOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Final fallback
      try {
        await navigator.clipboard.writeText(graphOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr);
      }
    }
  };

  const handleCopyGraphOnly = async () => {
    try {
      const graphOnly = extractGraphOnly(graphOutput);
      await copyToClipboard(graphOnly);
      setCopiedGraphOnly(true);
      setTimeout(() => setCopiedGraphOnly(false), 2000);
    } catch (err) {
      console.error("Failed to copy graph only:", err);
      // Final fallback
      try {
        const graphOnly = extractGraphOnly(graphOutput);
        await navigator.clipboard.writeText(graphOnly);
        setCopiedGraphOnly(true);
        setTimeout(() => setCopiedGraphOnly(false), 2000);
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr);
      }
    }
  };

  if (data.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          Graph Display
        </h2>
        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-md">
          No data to display. Please upload CSV data first.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-slate-900">Graph Display</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopyGraphOnly}
            className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${
              copiedGraphOnly
                ? "bg-green-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {copiedGraphOnly ? "✓ Copied!" : "Copy Graph Only"}
          </button>
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              copied
                ? "bg-green-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {copied ? "✓ Copied!" : "Copy All"}
          </button>
        </div>
      </div>

      <div
        className="p-6 rounded-md overflow-x-auto"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <pre
          className="font-mono text-sm whitespace-pre"
          style={{ whiteSpace: "pre", wordBreak: "keep-all" }}
        >
          {graphOutput}
        </pre>
      </div>
    </div>
  );
}

function generateBarGraph(
  data: Array<{ label: string; value: number }>,
  barChar: string = "█"
): string {
  if (!barChar) {
    return "Error: Bar character is required.";
  }
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxLabelLength = Math.max(...data.map((d) => d.label.length), 20);
  const barWidth = 50;
  const scale = barWidth / maxValue;

  let output = "";

  // Title
  output += "Bar Graph\n";
  const titleWidth = Math.max(barWidth + maxLabelLength + 15, 60);
  output += "=".repeat(titleWidth) + "\n\n";

  // Bars
  data.forEach(({ label, value }) => {
    const barLength = Math.max(1, Math.round(value * scale));
    const bar = barChar.repeat(barLength);
    const padding = " ".repeat(maxLabelLength - label.length);
    const valueStr = value.toString();
    output += `${label}${padding} │${bar} ${valueStr}\n`;
  });

  // Add scale indicator
  output += "\n";
  output += " ".repeat(maxLabelLength + 2);
  output += "0";
  output += " ".repeat(barWidth - 1);
  output += `${maxValue}\n`;

  return output;
}

function generateVerticalBarChart(
  data: Array<{ label: string; value: number }>,
  barChar: string = "█"
): string {
  if (!barChar) {
    return "Error: Bar character is required.";
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

  let output = "";

  // Title
  output += "Vertical Bar Chart\n";
  const titleWidth = Math.max(chartWidth + maxLabelLength + 15, 60);
  output += "=".repeat(titleWidth) + "\n\n";

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
    output += `${yLabel}│`;
    for (let col = 0; col < chartWidth; col++) {
      output += chart[row][col];
    }
    output += "\n";
  }

  // X-axis
  output += " ".repeat(yAxisWidth) + "└";
  output += "─".repeat(chartWidth) + "\n";

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
  output += labelLine.join("") + "\n\n";

  // Values
  data.forEach(({ label, value }) => {
    output += `${label}: ${value}\n`;
  });

  return output;
}

function generateAreaChart(
  data: Array<{ label: string; value: number }>,
  areaChars: [string, string] = ["█", "▓"]
): string {
  if (!areaChars[0] || !areaChars[1]) {
    return "Error: Both line and fill characters are required.";
  }
  const maxValue = Math.max(...data.map((d) => d.value));
  const maxLabelLength = Math.max(...data.map((d) => d.label.length), 20);
  const chartWidth = Math.max(data.length * 4, 40);
  const chartHeight = 15;

  let output = "";

  // Title
  output += "Area Chart\n";
  const titleWidth = Math.max(chartWidth + maxLabelLength + 15, 60);
  output += "=".repeat(titleWidth) + "\n\n";

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
  for (let row = 0; row < chartHeight; row++) {
    const yValue = maxValue - (row / chartHeight) * maxValue;
    const yLabel = yValue.toFixed(0).padStart(yAxisWidth - 1);
    output += `${yLabel}│`;
    for (let col = 0; col < chartWidth; col++) {
      output += chart[row][col];
    }
    output += "\n";
  }

  // X-axis
  output += " ".repeat(yAxisWidth) + "└";
  output += "─".repeat(chartWidth) + "\n";

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

  output += labelLine.join("") + "\n\n";

  // Values
  data.forEach(({ label, value }) => {
    output += `${label}: ${value}\n`;
  });

  return output;
}

function generatePieChart(
  data: Array<{ label: string; value: number }>,
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
  ]
): string {
  if (pieChars.length === 0) {
    return "Error: At least one character is required for pie chart.";
  }
  if (pieChars.length < data.length) {
    return `Error: Please select at least ${data.length} character${data.length > 1 ? "s" : ""} for ${data.length} data point${data.length > 1 ? "s" : ""}. You have ${pieChars.length} selected.`;
  }
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const maxLabelLength = Math.max(...data.map((d) => d.label.length), 20);
  const pieSize = 24;

  let output = "";

  // Title
  output += "Pie Chart\n";
  output += "=".repeat(60) + "\n\n";

  // Calculate percentages
  const percentages = data.map((d) => ({
    label: d.label,
    value: d.value,
    percentage: (d.value / total) * 100,
  }));

  // Use provided characters, or cycle through if more data points than characters
  const chars = pieChars.length > 0 ? pieChars : ["█"];

  output += "Legend:\n";
  percentages.forEach((item, index) => {
    const char = chars[index % chars.length];
    const padding = " ".repeat(maxLabelLength - item.label.length);
    const valueStr = Number.isInteger(item.value)
      ? item.value.toString()
      : item.value.toFixed(1);
    output += `${char} ${item.label}${padding} ${valueStr} (${item.percentage.toFixed(1)}%)\n`;
  });

  output += "\nVisual Representation:\n\n";

  // Create a pie visualization
  // Account for monospace font aspect ratio (characters are taller than wide)
  // Typical ratio is about 2:1 (height:width), so we use 2.0 as aspect ratio
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

        output += chars[charIndex % chars.length];
      } else {
        output += NBSP;
      }
    }
    output += "\n";
  }

  return output;
}
