import React, { useEffect, useState } from 'react';
import { getCountSuppliers } from '../../services/suppliersService';
import { Add01Icon, Delete02Icon, DistributionIcon, EyeIcon, PencilEdit02Icon } from 'hugeicons-react';
import { AlertType } from '../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import TablePage from './suppliers/TablePage';
import CrudPage from './suppliers/CrudPage';

interface ManageSuppliersProps {
    addAlert: (alert: AlertType) => void;
}

const ManageSuppliersPage: React.FC<ManageSuppliersProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countClients, setCountClients] = useState(0);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'company_identification', headerName: 'Company identification' },
        { name: 'company_name', headerName: 'Company name' },
        { name: 'company_email', headerName: 'Company email' },
        { name: 'company_phone', headerName: 'Company phone' },
        { name: 'company_address', headerName: 'Company address' },
    ];

    useEffect(() => {
        const fetchCountClients = async () => {
            try {
                const response = await getCountSuppliers();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                setCountClients(response_data.resp.total);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching count clients', type: 'danger', timeout: 3000 });
            }
        };

        fetchCountClients();
    }, [reloadTable, addAlert]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.suppliers}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_suppliers_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === 0}><Delete02Icon /></button>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === 0}><PencilEdit02Icon /></button>
                    <button className='bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('details', true)} disabled={selected === 0}><EyeIcon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-5 border-gray-100 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <DistributionIcon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countClients}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/suppliers' reloadTable={reloadTable} header={table_header} tbody={<TablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title={translations.add_supplier} onClose={() => toggleModal('add', false)}>
                    <CrudPage addAlert={addAlert} type='add' supplier_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title={translations.edit_supplier} onClose={() => toggleModal('edit', false)}>
                    <CrudPage addAlert={addAlert} type='edit' supplier_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title={translations.delete_supplier_sure} onClose={() => toggleModal('delete', false)}>
                    <CrudPage addAlert={addAlert} type='delete' supplier_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.details && (
                <Modal title={translations.details_supplier} onClose={() => toggleModal('details', false)}>
                    <CrudPage addAlert={addAlert} type='details' supplier_id={selected} onClose={() => toggleModal('details', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}          
        </DelayedSuspense>
    );
};

export default ManageSuppliersPage;