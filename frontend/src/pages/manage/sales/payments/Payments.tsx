import React, { useEffect, useState } from 'react';
import { Add01Icon, EyeIcon, Invoice02Icon, Invoice03Icon, Invoice04Icon, MinusSignIcon, PencilEdit02Icon, ShoppingBasketSecure03Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import DelayedSuspense from '../../../../components/DelayedSuspense';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCountPayments } from '../../../../services/SalesService';
import { URL_BACKEND } from '../../../../services/apiService';

const Payments: React.FC = () => {
    const { translations } = useTranslations();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [saleId, setSaleId] = useState<number | undefined>(isNaN(parseInt(queryParams.get('id') || '0')) ? undefined : parseInt(queryParams.get('id') || '0'));
    const [selected, setSelected] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({
        total: 0,
        total_payment: 0,
        remaining: 0
    });

    useEffect(() => {
        if (!saleId) {
          navigate('/manage/sales');
          setSaleId(undefined);
          return;
        }
      }, [saleId, navigate]);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'details', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'no', headerName: 'No. Recibo' },
        { name: 'payment_method.name', headerName: 'Metodo de pago' },
        { name: 'note', headerName: 'Nota/Referencia' },
        { name: 'subtotal', headerName: 'Total a pagar' },
        { name: 'total', headerName: 'Total pagado' },
        { name: '', headerName: 'Total restante' },
        { name: 'date_limit', headerName: 'Fecha limite' },        
        { name: 'user.first_name', headerName: 'Empleado' },
    ];

    const handleInvoice = () => {
        window.open(`${URL_BACKEND}/pdf/payment?id=${selected}`, '_blank');
    }

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountPayments(saleId || 0);
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
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.manage_sale_payments}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_sale_payments_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-green-500 text-white border-2 border-green-500 hover:bg-green-500/20 hover:text-green-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-green-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={handleInvoice} disabled={selected === undefined}><Invoice04Icon /></button>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === undefined}><PencilEdit02Icon /></button>
                    <button className='bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('details', true)} disabled={selected === undefined}><EyeIcon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice03Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>No. Factura</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{saleId}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <ShoppingBasketSecure03Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total de pagos</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 md:pb-0 md:border-b-0 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice02Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total a pagar</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total_payment}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <MinusSignIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total restante</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.remaining}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/sale/payments' id={saleId || 0} order='asc' order_by='date_limit' reloadTable={reloadTable} header={table_header} tbody={<TablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title={translations.add_payment} onClose={() => setIsModalOpen({ ...isModalOpen, add: false })}>
                    <CrudPage type='add' saleId={saleId} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, add: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title={translations.edit_payment} onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })}>
                    <CrudPage type='edit' saleId={saleId} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.details && (
                <Modal title={translations.details_payment} onClose={() => setIsModalOpen({ ...isModalOpen, details: false })}>
                    <CrudPage type='details' saleId={saleId} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, details: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Payments;