import React, { useEffect, useState } from 'react';
import { MedicalMaskIcon, PencilEdit02Icon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import TooltipButton from '../../../components/TooltipButton';
import { getMyCount } from '../../../services/Breaks';

const Breaks: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({
        total: 0,
        total_payment: 0,
        remaining: 0
    });

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'note', headerName: 'Nota' },
        { name: 'status', headerName: 'Estado' },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getMyCount();
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
                    <h1 className='text-2xl font-bold dark:text-white'>Mis descansos</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>Administra mis descansos</span>
                </div>
                <div className="flex gap-2">                    
                    <TooltipButton
                        tooltip="Editar"
                        onClick={() => toggleModal('edit', true)}
                        className="bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<PencilEdit02Icon />}
                        disabled={selected === undefined}
                    />
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <MedicalMaskIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table
                        endpoint='app/breaks'
                        order='desc'
                        order_by='date_reg'
                        reloadTable={reloadTable}
                        header={table_header}
                        tbody={<TablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.edit && (
                <Modal title='Editar descanso' onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })}>
                    <CrudPage type='edit' selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Breaks;