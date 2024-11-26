import React, { useEffect, useState } from 'react';
import DelayedSuspense from '../components/DelayedSuspense';
import SkeletonLoader from '../components/SkeletonLoader';
import { Invoice01Icon, Invoice02Icon, PercentCircleIcon, UserGroupIcon, WaterfallDown01Icon } from 'hugeicons-react';
import { getInfo } from '../services/Home';
import { formatNumber } from '../utils/formUtils';

const Home: React.FC = () => {
    const [countData, setCountData] = useState({
        sales: 0,
        total_sales: 0,
        payments: 0,
        total_payments: 0,
        commission: 0
    });

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getInfo();
                const response_resp = response.resp;

                setCountData(response_resp);
            } catch (error) {
            }
        };

        fetchCount();
    }, []);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <h1 className='text-2xl font-bold dark:text-white'>Inicio</h1>
                <span className='text-sm text-gray-600 dark:text-slate-400'>Bienvenido/a</span>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Ventas</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.sales}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            Q
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total ventas</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q{formatNumber(countData.total_sales)}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice02Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Pagos</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.payments}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            Q
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total pagos</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q{formatNumber(countData.total_payments)}</h3>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 mt-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <PercentCircleIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Comision</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.commission}%</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            Q
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total comision</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q0</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <WaterfallDown01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Mis faltas</h2>
                            <h3 className='text-lg font-bold dark:text-white'>0</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Clientes atrasados</h2>
                            <h3 className='text-lg font-bold dark:text-white'>0</h3>
                        </div>
                    </div>
                </div>
            </div>
        </DelayedSuspense>
    );
};

export default Home;