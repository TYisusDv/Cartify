import { ArrowDown01Icon } from 'hugeicons-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getList } from '../services/componentsService';
import { getNestedText, getNestedValue } from '../utils/formUtils';
import useTranslations from '../hooks/useTranslations';
import { generateUUID } from '../utils/uuidGen';
import useClickOutside from '../hooks/useClickOutSide';
import { CustomChangeEvent, Option } from '../types/componentsType';

interface SelectProps {
    props?: React.SelectHTMLAttributes<HTMLSelectElement>;
    myOptions?: Array<any>;
    endpoint?: string;
    endpoint_value?: string;
    endpoint_text?: string;
    icon?: any;
    label: string;
    required?: boolean;
    query?: string;
}

const Select: React.FC<SelectProps> = ({ props, myOptions, endpoint, endpoint_value, endpoint_text, icon, label, required = true, query = 'list' }) => {
    const { translations } = useTranslations();
    const selectRef = useRef<HTMLSelectElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [value, setValue] = useState<any>(props?.value || '0');
    const [searchQuery, setSearchQuery] = useState<string>();

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = useCallback((value: any) => {
        const selectedOption = options.find(option => option.value.toString() === value.toString());
    
        setValue(value);
    
        if (selectRef.current) {
            selectRef.current.value = value;
        }
    
        if (props?.onChange) {
            const event: CustomChangeEvent = {
                target: {
                    value: value,
                },
                object: selectedOption?.object
            } as CustomChangeEvent;
    
            props.onChange(event);
        }
    
        setIsOpen(false);
    }, [options, props, selectRef, setValue, setIsOpen]);

    useClickOutside(containerRef, () => setIsOpen(false));

    useEffect(() => {
        if (endpoint && translations.select_an_option) {
            const fetchData = async () => {
                try {
                    const params = {
                        query: query,
                        search: searchQuery || ''
                    };
                    const response = await getList(endpoint, params);
                    if (response.success) {
                        const newOptions = response.resp.map((option: any) => ({
                            value: getNestedValue(option, endpoint_value) || generateUUID(),
                            text: getNestedText(option, endpoint_text) || '{TextError}',
                            object: option
                        }));
                        setOptions([{ value: '0', text: translations.select_an_option }, ...newOptions]);
                    }
                } catch (error) {
                    setOptions([{ value: '0', text: translations.select_an_option }]);
                }
            };

            fetchData();
        } else if (myOptions) {
            const newOptions = myOptions.map((option: any) => ({
                value: option.value,
                text: option.label
            }));
            setOptions([{ value: '0', text: translations.select_an_option }, ...newOptions]);
        }
    }, [endpoint, translations.select_an_option, endpoint_value, endpoint_text, searchQuery, myOptions]);

    useEffect(() => {
        setValue(props?.value || '0');
    }, [props?.value]);

    return (
        <div ref={containerRef} className='flex border-2 h-full border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2 dark:text-white'>
            <h3 className='flex gap-1 w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'><span className='text-wrap'>{label}</span> {required ? <span className='text-red-500'>*</span> : ''}</h3>
            <div className='relative w-full'>
                <select
                    {...props}
                    className='w-full hidden'
                    ref={selectRef}
                >
                    {options.map((option) => (
                        <option key={generateUUID()} value={option.value}></option>
                    ))}
                </select>
                <div
                    className={`relative flex flex-wrap items-center justify-between text-sm rounded-md p-2 ${props?.disabled ? 'cursor-default dark:hover:bg-slate-700' : 'cursor-pointer dark:hover:bg-slate-600'}`}
                    onClick={handleOpen}
                >
                    <span className='line-clamp-1'>{options.find((option) => option.value.toString() === value.toString())?.text}</span>
                    <div className='w-[20px] flex-shrink-0'>{icon ? icon : <ArrowDown01Icon size={20} />}</div>
                </div>
                {isOpen && !props?.disabled && (
                    <div className='absolute w-full text-sm border-2 rounded-md mt-1 dark:bg-slate-700 dark:border-slate-600'>
                        {endpoint && (
                            <input
                                type='text'
                                value={searchQuery || ''}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='w-full p-2 border-b-2 rounded-t-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none'
                                placeholder={translations.search}
                            />
                        )}
                        <ul>
                            {options.map((option) => (
                                <li
                                    key={generateUUID()}
                                    className='w-full cursor-pointer dark:hover:bg-slate-600 p-2'
                                    onClick={() => { handleOptionClick(option.value) }}
                                >
                                    {option.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Select;