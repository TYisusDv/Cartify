import React from 'react';

type HandleChangeOptions<T> = {
  setFormValues: React.Dispatch<React.SetStateAction<T>>;
  setUpdateFlag?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleChange = <T extends Record<string, any>>({ setFormValues, setUpdateFlag}: HandleChangeOptions<T>) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

  if (setUpdateFlag) {
    setUpdateFlag(true);
  }
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

    if (lastKey) {
      current[lastKey] = value;
      current['name'] = optionText;
    }

    return updatedState;
  });
};

export const handleFileChange = (allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'], setCapturedImages: React.Dispatch<React.SetStateAction<File[]>>, stopVideo: () => void, one: boolean = false) => (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;

  if (files) {
    const filteredFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

    if (filteredFiles.length === 0) {
      alert('Please upload files in an allowed format.');
      event.target.value = '';
      return;
    }
  
    stopVideo();
    
    if (one) {
      setCapturedImages([filteredFiles[0]]);
    } else {
      setCapturedImages(prev => [...prev, ...filteredFiles]);
    }
  }
};