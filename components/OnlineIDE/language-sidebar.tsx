"use client";
import { Tooltip, Button } from '@mantine/core';
import { Language, LanguageCode } from "@/types/ide";
import IconX from '../icons/IconX';
import IconMenu from '../icons/IconMenu';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated imports for App Router
import { useState, Fragment } from 'react';

interface LanguageSidebarProps {
  onClear: () => void;
  isWarningModalOpen: boolean;
  setIsWarningModalOpen: (isOpen: boolean) => void;
  selectedLanguage: LanguageCode;
  onLanguageSelect: (language: LanguageCode) => void;
}

const languages = [
  { id: 1 as LanguageCode, name: 'C', icon: '/assets/images/ide/c (2).png', status: true },
  { id: 2 as LanguageCode, name: 'C++', icon: '/assets/images/ide/cpp.svg', status: true },
  { id: 4 as LanguageCode, name: 'Java', icon: '/assets/images/ide/java2.svg', status: true },
  { id: 63 as LanguageCode, name: 'JavaScript', icon: '/assets/images/ide/javascript.svg', status: true },
  { id: 68 as LanguageCode, name: 'PHP', icon: '/assets/images/ide/php.svg', status: true },
  { id: 71 as LanguageCode, name: 'Python', icon: '/assets/images/ide/python.svg', status: true },
  { id: 72 as LanguageCode, name: 'Python ML', icon: '/assets/images/ide/ml.webp', status: true },
  { id: 74 as LanguageCode, name: 'TypeScript', icon: '/assets/images/ide/typescript.svg', status: true },
];

export function LanguageSidebar({
  onClear,
  selectedLanguage,
  onLanguageSelect,
  isWarningModalOpen,
  setIsWarningModalOpen,
}: LanguageSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [langToChange, setLangToChange] = useState<LanguageCode | null>(null);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const router = useRouter();

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className={`hidden md:flex flex-col items-center pr-1 py-4 gap-2 w-20 border-r bg-muted/50`}>
        {languages.map((lang) => {
          return lang.status && (
            <Tooltip label={lang.name} key={lang.name}>
              <button
                className={`py-1 w-16 border rounded-md hover:bg-gray-100 ${selectedLanguage === lang.id && "bg-gray-200 hover:bg-gray-300 rounded-md border border-[#264893]"}`}
                onClick={() => {
                  if (localStorage.getItem('cjr-ide')) {
                    setLangToChange(lang.id);
                    setIsOpen(true);
                  } else {
                    router.push(`/ide/?lang=${lang.id}`);
                    onClear();
                  }
                }}
              >
                <img src={lang.icon} className="size-8 mx-auto" alt={lang.name} />
                <span className="font-bold leading-none text-[10px] text-[#264893]">{lang.name}</span>
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* Toggle button for smaller screens */}
      <div className="md:hidden">
        <button
          className="fixed top-3 left-2 z-50"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? null : <IconMenu />}
        </button>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={toggleSidebar}
          />
        )}

        <div
          className={`fixed max-h-screen overflow-y-scroll top-0 left-0 h-full z-50 bg-[#FFFFFF] bg-muted/90 w-28 transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-end p-2">
            <button
              className="z-50 fixed right-2 top-2"
              onClick={toggleSidebar}
            >
              <IconX />
            </button>
          </div>

          <div className="flex flex-col items-center py-4 gap-4">
            {languages.map((lang) => {
              return lang.status && (
                <Tooltip label={lang.name} key={lang.name}>
                  <button
                    className={`py-1 w-16 border rounded-md ${selectedLanguage === lang.id && "bg-gray-200 hover:bg-gray-300 border border-[#264893]"}`}
                    onClick={() => {
                      if (localStorage.getItem('cjr-ide')) {
                        setLangToChange(lang.id);
                        setIsOpen(true);
                      } else {
                        router.push(`/ide/?lang=${lang.id}`);
                        onClear();
                      }
                      toggleSidebar();
                    }}
                  >
                    <img src={lang.icon} className="size-8 mx-auto" alt={lang.name} />
                    <span className="font-bold text-[10px] text-[#264893]">{lang.name}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
      {isOpen && langToChange && (
        <LanguageChangeModal 
          isOpen={isOpen} 
          setIsOpen={setIsOpen} 
          selectedLanguage={langToChange} 
          onLanguageSelect={onLanguageSelect} 
        />
      )}
    </>
  );
}

const LanguageChangeModal: React.FC<{
  isOpen: boolean;
  onLanguageSelect: (language: LanguageCode) => void;
  setIsOpen: (isOpen: boolean) => void;
  selectedLanguage: LanguageCode;
}> = ({ isOpen, setIsOpen, selectedLanguage, onLanguageSelect }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use useSearchParams for query params in App Router
  const id = searchParams.get('id'); // Access 'id' from query params

  return (
    <div onClick={() => setIsOpen(true)}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
          <Transition.Child 
            as={Fragment} 
            enter="ease-out duration-300" 
            enterFrom="opacity-0" 
            enterTo="opacity-100" 
            leave="ease-in duration-200" 
            leaveFrom="opacity-100" 
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] bg-[black]/60 px-4">
            <div className="flex min-h-screen items-start justify-center px-4">
              <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                  <h5 className="text-lg font-bold">Unsaved changes</h5>
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    className="text-white-dark hover:text-dark px-2"
                  >
                    <IconX />
                  </button>
                </div>
                <div className="p-5 w-full space-y-3">
                  <p>Unsaved changes will be lost. Are you sure you want to leave?</p>
                  <div className="pt-5 flex items-center gap-2 justify-end">
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        localStorage.removeItem('cjr-ide');
                        onLanguageSelect(selectedLanguage);
                        setIsOpen(false);
                        router.push(`/virtual_labs/ide/?lang=${selectedLanguage}`).then(() => window.location.reload());
                      }} 
                      className="bg-red-600 px-4 py-2 rounded-lg text-white"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                      }} 
                      type="button" 
                      className="bg-[#264893] px-5 py-2 rounded-lg text-white"
                    >
                      No
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};