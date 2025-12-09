"use client";

import { useState } from "react";
import CSVInput from "@/components/CSVInput";
import GraphDisplay from "@/components/GraphDisplay";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Multiselect } from "@/components/ui/multiselect";
import {
  useLocalStorageString,
  useLocalStorageJSON,
} from "@/hooks/useLocalStorage";
import { GraphType, GraphDataPoint } from "@/types/graph";
import { ASCII_CHARS } from "@/constants/ascii";

export default function Home() {
  const [csvData, setCsvData] = useState<string>(`Role,	Analogy
External,	14
Internal,	23
Cop, 17
Elevato, 9
Boom, 4
Blast, 20
Carps, 7`);
  const [graphType, setGraphType] = useState<GraphType>("bar");
  const [parsedData, setParsedData] = useState<GraphDataPoint[]>([]);

  // Use React 19 best practices with useSyncExternalStore for localStorage
  const [backgroundColor, setBackgroundColor] = useLocalStorageString(
    "graphBackgroundColor",
    "#1e293b"
  );
  const [textColor, setTextColor] = useLocalStorageString(
    "graphTextColor",
    "#4ade80"
  );

  // Character sets for different graph types
  const [barChar, setBarChar] = useLocalStorageString("barChar", "█");

  // Validate that areaChars is always a tuple of exactly 2 strings
  const [areaChars, setAreaChars] = useLocalStorageJSON<[string, string]>(
    "areaChars",
    ["█", "▓"],
    (value): value is [string, string] =>
      Array.isArray(value) &&
      value.length === 2 &&
      typeof value[0] === "string" &&
      typeof value[1] === "string"
  );

  const [pieChars, setPieChars] = useLocalStorageJSON<string[]>("pieChars", [
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
  ]);

  const handleCSVProcess = (data: GraphDataPoint[]) => {
    setParsedData(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">ASCII Graphs</h1>
        <p className="text-slate-600 mb-8">
          Convert your CSV data into beautiful ASCII graphs
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <CSVInput
              onDataProcessed={handleCSVProcess}
              csvData={csvData}
              setCsvData={setCsvData}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Graph Type
              </Label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setGraphType("bar")}
                  variant={graphType === "bar" ? "default" : "outline"}
                  size="sm"
                >
                  Bar Graph
                </Button>
                <Button
                  onClick={() => setGraphType("verticalBar")}
                  variant={graphType === "verticalBar" ? "default" : "outline"}
                  size="sm"
                >
                  Vertical Bar
                </Button>
                <Button
                  onClick={() => setGraphType("area")}
                  variant={graphType === "area" ? "default" : "outline"}
                  size="sm"
                >
                  Area Chart
                </Button>
                <Button
                  onClick={() => setGraphType("pie")}
                  variant={graphType === "pie" ? "default" : "outline"}
                  size="sm"
                >
                  Pie Chart
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Characters
              </Label>
              {(graphType === "bar" || graphType === "verticalBar") && (
                <div className="mb-3">
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Bar Character <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Select value={barChar || ""} onValueChange={setBarChar}>
                        <SelectTrigger
                          className={`font-mono ${
                            !barChar ? "border-red-300 bg-red-50" : ""
                          }`}
                        >
                          <SelectValue placeholder="Select character" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASCII_CHARS.map((char) => (
                            <SelectItem key={char} value={char}>
                              {char}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!barChar && (
                        <p className="text-xs text-red-500 mt-1">
                          Input is required
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => setBarChar("█")}
                      variant="outline"
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              )}
              {graphType === "area" && (
                <div className="mb-3">
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Area Characters (Line, Fill){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-slate-500 mb-1 block">
                          Line Character
                        </Label>
                        <Select
                          value={areaChars[0] || ""}
                          onValueChange={(value) =>
                            setAreaChars([value, areaChars[1]])
                          }
                        >
                          <SelectTrigger
                            className={`font-mono ${
                              !areaChars[0] ? "border-red-300 bg-red-50" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select character" />
                          </SelectTrigger>
                          <SelectContent>
                            {ASCII_CHARS.map((char) => (
                              <SelectItem key={char} value={char}>
                                {char}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!areaChars[0] && (
                          <p className="text-xs text-red-500 mt-1">
                            Input is required
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label className="text-xs text-slate-500 mb-1 block">
                          Fill Character
                        </Label>
                        <Select
                          value={areaChars[1] || ""}
                          onValueChange={(value) =>
                            setAreaChars([areaChars[0], value])
                          }
                        >
                          <SelectTrigger
                            className={`font-mono ${
                              !areaChars[1] ? "border-red-300 bg-red-50" : ""
                            }`}
                          >
                            <SelectValue placeholder="Select character" />
                          </SelectTrigger>
                          <SelectContent>
                            {ASCII_CHARS.map((char) => (
                              <SelectItem key={char} value={char}>
                                {char}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!areaChars[1] && (
                          <p className="text-xs text-red-500 mt-1">
                            Input is required
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => setAreaChars(["█", "▓"])}
                      variant="outline"
                      size="sm"
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              )}
              {graphType === "pie" && (
                <div className="mb-3">
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Pie Slice Characters <span className="text-red-500">*</span>{" "}
                    (Select multiple)
                  </Label>
                  <div className="flex flex-col gap-2">
                    <Multiselect
                      options={ASCII_CHARS}
                      selected={pieChars}
                      onSelectionChange={setPieChars}
                      placeholder="Select characters..."
                      error={
                        parsedData.length > 0 &&
                        pieChars.length < parsedData.length
                      }
                    />
                    {parsedData.length > 0 &&
                      pieChars.length < parsedData.length && (
                        <p className="text-xs text-red-500">
                          Please select at least {parsedData.length} character
                          {parsedData.length > 1 ? "s" : ""} (you have{" "}
                          {pieChars.length} selected, need {parsedData.length})
                        </p>
                      )}
                    {pieChars.length === 0 && (
                      <p className="text-xs text-red-500">
                        Please select at least one character
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 items-center">
                      <span className="text-xs text-slate-500">Presets:</span>
                      {[
                        "█,▓,▒,░,▄,▀",
                        "■,□,▪,▫,●,○",
                        "#,*,+,.,-,=",
                        "1,2,3,4,5,6",
                      ].map((preset) => (
                        <Button
                          key={preset}
                          onClick={() => setPieChars(preset.split(","))}
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs"
                        >
                          {preset}
                        </Button>
                      ))}
                    </div>
                    <Button
                      onClick={() =>
                        setPieChars([
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
                        ])
                      }
                      variant="outline"
                      size="sm"
                      className="self-start"
                    >
                      Reset to Default
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Colors
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Background
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#1e293b"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">
                    Text
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-12 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 font-mono"
                      placeholder="#4ade80"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  onClick={() => {
                    setBackgroundColor("#1e293b");
                    setTextColor("#4ade80");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Reset to Default
                </Button>
                <Button
                  onClick={() => {
                    setBackgroundColor("#000000");
                    setTextColor("#00ff00");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Classic Terminal
                </Button>
                <Button
                  onClick={() => {
                    setBackgroundColor("#0f172a");
                    setTextColor("#60a5fa");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Blue Theme
                </Button>
                <Button
                  onClick={() => {
                    setBackgroundColor("#ffffff");
                    setTextColor("#000000");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Black-n-White
                </Button>
              </div>
            </div>

            <GraphDisplay
              data={parsedData}
              graphType={graphType}
              backgroundColor={backgroundColor}
              textColor={textColor}
              barChar={barChar}
              areaChars={areaChars}
              pieChars={pieChars}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
