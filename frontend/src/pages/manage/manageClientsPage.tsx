import React, { useEffect, useState } from 'react';
import { Add01Icon, Mail01Icon, Search01Icon, SmartPhone01Icon, TelephoneIcon, UserAccountIcon, UserCircleIcon, UserGroupIcon, UserIdVerificationIcon, UserQuestion02Icon } from 'hugeicons-react';
import { handleChange } from '../../utils/formUtils';
import { AlertType } from '../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import { listLocations } from '../../services/locationsService';
import useTranslations from '../../hooks/useTranslations';
import DelayedSuspense from '../../components/DelayedSuspense';
import SkeletonLoader from '../../components/SkeletonLoader';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import InputGroup from '../../components/InputGroup';
import SelectGroup from '../../components/SelectGroup';
import { listTypesOfIds } from '../../services/typesOfIdsService';
import { addClient } from '../../services/clientsService';
import useFormSubmit from '../../hooks/useFormSubmit';
import ManageAddClientPage from './clients/manageAddClientPage';

interface ManageClientsProps {
    addAlert: (alert: AlertType) => void;
}

const ManageClientsPage: React.FC<ManageClientsProps> = ({ addAlert }) => {
    const { translations } = useTranslations();
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
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

    const openModalAdd = () => {
        setIsModalAddOpen(true);
    };

    const closeModalAdd = () => {
        setIsModalAddOpen(false);
    };

    const table_header = [
        { name: 'id', headerName: 'ID' },
        { name: 'clientName', headerName: 'Sucursal' },
        { name: 'alias', headerName: 'Alias' },
        { name: 'fullname', headerName: 'Nombre completo' },
        { name: 'phoneNumber', headerName: 'Phone Number' },
    ];

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

            //saveToken(response_data.resp.accessToken)
            addAlert({ id: uuidv4(), text: 'Success! Welcome to Carsync.', type: 'primary', timeout: 3000 });
        }
    };


    return (
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.clients}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.manage_clients_info}</span>
                </div>
                <div>
                    <button className='bg-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white dark:bg-slate-600 dark:text-white rounded-full p-3' onClick={openModalAdd}><Add01Icon /></button>
                </div>
            </div>
            <div className='flex flex-col p-8 animate__animated animate__fadeIn'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 border-t-2 border-b-2 border-gray-100 py-6 dark:border-slate-600'>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 border-gray-100 md:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm u font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pt-0 md:border-r-0 lg:border-r-2 lg:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 border-b-2 pb-5 pt-3 border-gray-100 md:pb-0 md:border-r-2 md:border-b-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                    <div className='col-span-1 flex items-center gap-3 border-r-0 pt-3 border-gray-100 md:border-r-0 lg:border-r-0 lg:p-0 dark:border-slate-600'>
                        <div className='flex justify-center items-center h-12 w-12 bg-gray-200 rounded-full dark:bg-slate-600 dark:text-white'>
                            <UserGroupIcon />
                        </div>
                        <div>
                            <h2 className='text-sm font-semibold text-gray-600 dark:text-slate-400'>Total</h2>
                            <h3 className='text-lg font-bold dark:text-white'>18</h3>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-6'>
                    <Table endpoint='/' header={table_header} />
                </div>
            </div>
            {isModalAddOpen && (
                <Modal title={translations.add_client} onClose={closeModalAdd}>
                    <ManageAddClientPage addAlert={addAlert} />
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default ManageClientsPage;