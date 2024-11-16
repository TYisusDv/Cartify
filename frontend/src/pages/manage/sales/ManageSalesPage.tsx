import React, { useEffect, useState } from 'react';
import { getCountSuppliers } from '../../../services/suppliersService';
import { ContractsIcon, Invoice02Icon, Pdf01Icon, PencilEdit02Icon, ShoppingBasketSecure03Icon, SignatureIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Table from '../../../components/Table';
import TablePage from './TablePage';
import FiltersPage from './filtersPage';
import { Link } from 'react-router-dom';
import Modal from '../../../components/Modal';
import CrudPage from './Crud';
import { URL_BACKEND } from '../../../services/apiService';
import SignaturePad from '../../../components/Signature';

const ManageSalesPage: React.FC = () => {
    const { translations } = useTranslations();
    const [selected, setSelected] = useState<number | undefined>();
    const [isModalOpen, setIsModalOpen] = useState({ edit: false, signature: false });
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState(0);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const toggleModal = (modalType: 'edit' | 'signature', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountSuppliers();
                const response_resp = response.resp;

                setCountData(response_resp.total);
            } catch (error) {
            }
        };

        fetchCount();
    }, [reloadTable]);

    const table_header = [
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'id', headerName: 'No. Factura' },
        { name: 'status.name', headerName: 'Estado' },
        { name: 'total', headerName: 'Total' },
        { name: '', headerName: 'Pagos pendientes' },
        { name: 'location.name', headerName: 'Sucursal' },
        { name: 'client.person.firstname', headerName: 'Cliente' },
        { name: 'user.first_name', headerName: 'Empleado' },
        { name: '', headerName: 'Productos' }
    ];

    const handleCertificate = () => {
        window.open(`${URL_BACKEND}/pdf/certificate?id=${selected}`, '_blank');  
    }

    const handleContract = () => {
        window.open(`${URL_BACKEND}/pdf/contract?id=${selected}`, '_blank');  
    }

    const handleSaveSignature = async (signature: string) => {
        try {
          const response = await fetch('/api/save-signature/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ signature }),
          });
    
          if (response.ok) {
            alert("Firma guardada exitosamente.");
          } else {
            alert("Hubo un problema al guardar la firma.");
          }
        } catch (error) {
          console.error("Error al enviar la firma:", error);
        }
    };

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.sales}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_sales_info}</span>
                </div>
                <div className='flex gap-2'>
                    <button className='bg-red-500 text-white border-2 border-red-500 hover:bg-red-500/20 hover:text-red-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={handleContract} disabled={selected === undefined}><ContractsIcon /></button>
                    <button className='bg-red-500 text-white border-2 border-red-500 hover:bg-red-500/20 hover:text-red-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={handleCertificate} disabled={selected === undefined}><Pdf01Icon /></button>
                    <button className='bg-blue-500 text-white border-2 border-blue-500 hover:bg-blue-500/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('signature', true)} disabled={selected === undefined}><SignatureIcon /></button>
                    <Link to={`/manage/sale/payments?id=${selected}`}><button className='bg-green-500 text-white border-2 border-green-500 hover:bg-green-500/20 hover:text-green-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-green-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' disabled={selected === undefined}><Invoice02Icon /></button></Link>
                    <button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => toggleModal('edit', true)} disabled={selected === undefined}><PencilEdit02Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 pb-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <ShoppingBasketSecure03Icon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>{countData}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='manage/sales' 
                        unique='manage-sales'
                        reloadTable={reloadTable} 
                        header={table_header} 
                        tbody={<TablePage selected={selected} setSelected={setSelected} />} 
                        filters={<FiltersPage />}
                    />
                </div>
            </div>    
            {isModalOpen.edit && (
                <Modal title={translations.edit_sale} onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })}>
                    <CrudPage type='edit' selected_id={selected} onClose={() => setIsModalOpen({ ...isModalOpen, edit: false })} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )} 
            {isModalOpen.signature && (
                <Modal title='Firmar venta' onClose={() => setIsModalOpen({ ...isModalOpen, signature: false })}>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h2 className='mb-1 text-black dark:text-white'>Firma del comprador</h2>
                            <SignaturePad onSave={handleSaveSignature} />
                        </div>
                        <div>
                            <h2 className='mb-1 text-black dark:text-white'>Firma del fiador</h2>
                            <SignaturePad onSave={handleSaveSignature} />
                        </div>
                    </div>
                </Modal>
            )}       
        </DelayedSuspense>
    );
};

export default ManageSalesPage;