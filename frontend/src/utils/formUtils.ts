import React from 'react';

export const extractMessages = (error: any): string[] => {
  if (error && error.response && error.response.data && error.response.data.resp) {
      const resp = error.response.data.resp;

      if (typeof resp === 'object' && resp !== null) {
          return Object.keys(resp).flatMap(key => resp[key] as string[]);
      } else if (resp) {
          return [resp];
      }
  }

  if (error instanceof Error) {
      return [error.message];
  }

  return ['An unexpected error occurred.'];
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

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};
