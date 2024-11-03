import React, { useEffect, useState } from 'react';
import useTranslations from '../../../../hooks/useTranslations';
import DelayedSuspense from '../../../../components/DelayedSuspense';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import Table from '../../../../components/Table';
import TablePage from './TBody';
import { getCountCashRegisterSales, getCountCashRegisterSalesPayments } from '../../../../services/CashRegister';
import { Cash01Icon, Invoice02Icon, Search01Icon } from 'hugeicons-react';
import { Sale, SalePayment } from '../../../../types/modelType';
import { Link } from 'react-router-dom';
import Filters from './Filters';
import TBodyPayments from './TBodyPayments';
import FiltersPayments from './FiltersPayments';
import Modal from '../../../../components/Modal';
import Crud from './Crud';

const Sales: React.FC = () => {
    const { translations } = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState({ search: false });
    const [selected, setSelected] = useState<number | undefined>();
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({
        total: 0
    });
    const [countDataPayments, setCountDataPayments] = useState({
        total: 0,
    });
    const [formValues, setFormValues] = useState<Sale>();
    const [formValuesPayments, setFormValuesPayments] = useState<SalePayment>();

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split('T')[0];

    const [formValuesSearch, setFormValuesSearch] = useState({
        date_1: formattedToday,
        date_2: formattedTomorrow,
        location: undefined
    });

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    const table_header = [
        { name: 'id', headerName: 'No. Factura' },
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'status.name', headerName: 'Estado Factura' },
        { name: 'total', headerName: 'Total' },
        { name: 'location.name', headerName: 'Ubicacion' },
        { name: 'client.person.firstname', headerName: 'Cliente' },
        { name: 'user.first_name', headerName: 'Empleado' },
    ];

    const table_header_payments = [
        { name: 'no', headerName: 'No. Recibo' },
        { name: 'date_reg', headerName: 'Fecha de registro' },
        { name: 'payment_method.name', headerName: 'Metodo de pago' },
        { name: 'total', headerName: 'Total' },
        { name: 'location.name', headerName: 'Ubicacion' },
        { name: 'sale.client.person.firstname', headerName: 'Cliente' },
        { name: 'user.first_name', headerName: 'Empleado' },
    ];

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountCashRegisterSales(formValues, formValuesSearch);
                const response_resp = response.resp;

                setCountData(response_resp);
            } catch (error) {
            }
        };

        fetchCount();
    }, [reloadTable, formValues, formValuesSearch]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCountCashRegisterSalesPayments(formValuesPayments, formValuesSearch);
                const response_resp = response.resp;

                setCountDataPayments(response_resp);
            } catch (error) {
            }
        };

        fetchCount();
    }, [reloadTable, formValuesPayments, formValuesSearch]);

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.cash_register}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_cash_register}</span>
                </div>
                <div className='flex gap-2'>
                    <Link to={`/manage/sale/payments?id=${selected}`}><button className='bg-yellow-500 text-white border-2 border-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-yellow-500/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' disabled={selected === undefined}><Invoice02Icon /></button></Link>
                    <button className='bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={() => setIsModalOpen((prev) => ({ ...prev, search: true }))}><Search01Icon /></button>
                </div>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='col-span-1'>
                    <div className='flex flex-col'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                            <div className='col-span-1 flex items-center gap-3 border-gray-100 dark:border-slate-600'>
                                <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                                    <Cash01Icon />
                                </div>
                                <div>
                                    <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total vendido</h2>
                                    <h3 className='text-lg font-bold dark:text-white'>Q{countData.total}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='w-full mt-6'>
                            <Table
                                classNameFilters='md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-3'
                                endpoint='manage/cashregister/sales'
                                reloadTable={reloadTable}
                                header={table_header}
                                tbody={
                                    <TablePage
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                }
                                filters={<Filters setFormValuesPage={setFormValues} />}
                                filters_params={formValuesSearch}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-span-1'>
                    <div className='flex flex-col'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                            <div className='col-span-1 flex items-center gap-3 border-gray-100 dark:border-slate-600'>
                                <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                                    <Cash01Icon />
                                </div>
                                <div>
                                    <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total pagado</h2>
                                    <h3 className='text-lg font-bold dark:text-white'>Q{countDataPayments.total}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='w-full mt-6'>
                            <Table
                                classNameFilters='md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-3'
                                endpoint='manage/cashregister/sales'
                                query='table_payments'
                                reloadTable={reloadTable}
                                header={table_header_payments}
                                tbody={
                                    <TBodyPayments
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                }
                                filters={<FiltersPayments setFormValuesPage={setFormValuesPayments} />}
                                filters_params={formValuesSearch}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen.search && (
                <Modal title={translations.search} onClose={() => setIsModalOpen((prev) => ({ ...prev, search: false }))}>
                    <Crud type='search' formValues={formValuesSearch} setFormValues={setFormValuesSearch} onClose={() => setIsModalOpen((prev) => ({ ...prev, search: false }))} handleTableReload={handleTableReload} setSelected={setSelected} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Sales;