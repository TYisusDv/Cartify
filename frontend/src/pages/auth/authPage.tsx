import React, { useState } from 'react';
import { login } from '../../services/authService';
import { AuthLoginValues } from '../../types/auth';
import { AlertType } from '../../types/alert';
import { UserAccountIcon, LockPasswordIcon } from 'hugeicons-react';
import { handleChange } from '../../utils/formUtils';
import { saveToken } from '../../utils/authUtils';
import { v4 as uuidv4 } from 'uuid';
import InputGroup from '../../components/InputGroup';
import useFormSubmit from '../../hooks/useFormSubmit';

interface AuthPageProps {
  addAlert: (alert: AlertType) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ addAlert }) => {
    const [formValues, setFormValues] = useState<AuthLoginValues>({ username: '', password: '' });

    const handleLogin = async () => {      
       return await login(formValues.username, formValues.password);
    };
    
    const { handleSubmit, isLoading } = useFormSubmit(handleLogin, addAlert);    

    const onSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const response = await handleSubmit(formValues);
      if(response){
        const response_data = response.data;
        if(!response_data.success){
          addAlert({ id: uuidv4(), text: response_data.resp, type: 'danger', timeout: 3000 });
          return;
        }
        
        saveToken(response_data.resp.accessToken)
        addAlert({ id: uuidv4(), text: 'Success! Welcome to Carsync.', type: 'primary', timeout: 3000 });
      }      
    };

    return (
      <section className='auth-page relative h-screen w-screen bg-cover bg-no-repeat'>        
        <div className='h-screen w-screen bg-gradient-to-r from-white to-white/60 dark:from-slate-900 dark:to-slate-600/50'></div>
        <div className='flex flex-col h-full absolute top-0 left-0'>          
          <header className='flex h-16 items-center px-14 w-screen box-border'>
            <h1 className='text-xl font-bold cursor-default dark:text-white'>Carsync</h1>
          </header>
          <div className='flex flex-col h-full px-14 box-border justify-center w-full md:w-8/12 lg:w-6/12 xl:w-4/12'>
            <div>
              <p className='text-gray-600 font-bold text-lg uppercase dark:text-gray-400'>Manage your business</p>
              <h2 className='text-5xl font-bold dark:text-white'>Log in to your account.</h2>
              <div className='text-gray-600 font-bold mt-4 dark:text-gray-400'>You don't have an account? <a className='text-blue-600 hover:underline' href='s'>Register</a></div>
            </div>
            <form onSubmit={onSubmit} autoComplete='off'>
              <div className='grid grid-cols-1 w-full gap-2 mt-9'>
                <div className='col-span-1'>
                  <InputGroup 
                    id='username'
                    name='username'
                    label='Username' 
                    icon={<UserAccountIcon className='icon text-gray-700' size={28} />} 
                    onChange={handleChange(setFormValues)} 
                  />
                </div>
                <div className='col-span-1'>
                  <InputGroup 
                    id='password'
                    name='password'
                    label='Password' 
                    type='password'
                    icon={<LockPasswordIcon className='icon text-gray-700' size={28} />} 
                    onChange={handleChange(setFormValues)}
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-2 mt-6'>              
                <div className='col-span-1 col-end-3'>
                  <button className='btn' disabled={isLoading}>Log in</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  };
  
  export default AuthPage;