"use client";

import { OutputHeader } from "./output/output-header";
import { OutputContent } from "./output/output-content";
import { RefObject } from "react";
import { LanguageCode } from "@/types/ide";

interface OutputPanelProps {
  output: string;
  onClear: () => void;
  outputRef: RefObject<HTMLPreElement>;
  handleInlineInput: (e: React.FormEvent) => void;
  inputPrompt: string | null;
  selectedLanguage: LanguageCode;
  isExecuting: boolean;
  executionTime: number;
  executionCount: number;
  formatTime: (seconds: number) => string;
  stopExecution: () => void;
  sendInput: (input: string) => void;
}

const languageMap: Record<LanguageCode, { name: string }> = {
  1: { name: 'C' },
  2: { name: 'C++' },
  4: { name: 'Java' },
  68: { name: 'PHP' },
  63: { name: 'Javascript' },
  74: { name: 'Typescript' },
  71: { name: 'Python' },
  72: { name: 'Python ML' },
  0: { name: 'Unknown' },
};

export function OutputPanel({
  output,
  onClear,
  outputRef,
  handleInlineInput,
  inputPrompt,
  selectedLanguage,
  isExecuting,
  executionTime,
  executionCount,
  formatTime,
  stopExecution,
  sendInput,
}: OutputPanelProps) {
  const title = `Terminal (${languageMap[selectedLanguage]?.name || 'Unknown'})`;

  return (
    <div className="h-full w-full overflow-hidden border-t">
      <OutputHeader
        onClear={onClear}
        title={title}
        isExecuting={isExecuting}
        executionCount={executionCount}
        executionTime={executionTime}
        formatTime={formatTime}
        stopExecution={stopExecution}
      />
      <OutputContent
        content={output}
        outputRef={outputRef}
        handleInlineInput={handleInlineInput}
        inputPrompt={inputPrompt}
        selectedLanguage={selectedLanguage}
        isExecuting={isExecuting}
        sendInput={sendInput}
      />
    </div>
  );
}