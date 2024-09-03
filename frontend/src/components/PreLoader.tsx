import React from 'react';

const PreLoader: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen w-screen animate__animated animate__fadeIn dark:bg-slate-800'>
      <div className='flex flex-col gap-3'>
        <div className='loader'></div>
        <h1 className='text-2xl font-bold dark:text-gray-100'>Carsync</h1>
      </div>
    </div>
  );
};

export default PreLoader;
