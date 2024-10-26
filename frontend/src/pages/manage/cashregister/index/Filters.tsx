import React from 'react';
import useTranslations from '../../../../hooks/useTranslations';
import Select from '../../../../components/Select';
import { Calendar02Icon, StoreLocation01Icon } from 'hugeicons-react';
import Input from '../../../../components/Input';

interface FiltersProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
    formValuesPage: any;
    setFormValuesPage: (values: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ formValues, setFormValues, formValuesPage, setFormValuesPage }) => {
    const { translations } = useTranslations();

    return (
        <>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        onChange: (e) => {
                            setFormValuesPage((prev: any) => ({
                                ...prev,
                                location: {
                                    id: e.target.value
                                }
                            }));

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

export default Filters;