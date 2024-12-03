import React, { useEffect, useState } from 'react';
import { Add01Icon, Delete02Icon, DoNotTouch01Icon, ShoppingBasketSecure03Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import DelayedSuspense from '../../../../components/DelayedSuspense';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import { useLocation, useNavigate } from 'react-router-dom';
import TooltipButton from '../../../../components/TooltipButton';
import { getCount } from '../../../../services/Absences';

const Fouls: React.FC = () => {
    const { translations } = useTranslations();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [queryID, setQueryID] = useState<number | undefined>(isNaN(parseInt(queryParams.get('id') || '0')) ? undefined : parseInt(queryParams.get('id') || '0'));
    const [selected, setSelected] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, delete: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({
        total: 0,
        total_payment: 0,
        remaining: 0
    });

    useEffect(() => {
        if (!queryID) {
            navigate('/manage/users');
            setQueryID(undefined);
            return;
        }
    }, [queryID, navigate]);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'delete', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'note', headerName: 'Nota' },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCount(queryID || 0);
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
                    <h1 className='text-2xl font-bold dark:text-white'>Faltas</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>Administra las faltas del empleado</span>
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
                        tooltip="Agregar"
                        onClick={() => toggleModal('add', true)}
                        className="bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Add01Icon />}
                    />
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>No. Empleado</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{queryID}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <DoNotTouch01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total de faltas</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table
                        endpoint='manage/users/absences'
                        id={queryID || 0}
                        order='desc'
                        order_by='date_reg'
                        reloadTable={reloadTable}
                        header={table_header}
                        tbody={<TablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title='Agregar falta' onClose={() => setIsModalOpen({ ...isModalOpen, add: false })}>
                    <CrudPage type='add' queryID={queryID} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, add: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
            {isModalOpen.delete && (
                <Modal title='Eliminar falta' onClose={() => setIsModalOpen({ ...isModalOpen, delete: false })}>
                    <CrudPage type='delete' queryID={queryID} selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, delete: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Fouls;