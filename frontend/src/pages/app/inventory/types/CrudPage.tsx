import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../../types/alert';
import { InventoryType } from '../../../../types/modelType';
import { addInventoryType, deleteInventoryType, editInventoryType, getInventoryType } from '../../../../services/inventoryTypesService';
import { ProfileIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import useFormSubmit from '../../../../hooks/useFormSubmit';
import Input from '../../../../components/Input';
import Switch from '../../../../components/Switch';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number) => void;
    type: string;
    selected_id?: number;
}

const CrudPage: React.FC<CrudPageProps> = ({ addAlert, onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<InventoryType>({ id: selected_id });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudPageProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getInventoryType(selected_id);
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(response_data?.resp);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching inventory type', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const handleForm = async () => {
        if (type === 'add') return addInventoryType(formValues);
        if (type === 'edit') return editInventoryType(formValues);
        if (type === 'delete' && selected_id) return deleteInventoryType(selected_id);
    };

    const { handleSubmit, isLoading } = useFormSubmit(handleForm, addAlert);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleSubmit(formValues);

        if (response) {
            if (!response?.data?.success) {
                addAlert({ id: uuidv4(), text: response?.data?.resp, type: 'danger', timeout: 3000 });
                return;
            }

            addAlert({ id: uuidv4(), text: response?.data?.resp, type: 'primary', timeout: 3000 });
            onClose();

            if (handleTableReload) handleTableReload();
            if (setSelected) setSelected(0);
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
                        id: 'inventory_type_1',
                        name: 'inventory_type',
                        checked: !!(formValues.type === 1 || formValues.type?.toString() === '1'),
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            type: e.target.checked ? 1 : formValues.type || 0
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={translations.inventory_entry}
                    color={colorPage}
                />
                <Switch
                    props={{
                        id: 'inventory_type_2',
                        name: 'inventory_type',
                        checked: !!(formValues.type === 2 || formValues.type?.toString() === '2'),
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            type: e.target.checked ? 2 : formValues.type || 0
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={translations.inventory_exit}
                    color={colorPage}
                />
                <Switch
                    props={{
                        id: 'inventory_type_3',
                        name: 'inventory_type',
                        checked: !!(formValues.type === 3 || formValues.type?.toString() === '3'),
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            type: e.target.checked ? 3 : formValues.type || 0
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={translations.inventory_transfer}
                    color={colorPage}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                <div className='col-span-1 md:col-end-3 w-full'>
                    {(type === 'delete' || type === 'edit' || type === 'add') && (
                        <button type='submit' className={`btn btn-${colorPage} max-w-48 h-12 float-end`} disabled={isLoading}>
                            {translations[type]}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CrudPage;