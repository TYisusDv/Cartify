import React from 'react';
import { EyeIcon, Mail01Icon, PercentCircleIcon, StoreLocation02Icon, TelephoneIcon, UserIcon, ViewOffSlashIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import { User } from '../../../types/modelType';

interface TBodyProps {
    data?: Array<User>;
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
                                <UserIcon size={22} /> {row.first_name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'>
                                {row.last_name || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'>
                                <Mail01Icon size={22} /> {row.email || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'>
                                <TelephoneIcon size={22} /> {row.profile?.phone || '-'}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 rounded-xl'>
                                <PercentCircleIcon size={22} /> {row.profile?.commission || 0}
                            </span>
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'>
                                <StoreLocation02Icon size={22} /> {row.profile?.location?.name || '-'}
                            </span>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={6} className='px-6 py-4 text-center dark:text-white'>{translations.no_data}</td>
                </tr>
            )}
        </tbody>
    );
};

export default TBody;