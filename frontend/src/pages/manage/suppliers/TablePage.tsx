import React from 'react';
import { Mail01Icon, RoadLocation01Icon, UserIdVerificationIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';

interface TablePageProps {
    data?: Array<{ [key: string]: any }>;
    selected: string;
    setSelected: (value: string) => void;
}

const TablePage: React.FC<TablePageProps> = ({ data, selected, setSelected }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className={`text-sm text-gray-800 dark:text-slate-200 ${selected === row.id ? 'bg-blue-500/40 dark:bg-blue-500/20' : ' bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:hover:bg-slate-700/80'}`} onClick={() => setSelected(row.id)}>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><UserIdVerificationIcon size={22} /> {row.company_identification || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            {row.company_name || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><Mail01Icon size={22} /> {row.company_email || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            {row.company_phone || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><RoadLocation01Icon size={22} /> {row.company_address || '-'}</span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;