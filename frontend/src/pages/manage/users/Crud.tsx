import React, { useEffect, useState } from 'react';
import { User } from '../../../types/modelType';
import { PercentCircleIcon, ProfileIcon, StoreLocation02Icon, TelephoneIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import Input from '../../../components/Input';
import Switch from '../../../components/Switch';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';
import { extractMessages } from '../../../utils/formUtils';
import { addUser, deleteUser, editUser, getUser } from '../../../services/Users';
import Select from '../../../components/Select';

interface CrudProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number) => void;
    type: string;
    selected_id?: number;
}

const Crud: React.FC<CrudProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<User>({ id: selected_id });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getUser(formValues);
                    const response_resp = response.resp;

                    setFormValues({...response_resp, profile: {...response_resp.profile, location_id: response_resp?.profile?.location?.id || 0}});
                } catch (error) {
                }
            };

            fetchGet();
        }
    }, [type, selected_id]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response_resp;
            if (type === 'add') {
                const response = await addUser(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editUser(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete' && selected_id) {
                const response = await deleteUser(formValues);
                response_resp = response?.resp;
            }

            addAlert({
                id: generateUUID(),
                title: 'Success',
                msg: response_resp,
                icon: 'CheckmarkCircle02Icon',
                timeout: 2000
            });

            onClose();

            if (handleTableReload) handleTableReload();
            if (setSelected) setSelected(0);
        } catch (error) {
            const messages = extractMessages(error);
            messages.forEach(msg => {
                addAlert({
                    id: generateUUID(),
                    title: 'An error has occurred.',
                    msg: msg,
                    icon: 'Alert01Icon',
                    color: 'red',
                    timeout: 2000
                });
            });
        }
    };

    return (
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 w-full'>
                <div className='z-10'>
                    <Select
                        props={{
                            id: 'location',
                            name: 'location',
                            onChange: (e) => setFormValues(prev => ({
                                ...prev,
                                profile: {
                                    ...prev.profile,
                                    location_id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }
                            })),
                            value: formValues.profile?.location?.id,
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        endpoint='manage/locations'
                        endpoint_value='id'
                        endpoint_text='{name}'
                        icon={<StoreLocation02Icon size={20} />}
                        label={translations.location}
                    />
                </div>
                <Input
                    props={{
                        id: 'phone',
                        name: 'phone',
                        value: formValues.profile?.phone,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            profile: {
                                ...prev.profile,
                                phone: e.target.value
                            }
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Telefono'
                    icon={<TelephoneIcon className='icon' size={24} />}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'commission',
                        name: 'commission',
                        type: 'number',
                        min: 0,
                        max: 100,
                        value: formValues.profile?.commission,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            profile: {
                                ...prev.profile,
                                commission: !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : 0,
                            }
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Comision'
                    icon={<PercentCircleIcon className='icon' size={24} />}
                    color={colorPage}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                <div className='col-span-1 md:col-end-3 w-full'>
                    {(type === 'delete' || type === 'edit' || type === 'add') && (
                        <button type='submit' className={`btn btn-${colorPage} max-w-48 h-12 float-end`}>
                            {translations[type]}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Crud;