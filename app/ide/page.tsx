'use client';
import { OutputPanel } from '@/components/OnlineIDE/output-panel';
import { InputPanel } from '@/components/OnlineIDE/input-panel';
import { showToast } from '@/components/ShowToast';
import { LanguageCode, ProjectData } from '@/types/ide';
import { RefObject, SetStateAction, Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarEditor from '@/components/OnlineIDE/SidebarEditor';

const MESSAGE_TYPE = {
  CODE: 'CODE:',
  EXEC_TERMINATED: 'EXEC_TERMINATED',
  EXEC_TIMEOUT: 'EXEC_TIMEOUT',
  CONTAINER_ID: 'container_id:',
  ERROR: 'error:',
  STOP: 'STOP',
};

const languageMap = {
  1: { socketType: 'c', name: 'C' },
  2: { socketType: 'cpp', name: 'C++' },
  4: { socketType: 'java', name: 'Java' },
  68: { socketType: 'php', name: 'PHP' },
  63: { socketType: 'js', name: 'Javascript' },
  74: { socketType: 'ts', name: 'Typescript' },
  71: { socketType: 'py', name: 'Python' },
  72: { socketType: 'py-ml', name: 'Python ML' },
};

const defaultCode = {
  71: '# Write your Python code here\nprint("Hello World")',
  0: '',
  72: '# Write your Python code here\nprint("Hello World")',
  63: '// Write your JavaScript code here\nconsole.log("Hello, Hello World!");',
  74: '// Write your Typescript code here\nconsole.log("Hello, Hello World!");',
  2: '#include <iostream>\n\nint main() {\n    std::cout << "Hello Everyone" << std::endl;\n    return 0;\n}',
  1: '#include <stdio.h>\n\nint main() {\n    printf("Hello Everyone\\n");\n    return 0;\n}',
  68: '<?php\n\necho "Hello Everyone";\n?>',
  4: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Everyone\");\n    }\n}"
};

export default function Home() {

  let url = "ws://216.48.180.96:8888/ws/v1/compiler1"; //in env

  const [inputValues, setInputValues] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [resolveInput, setResolveInput] = useState<((value: string) => void) | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cppSocket, setCppSocket] = useState<WebSocket | null>(null);
  const [isCppConnected, setIsCppConnected] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(0);
  const [containerId, setContainerId] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [executionCount, setExecutionCount] = useState(0);
  const [code, setCode] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const outputRef = useRef(null) as unknown as RefObject<HTMLPreElement>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanOutput = (text: string) => {
    return text
      .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
      .trim();
  };

  const addMessage = (text: string) => {
    const cleanedText = cleanOutput(text);
    if (cleanedText) {
      setOutput((prev) => prev + cleanedText + '\n');
    }
  };

  const cleanupWebSocket = () => {
    if (cppSocket && cppSocket.readyState === WebSocket.OPEN) {
      cppSocket.close();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCppSocket(null);
    setIsCppConnected(false);
    setIsExecuting(false);
    setContainerId(null);
    setExecutionTime(0);
  };

  const connectWebSocket = (language: string) => {
    cleanupWebSocket();
    addMessage(`Connecting to server (${languageMap[selectedLanguage as keyof typeof languageMap]?.name}) to execute code.`);

    const wsUrl = `${url}/?language=${language}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsCppConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith(MESSAGE_TYPE.CONTAINER_ID)) {
        const id = message.replace(MESSAGE_TYPE.CONTAINER_ID, '');
        setContainerId(id);
        addMessage("Ready!");
      } else if (message.startsWith(MESSAGE_TYPE.ERROR)) {
        addMessage(message);
        stopExecution();
      } else if (message === MESSAGE_TYPE.EXEC_TERMINATED) {
        addMessage(`Program execution completed, Time: ${formatTime(executionTime)}`);
        stopExecution();
      } else if (message === MESSAGE_TYPE.EXEC_TIMEOUT) {
        addMessage('Program execution timed out');
        stopExecution();
      } else {
        const isInputPrompt = message.includes(':') || message.includes('?') || message.toLowerCase().includes('enter');
        if (isInputPrompt) {
          setOutput((prev) => prev + message.trimEnd());
          setInputPrompt(message.trim());
          setResolveInput(() => (inputValue: string) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(inputValue + '\n');
              addMessage(inputValue);
              setInputPrompt(null);
              setResolveInput(null);
            }
          });
        } else {
          addMessage(message);
        }
      }
    };

    ws.onerror = (error) => {
      const errorMsg = `Error: ${error}`;
      console.error(errorMsg);
      addMessage(errorMsg);
      stopExecution();
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      //addMessage('Disconnected');
      stopExecution();
    };

    setCppSocket(ws);
  };

  const startExecution = () => {
    setIsExecuting(true);
    setExecutionCount((prev) => prev + 1);
    addMessage(`Executing ${languageMap[selectedLanguage as keyof typeof languageMap]?.name} code...`);
    setExecutionTime(0);
    timerRef.current = setInterval(() => {
      setExecutionTime((prev) => prev + 1);
    }, 1000);
  };

  const stopExecution = () => {
    if (isExecuting && cppSocket && cppSocket.readyState === WebSocket.OPEN) {
      cppSocket.send(MESSAGE_TYPE.STOP);
      console.log('Sent STOP command');
    }
    setIsExecuting(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (isClient && selectedLanguage !== 0) {
      const langConfig = languageMap[selectedLanguage as keyof typeof languageMap];
      if (langConfig) {
        connectWebSocket(langConfig.socketType);
      }
    }
    return cleanupWebSocket;
  }, [isClient, selectedLanguage]);

  useEffect(() => {
    setIsClient(true);
    const lang = searchParams.get('lang');
    if (lang) {
      const langCode = Number(lang) as LanguageCode;
      setSelectedLanguage(langCode);
      setCode(defaultCode[langCode] || '');
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, inputPrompt]);

  const socketRun = () => {
    if (!cppSocket || cppSocket.readyState !== WebSocket.OPEN) {
      addMessage('Not connected to server');
      return;
    }
    if (!code.trim()) {
      addMessage('Please enter some code');
      return;
    }
    startExecution();
    cppSocket.send(`${MESSAGE_TYPE.CODE}${code}`);
    console.log('Sent code:', `${MESSAGE_TYPE.CODE}${code}`);
  };

  const run = () => {
    const langConfig = languageMap[selectedLanguage as keyof typeof languageMap];
    if (langConfig) {
      if ([1, 2, 4, 63, 68, 71, 74].includes(selectedLanguage)) {
        socketRun();
      } else if (selectedLanguage === 72) {
        pythonMLRun();
      } else {
        showToast('danger', 'Unsupported language');
      }
    } else {
      showToast('danger', 'Please select a valid language');
    }
  };

  const pythonMLRun = async () => {
    setIsExecuting(true);
    addMessage('Python ML execution not fully implemented');
    setTimeout(() => setIsExecuting(false), 1000);
  };

  const handleInlineInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolveInput) {
      const inputElement = (e.target as HTMLFormElement).elements.namedItem('inline-input') as HTMLInputElement;
      resolveInput(inputElement.value);
      inputElement.value = '';
    }
  };

  const showInput = [0, 1, 2, 4, 63, 68, 71, 74].includes(selectedLanguage);

  if (!isClient) return null;

  return (
    <Suspense fallback={<div>Loading IDE...</div>}>
    <div className="min-h-screen w-full">
      <div className="flex h-screen flex-col divide-gray-500/30 overflow-hidden md:flex-row">
        <div className="h-[40vh] w-full flex-shrink-0 md:h-full md:w-[69.7%]">
          <SidebarEditor
            onClear={() => setOutput('')}
            isExecuting={isExecuting}
            loading={loading}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            run={run}
            setCode={setCode}
            code={code}
            projectData={projectData}
            setProjectData={setProjectData}
            stopExecution={stopExecution}
          />
        </div>
        <div className="resizer !bg-gray-500/30" id="dragMe"></div>
        <div className="flex h-[60vh] w-full flex-shrink-0 flex-col md:h-full md:w-[30%]">
          {!showInput && <InputPanel inputValues={inputValues} setInputValues={setInputValues} selectedLanguage={selectedLanguage} />}
          <OutputPanel
            output={output}
            onClear={() => setOutput('')}
            outputRef={outputRef}
            handleInlineInput={handleInlineInput}
            inputPrompt={inputPrompt}
            selectedLanguage={selectedLanguage}
            isExecuting={isExecuting}
            executionTime={executionTime}
            executionCount={executionCount}
            formatTime={formatTime}
            stopExecution={stopExecution}
          />
        </div>
      </div>
    </div>
  </Suspense>
  );
}