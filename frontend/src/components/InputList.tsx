import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import apiService from '../services/apiService';

interface InputListProps {
    id: string;
    name: string;
    label: string;
    icon: React.ReactNode;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    endpoint: string;
}

interface Suggestion {
    id: number;
    name: string;
    status?: boolean; // Incluye si es relevante para tu lógica
}

interface ApiResponse {
    success: boolean;
    resp: Suggestion[];
}

const InputList: React.FC<InputListProps> = ({ id, name, label, icon, onChange, type = 'text', required = true, endpoint }) => {
    const [hasText, setHasText] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
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
                    console.error('Error fetching suggestions:', response_data);
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
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
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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