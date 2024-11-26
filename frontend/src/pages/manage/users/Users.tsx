import React, { useEffect, useState } from 'react';
import { Add01Icon, Delete02Icon, PencilEdit02Icon, StoreLocation02Icon, UserGroupIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TBody';
import CrudPage from './Crud';
import { getCount } from '../../../services/Users';
import TooltipButton from '../../../components/TooltipButton';

const Users: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState(0);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'first_name', headerName: 'Nombre(s)' },
        { name: 'last_name', headerName: 'Apellido(s)' },
        { name: 'email', headerName: 'Correo electronico' },
        { name: 'profile.phone', headerName: translations.phone },
        { name: 'profile.commission', headerName: 'Comision' },
        { name: 'profile.location.name', headerName: translations.location },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCount();
                const response_resp = response.resp;

                setCountData(response_resp.total);
            } catch (error) {
            }
        };

        fetchCount();
    }, [reloadTable]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>Usuarios</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>Admintrar usuarios</span>
                </div>
                <div className="flex gap-2">                    
                    <TooltipButton
                        tooltip="Editar"
                        onClick={() => toggleModal("edit", true)}
                        disabled={selected === undefined}
                        className="bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<PencilEdit02Icon />}
                    />
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/users' reloadTable={reloadTable} header={table_header} tbody={<TablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>            
            {isModalOpen.edit && (
                <Modal title='Editar usuario' onClose={() => toggleModal('edit', false)}>
                    <CrudPage type='edit' selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Users;