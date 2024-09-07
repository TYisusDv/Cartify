import React, { useState } from 'react';
import { Add01Icon, UserGroupIcon } from 'hugeicons-react';
import { AlertType } from '../../types/alert';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import ManageAddClientPage from './clients/manageAddClientPage';
import ManageClientsTablePage from './clients/manageClientsTablePage';

interface ManageClientsProps {
    addAlert: (alert: AlertType) => void;
}

const ManageClientsPage: React.FC<ManageClientsProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const openModalAdd = () => {
        setIsModalAddOpen(true);
    };

    const closeModalAdd = () => {
        setIsModalAddOpen(false);
    };

    const table_header = [
        { name: 'id', headerName: 'ID' },        
        { name: 'person.alias', headerName: translations.alias },
        { name: 'person.firstname', headerName: translations.firstname },
        { name: 'person.middlename', headerName: translations.middlename },
        { name: 'person.lastname', headerName: translations.lastname },
        { name: 'person.second_lastname', headerName: translations.second_lastname },
        { name: 'person.phone', headerName: translations.phone },
        { name: 'person.birthdate', headerName: translations.birthdate },
        { name: 'person.addresses[0].city.name', headerName:  translations.address_city },
        { name: 'id', headerName: translations.actions },
    ];

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.clients}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_clients_info}</span>
                </div>
                <div>
                    <button className='bg-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:bg-slate-600 dark:text-white rounded-full p-3' onClick={openModalAdd}><Add01Icon /></button>
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
                    <Table endpoint='manage/clients' header={table_header} tbody={<ManageClientsTablePage />} />
                </div>
            </div>
            {isModalAddOpen && (
                <Modal title={translations.add_client} onClose={closeModalAdd}>
                    <ManageAddClientPage addAlert={addAlert} onClose={closeModalAdd} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default ManageClientsPage;