import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className='flex flex-col w-full p-8 space-y-4 overflow-y-hidden animate__animated animate__fadeIn'>
      <div className='h-8 bg-gray-200 rounded w-2/4 animate-pulse'></div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
      </div>
      <div className='h-80 bg-gray-200 rounded w-full animate-pulse'></div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div className='col-span-1 h-44 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-44 bg-gray-200 rounded animate-pulse'></div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-2'>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse'></div>
      </div>
      <div className='h-32 bg-gray-200 rounded w-full animate-pulse'></div>
    </div>
  );
};

export default SkeletonLoader;
