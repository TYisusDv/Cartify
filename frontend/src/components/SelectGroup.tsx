import { ArrowDown01Icon, CheckmarkCircle01Icon } from 'hugeicons-react';
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { getList } from '../services/componentsService';
import useClickOutside from '../hooks/useClickOutSide';
import useTranslations from '../hooks/useTranslations';

interface Option {
  value: string;
  label: string;
}

interface SelectGroupProps {
  name: string;
  value?: any;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  endpoint?: string;
  myOptions?: Option[];
}

const SelectGroup: React.FC<SelectGroupProps> = ({ name, value, onChange, endpoint, myOptions }) => {
  const { translations } = useTranslations();
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const selectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (myOptions) {
      setOptions(myOptions);
    } else if (endpoint) {
      loadOptions();
    }
  }, [myOptions, endpoint]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const loadOptions = async () => {
    if(endpoint){
      try {
        const params = { query: 'list' };
        const response = await getList(endpoint, params);
        if (response.data.success) {
          setOptions(response.data.resp.map((option: any) => ({ value: option.id, label: option.name })));
        }
      } catch (error) {
        setOptions([]);
      }
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
    <div ref={containerRef} className="relative w-full">
      <select
        ref={selectRef}
        name={name}
        className="hidden"
        value={selectedValue}
        onChange={handleSelect}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className="flex items-center justify-between cursor-pointer text-sm p-2 rounded-md gap-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option.value.toString() === selectedValue.toString())?.label || translations.select_an_option}
        <ArrowDown01Icon size={20} />
      </div>
      {isOpen && (
        <ul className="absolute left-0 top-full text-sm mt-1 w-full border border-gray-200 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
          {options.map((option) => (
            <li
              key={option.value}
              className={`flex items-center justify-between cursor-pointer p-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 ${selectedValue === option.value ? 'bg-gray-200 dark:bg-slate-600' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label} {selectedValue === option.value ? <CheckmarkCircle01Icon className="text-black dark:text-white" size={18} /> : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectGroup;
