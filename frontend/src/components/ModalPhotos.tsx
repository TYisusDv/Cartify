import React, { ReactNode, useEffect } from 'react';
import Portal from './Portal';

interface ModalPhotosProps {
    children: ReactNode;
    onClose: () => void;
}

const ModalPhotos: React.FC<ModalPhotosProps> = ({ children, onClose }) => {
    useEffect(() => {
        const panelContent = document.querySelector('.panel-content') as HTMLElement;
        if (panelContent) {
            panelContent.classList.add('overflow-hidden');
        }

        return () => {
            if (panelContent) {
                panelContent.classList.remove('overflow-hidden');
            }
        };
    }, []);

    return (
        <Portal id='portal-modal'>
            <div className='absolute top-0 left-0 flex items-center justify-center h-full w-full p-2 z-50 bg-black/50 dark:bg-slate-800/80 animate__animated animate__fadeIn animate__faster overflow-auto'>
                <button type='button' className='absolute top-0 right-0 m-10 rounded-full p-3 hover:bg-gray-200 dark:text-white dark:hover:bg-slate-600' aria-label='Close' onClick={onClose}>
                    <span className='sr-only'>Close</span>
                    <svg className='w-5 h-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
                        <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
                    </svg>
                </button>
                <div className='flex flex-col bg-white h-auto w-full max-w-[680px] rounded-3xl dark:bg-slate-700'>
                    {children}
                </div>
            </div>
        </Portal>
    );
};

export default ModalPhotos;