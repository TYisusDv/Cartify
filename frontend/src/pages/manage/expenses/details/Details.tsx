import React, { useEffect, useState } from 'react';
import { Add01Icon, BarCode02Icon, Delete02Icon, PencilEdit02Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import DelayedSuspense from '../../../../components/DelayedSuspense';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import Crud from './Crud';
import { useLocation, useNavigate } from 'react-router-dom';
import TBody from './TBody';
import { getCountDetails } from '../../../../services/ExprenseDetails';
import TooltipButton from '../../../../components/TooltipButton';

const Details: React.FC = () => {
    const { translations } = useTranslations();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [expenseId, setExpenseId] = useState<string | undefined>(queryParams.get('id') || undefined);
    const [selected, setSelected] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({
        total: 0
    });

    useEffect(() => {
        if (!expenseId) {
            navigate('/manage/expenses');
            setExpenseId(undefined);
            return;
        }
    }, [expenseId, navigate]);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'product.name', headerName: translations.product },
        { name: 'quantity', headerName: translations.quantity },
        { name: 'cost', headerName: 'Costo' },
        { name: 'user.first_name', headerName: 'Empleado' },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountDetails(expenseId);
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
                    <h1 className='text-2xl font-bold dark:text-white'>Productos</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>Administra productos</span>
                </div>
                <div className="flex gap-2">
                    <TooltipButton
                        tooltip="Eliminar"
                        onClick={() => toggleModal("delete", true)}
                        disabled={selected === undefined}
                        className="bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Delete02Icon />}
                    />
                    <TooltipButton
                        tooltip="Editar"
                        onClick={() => toggleModal("edit", true)}
                        disabled={selected === undefined}
                        className="bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<PencilEdit02Icon />}
                    />
                    <TooltipButton
                        tooltip="Agregar"
                        onClick={() => toggleModal("add", true)}
                        className="bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Add01Icon />}
                    />
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <BarCode02Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/expenses/details' id={expenseId || 0} reloadTable={reloadTable} header={table_header} tbody={<TBody selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title='Agregar producto a la factura por pagar' onClose={() => setIsModalOpen({ ...isModalOpen, add: false })}>
                    <Crud type='add' expenseId={expenseId} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, add: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title='Editar producto de la factura por pagar' onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })}>
                    <Crud type='edit' expenseId={expenseId} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title='Elimnar el producto de la factura por pagar' onClose={() => setIsModalOpen({ ...isModalOpen, delete: false })}>
                    <Crud type='delete' expenseId={expenseId} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, delete: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Details;