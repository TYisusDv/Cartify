import React, { ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    title: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, title, onClose }) => {
    return (
        <div className='absolute top-0 left-0 flex items-center justify-center h-screen w-screen p-2 z-50 bg-black/50 dark:bg-slate-800/80 animate__animated animate__fadeIn'>
            <div className='flex flex-col bg-white h-auto w-full max-w-[680px] rounded-3xl dark:bg-slate-700'>
                <div className='flex justify-between w-full p-5 border-b-2 border-gray-200 dark:border-slate-600'>
                    <h1 className='text-lg font-bold dark:text-white'>{title}</h1>
                    <button type='button' className='rounded-full p-2 hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600' aria-label='Close' onClick={onClose}>
                        <span className='sr-only'>Close</span>
                        <svg className='w-3 h-3' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
                            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'd='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'/>
                        </svg>
                    </button>
                </div>
                <div className='w-full p-5 pt-3 pb-3'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;