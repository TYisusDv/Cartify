import React from 'react';

export const handleChange = <T extends Record<string, any>>(setFormValues: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, type, checked, value } = e.target;

  setFormValues(prevState => {
    const keys = name.split('.');
    const lastKey = keys.pop();

    if (!lastKey) return prevState;

    let updatedState: any = { ...prevState };
    let current: any = updatedState;

    keys.forEach((key) => {
      if (key.includes('[')) {
        const [arrayKey, indexStr] = key.split(/[[]]/).filter(Boolean);
        const arrayIndex = parseInt(indexStr, 10);

        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }

        while (current[arrayKey].length <= arrayIndex) {
          current[arrayKey].push({});
        }

        current = current[arrayKey][arrayIndex];
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });

    current[lastKey] = type === 'checkbox' ? checked : value;

    return updatedState;
  });
};

export const handleSelectChange = <T extends Record<string, any>>(setFormValues: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  const optionText = e.target.options[e.target.selectedIndex].text;

  setFormValues(prevState => {
    const keys = name.split('.');
    const lastKey = keys.pop();

    if (!lastKey) return prevState;

    let updatedState: any = { ...prevState };
    let current: any = updatedState;

    keys.forEach((key, index) => {
      if (key.includes('[')) {
        const [arrayKey, indexStr] = key.split(/[\[\]]/).filter(Boolean);
        const arrayIndex = parseInt(indexStr, 10);
        
        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }
        
        while (current[arrayKey].length <= arrayIndex) {
          current[arrayKey].push({});
        }
        
        current = current[arrayKey][arrayIndex];
      } else {
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
    });

    if (lastKey) {
      current[lastKey] = value;
      current['name'] = optionText;
    }

    return updatedState;
  });
};