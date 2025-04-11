'use client';

import { LanguageCode } from '@/types/ide';
import { ScrollArea } from '@mantine/core';
import { RefObject, useEffect } from 'react';

interface OutputContentProps {
  content: string;
  outputRef: RefObject<HTMLPreElement>;
  handleInlineInput: (e: React.FormEvent) => void;
  inputPrompt: string | null;
  selectedLanguage: LanguageCode;
  isExecuting: boolean;
  sendInput: (input: string) => void;
}

export function OutputContent({
  content,
  outputRef,
  handleInlineInput,
  inputPrompt,
  selectedLanguage,
  isExecuting,
  sendInput,
}: OutputContentProps) {
  const showInput = [0, 1, 2, 4, 63, 68, 71, 74].includes(selectedLanguage);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [content, outputRef]);

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = (e.target as HTMLFormElement).elements.namedItem('program-input') as HTMLInputElement;
    const value = inputElement.value.trim();
    if (value && sendInput) {
      sendInput(value);
      inputElement.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const inputElement = e.target as HTMLInputElement;
      const value = inputElement.value.trim();
      if (value && sendInput) {
        sendInput(value);
        inputElement.value = '';
      }
    }
  };

  return (
    <div className="h-[calc(100%-3.5rem)] flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto">
        <pre ref={outputRef} className="whitespace-pre-wrap break-words p-4 font-mono text-sm">
          {content}
        </pre>
      </div>
      {showInput && (isExecuting || inputPrompt) && (
        <form onSubmit={handleInputSubmit} className="p-2 border-t border-gray-500/30 bg-gray-100/50 backdrop-blur-sm">
          <div className="flex gap-2 items-center">
            {/* {inputPrompt && <span className="text-gray-700 text-sm">{inputPrompt}</span>} */}
            <input
              name="program-input"
              type="text"
              id="program-input"
              className="flex-grow border border-blue-400 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
              autoFocus
              placeholder="Enter input here..."
              onKeyDown={handleKeyPress}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}