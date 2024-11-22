import React from 'react';
import { BarCode02Icon, Calendar03Icon, EyeIcon, InvoiceIcon, NoteIcon, ProfileIcon, ShoppingBasketSecure03Icon, TextNumberSignIcon, ViewOffSlashIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import { Warranty } from '../../../types/modelType';

interface TBodyProps {
    data?: Array<Warranty>;
    selected: number | undefined;
    setSelected: (value: number | undefined) => void;
}

const TBody: React.FC<TBodyProps> = ({ data, selected, setSelected }) => {
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
                                    }).replace(',', '')
                                    : '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.sale?.id || '-'}</span>
                        </td>  
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><InvoiceIcon size={22} /> {row.expense_detail?.expense?.no || '-'}</span>
                        </td>  
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'><TextNumberSignIcon size={22} /> {row.expense_detail?.expense?.transaction_number || '-'}</span>
                        </td> 
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><BarCode02Icon size={22} /> {row.expense_detail?.serial_number || ''} - {row.expense_detail?.product?.name || '-'}</span>
                        </td>  
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'><NoteIcon size={22} /> {row.note || '-'}</span>
                        </td>                      
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TBody;