import React from 'react';
import { Calendar01Icon, Calendar03Icon, DistributionIcon, Tick01Icon, ToggleOnIcon, UserIcon, WaterfallDown01Icon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import { Expense } from '../../../types/modelType';
import { calculateDaysRemaining } from '../../../utils/DateFuncs';
import { formatNumber } from '../../../utils/formUtils';

interface TBodyProps {
    data?: Array<Expense>;
    selected: string | undefined;
    setSelected: (value: string | undefined) => void;
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
                                        year: 'numeric'
                                    }).replace(',', '')
                                    : '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-[1px]'><WaterfallDown01Icon size={22} /> {row.no || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-[1px]'>Q{formatNumber(row.total || 0)}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-[1px]'>Q{formatNumber(row.total_paid || 0)}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-[1px]'>Q{formatNumber((row.total || 0) - (row.total_paid || 0))}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'><DistributionIcon size={18} /> {row.supplier?.company_name || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <Calendar03Icon size={22} />
                                {row.date_limit ?
                                    new Date(row.date_limit).toLocaleString('es-MX', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })
                                    : '-'}
                            </span>
                            <br />
                            <span className={`inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold rounded-xl ${(calculateDaysRemaining(row.date_limit ? new Date(row.date_limit) : undefined) || 0) < 0 ? 'bg-red-500' : (calculateDaysRemaining(row.date_limit ? new Date(row.date_limit) : undefined) || 0) <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}>
                                <Calendar01Icon size={22} />
                                {calculateDaysRemaining(row.date_limit ? new Date(row.date_limit) : undefined)} dias.
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            {
                            row.isactive ? 
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-blue-600 text-white rounded-xl'><ToggleOnIcon size={22} /> Activo</span>
                            :
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-green-600 text-white rounded-xl'><Tick01Icon size={22} /> Completado</span>
                            }
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
                    <td colSpan={8} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TBody;