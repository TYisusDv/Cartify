import React from 'react';
import { BrandfetchIcon, DollarCircleIcon, EyeIcon, Layers01Icon, ProfileIcon, ViewOffSlashIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import { URL_BACKEND } from '../../../services/apiService';
import { formatNumber } from '../../../utils/formUtils';

interface TablePageProps {
    data?: Array<{ [key: string]: any }>;
    selected: string;
    toggleModal?: (modalType: 'product_images', isOpen: boolean) => void;
    setSelected: (value: string) => void;
    setImageUrl?: (url: string) => void;
    className?: string;
}

const TablePage: React.FC<TablePageProps> = ({ data, selected, toggleModal, setSelected, setImageUrl, className }) => {
    const { translations } = useTranslations();

    const handleImage = (url: string) => {
        if (setImageUrl) setImageUrl(url);
        if (toggleModal) toggleModal('product_images', true);
    }

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className={`text-sm text-gray-800 dark:text-slate-200 ${selected === row.id ? 'bg-blue-500/40 dark:bg-blue-500/20' : ' bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:hover:bg-slate-700/80'}`} onClick={() => setSelected(row.id)}>
                        <td className={`px-6 py-6 ${row?.product_images[0]?.image ? 'pr-0' : ''}`}>
                            {row?.product_images[0]?.image ? <img src={`${URL_BACKEND}${row.product_images[0].image}`} alt='Profile' className='cursor-pointer rounded-full w-12 h-12 min-w-12 min-h-12' onClick={() => {handleImage(row.product_images[0].image)}} /> : '-'}
                        </td>
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
                            <span className='flex items-center gap-[1px]'>Q{formatNumber(row.cost_price || 0)}</span>
                        </td> 
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'>Q{formatNumber(row.cash_price || 0)}</span>
                        </td>
                        <td className='px-6 py-6'>
                            <span className='flex items-center gap-[1px]'>Q{formatNumber(row.credit_price || 0)}</span>
                        </td>  
                        <td className='px-6 py-4'>
                            {
                            row.status ? 
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-green-600 text-white rounded-xl'><EyeIcon size={22} /> {translations.available}</span>
                            :
                                <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-red-600 text-white rounded-xl'><ViewOffSlashIcon size={22} /> {translations.hidden}</span>
                            }
                        </td>                     
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={8} className='px-6 py-6 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TablePage;