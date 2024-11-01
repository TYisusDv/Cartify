import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { BarCode02Icon, Calendar02Icon, SearchAreaIcon, StoreLocation01Icon } from 'hugeicons-react';
import Input from '../../../components/Input';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
    formValuesPage: any;
    setFormValuesPage: (values: any) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues, formValuesPage, setFormValuesPage }) => {
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
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Input
                    props={{
                        id: 'date_1',
                        name: 'date_1',
                        type: 'date',
                        value: formValuesPage?.date_1,
                        onChange: (e) => {
                            setFormValuesPage((prev: any) => ({
                                ...prev,
                                date_1: e.target.value
                            }));
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    date_1: e.target.value
                                }));
                            }
                        },
                    }}
                    label='De la fecha'
                    icon={<Calendar02Icon className='icon' size={24} />}
                    required={false}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>           
                <Input
                    props={{
                        id: 'date_2',
                        name: 'date_2',
                        type: 'date',
                        value: formValuesPage?.date_2,
                        onChange: (e) => {
                            setFormValuesPage((prev: any) => ({
                                ...prev,
                                date_2: e.target.value
                            }));
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    date_2: e.target.value
                                }));
                            }
                        },
                    }}
                    label='A la fecha'
                    icon={<Calendar02Icon className='icon' size={24} />}
                    required={false}
                />
            </div>
        </>
    );
};

export default FiltersPage;