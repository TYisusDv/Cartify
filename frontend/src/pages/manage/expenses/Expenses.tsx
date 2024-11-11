import React, { useEffect, useState } from 'react';
import { Add01Icon, BarCode02Icon, Delete02Icon, Invoice01Icon, Invoice02Icon, PencilEdit02Icon, StoreLocation02Icon, Tick01Icon, WaterfallDown01Icon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TBody';
import CrudPage from './Crud';
import { getCount } from '../../../services/Exprenses';
import { Link } from 'react-router-dom';
import Filters from './Filters';

const Expenses: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({
        total: 0,
        total_sum: 0,
        total_paid: 0,
        total_remaining: 0
    });

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'no', headerName: 'No. Factura' },
        { name: 'total', headerName: 'Total de factura' },
        { name: '', headerName: 'Total abonado' },
        { name: '', headerName: 'Total restante' },
        { name: 'supplier.company_name', headerName: translations.supplier },
        { name: 'date_limit', headerName: 'Fecha limite' },
        { name: 'user.first_name', headerName: 'Empleado' },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCount();
                const response_resp = response.resp;

                setCountData(response_resp);
            } catch (error) {
            }
        };

        fetchCount();
    }, [reloadTable]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>Gastos</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>Administra</span>
                </div>
                <div className='flex gap-2'>
                    <Link to={`/manage/expenses/payments?id=${selected}`}><button className='bg-green-500 text-white border-2 border-green-500 hover:bg-green-500/20 hover:text-green-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-green-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' disabled={selected === undefined}><Invoice01Icon /></button></Link>
                    <Link to={`/manage/expenses/details?id=${selected}`}><button className='bg-green-500 text-white border-2 border-green-500 hover:bg-green-500/20 hover:text-green-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-green-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' disabled={selected === undefined}><BarCode02Icon /></button></Link>
                    <button className='bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === undefined}><Delete02Icon /></button>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === undefined}><PencilEdit02Icon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <WaterfallDown01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Tick01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total facturado</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q{countData.total_sum}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Tick01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total pagado</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q{countData.total_paid}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice02Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total pendiente</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q{countData.total_remaining}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table 
                        endpoint='manage/expenses' 
                        order='desc' 
                        order_by='date_reg' 
                        reloadTable={reloadTable} 
                        header={table_header} 
                        tbody={
                            <TablePage 
                                selected={selected} 
                                setSelected={setSelected} 
                            />
                        } 
                        filters={<Filters />}
                    />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title='Agregar gasto' onClose={() => toggleModal('add', false)}>
                    <CrudPage type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title='Editar gasto' onClose={() => toggleModal('edit', false)}>
                    <CrudPage type='edit' selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title='Eliminar gasto' onClose={() => toggleModal('delete', false)}>
                    <CrudPage type='delete' selected_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Expenses;