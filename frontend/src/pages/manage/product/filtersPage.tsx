import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { BrandfetchIcon, Layers01Icon } from 'hugeicons-react';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();

    return (
        <>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
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
                    icon={<BrandfetchIcon size={20} />}
                    label={translations.brand}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
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
                    icon={<Layers01Icon size={20} />}
                    label={translations.category}
                />
            </div>
        </>
    );
};

export default FiltersPage;