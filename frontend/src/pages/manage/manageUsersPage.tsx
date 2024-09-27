import React, { useState } from 'react';
import { Search01Icon, UserGroupIcon } from 'hugeicons-react';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import Input from '../../components/Input';

const ManageUsersPage: React.FC = () => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState({ search: '' });

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <h1 className='text-2xl font-bold dark:text-white'>{translations.users}</h1>
                <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_users_info}</span>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 md:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pb-0 md:border-r-2 md:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col mt-8 gap-2'>
                    
                    <div className='flex w-full'>  
                        <div className="overflow-x-auto sm:rounded-lg w-full">
                            <table className="w-full text-sm text-left">
                                <thead className="text-sm text-gray-700 uppercase bg-gray-200 dark:bg-slate-600 dark:text-white">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Product name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Product name
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-sm text-gray-700 bg-gray-100 dark:bg-slate-700 dark:text-white">                                       
                                        <td className="px-6 py-4">
                                            Laptop
                                        </td>
                                        <td className="px-6 py-4">
                                            Laptop
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </DelayedSuspense>
    );
};

export default ManageUsersPage;