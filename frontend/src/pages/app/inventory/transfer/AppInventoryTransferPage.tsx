import React, { useEffect, useState } from 'react';
import { Add01Icon, Delete02Icon, EyeIcon, PencilEdit02Icon, SearchList02Icon } from 'hugeicons-react';
import { AlertType } from '../../../../types/alert';
import useTranslations from '../../../../hooks/useTranslations';
import DelayedSuspense from '../../../../components/DelayedSuspense';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import FiltersPage from './filtersPage';
import { generateUUID } from '../../../../utils/uuidGen';
import { getCountInventoryTransfer } from '../../../../services/inventoryService';

interface AppInventoryTransferPageProps {
    addAlert: (alert: AlertType) => void;
}

const AppInventoryTransferPage: React.FC<AppInventoryTransferPageProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({total: 0});

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details' | 'product_images', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'quantity', headerName: translations.quantity },
        { name: 'product.name', headerName: translations.product },
        { name: 'location.name', headerName: translations.location_exit },
        { name: 'location.name', headerName: translations.location_entry },
        { name: 'type', headerName: translations.type },
        { name: 'note', headerName: translations.note },
        { name: 'user.first_name', headerName: 'Empleado' },
        { name: 'user_transfer.first_name', headerName: translations.dealer },
        { name: 'user_transfer_receives.first_name', headerName: translations.person_who_receives },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountInventoryTransfer();
                const response_data = response.data;

                setCountData({total: response_data.resp.total});
            } catch (error) {
                addAlert({ id: generateUUID(), text: 'Error fetching count', type: 'danger', timeout: 3000 });
            }
        };

        fetchCount();
    }, [reloadTable, addAlert]);
    
    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.inventory} - {translations.inventory_transfer}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.app_inventory_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === undefined}><Delete02Icon /></button>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === undefined}><PencilEdit02Icon /></button>
                    <button className='bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('details', true)} disabled={selected === undefined}><EyeIcon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <SearchList02Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table 
                        endpoint='app/inventory' 
                        reloadTable={reloadTable} 
                        header={table_header} 
                        order_by='date_reg'
                        tbody={
                            <TablePage 
                                selected={selected} 
                                setSelected={setSelected}
                            />
                        }
                        filters={<FiltersPage />}
                        query='table_transfer'
                    />
                </div>
            </div>

            {isModalOpen.add && (
                <Modal title={translations.add_movement} onClose={() => toggleModal('add', false)} className='max-w-[980px]'>
                    <CrudPage addAlert={addAlert} type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )} 

            {isModalOpen.edit && (
                <Modal title={translations.edit_movement} onClose={() => toggleModal('edit', false)} className='max-w-[980px]'>
                    <CrudPage addAlert={addAlert} type='edit' selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}  

            {isModalOpen.details && (
                <Modal title={translations.details_movement} onClose={() => toggleModal('details', false)} className='max-w-[980px]'>
                    <CrudPage addAlert={addAlert} type='details' selected_id={selected} onClose={() => toggleModal('details', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}  

            {isModalOpen.delete && (
                <Modal title={translations.delete_movement_sure} onClose={() => toggleModal('delete', false)} className='max-w-[980px]'>
                    <CrudPage addAlert={addAlert} type='delete' selected_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}         
        </DelayedSuspense>
    );
};

export default AppInventoryTransferPage;