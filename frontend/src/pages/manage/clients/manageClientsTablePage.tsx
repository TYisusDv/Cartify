import React from 'react';
import { Location01Icon, TelephoneIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import { calculateAge } from '../../../utils/ageUtils';
import { URL_BACKEND } from '../../../services/apiService';

interface ManageClientsTableProps {
    data?: Array<{ [key: string]: any }>;
    selected: number;
    setSelected: (value: number) => void;
    toggleModal: (modalType: 'add' | 'delete' | 'profile_image', isOpen: boolean) => void;
    setModalProfilePicture: (url: string) => void;
}

const ManageClientsTablePage: React.FC<ManageClientsTableProps> = ({ data, selected, setSelected, toggleModal, setModalProfilePicture }) => {
    const { translations } = useTranslations();

    const handleImage = (url: string) => {
        setModalProfilePicture(url);
        toggleModal('profile_image', true);
    }

    return (
        <tbody>
            {data && data.length > 0 ? (
                data.map((row, index) => (
                    <tr key={index} className={`text-sm text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80 ${selected === row.id ? 'bg-gray-200/80 dark:bg-slate-700/60' : ''}`} onClick={() => setSelected(row.id)}>
                        <td className='flex items-center w-full pl-6 py-4'>
                            {row.person.profile_image ? <img src={`${URL_BACKEND}${row.person.profile_image}`} alt='Profile' className='cursor-pointer rounded-full w-12 h-12 min-w-12 min-h-12' onClick={() => {handleImage(row.person.profile_image)}} /> : '-'}
                        </td>
                        <td className='px-6 py-4'>
                            {row.person.alias || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            {row.person.firstname || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            {row.person.middlename || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            {row.person.lastname || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            {row.person.second_lastname || '-'}
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><TelephoneIcon size={22} /> {row.person.phone || '-'}</span>
                        </td>
                        <td className='px-6 py-4'>
                            {row.person.birthdate ? `${new Date(row.person.birthdate).toLocaleDateString('es-MX')} - ${calculateAge(row.person.birthdate)} years` : '-'}
                        </td>
                        <td className='px-6 py-4'>
                            <span className='inline-flex items-center w-auto whitespace-nowrap gap-1 p-1 pr-2 font-bold bg-gray-200 dark:bg-slate-600 rounded-xl'><Location01Icon size={22} /> {row.person.addresses[0]?.city.name || '-'}</span>
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

export default ManageClientsTablePage;