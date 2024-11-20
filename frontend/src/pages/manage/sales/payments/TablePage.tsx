import React from 'react';
import { Calendar01Icon, Calendar03Icon, CreditCardIcon, Invoice04Icon, Note01Icon, StoreLocation01Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { SalePayment } from '../../../../types/modelType';
import { calculateDaysRemaining } from '../../../../utils/DateFuncs';
import { formatNumber } from '../../../../utils/formUtils';

interface TablePageProps {
    data?: Array<SalePayment>;
    selected: string | undefined;
    setSelected: (value: string | undefined) => void;
}

const TablePage: React.FC<TablePageProps> = ({ data, selected, setSelected }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className={`text-sm text-gray-800 dark:text-slate-200 ${selected === row.id ? 'bg-blue-500/40 dark:bg-blue-500/20' : ' bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:hover:bg-slate-700/80'}`} onClick={() => setSelected(row.id)}>
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
                            <span className='flex items-center gap-1'><Invoice04Icon size={22} /> {row.no || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <CreditCardIcon size={22} />
                                {row.payment_method?.name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><Note01Icon size={22} /> {row.note || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {formatNumber(row.subtotal || 0)}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {formatNumber(((row.total || 0) - (row.commission || 0) - (row.surcharge || 0)) + (row.discount || 0))}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {formatNumber((row.subtotal || 0) - (((row.total || 0) - (row.commission || 0) - (row.surcharge || 0)) + (row.discount || 0)))}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <StoreLocation01Icon size={22} />
                                {row.location?.name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <div className='flex flex-col gap-2'>
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                    <Calendar03Icon size={22} />
                                    {row.date_limit ?
                                        new Date(row.date_limit).toLocaleString('es-MX', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        }).replace(',', '')
                                        : '-'}                                    
                                </span>        
                                { ((row.subtotal || 0) - (((row.total || 0) - (row.commission || 0)) + (row.discount || 0))) > 0 && (
                                    <span className={`inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold rounded-xl ${(calculateDaysRemaining(row.date_limit ? new Date(row.date_limit) : undefined) || 0) < -3 ? 'bg-red-500' : (calculateDaysRemaining(row.date_limit ? new Date(row.date_limit) : undefined) || 0) <= 0 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                        <Calendar01Icon size={22} />
                                        {calculateDaysRemaining(row.date_limit ? new Date(row.date_limit) : undefined)} dias.                        
                                    </span>
                                )}                        
                                
                            </div>
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
                    <td colSpan={10} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;