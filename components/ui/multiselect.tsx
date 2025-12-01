"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface MultiselectProps {
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function Multiselect({
  options,
  selected,
  onSelectionChange,
  placeholder = "Select items...",
  className,
  error = false,
}: MultiselectProps) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onSelectionChange(newSelected);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-mono",
            error && "border-red-300 bg-red-50",
            className
          )}
        >
          <span className="truncate">
            {selected.length === 0
              ? placeholder
              : selected.length === 1
                ? selected[0]
                : `${selected.length} selected`}
          </span>
          <div className="flex items-center gap-1">
            {selected.length > 0 && (
              <X
                className="h-4 w-4 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <div className="max-h-[300px] overflow-y-auto p-1">
          {options.map((option) => (
            <div
              key={option}
              className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(option);
              }}
            >
              <Checkbox
                checked={selected.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange([...selected, option]);
                  } else {
                    onSelectionChange(
                      selected.filter((item) => item !== option)
                    );
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <label className="flex-1 cursor-pointer font-mono text-sm">
                {option}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
