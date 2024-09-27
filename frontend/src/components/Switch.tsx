import React, { FC, InputHTMLAttributes } from 'react';

interface SwitchProps {
    props?: InputHTMLAttributes<HTMLInputElement>;
    icon?: any;
    label: string;
    color?: 'blue' | 'orange' | 'red' | 'yellow';
    required?: boolean;
}

const Switch: FC<SwitchProps> = ({ props, icon, label, color = 'blue', required = true }) => {
    const colorClasses = {
        blue: 'peer-checked:bg-blue-500',
        orange: 'peer-checked:bg-orange-500',
        red: 'peer-checked:bg-red-500',
        yellow: 'peer-checked:bg-yellow-500',
    };

    return (
        <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full z-10 gap-2'>
            <label className='inline-flex items-center cursor-pointer'>
                <span className='ml-1 me-2 text-sm font-bold text-gray-900 dark:text-gray-300'>
                    {label} {required ? <span className='text-red-500'>*</span> : ''}
                </span>
                <input
                    {...props}
                    type='checkbox'
                    className='sr-only peer'
                />
                <div
                    className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-transparent rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${colorClasses[color]}`}
                ></div>
            </label>
        </div>
    );
};

export default Switch;
