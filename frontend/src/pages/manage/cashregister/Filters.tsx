import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { BrandfetchIcon, Layers01Icon, StoreLocation01Icon } from 'hugeicons-react';

interface FiltersProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
    setFormValuesPage: (values: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ formValues, setFormValues, setFormValuesPage }) => {
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
        </>
    );
};

export default Filters;