"use client";

import { Button, Tooltip } from "@mantine/core";

interface OutputHeaderProps {
  onClear: () => void;
  title: string;
  isExecuting: boolean;
  executionCount: number;
  executionTime: number;
  formatTime: (seconds: number) => string;
  stopExecution: () => void;
}

export function OutputHeader({
  onClear,
  title,
  isExecuting,
  executionCount,
  executionTime,
  formatTime,
  stopExecution,
}: OutputHeaderProps) {
  return (
    <div className="bg-muted/50 flex items-center justify-between border-b border-gray-500/30 w-screen md:w-full h-[55px] px-3">
      <h2 className="text-sm font-semibold">{title}</h2>
      <div className="flex items-center gap-2">
        {isExecuting && (
          <>
            {/* <span className="text-sm">Executing #{executionCount}</span> */}
            <span className="text-sm">Time: {formatTime(executionTime)}</span>
            <button
              className="h-8 w-16 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={stopExecution}
            >
              Stop
            </button>
          </>
        )}
        <Tooltip label={"Clear Output"}>
          <button
            className="h-8 w-16 hover:bg-gray-500/10 border border-gray-500/80 rounded-md text-gray-500/90"
            onClick={onClear}
          >
            Clear
          </button>
        </Tooltip>
      </div>
    </div>
  );
}