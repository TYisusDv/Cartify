import React, { useEffect, useState } from 'react';
import { getCountProducts } from '../../../services/productsService';
import { URL_BACKEND } from '../../../services/apiService';
import { Add01Icon, BarCode02Icon, Delete02Icon, EyeIcon, PencilEdit02Icon, ViewOffSlashIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import Modal from '../../../components/Modal';
import TablePage from './TablePage';
import CrudPage from './CrudPage';
import BrandsCrudPage from './brands/CrudPage';
import CategoriesCrudPage from './categories/CrudPage';
import SuppliersCrudPage from '../suppliers/CrudPage';
import TaxCrudPage from '../taxes/CrudPage';
import FiltersPage from './filtersPage';
import ModalPhotos from '../../../components/ModalPhotos';
import TooltipButton from '../../../components/TooltipButton';


const ManageProductsPage: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false, delete: false, details: false, add_brand: false, add_category: false, add_supplier: false, add_tax: false, product_images: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({ total: 0, visible: 0, hidden: 0 });
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'add' | 'edit' | 'delete' | 'details' | 'add_brand' | 'add_category' | 'add_supplier' | 'add_tax' | 'product_images', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const table_header = [
        { name: 'image', headerName: '' },
        { name: 'name', headerName: translations.name },
        { name: 'model', headerName: translations.model },
        { name: 'brand.name', headerName: translations.brand },
        { name: 'category.name', headerName: translations.category },
        { name: 'cost_price', headerName: translations.cost_price },
        { name: 'cash_price', headerName: translations.cash_price },
        { name: 'credit_price', headerName: translations.credit_price },
        { name: 'status', headerName: translations.status },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountProducts();
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
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.products}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_products_info}</span>
                </div>
                <div className="flex gap-2">
                    <TooltipButton
                        tooltip="Eliminar"
                        onClick={() => toggleModal('delete', true)}
                        disabled={selected === ''}
                        className="bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Delete02Icon />}
                    />
                    <TooltipButton
                        tooltip="Editar"
                        onClick={() => toggleModal('edit', true)}
                        disabled={selected === ''}
                        className="bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<PencilEdit02Icon />}
                    />
                    <TooltipButton
                        tooltip="Ver detalles"
                        onClick={() => toggleModal('details', true)}
                        disabled={selected === ''}
                        className="bg-orange-500 text-white border-2 border-orange-500 hover:bg-orange-500/20 hover:text-orange-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-orange-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<EyeIcon />}
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
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <BarCode02Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.total}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <EyeIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>{translations.visible}</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.visible}</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <ViewOffSlashIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>{translations.hidden}</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData.hidden}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table
                        endpoint='manage/products'
                        reloadTable={reloadTable}
                        header={table_header}
                        tbody={
                            <TablePage
                                selected={selected}
                                toggleModal={toggleModal}
                                setSelected={setSelected}
                                setImageUrl={setImageUrl}
                            />
                        }
                        filters={<FiltersPage />}
                    />
                </div>
            </div>
            {isModalOpen.add && (
                <Modal title={translations.add_product} onClose={() => toggleModal('add', false)} className='max-w-screen-md'>
                    <CrudPage type='add' selected_id={selected} onClose={() => toggleModal('add', false)} handleTableReload={handleTableReload} setSelected={setSelected} toggleModal={toggleModal} />
                </Modal>
            )}

            {isModalOpen.edit && (
                <Modal title={translations.edit_product} onClose={() => toggleModal('edit', false)} className='max-w-screen-md'>
                    <CrudPage type='edit' setImageUrl={setImageUrl} selected_id={selected} onClose={() => toggleModal('edit', false)} handleTableReload={handleTableReload} setSelected={setSelected} toggleModal={toggleModal} />
                </Modal>
            )}

            {isModalOpen.delete && (
                <Modal title={translations.delete_product} onClose={() => toggleModal('delete', false)} className='max-w-screen-md'>
                    <CrudPage type='delete' setImageUrl={setImageUrl} selected_id={selected} onClose={() => toggleModal('delete', false)} handleTableReload={handleTableReload} setSelected={setSelected} toggleModal={toggleModal} />
                </Modal>
            )}

            {isModalOpen.details && (
                <Modal title={translations.details_product} onClose={() => toggleModal('details', false)} className='max-w-screen-md'>
                    <CrudPage type='details' setImageUrl={setImageUrl} selected_id={selected} onClose={() => toggleModal('details', false)} handleTableReload={handleTableReload} setSelected={setSelected} toggleModal={toggleModal} />
                </Modal>
            )}

            {isModalOpen.add_brand && (
                <Modal title={translations.add_product_brand} onClose={() => toggleModal('add_brand', false)}>
                    <BrandsCrudPage type='add' onClose={() => toggleModal('add_brand', false)} />
                </Modal>
            )}

            {isModalOpen.add_category && (
                <Modal title={translations.add_product_category} onClose={() => toggleModal('add_category', false)}>
                    <CategoriesCrudPage type='add' onClose={() => toggleModal('add_category', false)} />
                </Modal>
            )}

            {isModalOpen.add_supplier && (
                <Modal title={translations.add_supplier} onClose={() => toggleModal('add_supplier', false)}>
                    <SuppliersCrudPage type='add' onClose={() => toggleModal('add_supplier', false)} />
                </Modal>
            )}

            {isModalOpen.add_tax && (
                <Modal title={translations.add_tax} onClose={() => toggleModal('add_tax', false)}>
                    <TaxCrudPage type='add' onClose={() => toggleModal('add_tax', false)} />
                </Modal>
            )}

            {isModalOpen.product_images && (
                <ModalPhotos onClose={() => toggleModal('product_images', false)}>
                    <div className='flex w-full h-full justify-center'>
                        <img src={`${URL_BACKEND}${imageUrl}`} alt='Product' className='rounded-2xl' />
                    </div>
                </ModalPhotos>
            )}
        </DelayedSuspense>
    );
};

export default ManageProductsPage;