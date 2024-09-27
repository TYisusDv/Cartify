import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { StoreLocation01Icon } from 'hugeicons-react';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();

    return (
        <div className='flex gap-2 w-full'>
            <Select
                props={{
                    id: 'brand',
                    name: 'brand',
                    onChange: (e) => {
                        if (setFormValues) {
                            setFormValues((prev: any) => ({
                                ...prev,
                                brand: {
                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }
                            }));
                        }
                    },
                    value: formValues.brand?.id
                }}
                endpoint='manage/product/brands'
                endpoint_value='id'
                endpoint_text='{name}'
                icon={<StoreLocation01Icon size={20} />}
                label={translations.brand}
            />
            <Select
                props={{
                    id: 'category',
                    name: 'category',
                    onChange: (e) => {
                        if (setFormValues) {
                            setFormValues((prev: any) => ({
                                ...prev,
                                category: {
                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }
                            }));
                        }
                    },
                    value: formValues.category?.id
                }}
                endpoint='manage/product/categories'
                endpoint_value='id'
                endpoint_text='{name}'
                icon={<StoreLocation01Icon size={20} />}
                label={translations.brand}
            />
        </div>
    );
};

export default FiltersPage;