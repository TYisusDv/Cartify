import React, { useEffect, useState } from 'react';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import { CreditCardIcon, Invoice01Icon, Search01Icon } from 'hugeicons-react';
import Table from '../../components/Table';
import { getTable } from '../../services/componentsService';
import { generateKey, generateUUID } from '../../utils/uuidGen';
import TBodySales from './TBodySales';
import { getCount } from '../../services/StatisticsSales';
import Chart from 'react-apexcharts';
import Modal from '../../components/Modal';
import Crud from './Crud';
import { IconFileExcel } from '@tabler/icons-react';
import { addAlert } from '../../utils/Alerts';
import { extractMessages, formatNumber } from '../../utils/formUtils';
import apiService from '../../services/apiService';
import TooltipButton from '../../components/TooltipButton';

interface PaymentMethod {
    name: string;
    total: number;
}

interface LocationData {
    location_name: string;
    payment_methods: PaymentMethod[];
}

interface OrganizedData {
    [methodName: string]: {
        [locationName: string]: number;
    };
}

const Sales: React.FC = () => {
    const { translations } = useTranslations();
    const [reloadTable, setReloadTable] = useState(0);
    const [countData, setCountData] = useState({ total_sales: 0, total_payments: 0 });

    const [data, setData] = useState<OrganizedData>({});
    const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
    const [locations, setLocations] = useState<string[]>([]);
    const [locationTotals, setLocationTotals] = useState<{ [location: string]: number }>({});

    const [isModalOpen, setIsModalOpen] = useState({ search: false });

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

    const [locationNames, setLocationNames] = useState<string[]>([]);
    const [totalSales, setTotalSales] = useState<number[]>([]);

    const handleTableReload = () => {
        setReloadTable(prev => prev + 1);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getTable('/statistics/sales', { query: 'table_sales', filters: formValuesSearch });
                const responseData = response.resp;
                const names = responseData.map((item: any) => item.location__name);
                const sales = responseData.map((item: any) => item.total_sales);
                setLocationNames(names);
                setTotalSales(sales);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        }
        fetchData();
    }, [formValuesSearch]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getTable('/statistics/sales', { query: 'table_location_payment_methods', filters: formValuesSearch });
                const response_resp: LocationData[] = response.resp;

                const methods = new Set<string>();
                const organizedData: OrganizedData = {};
                const totals: { [location: string]: number } = {};

                response_resp.forEach((location) => {
                    location.payment_methods.forEach((method) => {
                        methods.add(method.name);
                        organizedData[method.name] = organizedData[method.name] || {};
                        organizedData[method.name][location.location_name] = method.total;

                        totals[location.location_name] = (totals[location.location_name] || 0) + method.total;
                    });
                });

                setPaymentMethods(Array.from(methods));
                setLocations(response_resp.map((loc) => loc.location_name));
                setData(organizedData);
                setLocationTotals(totals);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        }

        fetchData();
    }, [formValuesSearch]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await getCount(formValuesSearch);
                const response_resp = response.resp;

                setCountData(response_resp);
            } catch (error) {
                console.error("Error al obtener conteo:", error);
            }
        };

        fetchCount();
    }, [reloadTable, formValuesSearch]);

    const getLocationSeries = (location: string) => {
        return paymentMethods.map(method => data[method]?.[location] || 0);
    };

    const getTotalByMethod = (method: string): number => {
        return Object.values(data[method] || {}).reduce((acc, curr) => acc + curr, 0);
    };

    const series = paymentMethods.map(method => getTotalByMethod(method));

    const downloadExcel = async () => {
        try {
            const response = await apiService.get('excel/statistics/sales', {
                responseType: 'blob',
                params: {
                    filters: formValuesSearch
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', 'statistics_sales.xlsx');

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            const messages = extractMessages(error);
            messages.forEach(msg => {
                addAlert({
                    id: generateUUID(),
                    title: 'An error has occurred.',
                    msg: msg,
                    icon: 'Alert01Icon',
                    color: 'red',
                    timeout: 2000
                });
            });
        }
    };

    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.statistics}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.statistics}</span>
                </div>
                <div className="flex gap-2">
                    <TooltipButton
                        tooltip="Descargar Excel"
                        onClick={downloadExcel}
                        className="bg-green-600 text-white border-2 border-green-600 hover:bg-green-600/20 hover:text-green-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-green-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<IconFileExcel />}
                    />
                    <TooltipButton
                        tooltip="Buscar"
                        onClick={() => setIsModalOpen((prev) => ({ ...prev, search: true }))}
                        className="bg-blue-600 text-white border-2 border-blue-600 hover:bg-blue-600/20 hover:text-blue-500 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-blue-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white"
                        icon={<Search01Icon />}
                    />
                </div>

            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn animate__faster'>
                <h1 className='font-bold text-xl text-black dark:text-white'>Total vendido por sucursal</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 mt-3 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-gray-100 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <Invoice01Icon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>Q{formatNumber(countData.total_sales)}</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table
                        query='table_sales'
                        endpoint='statistics/sales'
                        reloadTable={reloadTable}
                        header={[
                            { name: '', headerName: 'Sucursal' },
                            { name: '', headerName: 'Total' },
                        ]}
                        tbody={<TBodySales />}
                        show_search={false}
                        show_pagination={false}
                        filters_params={formValuesSearch}
                    />
                </div>
                <h1 className='font-bold text-xl mt-8 text-black dark:text-white'>Total ingresos</h1>
                <div className='w-full mt-2'>
                    <div className="overflow-x-auto rounded-lg w-full">
                        <table className="w-full text-sm text-left">
                            <thead className="select-none text-sm text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer">
                                        Método de Pago
                                    </th>
                                    {locations.map((location, index) => (
                                        <th key={generateKey(index)} scope="col" className="px-6 py-3 cursor-pointer">
                                            {location}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3 cursor-pointer">
                                        Total por Sucursal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentMethods.map((method, index) => (
                                    <tr key={generateKey(index)} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80`}>
                                        <td className='px-6 py-4'>
                                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                                <CreditCardIcon size={22} />
                                                {method}
                                            </span>
                                        </td>
                                        {locations.map((location, index) => (
                                            <td key={generateKey(index)} className='px-6 py-4'>
                                                Q{formatNumber(data[method][location] || 0)}
                                            </td>
                                        ))}
                                        <td className='px-6 py-4'>
                                            Q{formatNumber(locations.reduce((acc, location) => acc + (data[method][location] || 0), 0))}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="text-sm border-t-2 border-gray-300 dark:border-slate-500 text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80">
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl">
                                            <Invoice01Icon size={22} />
                                            Total
                                        </span>
                                    </td>
                                    {locations.map((location, index) => (
                                        <td key={generateKey(index)} className='px-6 py-4'>
                                            Q{formatNumber(locationTotals[location] || 0)}
                                        </td>
                                    ))}
                                    <td className='px-6 py-4'>
                                        Q{formatNumber(Object.values(locationTotals).reduce((acc, curr) => acc + curr, 0))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <h1 className='font-bold text-xl mt-8 text-black dark:text-white'>Graficos</h1>
                <div className='w-full mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div className='col-span-1 flex flex-col items-center gap-2 w-full text-black dark:text-white'>
                        <Chart
                            options={{
                                chart: {
                                    type: 'donut',
                                },
                                labels: locationNames,
                                legend: {
                                    position: 'bottom',
                                },
                                theme: {
                                    mode: 'dark',
                                },
                                title: {
                                    text: 'Total de ventas',
                                    align: 'center',
                                },
                            }}
                            series={totalSales}
                            type="donut"
                        />
                    </div>
                    <div className='col-span-1 flex flex-col items-center gap-2 w-full text-black dark:text-white'>
                        <div className='w-full mt-4 flex justify-center'>
                            <Chart
                                options={{
                                    title: {
                                        text: `Ingresos totales`,
                                        align: 'center'
                                    },
                                    chart: { type: 'bar' },
                                    xaxis: {
                                        categories: locations
                                    },
                                    colors: ['#2E93fA'],
                                    dataLabels: {
                                        enabled: true,
                                        formatter: (val: number) => `Q${val}`,
                                    },
                                    tooltip: {
                                        theme: 'dark'
                                    },
                                    theme: {
                                        mode: 'dark'
                                    }
                                }}
                                series={
                                    [{
                                        name: 'Ingresos Totales',
                                        data: Object.values(locationTotals),
                                    }]
                                }
                                type="bar"
                            />
                        </div>
                    </div>
                    <div className='col-span-1 flex flex-col items-center gap-2 w-full text-black dark:text-white'>
                        <Chart
                            options={{
                                title: {
                                    text: `Total en metodos de pago`,
                                    align: 'center'
                                },
                                chart: {
                                    type: 'donut',
                                },
                                labels: paymentMethods,
                                legend: {
                                    position: 'bottom',
                                },
                                responsive: [{
                                    breakpoint: 480,
                                    options: {
                                        chart: {
                                            width: 200,
                                        },
                                        legend: {
                                            position: 'bottom',
                                        },
                                    },
                                }],
                                theme: {
                                    mode: 'dark'
                                }
                            }}
                            series={series}
                            type="donut"
                        />
                    </div>
                    {locations.map((location, index) => (
                        <div key={generateKey(index)} className='flex flex-col items-center gap-2 w-full text-black dark:text-white'>
                            <Chart
                                options={{
                                    title: {
                                        text: `Total en metodos de pago en ${location}`,
                                        align: 'center'
                                    },
                                    chart: { type: 'donut' },
                                    labels: paymentMethods,
                                    legend: {
                                        position: 'bottom',
                                    },
                                    responsive: [
                                        {
                                            breakpoint: 480,
                                            options: {
                                                chart: { width: 200 },
                                                legend: { position: 'bottom' },
                                            },
                                        },
                                    ],

                                    theme: {
                                        mode: 'dark'
                                    }
                                }}
                                series={getLocationSeries(location)}
                                type="donut"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen.search && (
                <Modal title={translations.search} onClose={() => setIsModalOpen((prev) => ({ ...prev, search: false }))}>
                    <Crud type='search' formValues={formValuesSearch} setFormValues={setFormValuesSearch} onClose={() => setIsModalOpen((prev) => ({ ...prev, search: false }))} handleTableReload={handleTableReload} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default Sales;