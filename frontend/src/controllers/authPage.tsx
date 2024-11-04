import React, { useState } from 'react';
import { login } from '../services/authService';
import { AuthLoginValues } from '../types/auth';
import { UserAccountIcon, LockPasswordIcon } from 'hugeicons-react';
import { saveRefreshToken, saveToken } from '../utils/authUtils';
import Input from '../components/Input';
import { extractMessages } from '../utils/formUtils';
import { addAlert } from '../utils/Alerts';
import { generateUUID } from '../utils/uuidGen';

const AuthPage: React.FC = () => {
  const [formValues, setFormValues] = useState<AuthLoginValues>({ username: '', password: '' });
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {      
      const response = await login(formValues.username, formValues.password);
      const response_resp = response?.resp;

      addAlert({
        id: generateUUID(),
        title: 'Success',
        msg: 'Welcome to Cartify.',
        icon: 'CheckmarkCircle02Icon',
        timeout: 2000
      });

      saveToken(response_resp.accessToken);
      saveRefreshToken(response_resp.refreshToken);

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      const messages = extractMessages(error);
      messages.forEach(msg => {
        addAlert({
          id: generateUUID(),
          title: 'An error has occurred.',
          msg: msg,
          icon: 'Alert01Icon',
          color: 'red',
          timeout: 2000
        });
      });
    }
  };

  return (
    <section className='auth-page relative h-screen w-screen bg-cover bg-no-repeat'>
      <div className='h-screen w-screen bg-gradient-to-r from-white to-white/60 dark:from-slate-900 dark:to-slate-600/50'></div>
      <div className='flex flex-col h-full absolute top-0 left-0'>
        <header className='flex h-16 items-center px-14 w-screen box-border'>
          <h1 className='text-xl font-bold cursor-default dark:text-white'>Cartify</h1>
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
                <Input
                  props={{
                    id: 'username',
                    name: 'username',
                    value: formValues.username,
                    onChange: (e) => setFormValues(prev => ({
                      ...prev,
                      username: e.target.value || ''
                    })),
                  }}
                  label='Username'
                  icon={<UserAccountIcon className='icon text-gray-700' size={28} />}
                />
              </div>
              <div className='col-span-1'>
                <Input
                  props={{
                    id: 'password',
                    name: 'password',
                    value: formValues.password,
                    type: 'password',
                    onChange: (e) => setFormValues(prev => ({
                      ...prev,
                      password: e.target.value || ''
                    })),
                  }}
                  label='Password'
                  icon={<LockPasswordIcon className='icon text-gray-700' size={28} />}
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-2 mt-6'>
              <div className='col-span-1 md:col-end-3'>
                <button className='btn btn-blue'>Log in</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;