import { ArrowDown01Icon, CheckmarkCircle01Icon } from 'hugeicons-react';
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { getList } from '../services/componentsService';
import useClickOutside from '../hooks/useClickOutSide';
import useTranslations from '../hooks/useTranslations';

interface SelectGroupProps {
  name: string;
  value?: any;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  endpoint: string;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ name, value, onChange, endpoint }) => {
  const { translations } = useTranslations();
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if(value){
      setSelectedValue(value);
    }
  }, [value]);

  const loadOptions = async () => {
    try {
      const params = { query: 'list' };
      const response = await getList(endpoint, params);
      if (response.data.success) {
        setOptions(response.data.resp);
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setIsOpen(false);

    if (onChange) {
      onChange(e);
    }
  };

  const handleOptionClick = (optionId: string) => {
    if (selectRef.current) {
      selectRef.current.value = optionId;
      const event = { target: selectRef.current } as ChangeEvent<HTMLSelectElement>;
      handleSelect(event);
    }
  };

  return (
    <div ref={containerRef} className='relative w-full'>
      <select
        ref={selectRef}
        name={name}
        className='hidden'
        value={selectedValue}
        onChange={handleSelect}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div
        className='flex items-center justify-between cursor-pointer text-sm p-2 rounded-md gap-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'
        onClick={() => {
          if (!isOpen) { 
            //loadOptions();
            setIsOpen(!isOpen);
          }
        }}
      >
        {options.find((option) => option.id.toString() === selectedValue.toString())?.name || translations.select_an_option}
        <ArrowDown01Icon size={20} />
      </div>
      {isOpen && (
        <ul className='absolute left-0 top-full text-sm mt-1 w-full border border-gray-200 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600'>
          {options.map((option) => (
            <li
              key={option.id}
              className={`flex items-center justify-between cursor-pointer p-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 ${selectedValue === option.id ? 'bg-gray-200 dark:bg-slate-600' : ''
                }`}
              onClick={() => handleOptionClick(option.id)}
            >
              {option.name} {selectedValue === option.id ? <CheckmarkCircle01Icon className='text-black dark:text-white' size={18} /> : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectGroup;