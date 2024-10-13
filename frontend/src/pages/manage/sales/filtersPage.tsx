import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { MoreIcon } from 'hugeicons-react';

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
                        id: 'type_of_sale',
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
        </>
    );
};

export default FiltersPage;