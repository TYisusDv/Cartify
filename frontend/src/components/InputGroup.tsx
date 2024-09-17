import React, { useState, ChangeEvent, useEffect } from 'react';

interface InputGroupProps {
    id: string;
    name: string;
    label: string;
    icon: React.ReactNode;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    type?: string;
    color?: string;
    required?: boolean;
    disabled?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({ id, name, label, icon, onChange, value, type = 'text', color = 'blue', required = true, disabled = false }) => {
    const [hasText, setHasText] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHasText(value.trim() !== '');

        if (onChange) {
            onChange(e);
        }
    };

    useEffect(() => {
        if(value !== null && value !== '' && value !== undefined){
            setHasText(true);
        }

        if(type === 'date'){
            setHasText(true);
        }
    }, [value, type]);

    return (
        <div className={`input-group input-group-${color} ${hasText ? 'has-text' : ''}`}>
            <label className='label' htmlFor={id}>{label} { required ? <span className='text-red-500'>*</span> : ''}</label>
            <input
                id={id}
                name={name}
                type={type}
                className='input'
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
            />
            {icon}
        </div>
    );
};

export default InputGroup;