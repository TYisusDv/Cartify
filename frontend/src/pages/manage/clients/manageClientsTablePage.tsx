import { Location01Icon, TelephoneIcon, UserAccountIcon } from 'hugeicons-react';
import React from 'react';
import useTranslations from '../../../hooks/useTranslations';

interface ManageClientsTableProps {
    data?: Array<{ [key: string]: any }>;
}

const ManageClientsTablePage: React.FC<ManageClientsTableProps> = ({ data }) => {
    const { translations } = useTranslations();

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className='text-sm text-gray-800 bg-gray-100 dark:bg-slate-700 dark:text-slate-200'>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><UserAccountIcon size={22} /> {row.id}</span>
                        </td>
                        <td className='px-6 py-4'>
                           {row.person.alias || 'N/A'}
                        </td>
                        <td className='px-6 py-4'>
                           {row.person.firstname || 'N/A'}
                        </td>
                        <td className='px-6 py-4'>
                           {row.person.middlename || 'N/A'}
                        </td>
                        <td className='px-6 py-4'>
                           {row.person.lastname || 'N/A'}
                        </td>
                        <td className='px-6 py-4'>
                           {row.person.second_lastname || 'N/A'}
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><TelephoneIcon size={22} /> {row.person.phone || 'N/A'}</span>
                        </td>
                        <td className='px-6 py-4'>
                           {row.person.birthdate || 'N/A'}
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><Location01Icon size={22} /> {row.person.addresses[0]?.city.name || 'N/A'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            <button type='submit' className='btn h-9 w-24 float-end rounded-xl'>{translations.actions}</button>
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

export default ManageClientsTablePage;