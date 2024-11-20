import React from 'react';
import { Calendar03Icon, DocumentCodeIcon, Invoice03Icon, LocationUser04Icon, Note01Icon, ShoppingBasketSecure03Icon, StoreLocation01Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { Sale } from '../../../../types/modelType';
import { generateKey } from '../../../../utils/uuidGen';
import { formatNumber } from '../../../../utils/formUtils';

interface TablePageProps {
    data?: Array<Sale>;
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
                            <span className='flex items-center gap-1'><Invoice03Icon size={22} /> {row.id || '-'}</span>
                        </td>   
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
                                <br />
                                {row.date_reg ?
                                    new Date(row.date_reg).toLocaleString('es-MX', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    }).replace(',', '')
                                    : '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            
                            {
                            row.status?.calculate ? 
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-blue-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.type === 1 ? 'Contado' : row.type === 2 ? 'Credito' : '-'}</span>
                            :
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-red-600 text-white rounded-xl'><ShoppingBasketSecure03Icon size={22} /> {row.status?.name || '-'}</span>
                            }
                        </td>       
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q {formatNumber(row.total || 0)}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <StoreLocation01Icon size={22} />
                                {row.location?.name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><LocationUser04Icon size={22} /> {row.client?.person?.firstname || '-'} {row.client?.person?.lastname || '-'}</span>
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
                    <td colSpan={9} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;