import React, { useState, ReactNode, useEffect, useRef } from 'react';
import { ArrowDown01Icon, ArrowUp01Icon } from 'hugeicons-react';
import { useLocation } from 'react-router-dom';
import useClickOutside from '../hooks/useClickOutSide';

interface DropdownMenuProps {
    label: string;
    icon: any;
    children: ReactNode;
    links?: string[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, icon, children, links }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (links && links.includes(location.pathname)) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [location.pathname, links]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useClickOutside(containerRef, () => {
        if (links && !links.includes(location.pathname)) {
            setIsOpen(false);
        }
    });


    return (
        <div className='flex flex-col w-full' ref={containerRef}>
            <div className='flex h-10 items-center text-base gap-3 text-gray-700 dark:text-slate-300'>
                {icon}
                <button onClick={toggleMenu} className='flex items-center justify-between w-full text-left'>
                    {label}
                    <div className='flex justify-center items-center text-gray-700 bg-gray-200 rounded-full p-[2px] dark:text-slate-300 dark:bg-slate-600'>
                        {isOpen ? <ArrowUp01Icon /> : <ArrowDown01Icon />}
                    </div>
                </button>
            </div>
            {isOpen && <ul className='flex flex-col gap-2 ml-10'>{children}</ul>}
        </div>
    );
};

export default DropdownMenu;
