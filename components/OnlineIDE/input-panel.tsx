"use client";

import { OutputHeader } from "./output/output-header";
import { OutputContent } from "./output/output-content";
import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { LanguageCode } from "@/types/ide";
import { ScrollArea, Tooltip } from "@mantine/core";
import IconArrowDownward from "../icons/IconArrowDownward";

interface OutputPanelProps {
  inputValues: string;
  setInputValues: Dispatch<SetStateAction<string>>;
  selectedLanguage: LanguageCode;
}

export function InputPanel({ inputValues, setInputValues, selectedLanguage }: OutputPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className={`w-full min-h-[55px]  overflow-hidden border-t  bg-muted/50`}>
      <div className="bg-muted/50 flex items-center  justify-between px-3 h-[55px] border-b border-gray-500/30 bg-muted w-screen md:w-full">
        <h2 className="text-sm font-semibold">Input</h2>
        <div className="flex gap-2 items-center justify-center">
          <Tooltip label={`${isOpen ? 'Close' : 'Open'}`}>
            <button
              className="h-8 px-2 hover:bg-gray-500/10 border border-gray-500/80 rounded-md text-gray-500/90"
              onClick={() => setIsOpen(prev => !prev)}
            >
              <IconArrowDownward fill="#6b7280"  className={`${isOpen ? 'rotate-180' : 'rotate-0'} opacity-90 transition-transform duration-500 ease-out`} />
            </button>
          </Tooltip>
          <Tooltip label={"Clear Input"}>
            <button
              className="h-8 w-16 hover:bg-gray-500/10 border border-gray-500/80 rounded-md text-gray-500/90"
              onClick={() => setInputValues("")}
            >
              Clear
            </button>
          </Tooltip>
        </div>
      </div>
      <div 
        className={`
          overflow-hidden
          transition-[height,opacity,transform] 
          duration-500
          ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isOpen ? 'h-[200px] opacity-100' : 'h-0 opacity-0'} 
        `}
      >
        <div 
          className={`
            mt-4 
            px-2 
            w-full
            transition-transform
            duration-500
            ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isOpen ? 'translate-y-1' : '-translate-y-1'}
          `}
        >
          <textarea
            name="editor"
            id="editor"
            className="bg-transparent text-black border-none w-full focus:outline-none py-2 resize-none max-h-[calc(10vh)] md:max-h-[calc(20vh-2rem)] hidescrollbar"
            value={inputValues}
            onChange={(e) => setInputValues(e.target.value)}
            rows={10}
            placeholder="Enter input values here..."
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}