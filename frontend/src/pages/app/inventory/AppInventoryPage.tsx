import React, { useEffect, useState } from 'react';
import { Add01Icon, Delete02Icon, EyeIcon, PencilEdit02Icon, SearchList02Icon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import FiltersPage from './filtersPage';
import { getCountInventory } from '../../../services/inventoryService';
import TooltipButton from '../../../components/TooltipButton';

const AppInventoryPage: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<string | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({ total: 0 });
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];
    const [formValues, setFormValues] = useState({ date_1: formattedToday, date_2: formattedTomorrow });

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details' | 'product_images', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'quantity', headerName: 'Cantidad' },
        { name: 'product.name', headerName: 'Producto' },
        { name: 'location.name', headerName: 'Ubicación' },
        { name: 'type', headerName: 'Tipo' },
        { name: 'area', headerName: 'Area' },
        { name: 'note', headerName: 'Nota' },
        { name: 'user.first_name', headerName: 'Empleado' },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountInventory(formValues);
                const response_resp = response.resp;

                setCountData({ total: response_resp.total });
            } catch (error) {

            }
        };

        fetchCount();
    }, [reloadTable, formValues]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.inventory}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.app_inventory_info}</span>
                </div>
                <div className="flex gap-2">
                    <TooltipButton
                        tooltip="Eliminar"
                        onClick={() => toggleModal('delete', true)}
                        className="bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Delete02Icon />}
                        disabled={selected === undefined}
                    />
                    <TooltipButton
                        tooltip="Editar"
                        onClick={() => toggleModal('edit', true)}
                        className="bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<PencilEdit02Icon />}
                        disabled={selected === undefined}
                    />
                    <TooltipButton
                        tooltip="Detalles"
                        onClick={() => toggleModal('details', true)}
                        className="bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<EyeIcon />}
                        disabled={selected === undefined}
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
                        filters={<FiltersPage formValuesPage={formValues} setFormValuesPage={setFormValues} />}
                        filters_params={formValues}
                    />
                </div>
            </div>

            {isModalOpen.add && (
                <Modal title={translations.add_movement} onClose={() => toggleModal('add', false)} className='max-w-[980px]'>
                    <CrudPage type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title={translations.edit_movement} onClose={() => toggleModal('edit', false)} className='max-w-[980px]'>
                    <CrudPage type='edit' selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.details && (
                <Modal title={translations.details_movement} onClose={() => toggleModal('details', false)} className='max-w-[980px]'>
                    <CrudPage type='details' selected_id={selected} onClose={() => toggleModal('details', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title={translations.delete_movement_sure} onClose={() => toggleModal('delete', false)} className='max-w-[980px]'>
                    <CrudPage type='delete' selected_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default AppInventoryPage;