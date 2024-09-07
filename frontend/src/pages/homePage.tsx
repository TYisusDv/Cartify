import React from 'react';
import useTranslations from '../hooks/useTranslations';
import DelayedSuspense from '../components/DelayedSuspense';
import SkeletonLoader from '../components/SkeletonLoader';

const HomePage: React.FC = () => {
  const { translations } = useTranslations();

  return (
    <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>        
     <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn animate__faster'>
          <h1 className='text-2xl font-bold dark:text-white'>{translations.home}</h1>
          <span className='text-sm text-gray-600 dark:text-slate-400'>Cierra sesiond</span>
      </div>
      <div className='flex p-8'>
  
      </div>
    </DelayedSuspense>
  );
};

export default HomePage;