import React, { useEffect, useState } from 'react';
import { getCountSuppliers } from '../../../services/suppliersService';
import { Add01Icon, Delete02Icon, DistributionIcon, EyeIcon, Invoice02Icon, PencilEdit02Icon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import TablePage from './TablePage';
import FiltersPage from './filtersPage';
import TableCreditPage from './TableCreditPage';
import { Link } from 'react-router-dom';

const ManageSalesPage: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState(0);
    const [typeOfSale, setTypeOfSale] = useState(0);

    const initialTableHeader = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'id', headerName: 'No. Factura' },
        { name: 'id', headerName: 'Metodo de pago' },
        { name: 'id', headerName: 'Nota y referencia' },
        { name: 'total', headerName: 'Total' },
        { name: 'id', headerName: 'Sucursal' },
        { name: 'client.person.firstname', headerName: 'Cliente' },
        { name: 'id', headerName: 'Empleado' },
        { name: 'id', headerName: 'Productos' }
    ];

    const [tableHeader, setTableHeader] = useState(initialTableHeader);

    const initialTbody = <TablePage selected={selected} setSelected={setSelected} />
    
    const [tableTbody, setTableTbody] = useState(initialTbody);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountSuppliers();
                const response_resp = response.resp;

                setCountData(response_resp.total);
            } catch (error) {
            }
        };

        fetchCount();
    }, [reloadTable]);

    useEffect(() => {
        if(typeOfSale === 2){
            setTableHeader([
                { name: 'date_reg', headerName: 'Fecha de registro' },
                { name: 'id', headerName: 'Estado de factura' },
                { name: 'id', headerName: 'No. Factura' },
                { name: 'total', headerName: 'Total' },
                { name: 'id', headerName: 'Sucursal' },
                { name: 'client.person.firstname', headerName: 'Cliente' },
                { name: 'id', headerName: 'Empleado' },
                { name: 'id', headerName: 'Productos' }
            ]);
            setTableTbody(<TableCreditPage selected={selected} setSelected={setSelected} />);
        } else {
            setTableHeader(initialTableHeader);
            setTableTbody(initialTbody);            
        }
    }, [typeOfSale, selected]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.sales}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_sales_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === 0}><Delete02Icon /></button>
                    <Link to={`/manage/sale/payments?id=${selected}`}><button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === 0}><Invoice02Icon /></button></Link>
                    <button className='bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('details', true)} disabled={selected === 0}><EyeIcon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <DistributionIcon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/sales' 
                        reloadTable={reloadTable} 
                        header={tableHeader} 
                        tbody={tableTbody} 
                        filters={
                            <FiltersPage
                                setValue={setTypeOfSale}
                            />
                        }
                    />
                </div>
            </div>            
        </DelayedSuspense>
    );
};

export default ManageSalesPage;