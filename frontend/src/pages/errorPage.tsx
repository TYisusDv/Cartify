import React from 'react';
import DelayedSuspense from '../components/DelayedSuspense';
import SkeletonLoader from '../components/SkeletonLoader';

interface ErrorPageProps {
    code: number;
    detail: string;
}
  
const ErrorPage: React.FC<ErrorPageProps> = ({ code, detail }) => {

  return (
    <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>        
     <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn'>
          <h1 className='text-2xl font-bold dark:text-white'>Error {code}</h1>
          <span className='text-sm text-gray-600 dark:text-slate-400'>{detail}</span>
      </div>
      <div className='flex flex-col p-8 animate__animated animate__fadeIn'>
        
      </div>
    </DelayedSuspense>
  );
};

export default ErrorPage;