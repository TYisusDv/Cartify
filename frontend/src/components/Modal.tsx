import React, { ReactNode } from 'react';
import Portal from './Portal';
import { Cancel01Icon } from 'hugeicons-react';

interface ModalProps {
    children: ReactNode;
    title: string;
    onClose: () => void;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ children, title, onClose, className = '' }) => {
    return (
        <Portal id='portal-modal'>
            <div className='fixed top-0 left-0 flex justify-center items-center h-screen w-screen p-2 z-[2] bg-black/50 dark:bg-slate-800/80 overflow-y-auto animate__animated animate__fadeIn animate__faster'>
                <div className={`flex flex-col bg-white w-full max-w-[680px] rounded-3xl dark:bg-slate-700 ${className} m-auto`}>
                    <div className='flex items-center justify-between p-5 border-b-2 border-gray-200 dark:border-slate-600'>
                        <h1 className='text-lg font-bold dark:text-white'>{title}</h1>
                        <button 
                            type='button' 
                            className='rounded-full p-2 hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600' 
                            aria-label='Close' 
                            onClick={onClose}
                        >
                            <span className='sr-only'>Close</span>
                            <Cancel01Icon />
                        </button>
                    </div>
                    <div className='flex-1 p-5 pt-3 pb-3'>
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default Modal;
