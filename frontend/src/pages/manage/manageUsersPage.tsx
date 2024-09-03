import React from 'react';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import { UserGroupIcon } from 'hugeicons-react';

const ManageUsersPage: React.FC = () => {
  const { translations } = useTranslations();

  return (
    <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>        
     <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn'>
          <h1 className='text-2xl font-bold'>{translations.users}</h1>
          <span className='text-sm text-gray-700 '>{translations.manage_users_info}</span>
      </div>
      <div className='flex flex-col p-8 animate__animated animate__fadeIn'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 pt-6 pb-6'>
            <div className='col-span-1 flex items-center gap-3 border-r-2 border-gray-100'>
                <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full'>
                    <UserGroupIcon />
                </div>
                <div>
                    <h2 className='text-sm font-semibold'>Total</h2>
                    <h3 className='text-lg font-bold'>18</h3>
                </div>
            </div>
            <div className='col-span-1 flex items-center gap-3 border-r-2 border-gray-100'>
                <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full'>
                    <UserGroupIcon />
                </div>
                <div>
                    <h2 className='text-sm font-semibold'>Total</h2>
                    <h3 className='text-lg font-bold'>18</h3>
                </div>
            </div>
            <div className='col-span-1 flex items-center gap-3 border-r-2 border-gray-100'>
                <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full'>
                    <UserGroupIcon />
                </div>
                <div>
                    <h2 className='text-sm font-semibold'>Total</h2>
                    <h3 className='text-lg font-bold'>18</h3>
                </div>
            </div>
            <div className='col-span-1 flex items-center gap-3'>
                <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full'>
                    <UserGroupIcon />
                </div>
                <div>
                    <h2 className='text-sm font-semibold'>Total</h2>
                    <h3 className='text-lg font-bold'>18</h3>
                </div>
            </div>
        </div>
      </div>
    </DelayedSuspense>
  );
};

export default ManageUsersPage;