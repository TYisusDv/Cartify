import React from 'react';
import useTranslations from '../../../../hooks/useTranslations';
import Select from '../../../../components/Select';
import { BarCode02Icon, SearchAreaIcon, StoreLocation01Icon } from 'hugeicons-react';

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
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    type: {
                                        id: e.target.value
                                    }
                                }));
                            }
                        },
                        value: formValues.type?.id
                    }}
                    endpoint='manage/inventory/types'
                    endpoint_value='id'
                    endpoint_text='{name}'
                    icon={<SearchAreaIcon size={20} />}
                    label={translations.type}
                    query='list_transfer'
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