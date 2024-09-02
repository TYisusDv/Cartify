import React from 'react';

const PreLoader: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen w-screen animate__animated animate__fadeIn'>
      <div className='flex flex-col gap-3'>
        <div className='loader'></div>
        <h1 className='text-2xl font-bold'>Carsync</h1>
      </div>
    </div>
  );
};

export default PreLoader;
