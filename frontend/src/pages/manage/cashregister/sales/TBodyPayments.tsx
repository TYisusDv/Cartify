import React from 'react';
import { Calendar03Icon, Invoice03Icon, LocationUser04Icon, ShoppingBasketSecure03Icon, StoreLocation01Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { SalePayment } from '../../../../types/modelType';
import { generateKey } from '../../../../utils/uuidGen';

interface TBodyPaymentsProps {
    data?: Array<SalePayment>;
    selected: number | undefined;
    setSelected: (value: number | undefined) => void;
}

const TBodyPayments: React.FC<TBodyPaymentsProps> = ({ data, selected, setSelected }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={generateKey(index)} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80 ${selected === row.sale?.id ? 'bg-gray-200/80 dark:bg-slate-700/60' : ''}`} onClick={() => setSelected(row.sale?.id)}>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><Invoice03Icon size={22} /> {row.no || '-'}</span>
                        </td>   
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <Calendar03Icon size={22} />
                                {row.date_reg ?
                                    new Date(row.date_reg).toLocaleString('es-MX', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }).replace(',', '')
                                    : '-'}
                                <br />
                                {row.date_reg ?
                                    new Date(row.date_reg).toLocaleString('es-MX', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(',', '')
                                    : '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>                            
                            {
                            row.sale?.status?.calculate ? 
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-blue-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} />{row.payment_method?.name || '-'}</span>
                            :
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-red-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.sale?.status?.name || '-'}</span>
                            }
                        </td>       
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {row.total || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <StoreLocation01Icon size={22} />
                                {row.location?.name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><LocationUser04Icon size={22} /> {row.sale?.client?.person?.firstname || '-'} {row.sale?.client?.person?.lastname || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <UserIcon size={22} />
                                {row.user?.first_name || '-'}
                            </span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={9} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TBodyPayments;