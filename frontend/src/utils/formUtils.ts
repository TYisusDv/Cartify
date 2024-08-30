import React from 'react';

export const handleChange = <T extends Record<string, any>>(setFormValues: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormValues(prevState => ({ ...prevState, [name]: value }));
};