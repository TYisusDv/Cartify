import React, { useEffect, useState } from 'react';
import { Location } from '../../../types/modelType';
import { ProfileIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import Input from '../../../components/Input';
import Switch from '../../../components/Switch';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';
import { extractMessages } from '../../../utils/formUtils';
import { addLocation, deleteLocation, editLocation, getLocation } from '../../../services/Locations';

interface CrudProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number) => void;
    type: string;
    selected_id?: number;
}

const Crud: React.FC<CrudProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Location>({ id: selected_id, status: true });
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
                    const response = await getLocation(formValues);
                    const response_resp = response.resp;

                    setFormValues(response_resp);
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
                const response = await addLocation(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editLocation(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete' && selected_id) {
                const response = await deleteLocation(formValues);
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
                <Input
                    props={{
                        id: 'name',
                        name: 'name',
                        value: formValues.name,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            name: e.target.value || ''
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={translations.name}
                    icon={<ProfileIcon className='icon' size={24} />}
                    color={colorPage}
                />
                <Switch
                    props={{
                        id: 'status',
                        name: 'status',
                        checked: !!(formValues.status === true || formValues.status === 1 || formValues.status === '1'),
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            status: e.target.checked ? true : false
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={translations.visible}
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