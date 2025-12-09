"use client";

import { useState, useEffect } from "react";
import { CSVInputProps } from "@/types/csv";
import { parseCSV } from "@/lib/csv/parser";

export default function CSVInput({
  onDataProcessed,
  csvData,
  setCsvData,
}: CSVInputProps) {
  const [error, setError] = useState<string>("");

  const handleProcess = () => {
    try {
      setError("");
      if (!csvData.trim()) {
        setError("Please enter CSV data");
        return;
      }

      const parsed = parseCSV(csvData);
      if (parsed.length === 0) {
        setError("No valid data found in CSV");
        return;
      }

      // Store in localStorage (temp storage)
      localStorage.setItem("csvData", csvData);
      localStorage.setItem("parsedData", JSON.stringify(parsed));

      onDataProcessed(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error parsing CSV");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvData(text);
    };
    reader.readAsText(file);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("csvData");
    if (saved) {
      setCsvData(saved);
      const parsed = localStorage.getItem("parsedData");
      if (parsed) {
        try {
          onDataProcessed(JSON.parse(parsed));
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">CSV Input</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Upload CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Or Paste CSV Data
        </label>
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder="Label,Value&#10;Apple,25&#10;Banana,30&#10;Orange,20"
          className="w-full h-48 p-3 border border-slate-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-slate-500 mt-1">
          Format: Label,Value (one per line)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleProcess}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        Process CSV
      </button>
    </div>
  );
}
