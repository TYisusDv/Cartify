import React from 'react';
import useTranslations from '../hooks/useTranslations';


const HomePage: React.FC = () => {
  const { translations } = useTranslations();

  return (
    <>
        <div className='flex w-full p-8'>
            <h1 className='text-2xl font-bold'>{translations.home}</h1>
        </div>
        <div className='flex p-8'>

        </div>
    </>
  );
};

export default HomePage;