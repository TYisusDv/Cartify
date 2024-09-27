import React from 'react';

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

export const getNestedValue = (obj: any, path?: string) => {
  if(path){
    return path.split('.').reduce((value, key) => {
        return value?.[key];
    }, obj);
  }
  
  return;
};

export const getNestedText = (obj: any, template?: string) => {
  if(template){
    return template.replace(/\{([^}]+)\}/g, (_, path) => {
      return getNestedValue(obj, path) || '';
    });
  }

  return;
};