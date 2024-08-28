import React, { useState, ChangeEvent } from 'react';

interface InputGroupProps {
    id: string;
    name: string;
    label: string;
    icon: React.ReactNode;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ id, name, label, icon, onChange, type = 'text' }) => {
    const [hasText, setHasText] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHasText(value.trim() !== '');

        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={`input-group ${hasText ? 'has-text' : ''}`}>
            <label className='label' htmlFor={id}>{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                className='input'
                onChange={handleInputChange}
            />
            {icon}
        </div>
    );
};

export default InputGroup;