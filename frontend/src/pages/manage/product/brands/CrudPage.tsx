import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../../types/alert';
import { handleChange } from '../../../../utils/formUtils';
import { ProductBrand } from '../../../../types/modelType';
import { addProductBrand, deleteProductBrand, editProductBrand, getProductBrand } from '../../../../services/productBrandService';
import { ProfileIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import useFormSubmit from '../../../../hooks/useFormSubmit';
import InputGroup from '../../../../components/InputGroup';

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
    const [formValues, setFormValues] = useState<ProductBrand>({ id: selected_id, status: true });
    const [colorPage, setColorPage] = useState<string>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudPageProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type]);

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getProductBrand(selected_id);
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(response_data?.resp);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching product brand', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const handleForm = async () => {
        if (type === 'add') return addProductBrand(formValues);
        if (type === 'edit') return editProductBrand(formValues);
        if (type === 'delete' && selected_id) return deleteProductBrand(selected_id);
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

            if(handleTableReload) handleTableReload();
            if(setSelected) setSelected(0);
        }
    };

    return (
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 w-full'>
                <InputGroup
                    id='name'
                    name='name'
                    label={translations.name}
                    icon={<ProfileIcon className='icon' size={24} />}
                    onChange={handleChange({ setFormValues })}
                    value={formValues.name || ''}
                    color={colorPage}
                    disabled={['details', 'delete'].includes(type)}
                />
                <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full z-10 gap-2'>
                    <label className='inline-flex items-center cursor-pointer'>
                        <span className='ml-1 me-2 text-sm font-bold text-gray-900 dark:text-gray-300'>{translations.visible}</span>
                        <input type='checkbox' 
                            value={formValues.status ? '1' : '0'} 
                            disabled={['details', 'delete'].includes(type)} 
                            className='sr-only peer' 
                            name='status' 
                            onChange={handleChange({ setFormValues })} 
                            checked={formValues.status ? true : false} 
                        />
                        <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-transparent rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${colorPage === 'blue' ? 'peer-checked:bg-blue-500' : colorPage === 'orange' ? 'peer-checked:bg-orange-500' : colorPage === 'red' ? 'peer-checked:bg-red-500' : colorPage === 'yellow' ? 'peer-checked:bg-yellow-500' : 'peer-checked:bg-blue-500'}`}>
                        </div>
                    </label>
                </div>
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