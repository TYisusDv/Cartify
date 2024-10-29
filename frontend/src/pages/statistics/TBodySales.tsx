import React from 'react';
import { CreditCardIcon } from 'hugeicons-react';
import useTranslations from '../../hooks/useTranslations';
import { generateKey } from '../../utils/uuidGen';

interface TBodySalesProps {
    data?: Array<{ [key: string]: any }>;
}

const TBodySales: React.FC<TBodySalesProps> = ({ data }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={generateKey(index)} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80`}>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <CreditCardIcon size={22} />
                                {row.location__name}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='flex items-center gap-1'>Q{row.total_sales || 0}</span>
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

export default TBodySales;