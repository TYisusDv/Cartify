import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { MoreIcon, StoreLocation01Icon } from 'hugeicons-react';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
    setValue: (value: number) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues, setValue }) => {
    const { translations } = useTranslations();
    const type_of_sales_options = [
        { value: 1, label: 'Contado' },
        { value: 2, label: 'Credito' },
    ];

    return (
        <>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        name: 'type_of_sale',
                        onChange: (e) => {
                            setValue(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value));
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    type: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }));
                            }
                        },
                        value: formValues.brand?.id
                    }}
                    myOptions={type_of_sales_options}
                    icon={<MoreIcon size={20} />}
                    label={translations.type_of_sale}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        id: 'location',
                        name: 'location',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    location: {
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                    }
                                }));
                            };
                        },
                        value: formValues.location?.id,
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