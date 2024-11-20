import React from 'react';
import { EyeIcon, ProfileIcon, ViewOffSlashIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';

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
                    <tr key={index} className={`text-sm text-gray-800 dark:text-slate-200 ${selected === row.id ? 'bg-blue-500/40 dark:bg-blue-500/20' : ' bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:hover:bg-slate-700/80'}`} onClick={() => setSelected(row.id)}>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><ProfileIcon size={22} /> {row.name || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            {row.type === 1
                                ? translations.inventory_entry
                                : row.type === 2
                                    ? translations.inventory_exit
                                    : row.type === 3
                                        ? translations.inventory_transfer
                                        : '-'
                            }
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={2} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;