import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../../types/alert';
import { ProductCategory } from '../../../../types/modelType';
import { addProductCategory, deleteProductCategory, editProductCategory, getProductCategory } from '../../../../services/productCategoriesService';
import { ProfileIcon, UserCircleIcon } from 'hugeicons-react';
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
    const [formValues, setFormValues] = useState<ProductCategory>({ id: selected_id, status: true });
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
                    const response = await getProductCategory(selected_id);
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(response_data?.resp);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching product category', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const handleForm = async () => {
        if (type === 'add') return addProductCategory(formValues);
        if (type === 'edit') return editProductCategory(formValues);
        if (type === 'delete' && selected_id) return deleteProductCategory(selected_id);
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