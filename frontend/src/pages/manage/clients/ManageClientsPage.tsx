import React, { useEffect, useState } from 'react';
import { Add01Icon, LocationUser04Icon, Delete02Icon, EyeIcon, PencilEdit02Icon } from 'hugeicons-react';
import { AlertType } from '../../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import { getCountClients } from '../../../services/clientsService';

interface ManageClientsPageProps {
    addAlert: (alert: AlertType) => void;
}

const ManageClientsPage: React.FC<ManageClientsPageProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({total: 0, visible: 0, hidden: 0});

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'person.identification_picture', headerName: '' },
        { name: 'person.alias', headerName: translations.alias },
        { name: 'person.firstname', headerName: translations.firstname },
        { name: 'person.middlename', headerName: translations.middlename },
        { name: 'person.lastname', headerName: translations.lastname },
        { name: 'person.second_lastname', headerName: translations.second_lastname },
        { name: 'person.phone', headerName: translations.phone },
        { name: 'person.birthdate', headerName: translations.birthdate },
        { name: 'person.addresses[0].city.name', headerName: translations.address_city },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountClients();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                setCountData(response_data.resp);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching count', type: 'danger', timeout: 3000 });
            }
        };

        fetchCount();
    }, [reloadTable, addAlert]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.clients}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_clients_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === 0}><Delete02Icon /></button>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === 0}><PencilEdit02Icon /></button>
                    <button className='bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('details', true)} disabled={selected === 0}><EyeIcon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 border-gray-100 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <LocationUser04Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table 
                        endpoint='manage/clients' 
                        reloadTable={reloadTable} 
                        header={table_header} 
                        tbody={
                            <TablePage 
                                selected={selected} 
                                setSelected={setSelected}
                            />
                        } 
                    />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title={translations.add_client} onClose={() => toggleModal('add', false)} className='max-w-screen-xl'>
                    <CrudPage addAlert={addAlert} type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title={translations.edit_client} onClose={() => toggleModal('edit', false)} className='max-w-screen-xl'>
                    <CrudPage addAlert={addAlert} type='edit' selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title={translations.delete_client} onClose={() => toggleModal('delete', false)} className='max-w-screen-xl'>
                    <CrudPage addAlert={addAlert} type='delete' selected_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.details && (
                <Modal title={translations.details_client} onClose={() => toggleModal('details', false)} className='max-w-screen-xl'>
                    <CrudPage addAlert={addAlert} type='details' selected_id={selected} onClose={() => toggleModal('details', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}         
        </DelayedSuspense>
    );
};

export default ManageClientsPage;