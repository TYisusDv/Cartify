import React, { useEffect, useState } from 'react';
import { Mail01Icon, SmartPhone01Icon, TelephoneIcon, UserAccountIcon, UserCircleIcon, UserIdVerificationIcon, UserQuestion02Icon } from 'hugeicons-react';
import { handleChange } from '../../../utils/formUtils';
import { AlertType } from '../../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import { listLocations } from '../../../services/locationsService';
import useTranslations from '../../../hooks/useTranslations';
import InputGroup from '../../../components/InputGroup';
import SelectGroup from '../../../components/SelectGroup';
import { listTypesOfIds } from '../../../services/typesOfIdsService';
import { addClient } from '../../../services/clientsService';
import useFormSubmit from '../../../hooks/useFormSubmit';

interface ManageClientsProps {
    addAlert: (alert: AlertType) => void;
}

const ManageAddClientPage: React.FC<ManageClientsProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState({
        identification_id: null,
        alias: null,
        firstname: null,
        middlename: null,
        lastname: null,
        second_lastname: null,
        mobile: null,
        phone: null,
        birthdate: null,
        type_of_ids_id: null,
        location_id: null,
        email: null,
        client_class: null,
        allow_credit: true,
        note: null
    });
    const [locations, setLocations] = useState([]);
    const [typesOfIds, setTypesOfIds] = useState([]);
    const [activeTab, setActiveTab] = useState<string>('information');

    const handleLocationChange = (value: any) => {
        setFormValues({
            ...formValues,
            location_id: value,
        });
    };

    const handleTypeOfIdsChange = (value: any) => {
        setFormValues({
            ...formValues,
            type_of_ids_id: value,
        });
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await listLocations();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const locations_options = response_data.resp.map((location: any) => ({
                    value: location.id,
                    label: location.name,
                }));

                setLocations(locations_options);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching locations', type: 'danger', timeout: 3000 });
            }
        };

        const fetchTypesOfIds = async () => {
            try {
                const response = await listTypesOfIds();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const typesofids_options = response_data.resp.map((type: any) => ({
                    value: type.id,
                    label: type.name,
                }));

                setTypesOfIds(typesofids_options);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching types of ids', type: 'danger', timeout: 3000 });
            }
        };

        fetchLocations();
        fetchTypesOfIds();
    }, []);

    const handleAddClient = async () => {
        return await addClient(formValues);
    };

    const { handleSubmit, isLoading } = useFormSubmit(handleAddClient, addAlert);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await handleSubmit(formValues);
        if (response) {
            const response_data = response.data;
            if (!response_data.success) {
                addAlert({ id: uuidv4(), text: response_data.resp, type: 'danger', timeout: 3000 });
                return;
            }

            addAlert({ id: uuidv4(), text: 'Success! Welcome to Carsync.', type: 'primary', timeout: 3000 });
        }
    };

    return (
        <div>
            <div className="flex space-x-2">
                <button className={`py-2 px-4 ${'information' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('information')}>
                    Informacion
                </button>
                <button className={`py-2 px-4 ${'details' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('details')}>
                    Detalles
                </button>
            </div>
            <div className="mt-4">
                <form autoComplete='off' onSubmit={onSubmit} className={`tab-item ${'information' === activeTab ? 'block' : 'hidden'}`}>
                    <div className='flex flex-col gap-2 w-full'>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10'>
                            <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.location}</h3>
                            <div className='min-w-40'>
                                <SelectGroup options={locations} onChange={handleLocationChange} />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-10'>
                                <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10'>
                                    <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.identification_type}</h3>
                                    <div className='min-w-40'>
                                        <SelectGroup options={typesOfIds} onChange={handleTypeOfIdsChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='identification_id'
                                    name='identification_id'
                                    label={translations.identification_id}
                                    icon={<UserIdVerificationIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='alias'
                            name='alias'
                            label={translations.alias}
                            icon={<UserQuestion02Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='firstname'
                                    name='firstname'
                                    label={translations.firstname}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='middlename'
                                    name='middlename'
                                    label={translations.middlename}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
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
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='second_lastname'
                                    name='second_lastname'
                                    label={translations.second_lastname}
                                    icon={<UserAccountIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='email'
                            name='email'
                            label={translations.email}
                            icon={<Mail01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='mobile'
                                    name='mobile'
                                    label={translations.mobile_number}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='phone'
                                    name='phone'
                                    label={translations.phone_number}
                                    icon={<TelephoneIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                        <div className='col-span-1 md:col-end-3 w-full'>
                            <button type='submit' className='btn h-12 max-w-48 float-end' disabled={isLoading}>Agregar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageAddClientPage;