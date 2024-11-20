import React from 'react';
import { BarCode02Icon, Layers01Icon, SearchList02Icon, UserAccountIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { Inventory } from '../../../../types/modelType';

interface TablePageProps {
    data?: Inventory[];
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
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <Layers01Icon size={22} />
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
                        <td className='px-6 py-6'>
                            {row.quantity || 0}
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-2'>
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                    <BarCode02Icon size={22} />
                                    {row.product?.barcode || '-'}
                                </span>
                                {row.product?.name || ''}
                            </span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'>{row.location?.name || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'>{row.location_transfer?.name || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <SearchList02Icon size={22} />
                                {row.type?.name || '-'}
                            </span>

                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'>{row.note || '-'}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <UserAccountIcon size={22} /> {row.user?.first_name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <UserAccountIcon size={22} /> {row.user_transfer?.first_name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <UserAccountIcon size={22} /> {row.user_transfer_receives?.first_name || '-'}
                            </span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={10} className='px-6 py-6 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;