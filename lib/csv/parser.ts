import { GraphDataPoint } from "@/types/graph";

export function parseCSV(text: string): GraphDataPoint[] {
  const lines = text.trim().split("\n");
  if (lines.length === 0) return [];

  // Try to detect if first line is header
  const startIndex =
    lines[0].includes(",") && isNaN(parseFloat(lines[0].split(",")[1])) ? 1 : 0;

  const data: GraphDataPoint[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 2) continue;

    const label = parts[0];
    const value = parseFloat(parts[1]);

    if (isNaN(value)) {
      throw new Error(`Invalid number in row ${i + 1}: ${parts[1]}`);
    }

    data.push({ label, value });
  }

  return data;
}
