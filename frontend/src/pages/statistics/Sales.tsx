import React, { useState } from 'react';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import { Invoice01Icon } from 'hugeicons-react';
import Table from '../../components/Table';
import TBody from './TBody';

const Sales: React.FC = () => {
    const { translations } = useTranslations();

    const [reloadTable, setReloadTable] = useState(0);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    }

    const table_header = [
        { name: '', headerName: 'Metodo de pago' },
        { name: '', headerName: 'Total' },
    ];

    const table_header_locations = [
        { name: '', headerName: 'Metodo de pago' },
    ];

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex flex-col w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <h1 className='text-2xl font-bold dark:text-white'>{translations.statistics}</h1>
                <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.statistics}</span>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <h1 className='font-bold text-xl text-black dark:text-white'>Total metodos de pago</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 mt-3 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-gray-100 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q0</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table 
                        endpoint='manage/sale/payments'
                        reloadTable={reloadTable}
                        header={table_header}
                        tbody={
                            <TBody/>
                        } 
                    />
                </div>
                <h1 className='font-bold text-xl text-black dark:text-white'>Total metodos de pago por sucursal</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 mt-3 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-gray-100 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q0</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table 
                        endpoint='manage/sale/payments'
                        reloadTable={reloadTable}
                        header={table_header_locations}
                        tbody={
                            <TBody/>
                        } 
                    />
                </div>
            </div>
        </DelayedSuspense>
    );
};

export default Sales;