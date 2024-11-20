import React from 'react';
import { BarCode02Icon, More03Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import { ExpenseDetails } from '../../../../types/modelType';

interface TBodyProps {
    data?: Array<ExpenseDetails>;
    selected: number | undefined;
    setSelected: (value: number | undefined) => void;
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
                                <BarCode02Icon size={22} /> {row.product?.name || '-'}
                            </span>
                        </td> 
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'><More03Icon size={22} /> {row.quantity || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q{row.cost || '-'}</span>
                        </td>    
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <UserIcon size={22} /> {row.user?.first_name || '-'}
                            </span>
                        </td>                   
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TBody;