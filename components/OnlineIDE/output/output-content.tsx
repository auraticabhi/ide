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
        <form onSubmit={handleInputSubmit} className="p-2 border-t border-gray-500/30">
          <div className="flex gap-2">
            <input
              name="program-input"
              type="text"
              id="program-input"
              className="flex-grow border-none bg-transparent py-1 text-black focus:outline-none"
              autoFocus
              placeholder="Enter input for the program..."
              onKeyDown={handleKeyPress}
            />
            <button
              type="submit"
              className="px-2 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}