import { ArrowDown01Icon, CheckmarkCircle01Icon } from 'hugeicons-react';
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { getList } from '../services/componentsService';
import useClickOutside from '../hooks/useClickOutSide';
import useTranslations from '../hooks/useTranslations';

interface Option {
  value: any;
  label: string;
}

interface SelectGroupProps {
  name: string;
  value?: any;
  label?: string;
  label_per?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  endpoint?: string;
  myOptions?: Option[];
  disabled?: boolean;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ name, value, label = 'name', label_per, onChange, endpoint, myOptions, disabled = false }) => {
  const { translations } = useTranslations();
  const [selectedValue, setSelectedValue] = useState(value || 0);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([
    { value: 0, label: translations.select_an_option }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLSelectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    if (myOptions) {
      setOptions([{ value: 0, label: translations.select_an_option }, ...myOptions]);
    } else if (endpoint) {
      loadOptions(searchQuery);
    }
  }, [myOptions, endpoint, searchQuery]);

  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]);

  const loadOptions = async (query: string) => {
    if (endpoint) {
      try {
        const params = {
          query: 'list',
          search: query
        };
        const response = await getList(endpoint, params);
        if (response.data.success) {
          const newOptions = response.data.resp.map((option: any) => ({
            value: option.id,
            label: label_per ? `${option[label]} (${option[label_per]}%)` : option[label]
          }));
          setOptions([{ value: 0, label: translations.select_an_option }, ...newOptions]);
        }
      } catch (error) {
        setOptions([{ value: 0, label: translations.select_an_option }]);
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
    if (!disabled && selectRef.current) {
      selectRef.current.value = optionId;
      const event = { target: selectRef.current } as ChangeEvent<HTMLSelectElement>;
      handleSelect(event);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <select
        ref={selectRef}
        name={name}
        className="hidden"
        value={selectedValue}
        onChange={handleSelect}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div
        className={`flex items-center justify-between text-sm p-2 rounded-md gap-2 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 cursor-pointer ${disabled ? '!cursor-default dark:hover:bg-slate-700' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (endpoint) {
              loadOptions(searchQuery);
            }
          }
        }}
      >
        {options.find((option) => option.value.toString() === selectedValue.toString())?.label || translations.select_an_option}
        <ArrowDown01Icon size={20} />
      </div>
      {isOpen && !disabled && (
        <div className="absolute left-0 top-full text-sm mt-1 w-full border border-gray-200 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
          {endpoint && (
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border-b border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white outline-none"
              placeholder={translations.search}
              disabled={disabled}
            />
          )}
          <ul className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.value}
                className={`flex items-center justify-between p-2 gap-2 hover:bg-gray-200 dark:hover:bg-slate-600 cursor-pointer ${selectedValue.toString() === option.value.toString() ? 'bg-gray-200 dark:bg-slate-600' : ''} ${disabled ? 'cursor-default' : ''}`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label} {selectedValue.toString() === option.value.toString() ? <CheckmarkCircle01Icon className="text-black dark:text-white" size={18} /> : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectGroup;