import React from 'react';
import { Calendar03Icon, DistributionIcon, DocumentCodeIcon, Note01Icon, StoreLocation01Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { CashRegister } from '../../../../types/modelType';

interface TablePageProps {
    data?: Array<CashRegister>;
    selected: number | undefined;
    setSelected: (value: number | undefined) => void;
}

const TablePage: React.FC<TablePageProps> = ({ data, selected, setSelected }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80 ${selected === row.id ? 'bg-gray-200/80 dark:bg-slate-700/60' : ''}`} onClick={() => setSelected(row.id)}>
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
                            <span className='flex items-center gap-1'><DocumentCodeIcon size={22} /> {row.no || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><DistributionIcon size={22} /> {row.supplier || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {row.amount || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><Note01Icon size={22} /> {row.description || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><StoreLocation01Icon size={22} /> {row.location?.name || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><UserIcon size={22} /> {row.user?.first_name || '-'}</span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={7} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;