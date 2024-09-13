import React from 'react';

export const handleChange = <T extends Record<string, any>>(setFormValues: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormValues(prevState => ({ ...prevState, [name]: value }));
};

export const handleSelectChange = <T extends Record<string, any>>(setFormValues: React.Dispatch<React.SetStateAction<T>>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  //const option_text = e.target.options[e.target.selectedIndex].text;

  setFormValues(prevState => ({ ...prevState, [name]: value }));
};