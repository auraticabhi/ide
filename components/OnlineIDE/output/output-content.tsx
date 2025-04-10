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
}

export function OutputContent({ content, outputRef, handleInlineInput, inputPrompt, selectedLanguage }: OutputContentProps) {
  const showInput = [0, 1, 2, 4, 63, 68, 71, 74].includes(selectedLanguage);

  useEffect(() => {
    if (inputPrompt && outputRef.current) {
      const inputElement = outputRef.current.querySelector('input[name="inline-input"]');
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [inputPrompt, outputRef]);

  return (
    <div className="h-[calc(100%-3.5rem)] overflow-y-auto scrollbar-custom">
      {showInput ? (
        <pre ref={outputRef} className="whitespace-pre-wrap break-words p-4 font-mono text-sm">
          {content}
          {inputPrompt && (
            <form onSubmit={handleInlineInput} className="mt-1 flex flex-wrap items-start justify-start">
              <input
                name="inline-input"
                type="text"
                id="inline-input"
                className="border-none bg-transparent py-0 text-black focus:outline-none w-full"
                autoFocus
                placeholder={"input"}
              />
            </form>
          )}
        </pre>
      ) : (
        <pre ref={outputRef} className="whitespace-pre-wrap break-words p-4 text-sm" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
}