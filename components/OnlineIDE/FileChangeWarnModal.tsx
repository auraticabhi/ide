import { LanguageCode } from '@/types/ide';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useState, Fragment } from 'react';
import IconX from '../icons/IconX';

const SaveNameModal: React.FC<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    selectedLanguage : LanguageCode
}> = ({ isOpen, setIsOpen, selectedLanguage}) => {
    const router = useRouter();
    const {id} = router.query;


    return (
        <div onClick={() => setIsOpen(true)}>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" open={isOpen} onClose={() => setIsOpen(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-[999] bg-[black]/60 px-4">
                        <div className="flex min-h-screen items-start justify-center px-4">
                            <Dialog.Panel className="panel my-8 w-full max-w-lg overflow-hidden  rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                <div className="flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                                    <h5 className="text-lg font-bold">Unsaved changes</h5>
                                    <button type="button" onClick={() => setIsOpen(false)} className="text-white-dark hover:text-dark px-2">
                                        <IconX/>
                                    </button>
                                </div>
                                <div className="p-5 w-full space-y-3 ">
                                    <p>  Unsaved changes will be lost. Are you sure you want to leave?</p>

                                    <div className="pt-5 flex items-center gap-2 justify-end">
                                    <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            localStorage.removeItem('cjr-ide')
                                            router.push(`/ide/?lang=${selectedLanguage}`).then(() => window.location.reload());
                                        }} className="bg-red-600 px-4 py-2 rounded-lg text-white">
                                            Yes
                                        </button>
                                        <button onClick={() => {
                                            setIsOpen(false);
                                        }} type="button" className="bg-[#264893] px-5 py-2 rounded-lg text-white ">
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

export default SaveNameModal;
