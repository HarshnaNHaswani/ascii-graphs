"use client";

import { useState, useMemo } from "react";
import { GraphDisplayProps } from "@/types/graph";
import {
  generateBarGraph,
  generateVerticalBarChart,
  generateAreaChart,
  generatePieChart,
} from "@/lib/graphs/generators";

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

  const graphOutput = useMemo(() => {
    if (data.length === 0) {
      return "No data to display. Please upload CSV data first.";
    }

    let output = "";
    switch (graphType) {
      case "bar":
        output = generateBarGraph(data, barChar, backgroundColor, textColor);
        break;
      case "verticalBar":
        output = generateVerticalBarChart(
          data,
          barChar,
          backgroundColor,
          textColor
        );
        break;
      case "area":
        output = generateAreaChart(data, areaChars, backgroundColor, textColor);
        break;
      case "pie":
        output = generatePieChart(data, pieChars, backgroundColor, textColor);
        break;
      default:
        output = "";
    }
    return output;
  }, [
    data,
    graphType,
    barChar,
    areaChars,
    pieChars,
    backgroundColor,
    textColor,
  ]);

  const copyToClipboard = async (content: string) => {
    // Content is already HTML, so we can use it directly
    const htmlContent = content;

    // Extract plain text version for fallback
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

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
    <div className="min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
          Graph Display
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
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
        className="p-3 sm:p-6 rounded-md overflow-x-auto -mx-2 sm:mx-0"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
        }}
      >
        <div
          className="font-mono text-xs sm:text-sm min-w-max"
          dangerouslySetInnerHTML={{ __html: graphOutput }}
        />
      </div>
    </div>
  );
}
