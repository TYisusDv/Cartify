import React from 'react';
import { Cancel01Icon, DashboardBrowsingIcon, Tick01Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { SaleStatus } from '../../../../types/modelType';

interface TablePageProps {
    data?: Array<SaleStatus>;
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
                                <DashboardBrowsingIcon size={22} />
                                {row.name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            {
                            row.calculate ? 
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-blue-600 text-white rounded-xl'><Tick01Icon size={22} /> Si</span>
                            :
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-red-600 text-white rounded-xl'><Cancel01Icon size={22} /> No</span>
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