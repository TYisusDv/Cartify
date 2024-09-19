import React, { useState, ReactNode } from 'react';
import { ArrowDown01Icon, ArrowUp01Icon, CircleIcon } from 'hugeicons-react';

interface DropdownMenuProps {
    label: string;
    icon: any;
    children: ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='flex flex-col w-full'>
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