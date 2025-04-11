"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { java } from "@codemirror/lang-java";
// import { cpp } from "@codemirror/lang-cpp";
// import { php } from "@codemirror/lang-php";
// import { rust } from "@codemirror/lang-rust";
import { githubLight } from "@uiw/codemirror-theme-github";
import { debounce } from "lodash";
import { LanguageCode } from "@/types/ide";
import IconPlus from "../icons/IconPlus";
import IconMinus from "../icons/IconMinus";
import CodeEditorShimmer from "./CodeShimmer";

interface CodeEditorProps {
  loading : boolean;
  language: LanguageCode;
  onRunCode: () => void;
  setCode : Dispatch<SetStateAction<string>>;
  code : string;
}

const languageMap  : Partial<Record<LanguageCode,any>>= {
  71: python(),
  72: python(),
  63 : javascript(),
  74 : javascript({typescript : true}),
  2 : cpp(),
  68 : php(),
  4 : java(),
  1 : []

};

const defaultCode = {
  python: '# Write your Python code here\nprint("Coding Junior")',
  javascript:
    '// Write your JavaScript code here\nconsole.log("Hello, Coding Junior!");',
  typescript: '// Write your TypeScript code here\nconsole.log("Hi, World!");',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello Everyone" << std::endl;\n    return 0;\n}',
  php: '<?php\n//Write your PHP code here\necho "Hello, World!";',
  rust: 'fn main() {\n    println!("Hello, World!");\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  swift: 'print("Hello, World!")',
};

export function CodeEditor({ loading, language, onRunCode , setCode , code}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(18);
  // const [code, setCode] = useState(defaultCode['python']);
  const [executing, setExecuting] = useState(false);

  // useEffect(() => {
  //   setCode(defaultCode['python']);
  // }, [language]);

  const saveCode = (value : string) => {
    console.log("ola");

  }
  const debouncedSave = useCallback(
    debounce((value: string) => saveCode(value), 600),
    [] // Memoize the debounce function
  );

  const handleChange = (value: string) => {
    setCode(value);
    debouncedSave(value);
  };

  const handleRunCode = async () => {
    setExecuting(true);
    try {
      await onRunCode();
    } catch (error) {
      console.error("Error while running code:", error);
    } finally {
      setExecuting(false);
    }
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev+2,36));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 16));


  return (
      <div className="relative flex-1 overflow-hidden h-[calc(100%-3rem)] md:h-[calc(100vh-3.5rem)]">
        {loading && (
        <CodeEditorShimmer/>
      )}
        <CodeMirror
          value={code}
          height="100%"
          theme={githubLight}
          extensions={[language ? languageMap[language] : []]}
          onChange={handleChange}
          style={{ fontSize: `${fontSize}px` }}
          className="h-full max-w-full overflow-auto"
        />
        <div className="mb-4 absolute z-[10] bottom-0 right-2">
        <button
          onClick={decreaseFontSize}
          className="py-3 px-4 mr-2 text-xl bg-[#264893] hover:bg-[#264893]/80 text-white rounded"
        >
          <IconMinus />
        </button>
        <button
          onClick={increaseFontSize}
          className=" py-3 px-3 mr-2 text-xl bg-[#264893] hover:bg-[#264893]/80 text-white rounded"
        >
          <IconPlus />
        </button>

      </div>
      </div>
  );
}
