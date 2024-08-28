import React, { useState } from 'react';
import { login } from '../../services/authService';
import { saveToken } from '../../utils/authUtils';
import { AuthFormValues } from '../../types/auth';
import InputGroup from '../../components/InputGroup';
import { UserAccountIcon, LockPasswordIcon } from 'hugeicons-react';

const AuthPage: React.FC = () => {
    const [formValues, setFormValues] = useState<AuthFormValues>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValues(prevState => ({ ...prevState, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await login(formValues.email, formValues.password);
        saveToken(response.token);
      } catch (err) {
        setError('Login failed');
      }
    };
  
    return (
      <section className='auth-page'>
        <div className='auth-bg'></div>
        <div className='flex flex-col h-full absolute top-0 left-0'>
          <header className='flex h-16 items-center px-14 w-screen box-border'>
            <h1 className='text-xl text-white font-bold cursor-default'>Carsync</h1>
          </header>
          <div className='flex flex-col h-full px-14 box-border justify-center md:w-3/6'>
            <div>
              <p className='text-gray-400 font-bold text-lg uppercase'>Manage your business</p>
              <h2 className='text-5xl text-white font-bold'>Log in to your account.</h2>
              <div className='text-gray-500 font-bold mt-4'>You don't have an account? <a className='link' href='s'>Register</a></div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-12 w-full gap-2 mt-9'>
              <div className='col-span-12 md:col-span-6'>
                <InputGroup 
                  id='username'
                  name='username'
                  label='Username' 
                  icon={<UserAccountIcon className='icon' size={28} />} 
                  onChange={handleChange} 
                />
              </div>
              <div className='col-span-12 md:col-span-6'>
                <InputGroup 
                  id='password'
                  name='password'
                  label='Password' 
                  icon={<LockPasswordIcon className='icon' size={28} />} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AuthPage;