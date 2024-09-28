import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { BarCode02Icon, SearchAreaIcon, StoreLocation01Icon } from 'hugeicons-react';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();

    const inventory_type_options = [
        { value: 1, label: 'Entrada' },
        { value: 2, label: 'Salida' },
    ];

    return (
        <>            
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        id: 'type',
                        name: 'type',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    type: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }));
                            }
                        },
                        value: formValues.type,
                    }}
                    myOptions={inventory_type_options}
                    icon={<SearchAreaIcon size={20} />}
                    label={translations.type}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    product: {
                                        id: e.target.value
                                    }
                                }));
                            }
                        },
                        value: formValues.product?.id
                    }}
                    endpoint='manage/products'
                    endpoint_value='id'
                    endpoint_text='{name}'
                    icon={<BarCode02Icon size={20} />}
                    label={translations.product}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    location: {
                                        id: e.target.value
                                    }
                                }));
                            }
                        },
                        value: formValues.location?.id
                    }}
                    endpoint='manage/locations'
                    endpoint_value='id'
                    endpoint_text='{name}'
                    icon={<StoreLocation01Icon size={20} />}
                    label={translations.location}
                />
            </div>
        </>
    );
};

            export default FiltersPage;