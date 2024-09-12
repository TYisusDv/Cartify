import { ArrowDown01Icon, CheckmarkCircle01Icon } from 'hugeicons-react';
import React, { useState, useRef, useEffect } from 'react';
import useClickOutside from '../hooks/useClickOutSide';
import useTranslations from '../hooks/useTranslations';

interface Option {
  value: string;
  label: string;
}

interface SelectGroupProps {
  options: Option[];
  value?: string;
  onChange?: (option: Option) => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ options, value, onChange }) => {
  const { translations } = useTranslations();
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (value: string) => {
    const selectedOption = options.find(option => option.value === value);
    if (selectedOption) {
      setSelectedValue(value);
      setIsOpen(false);
      if (onChange) {
        onChange(selectedOption); // Pasar el objeto completo
      }
      if (selectRef.current) {
        selectRef.current.value = value;
      }
    }
  };

  return (
    <div ref={containerRef} className='relative w-full'>
      <select ref={selectRef} className='hidden' value={selectedValue} onChange={(e) => handleSelect(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className='flex items-center justify-between cursor-pointer text-sm p-2 rounded-md gap-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' onClick={() => setIsOpen(!isOpen)}>
        {options.find((option) => option.value === selectedValue)?.label || translations.select_an_option} <ArrowDown01Icon size={20} />
      </div>
      {isOpen && (
        <ul className='absolute left-0 top-full text-sm mt-1 w-full border border-gray-200 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600'>
          {options.map((option) => (
            <li key={option.value} className={`flex items-center justify-between cursor-pointer p-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 ${selectedValue === option.value ? 'bg-gray-200 dark:bg-slate-600' : ''}`} onClick={() => handleSelect(option.value)}>
              {option.label} {selectedValue === option.value ? <CheckmarkCircle01Icon className='text-black dark:text-white' size={18} /> : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectGroup;