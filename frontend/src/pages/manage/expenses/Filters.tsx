import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { DistributionIcon, ToggleOnIcon } from 'hugeicons-react';

interface FiltersProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();

    const status_options = [
        { value: 1, label: 'Activo' },
        { value: 2, label: 'Completado' },
    ];

    return (
        <>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        id: 'supplier',
                        name: 'supplier',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    supplier: {
                                        id: e.target.value
                                    }
                                }));
                            }
                        },
                        value: formValues.supplier?.id
                    }}
                    endpoint='manage/suppliers'
                    endpoint_value='id'
                    endpoint_text='{company_name}'
                    icon={<DistributionIcon size={20} />}
                    label={translations.supplier}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        name: 'status',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    status: e.target.value
                                }));
                            }
                        },
                        value: formValues.status?.id
                    }}
                    myOptions={status_options}
                    icon={<ToggleOnIcon size={20} />}
                    label='Estado'
                />
            </div>
        </>
    );
};

export default Filters;