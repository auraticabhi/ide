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
    isExampleModalOpen: boolean;
    setExampleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionCell: React.FC<ActionCellProps> = ({ 
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
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dialogRef.current && 
                !dialogRef.current.contains(event.target as Node) && 
                buttonRef.current && 
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsProjectsOpen(false);
            }
        };

        if (isProjectsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProjectsOpen, setIsProjectsOpen]);

    if (!isProjectsOpen) return null;

    return (
        isProjectsOpen && (
            <Suspense fallback={<div>Loading IDE...</div>}>
            <div 
                ref={dialogRef} 
                className="absolute right-0 top-[110%] z-10 w-28 flex-col items-start justify-start rounded-md border bg-white"
            >
                <button
                    className="w-full py-2 font-medium hover:bg-gray-100 flex items-center pl-3 gap-3"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsProjectsOpen(false);
                        
                            router.push(`/ide/?lang=${selectedLanguage}`);
                    }}
                >
                    <IconPlus className='w-5' />
                    New
                </button>
                <button
                    className="w-full py-2 font-medium hover:bg-gray-100 flex items-center pl-4 gap-3"
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
                    className="w-full py-2 font-medium hover:bg-gray-100 flex items-center pl-4 gap-4" 
                    onClick={openProjectsModal}
                >
                    <IconList className='w-4' />
                    List
                </button>
                {selectedLanguage === 72 && (
                    <button 
                        className="w-full py-2 font-medium hover:bg-gray-100 flex items-center pl-4 gap-4" 
                        onClick={() => setExampleModalOpen(true)}
                    >
                        <IconHelpCircle className='w-4' />
                        Help
                    </button>
                )}
            </div>
            </Suspense>
        )
    );
};

export default ActionCell;