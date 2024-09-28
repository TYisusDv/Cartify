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
        if(props?.value !== null && props?.value !== '' && props?.value !== undefined){
            setHasText(true);
        }

        if(props?.type === 'date'){
            setHasText(true);
        }
    }, [props?.value, props?.type]);

    return (
        <div className={`input-group input-group-${color} ${hasText ? 'has-text' : ''}`}>
            <label className='label' htmlFor={props?.id}>{label} { required ? <span className='text-red-500'>*</span> : ''}</label>
            <input
                {...props}
                className='input'
            />
            {icon}
        </div>
    );
};

export default Input;