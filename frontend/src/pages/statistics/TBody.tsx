import React from 'react';
import { Calendar01Icon, Calendar03Icon, Invoice03Icon, Layers01Icon, LocationUser04Icon, ShoppingBasketSecure03Icon, StoreLocation01Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../hooks/useTranslations';
import { Sale } from '../../types/modelType';
import { generateKey } from '../../utils/uuidGen';
import { calculateDaysRemaining } from '../../utils/DateFuncs';

interface TBodyProps {
    data?: Array<Sale>;
}

const TBody: React.FC<TBodyProps> = ({ data }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={generateKey(index)} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80`}>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <Calendar03Icon size={22} />
                                {row.date_reg ?
                                    new Date(row.date_reg).toLocaleString('es-MX', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(',', '')
                                    : '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><Invoice03Icon size={22} /> {row.id || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            {
                                row.status?.id === 1 ?
                                    <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-blue-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.status.name}</span>
                                    :
                                    row.status?.id === 2 ?
                                        <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-green-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.status.name}</span>
                                        :
                                        row.status?.id === 3 ?
                                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-red-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.status.name}</span>
                                            :
                                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-red-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.status?.name || '-'}</span>
                            }
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {row.total || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            {row.last_pending_payment ? 
                                <span className={`inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold rounded-xl ${(calculateDaysRemaining(row.last_pending_payment.date_limit ? new Date(row.last_pending_payment.date_limit) : undefined) || 0) < 0 ? 'bg-red-500' : (calculateDaysRemaining(row.last_pending_payment.date_limit ? new Date(row.last_pending_payment.date_limit) : undefined) || 0) <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                    <Calendar01Icon size={22} />
                                    {calculateDaysRemaining(row.last_pending_payment.date_limit ? new Date(row.last_pending_payment.date_limit) : undefined)} dias.                        
                                </span>
                            : 
                            <span className={`inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold rounded-xl bg-blue-500`}>
                                <Calendar01Icon size={22} />
                                Sin pagos pendientes                        
                            </span>
                        }
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <StoreLocation01Icon size={22} />
                                {row.location?.name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><LocationUser04Icon size={22} /> {row.client?.person?.firstname || '-'} {row.client?.person?.lastname || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <UserIcon size={22} />
                                {row.user?.first_name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <div className='flex flex-col gap-1 divide-y-2 dark:divide-slate-500'>
                                {row.inventory && row.inventory.length > 0 && (
                                    row.inventory.map((row, index) => (
                                        <div key={generateKey(index)} className='flex items-center gap-1 py-2 first:pt-0 last:pb-0'>
                                            <span><Layers01Icon size={20} /></span> <span className='font-bold'>{row.quantity || 0}.</span> <span>{row.product?.name || '-'}</span>
                                        </div>
                                    ))
                                )}

                            </div>
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

export default TBody;