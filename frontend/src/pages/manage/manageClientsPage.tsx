import React, { useState } from 'react';
import { Add01Icon, Delete02Icon, PencilEdit02Icon, UserGroupIcon } from 'hugeicons-react';
import { AlertType } from '../../types/alert';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import ManageAddClientPage from './clients/manageAddClientPage';
import ManageClientsTablePage from './clients/manageClientsTablePage';
import ManageDeleteClientPage from './clients/manageDeleteClientPage';

interface ManageClientsProps {
    addAlert: (alert: AlertType) => void;
}

const ManageClientsPage: React.FC<ManageClientsProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, delete: false });
    const [reloadTable, setReloadTable] = useState(0);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1); 
    };

    const toggleModal = (modalType: 'add' | 'delete', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'person.alias', headerName: translations.alias },
        { name: 'person.firstname', headerName: translations.firstname },
        { name: 'person.middlename', headerName: translations.middlename },
        { name: 'person.lastname', headerName: translations.lastname },
        { name: 'person.second_lastname', headerName: translations.second_lastname },
        { name: 'person.phone', headerName: translations.phone },
        { name: 'person.birthdate', headerName: translations.birthdate },
        { name: 'person.addresses[0].city.name', headerName:  translations.address_city },
    ];

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.clients}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_clients_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white hover:bg-gray-200 hover:text-black dark:hover:bg-slate-600 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-slate-700 dark:hover:text-white dark:bg-red-600 dark:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === undefined}><Delete02Icon /></button>
                    <button className='bg-yellow-600 text-white hover:bg-gray-200 hover:text-black dark:hover:bg-slate-600 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-slate-700 dark:hover:text-white dark:bg-yellow-600 dark:text-white rounded-full p-3' onClick={() => toggleModal('add', true)} disabled={selected === undefined}><PencilEdit02Icon /></button>
                    <button className='bg-blue-600 text-white hover:bg-gray-200 hover:text-black dark:hover:bg-slate-600 disabled:bg-gray-100 disabled:text-black dark:disabled:bg-slate-700 dark:hover:text-white dark:bg-blue-600 dark:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 md:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
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
                <div className='w-full mt-6'>
                    <Table endpoint='manage/clients' reloadTable={reloadTable} header={table_header} tbody={<ManageClientsTablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title={translations.add_client} onClose={() => toggleModal('add', false)}>
                    <ManageAddClientPage addAlert={addAlert} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title={translations.delete_client_sure} onClose={() => toggleModal('delete', false)}>
                    <ManageDeleteClientPage addAlert={addAlert} client_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default ManageClientsPage;