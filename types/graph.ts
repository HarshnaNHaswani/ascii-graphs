export type GraphType = "bar" | "verticalBar" | "area" | "pie";

export interface GraphDataPoint {
  label: string;
  value: number;
}

export interface GraphDisplayProps {
  data: GraphDataPoint[];
  graphType: GraphType;
  backgroundColor?: string;
  textColor?: string;
  barChar?: string;
  areaChars?: [string, string];
  pieChars?: string[];
}
