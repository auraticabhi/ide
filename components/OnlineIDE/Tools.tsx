'use client';
import { LanguageCode } from '@/types/ide';
import { useRouter, useSearchParams } from 'next/navigation'; // Updated imports for App Router
import { Dispatch, SetStateAction, Suspense, useEffect, useRef, useState } from 'react';
import IconPlus from '../icons/IconPlus';
import IconSave from '../icons/IconSave';
import IconList from '../icons/IconList';
import IconHelpCircle from '../icons/IconHelpCircle';

type ActionCellProps = {
    isProjectsOpen: boolean;
    setIsProjectsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isExampleModalOpen: boolean;
    setExampleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
    selectedLanguage: LanguageCode;
    openProjectsModal: () => void;
    setCode: Dispatch<SetStateAction<string>>;
    code: string;
    isNameModal: boolean;
    setIsNameModal: React.Dispatch<React.SetStateAction<boolean>>;
    isWarningModalOpen: boolean;
    setIsWarningModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    saveUpdateCode: () => void;
};

const Tools: React.FC<ActionCellProps> = ({ 
    isExampleModalOpen, 
    setExampleModalOpen, 
    isProjectsOpen, 
    setIsProjectsOpen, 
    buttonRef, 
    selectedLanguage, 
    openProjectsModal, 
    setCode, 
    code, 
    isNameModal, 
    setIsNameModal, 
    saveUpdateCode, 
    isWarningModalOpen, 
    setIsWarningModalOpen 
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    return (
        <Suspense fallback={<div>Loading IDE...</div>}>
        <div className='hidden xl:flex gap-2 justify-center items-center'>
            {selectedLanguage === 72 && (
                <button 
                    className="w-20 py-2 font-medium hover:bg-gray-100 border flex px-2 justify-center items-center gap-2 rounded-lg" 
                    onClick={() => setExampleModalOpen(true)}
                >
                    <IconHelpCircle className='w-4' />
                    Help
                </button>
            )}
            <button
                className="w-20 py-2 font-medium hover:bg-gray-100 border flex px-2 justify-center items-center gap-2 rounded-lg"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsProjectsOpen(false);
                    if (localStorage.getItem('cjr-ide')) {
                        setIsWarningModalOpen(true);
                    } else {
                        router.push(`/virtual_labs/ide/?lang=${selectedLanguage}`);
                    }
                }}
            >
                <IconPlus className='w-4' />
                New
            </button>
            <button
                className="w-24 py-2 font-medium hover:bg-gray-100 border flex px-2 justify-center items-center gap-2 rounded-lg"
                onClick={(e) => {
                    e.stopPropagation();
                    if (id) {
                        saveUpdateCode();
                        setIsProjectsOpen(false);
                    } else {
                        setIsNameModal(true);
                    }
                }}
            >
                <IconSave className='w-4' />
                {id ? 'Update' : 'Save'}
            </button>
            <button 
                className="w-20 py-2 font-medium hover:bg-gray-100 border flex px-2 justify-center items-center gap-2 rounded-lg" 
                onClick={openProjectsModal}
            >
                <IconList className='w-4' />
                List
            </button>
        </div>
        </Suspense>
    );
};

export default Tools;