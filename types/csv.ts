import { GraphDataPoint } from "./graph";

export interface CSVInputProps {
  onDataProcessed: (data: GraphDataPoint[]) => void;
  csvData: string;
  setCsvData: (data: string) => void;
}
