import React, { useEffect, useState } from 'react';
import { Calendar01Icon, JobSearchIcon, Mail01Icon, MosqueLocationIcon, Note04Icon, RoadLocation01Icon, SmartPhone01Icon, TelephoneIcon, UserAccountIcon, UserCircleIcon, UserIdVerificationIcon, UserQuestion02Icon } from 'hugeicons-react';
import { handleChange } from '../../../utils/formUtils';
import { AlertType } from '../../../types/alert';
import { Client, initialClient } from '../../../types/clientsType';
import { v4 as uuidv4 } from 'uuid';
import { getClient } from '../../../services/clientsService';
import useTranslations from '../../../hooks/useTranslations';
import InputGroup from '../../../components/InputGroup';
import { Contact } from '../../../types/contactsType';

interface ManageDetailsClientProps {
    addAlert: (alert: AlertType) => void;
    client_id: string | undefined;
    onClose: () => void;
    handleTableReload: () => void;
}
const ManageDetailsClientPage: React.FC<ManageDetailsClientProps> = ({ addAlert, onClose, handleTableReload, client_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Client>(initialClient);
    const [activeTab, setActiveTab] = useState<string>('information');
    const [contacts, setContacts] = useState<Contact[]>([]);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await getClient(client_id);
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                setFormValues(prevFormValues => ({
                    ...prevFormValues,
                    'location': response_data.resp?.location?.name,
                    'identification_id': response_data.resp?.person?.identification_id,
                    'type_id_name': response_data.resp?.person?.type_id?.name,
                    'type': response_data.resp?.type?.name,
                    'alias': response_data.resp?.person?.alias,
                    'occupation': response_data.resp?.person?.occupation,
                    'firstname': response_data.resp?.person?.firstname,
                    'midlename': response_data.resp?.person?.midlename,
                    'lastname': response_data.resp?.person?.lastname,
                    'second_lastname': response_data.resp?.person?.second_lastname,
                    'email': response_data.resp?.email,
                    'mobile': response_data.resp?.person?.mobile,
                    'phone': response_data.resp?.person?.phone,
                    'country': response_data.resp?.person?.addresses[0]?.city?.state?.country?.name,
                    'state': response_data.resp?.person?.addresses[0]?.city?.state?.name,
                    'street': response_data.resp?.person?.addresses[0]?.street,
                    'area': response_data.resp?.person?.addresses[0]?.area,
                    'city': response_data.resp?.person?.addresses[0]?.city?.name,
                    'birthdate': response_data.resp?.person?.birthdate,
                    'note': response_data.resp?.note,
                    'allow_credit': response_data.resp?.allow_credit ? '1' : '0',
                }));

                setContacts(response_data.resp?.contacts);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching contact types', type: 'danger', timeout: 3000 });
            }
        };

        fetchClient();
    }, []);

    return (
        <div>
            <div className='flex space-x-2 overflow-x-auto'>
                <button className={`py-2 px-4 ${'information' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('information')}>
                    Informacion
                </button>
                <button className={`py-2 px-4 ${'details' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('details')}>
                    Detalles
                </button>
                <button className={`py-2 px-4 ${'contacts' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('contacts')}>
                    Contactos
                </button>
            </div>
            <div className='mt-4'>
                <div className={`flex flex-col gap-2 w-full tab-item ${'information' === activeTab ? 'block' : 'hidden'}`}>
                    <InputGroup
                        id='location_name'
                        name='location_name'
                        label={translations.location}
                        icon={<UserIdVerificationIcon className='icon' size={24} />}
                        onChange={handleChange(setFormValues)}
                        value={formValues.location || ''}
                        required={false}
                        disabled={true}
                    />
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1 z-10'>
                            <InputGroup
                                id='identification_type'
                                name='identification_type'
                                label={translations.identification_type}
                                icon={<UserIdVerificationIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.type_id_name || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='identification_id'
                                name='identification_id'
                                label={translations.identification_id}
                                icon={<UserIdVerificationIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.identification_id || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1'>
                            <InputGroup
                                id='alias'
                                name='alias'
                                label={translations.alias}
                                icon={<UserQuestion02Icon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.alias || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='occupation'
                                name='occupation'
                                label={translations.occupation}
                                icon={<JobSearchIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.occupation || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1'>
                            <InputGroup
                                id='firstname'
                                name='firstname'
                                label={translations.firstname}
                                icon={<UserCircleIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.firstname || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='middlename'
                                name='middlename'
                                label={translations.middlename}
                                icon={<UserCircleIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.middlename || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1'>
                            <InputGroup
                                id='lastname'
                                name='lastname'
                                label={translations.lastname}
                                icon={<UserAccountIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.lastname || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='second_lastname'
                                name='second_lastname'
                                label={translations.second_lastname}
                                icon={<UserAccountIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.second_lastname || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <InputGroup
                        id='email'
                        name='email'
                        label={translations.email}
                        icon={<Mail01Icon className='icon' size={24} />}
                        onChange={handleChange(setFormValues)}
                        value={formValues.email || ''}
                        required={false}
                        disabled={true}
                    />
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1'>
                            <InputGroup
                                id='mobile'
                                name='mobile'
                                label={translations.mobile_number}
                                icon={<SmartPhone01Icon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.mobile || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='phone'
                                name='phone'
                                label={translations.phone_number}
                                icon={<TelephoneIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.phone || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <hr className='border dark:border-slate-600 mx-2 my-2' />
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1 z-10'>
                            <InputGroup
                                id='phone'
                                name='phone'
                                label={translations.country}
                                icon={<TelephoneIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.country || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1 z-50'>
                            <InputGroup
                                id='address_state'
                                name='address_state'
                                label={translations.address_state}
                                icon={<MosqueLocationIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.state || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className='grid items-center grid-cols-1 md:grid-cols-3 gap-2'>
                        <div className='col-span-1'>
                            <InputGroup
                                id='street'
                                name='street'
                                label={translations.street}
                                icon={<RoadLocation01Icon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.street || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='area'
                                name='area'
                                label={translations.address_area}
                                icon={<MosqueLocationIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.area || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='address_city'
                                name='address_city'
                                label={translations.address_city}
                                icon={<MosqueLocationIcon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.city || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col gap-2 w-full tab-item ${'details' === activeTab ? 'block' : 'hidden'}`}>
                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                        <div className='col-span-1'>
                            <InputGroup
                                id='birthdate'
                                name='birthdate'
                                label={translations.birthdate}
                                icon={<Calendar01Icon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.birthdate || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                        <div className='col-span-1'>
                            <InputGroup
                                id='note'
                                name='note'
                                label={translations.note}
                                icon={<Note04Icon className='icon' size={24} />}
                                onChange={handleChange(setFormValues)}
                                value={formValues.note || ''}
                                required={false}
                                disabled={true}
                            />
                        </div>
                    </div>
                    <InputGroup
                        id='class_client'
                        name='class_client'
                        label={translations.class_client}
                        icon={<Note04Icon className='icon' size={24} />}
                        onChange={handleChange(setFormValues)}
                        value={formValues.type || ''}
                        required={false}
                        disabled={true}
                    />
                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10 h-14 pr-5'>
                        <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.allow_credit}</h3>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center'>
                                <input id='allow_credit_1' type='radio' value='1' name='allow_credit' onChange={handleChange(setFormValues)} disabled className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === '1'} />
                                <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>Si</label>
                            </div>
                            <div className='flex items-center'>
                                <input id='allow_credit_2' type='radio' value='0' name='allow_credit' onChange={handleChange(setFormValues)} disabled className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === '0'} />
                                <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>No</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`flex flex-col gap-2 w-full tab-item ${'contacts' === activeTab ? 'block' : 'hidden'}`}>
                    <div className='overflow-x-auto rounded-lg w-full'>
                        <table className='w-full text-sm text-left'>
                            <thead className='text-xs text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white'>
                                <tr>
                                    <th scope='col' className='px-6 py-3'>
                                        Tipo
                                    </th>
                                    <th scope='col' className='px-6 py-3'>
                                        Parentezco
                                    </th>
                                    <th scope='col' className='px-6 py-3'>
                                        Nombre completo
                                    </th>
                                    <th scope='col' className='px-6 py-3'>
                                        Direccion
                                    </th>
                                    <th scope='col' className='px-6 py-3'>
                                        Numero de telefono
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact, index) => (
                                    <tr key={index} className='text-xs text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80'>
                                        <td className='px-6 py-4'>{contact.type?.name || ''}</td>
                                        <td className='px-6 py-4'>{contact.relationship}</td>
                                        <td className='px-6 py-4'>{contact.fullname}</td>
                                        <td className='px-6 py-4'>{contact.address}</td>
                                        <td className='px-6 py-4'>{contact.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageDetailsClientPage;