import React from 'react';
import { BrandfetchIcon, DollarCircleIcon, Layers01Icon, ProfileIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';

interface TablePageProps {
    data?: Array<{ [key: string]: any }>;
    selected: number;
    setSelected: (value: number) => void;
}

const TablePage: React.FC<TablePageProps> = ({ data, selected, setSelected }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80 ${selected === row.id ? 'bg-gray-200/80 dark:bg-slate-700/60' : ''}`} onClick={() => setSelected(row.id)}>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><ProfileIcon size={22} /> {row.name || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            {row.model || '-'}
                        </td>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><BrandfetchIcon size={22} /> {row.brand?.name || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><Layers01Icon size={22} /> {row.category?.name || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'><DollarCircleIcon size={18} /> {row.cost_price || '-'}</span>
                        </td> 
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'><DollarCircleIcon size={18} /> {row.cash_price || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'><DollarCircleIcon size={18} /> {row.credit_price || '-'}</span>
                        </td>                       
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={3} className='px-6 py-6 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;