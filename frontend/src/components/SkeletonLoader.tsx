import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className='flex flex-col w-full p-8 space-y-4 overflow-y-hidden animate__animated animate__fadeIn animate__faster'>
      <div className='h-8 bg-gray-200 rounded w-2/4 animate-pulse dark:bg-slate-700/60'></div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-2 dark:bg-slate-700/60'>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
      </div>
      <div className='h-80 bg-gray-200 rounded w-full animate-pulse dark:bg-slate-700/60'></div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div className='col-span-1 h-44 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-44 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-2 dark:bg-slate-700/60'>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
        <div className='col-span-1 h-20 bg-gray-200 rounded animate-pulse dark:bg-slate-700/60'></div>
      </div>
      <div className='h-32 bg-gray-200 rounded w-full animate-pulse dark:bg-slate-700/60'></div>
    </div>
  );
};

export default SkeletonLoader;
