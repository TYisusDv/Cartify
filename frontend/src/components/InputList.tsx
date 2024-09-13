import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import apiService from '../services/apiService';
import useClickOutside from '../hooks/useClickOutSide';

interface InputListProps {
    id: string;
    name: string;
    label: string;
    icon: React.ReactNode;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    type?: string;
    required?: boolean;
    endpoint: string;
}

interface Suggestion {
    id: number;
    name: string;
    status?: boolean;
}

interface ApiResponse {
    success: boolean;
    resp: Suggestion[];
}

const InputList: React.FC<InputListProps> = ({ id, name, label, icon, onChange, value = '', type = 'text', required = true, endpoint }) => {
    const [hasText, setHasText] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [inputValue, setInputValue] = useState<string>(value);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHasText(value.trim() !== '');
        setInputValue(value);

        if (onChange) {
            onChange(e);
        }

        if (value.trim()) {
            try {
                const response = await apiService.get<ApiResponse>(endpoint, {
                    params: {
                        query: 'list',
                        search: value
                    }
                });
                const response_data = response.data;

                if (response_data.success) {
                    setSuggestions(response_data.resp);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setInputValue(suggestion.name);
        setShowSuggestions(false);
        onChange({ target: { name: name, value: suggestion.name } } as ChangeEvent<HTMLInputElement>);
    };

    useEffect(() => {
        setInputValue(value);
        setHasText(value.trim() !== '');
    }, [value]);

    useClickOutside(containerRef, () => setShowSuggestions(false));

    return (
        <div className={`input-group relative ${hasText ? 'has-text' : ''}`} ref={containerRef}>
            <label className='label' htmlFor={id}>
                {label} {required ? <span className='text-red-500'>*</span> : ''}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                className='input'
                value={inputValue}
                onChange={handleInputChange}
            />
            {icon}
            {showSuggestions && suggestions.length > 0 && (
                <div className='absolute left-0 top-full text-sm mt-2 w-full border-2 border-gray-200 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600'>
                    <ul className='suggestions-list'>
                        {suggestions.map(suggestion => (
                            <li
                                key={suggestion.id}
                                className='flex items-center justify-between cursor-pointer p-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-600'
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default InputList;