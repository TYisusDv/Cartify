import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { DistributionIcon } from 'hugeicons-react';

interface FiltersProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();

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
        </>
    );
};

export default Filters;