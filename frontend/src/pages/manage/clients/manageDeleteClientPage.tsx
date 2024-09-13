import React, { useEffect, useState } from 'react';
import { UserAccountIcon, UserCircleIcon, UserIdVerificationIcon } from 'hugeicons-react';
import { handleChange } from '../../../utils/formUtils';
import { AlertType } from '../../../types/alert';
import { Client, initialClient } from '../../../types/clientsType';
import { deleteClient, getClient } from '../../../services/clientsService';
import { v4 as uuidv4 } from 'uuid';
import useTranslations from '../../../hooks/useTranslations';
import InputGroup from '../../../components/InputGroup';
import useFormSubmit from '../../../hooks/useFormSubmit';

interface ManageDeleteClientProps {
    addAlert: (alert: AlertType) => void;
    client_id: number;
    onClose: () => void;
    handleTableReload: () => void;
    setSelected: (value: number) => void;
}

const ManageDeleteClientPage: React.FC<ManageDeleteClientProps> = ({ addAlert, client_id, onClose, handleTableReload, setSelected }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Client>(initialClient);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await getClient(client_id);
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                setFormValues({
                    ...formValues,
                    identification_id: response_data.resp.person.identification_id,
                    firstname: response_data.resp.person.firstname,
                    lastname: response_data.resp.person.lastname
                }); 
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching client', type: 'danger', timeout: 3000 });
            }
        };

        fetchClient();
    }, []);
    
    const handleDeleteClient = async () => {
        return await deleteClient(client_id);
    };

    const { handleSubmit, isLoading } = useFormSubmit(handleDeleteClient, addAlert);

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
            handleTableReload();
            setSelected(0)
            onClose();
        }
    };

    return (
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 w-full tab-item'>
                <InputGroup
                    id='identification_id'
                    name='identification_id'
                    label={translations.identification_id}
                    icon={<UserIdVerificationIcon className='icon' size={24} />}
                    onChange={handleChange(setFormValues)}
                    value={formValues.identification_id || ''}
                    disabled={true}
                />
                <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                    <div className='col-span-1'>
                        <InputGroup
                            id='firstname'
                            name='firstname'
                            label={translations.firstname}
                            icon={<UserCircleIcon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            value={formValues.firstname || ''}
                            disabled={true}
                        />
                    </div>
                    <div className='col-span-1'>
                        <InputGroup
                            id='lastname'
                            name='lastname'
                            label={translations.lastname}
                            icon={<UserAccountIcon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            value={formValues.lastname || ''}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                <div className='col-span-1 md:col-end-3 w-full'>
                    <button type='submit' className='btn bg-red-600 border-red-600 hover:text-red-600 hover:bg-red-600/20 h-12 max-w-48 float-end' disabled={isLoading}>Eliminar</button>
                </div>
            </div>
        </form>
    );
};

export default ManageDeleteClientPage;