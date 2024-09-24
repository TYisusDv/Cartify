import React, { useState } from 'react';
import { Add01Icon, Delete02Icon, EyeIcon, PencilEdit02Icon } from 'hugeicons-react';
import { AlertType } from '../../../types/alert';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';

interface AppInventoryPageProps {
    addAlert: (alert: AlertType) => void;
}

const AppInventoryPage: React.FC<AppInventoryPageProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details' | 'product_images', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: '', headerName: 'Fecha de registro' },
        { name: '', headerName: 'Cantidad' },
        { name: '', headerName: 'Producto' },
        { name: '', headerName: 'Ubicación' },
        { name: '', headerName: 'Nota' },
        { name: '', headerName: 'Empleado' },
    ];
    
    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.inventory}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.app_inventory_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('delete', true)} disabled={selected === ''}><Delete02Icon /></button>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === ''}><PencilEdit02Icon /></button>
                    <button className='bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('details', true)} disabled={selected === ''}><EyeIcon /></button>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('add', true)}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 gap-3 animate__animated animate__fadeIn animate__faster'>
                <h1 className='text-black font-bold text-lg pb-2 dark:text-white border-b-2 dark:border-slate-600'>Entradas</h1>
                <div className='w-full'>
                    <Table 
                        endpoint='manage/products' 
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
                <h1 className='text-black font-bold text-lg pb-2 dark:text-white border-b-2 dark:border-slate-600'>Salidas</h1>
                <div className='w-full'>
                    <Table 
                        endpoint='manage/products' 
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
                <h1 className='text-black font-bold text-lg pb-2 dark:text-white border-b-2 dark:border-slate-600'>Traslados</h1>
                <div className='w-full'>
                    <Table 
                        endpoint='manage/products' 
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
                <Modal title={translations.add_movement} onClose={() => toggleModal('add', false)} className='max-w-[980px]'>
                    <CrudPage addAlert={addAlert} type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}         
        </DelayedSuspense>
    );
};

export default AppInventoryPage;