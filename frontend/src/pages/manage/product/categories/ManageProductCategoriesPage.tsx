import React, { useEffect, useState } from 'react';
import { getCountProductCategories } from '../../../../services/productCategoriesService';
import { Add01Icon, Delete02Icon, Layers01Icon, PencilEdit02Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import DelayedSuspense from '../../../../components/DelayedSuspense';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Table from '../../../../components/Table';
import Modal from '../../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import TooltipButton from '../../../../components/TooltipButton';

const ManageProductCategoriesPage: React.FC = () => {
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
        { name: 'name', headerName: translations.name },
        { name: 'page_number', headerName: 'Numero de pagina del certificado' },
        { name: 'status', headerName: translations.status },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountProductCategories();
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
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.product_categories}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_product_categories_info}</span>
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
                        tooltip="Editar"
                        onClick={() => toggleModal("edit", true)}
                        disabled={selected === undefined}
                        className="bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<PencilEdit02Icon />}
                    />
                    <TooltipButton
                        tooltip="Agregar"
                        onClick={() => toggleModal("add", true)}
                        className="bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Add01Icon />}
                    />
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Layers01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/product/categories' reloadTable={reloadTable} header={table_header} tbody={<TablePage selected={selected} setSelected={setSelected} />} />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title={translations.add_product_category} onClose={() => toggleModal('add', false)}>
                    <CrudPage type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title={translations.edit_product_category} onClose={() => toggleModal('edit', false)}>
                    <CrudPage type='edit' selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title={translations.delete_product_category} onClose={() => toggleModal('delete', false)}>
                    <CrudPage type='delete' selected_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default ManageProductCategoriesPage;