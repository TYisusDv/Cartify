import React from 'react';
import { Calendar03Icon, Note01Icon, UserGroupIcon, UserStatusIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import { UserBreak } from '../../../types/modelType';

interface TablePageProps {
    data?: Array<UserBreak>;
    selected: number | undefined;
    setSelected: (value: number | undefined) => void;
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
                                    }).replace(',', '')
                                    : '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><Note01Icon size={22} /> {row.note || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><UserStatusIcon size={22} /> {row.status?.name || '-'}</span>
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