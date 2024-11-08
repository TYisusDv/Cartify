import React, { useState, useEffect } from 'react';

interface InputProps {
    props?: React.InputHTMLAttributes<HTMLInputElement>;
    icon: any;
    label: string;
    color?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({ props, icon, label, color = 'blue', required = true }) => {
    const [hasText, setHasText] = useState(false);

    useEffect(() => {
        if (props?.value !== null && props?.value !== '' && props?.value !== undefined && props?.value.toString().length !== 0) {
            setHasText(true);
        } else if (props?.type === 'date' || props?.type === 'datetime-local') {
            setHasText(true);
        } else {
            setHasText(false);
        }
    }, [props?.value, props?.type]);

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        if (props?.type === 'number') {
            (event.target as HTMLInputElement).select();
        }
    };

    return (
        <div className={`input-group input-group-${color} ${hasText ? 'has-text' : ''}`}>
            <label className='label' htmlFor={props?.id}>
                {label} {required ? <span className='text-red-500'>*</span> : ''}
            </label>
            <input
                {...props}
                className='input'
                onClick={handleClick}
            />
            <span className='font-medium text-black dark:text-white'>
                {icon}
            </span>
        </div>
    );
};

export default Input;
