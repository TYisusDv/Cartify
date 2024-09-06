import { ArrowDown01Icon, CheckmarkCircle01Icon } from 'hugeicons-react';
import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectGroupProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ options, value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
    if (selectRef.current) {
      selectRef.current.value = value;
    }
  };

  return (
    <div className='relative w-full'>
      <select ref={selectRef} className='hidden' value={selectedValue} onChange={(e) => handleSelect(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className='flex items-center justify-between cursor-pointer text-sm p-2 rounded-md gap-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600' onClick={() => setIsOpen(!isOpen)}>
        {options.find((option) => option.value === selectedValue)?.label || 'Select an option'} <ArrowDown01Icon size={20} />
      </div>
      {isOpen && (
        <ul className='absolute left-0 top-full text-sm mt-1 w-full border border-gray-200 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600'>
          {options.map((option) => (
            <li key={option.value} className={`flex items-center justify-between cursor-pointer p-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 ${selectedValue === option.value ? 'bg-gray-200 dark:bg-slate-600' : ''}`} onClick={() => handleSelect(option.value)}>
              {option.label} {selectedValue === option.value ? <CheckmarkCircle01Icon size={18} /> : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectGroup;
