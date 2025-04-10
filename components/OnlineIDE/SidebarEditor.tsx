import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { LanguageSidebar } from './language-sidebar';
import { CodeEditor } from './code-editor';
import { LanguageCode, ProjectData } from '@/types/ide';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated imports for App Router
import ActionCell from './ActionCell';
import SaveNameModal from './SaveNameModal';
import FileChangeWarnModal from './FileChangeWarnModal';
import Tools from './Tools';
import IconAltArrow from '../icons/IconAltArrow';
import ExampleModal from './ExampleModal';

type SidebarEditorProps = {
  onClear: () => void;
  selectedLanguage: LanguageCode;
  loading: boolean;
  isExecuting: boolean;
  setSelectedLanguage: Dispatch<SetStateAction<LanguageCode>>;
  run: () => void;
  setCode: Dispatch<SetStateAction<string>>;
  code: string;
  setProjectData: Dispatch<SetStateAction<ProjectData | null>>;
  projectData: ProjectData | null;
  stopExecution: () => void;
};

const SidebarEditor = ({ isExecuting, loading, selectedLanguage, setSelectedLanguage, run, setCode, code, projectData, setProjectData, stopExecution, onClear }: SidebarEditorProps) => {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isExampleModalOpen, setExampleModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [projectName, setProjectName] = useState('');

  const openProjectsModal = () => setIsListModalOpen(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (id || projectData) {
          setIsProjectsOpen(false);
        } else {
          setIsNameModalOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, id, projectData]);

  useEffect(() => {
    if (projectData) setProjectName(projectData?.project_name);
  }, [projectData]);

  const extension: Partial<Record<LanguageCode, string>> = {
    71: '.py', 72: '.py', 63: '.js', 74: '.ts', 2: '.cpp', 1: '.c', 68: '.php', 4: '.java',
  };

  return (
    <>
      <div className="bg-muted/50 flex h-14 w-full items-center justify-between border-b border-gray-500/30 px-1 md:pl-2 md:pr-5">
        <div className="divide-x-1 flex items-center space-x-8">
          <a href="/">
            <div className="ml-2 pr-3.5 md:flex size-[45px] object-contain flex items-center justify-center">
              IDE
            </div>
          </a>
          <h1 className="hidden text-xl md:block">{projectData?.project_name || 'Untitled'}{extension[selectedLanguage]}</h1>
        </div>
        {/* <img src={"na"} className="ml-8 flex font-bold md:hidden" width={100} alt="na" /> */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <Tools
            isProjectsOpen={isProjectsOpen}
            setIsProjectsOpen={setIsProjectsOpen}
            buttonRef={buttonRef}
            selectedLanguage={selectedLanguage}
            openProjectsModal={openProjectsModal}
            setCode={setCode}
            code={code}
            isNameModal={isNameModalOpen}
            setIsNameModal={setIsNameModalOpen}
            saveUpdateCode={() => {}}
            isWarningModalOpen={isWarningModalOpen}
            setIsWarningModalOpen={setIsWarningModalOpen}
            isExampleModalOpen={isExampleModalOpen}
            setExampleModalOpen={setExampleModalOpen}
          />
          <button
            ref={buttonRef}
            onClick={(e) => { e.stopPropagation(); setIsProjectsOpen((prev) => !prev); }}
            className="relative flex h-8 w-20 items-center justify-center gap-2 rounded-md border border-[#264893] px-2 text-[#264893] hover:text-[#264893]/80 xl:hidden"
          >
            File
            <span className={`${isProjectsOpen ? '-rotate-90' : 'rotate-90'}`}>
              <IconAltArrow stroke="#264893" fill="#FAFAFA" className="w-4" />
            </span>
            <ActionCell
              isProjectsOpen={isProjectsOpen}
              setIsProjectsOpen={setIsProjectsOpen}
              buttonRef={buttonRef}
              selectedLanguage={selectedLanguage}
              openProjectsModal={openProjectsModal}
              setCode={setCode}
              code={code}
              isNameModal={isNameModalOpen}
              setIsNameModal={setIsNameModalOpen}
              saveUpdateCode={() => {}}
              isWarningModalOpen={isWarningModalOpen}
              setIsWarningModalOpen={setIsWarningModalOpen}
              isExampleModalOpen={isExampleModalOpen}
              setExampleModalOpen={setExampleModalOpen}
            />
          </button>
          <button
            className="flex w-16 h-9 items-center justify-center gap-1 rounded-md bg-[#264893] py-2 text-white hover:bg-[#264893]/80"
            disabled={isExecuting}
            onClick={run}
          >
            {isExecuting ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : 'Run'}
          </button>
          {isExecuting && (
            <button
              className="flex w-16 h-9 items-center justify-center gap-1 rounded-md bg-red-600 py-2 text-white hover:bg-red-700"
              onClick={stopExecution}
            >
              Stop
            </button>
          )}
        </div>
      </div>
      <div className="flex h-full w-full">
        <LanguageSidebar 
          onClear={onClear}
          selectedLanguage={selectedLanguage} 
          onLanguageSelect={setSelectedLanguage} 
          isWarningModalOpen={isWarningModalOpen} 
          setIsWarningModalOpen={setIsWarningModalOpen} 
        />
        <CodeEditor 
          loading={loading} 
          language={selectedLanguage} 
          onRunCode={run} 
          setCode={setCode} 
          code={code} 
        />
      </div>
      {isExampleModalOpen && (
        <ExampleModal 
          setCode={setCode} 
          isOpen={isExampleModalOpen} 
          setIsOpen={setExampleModalOpen} 
          selectedLanguage={selectedLanguage} 
        />
      )}
      {isNameModalOpen && (
        <SaveNameModal 
          isOpen={isNameModalOpen} 
          setIsOpen={setIsNameModalOpen} 
          onSave={() => {}} 
          setProjectName={setProjectName} 
          projectName={projectName} 
        />
      )}
      {isWarningModalOpen && (
        <FileChangeWarnModal 
          isOpen={isWarningModalOpen} 
          setIsOpen={setIsWarningModalOpen} 
          selectedLanguage={selectedLanguage} 
        />
      )}
    </>
  );
};

export default SidebarEditor;