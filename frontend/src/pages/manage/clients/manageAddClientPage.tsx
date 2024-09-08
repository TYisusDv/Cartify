import React, { useEffect, useState } from 'react';
import { Calendar01Icon, Location01Icon, Mail01Icon, MapsLocation01Icon, Monocle01Icon, MosqueLocationIcon, Note04Icon, RoadLocation01Icon, SmartPhone01Icon, TelephoneIcon, UserAccountIcon, UserCircleIcon, UserIdVerificationIcon, UserQuestion02Icon } from 'hugeicons-react';
import { handleChange } from '../../../utils/formUtils';
import { AlertType } from '../../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import { listLocations } from '../../../services/locationsService';
import { addClient } from '../../../services/clientsService';
import { listTypesOfIds } from '../../../services/typesOfIdsService';
import { listCountries } from '../../../services/countriesService';
import useTranslations from '../../../hooks/useTranslations';
import InputGroup from '../../../components/InputGroup';
import SelectGroup from '../../../components/SelectGroup';
import useFormSubmit from '../../../hooks/useFormSubmit';
import InputList from '../../../components/InputList';
import { Client, initialClient } from '../../../types/clientsType';

interface ManageAddClientProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload: () => void;
}

const ManageAddClientPage: React.FC<ManageAddClientProps> = ({ addAlert, onClose, handleTableReload }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Client>(initialClient);
    const [locations, setLocations] = useState([]);
    const [typesOfIds, setTypesOfIds] = useState([]);
    const [countries, setCountries] = useState([]);
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

    const handleCountryChange = (value: any) => {
        setFormValues({
            ...formValues,
            country_id: value,
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

        const fetchCountries = async () => {
            try {
                const response = await listCountries();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const countries_options = response_data.resp.map((country: any) => ({
                    value: country.id,
                    label: country.name,
                }));

                setCountries(countries_options);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching countries', type: 'danger', timeout: 3000 });
            }
        };

        fetchLocations();
        fetchTypesOfIds();
        fetchCountries();
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

            addAlert({ id: uuidv4(), text: response_data.resp, type: 'primary', timeout: 3000 });
            onClose();
            handleTableReload();
        }
    };

    return (
        <div>
            <div className='flex space-x-2'>
                <button className={`py-2 px-4 ${'information' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('information')}>
                    Informacion
                </button>
                <button className={`py-2 px-4 ${'details' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('details')}>
                    Detalles
                </button>
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'information' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-20 gap-2'>
                            <h3 className='w-auto text-sm font-semibold dark:text-gray-100 pl-1'>{translations.location} <span className='text-red-500'>*</span></h3>
                            <div className='w-10/12'>
                                <SelectGroup options={locations} onChange={handleLocationChange} />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-10'>
                                <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10'>
                                    <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.identification_type} <span className='text-red-500'>*</span></h3>
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
                            required={false}
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
                                    required={false}
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
                                    required={false}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='email'
                            name='email'
                            label={translations.email}
                            icon={<Mail01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='mobile'
                                    name='mobile'
                                    label={translations.mobile_number}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='phone'
                                    name='phone'
                                    label={translations.phone_number}
                                    icon={<TelephoneIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-10'>
                                <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10'>
                                    <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.country} <span className='text-red-500'>*</span></h3>
                                    <div className='w-10/12'>
                                        <SelectGroup options={countries} onChange={handleCountryChange} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 z-50'>
                                <InputList
                                    id='state'
                                    name='state'
                                    label={translations.address_state}
                                    icon={<MapsLocation01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    endpoint='manage/states'
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
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='area'
                                    name='area'
                                    label={translations.address_area}
                                    icon={<MosqueLocationIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputList
                                    id='city'
                                    name='city'
                                    label={translations.address_city}
                                    icon={<Location01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    endpoint='manage/cities'
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
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='note'
                                    name='note'
                                    label={translations.note}
                                    icon={<Note04Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='class_client'
                            name='class_client'
                            label={translations.class_client}
                            icon={<Monocle01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                        />
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10 h-14 pr-5'>
                            <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.allow_credit} <span className='text-red-500'>*</span></h3>
                            <div className='flex items-center gap-3'>                                
                                <div className='flex items-center'>
                                    <input id='allow_credit_1' type='radio' value='1' name='allow_credit' onChange={handleChange(setFormValues)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === '1'} />
                                    <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>Si</label>
                                </div>
                                <div className='flex items-center'>
                                    <input id='allow_credit_2' type='radio' value='0' name='allow_credit' onChange={handleChange(setFormValues)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === '0'} />
                                    <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>No</label>
                                </div>
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