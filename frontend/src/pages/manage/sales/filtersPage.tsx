import React from 'react';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { DashboardBrowsingIcon, MoreIcon, StoreLocation01Icon } from 'hugeicons-react';

interface FiltersPageProps {
    formValues?: any;
    setFormValues?: (values: any) => void;
}

const FiltersPage: React.FC<FiltersPageProps> = ({ formValues, setFormValues }) => {
    const { translations } = useTranslations();
    const type_of_sales_options = [
        { value: 1, label: 'Contado' },
        { value: 2, label: 'Credito' },
    ];

    const other_options = [
        { value: 1, label: 'Clientes atrasados' }
    ];

    return (
        <>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        id: 'status',
                        name: 'status',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    status: {
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                    }
                                }));
                            };
                        },
                        value: formValues.status?.id,
                    }}
                    endpoint='manage/sale/status'
                    endpoint_value='id'
                    endpoint_text='{name}'
                    icon={<DashboardBrowsingIcon size={20} />}
                    label={translations.sale_status}
                />
            </div>
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        name: 'type_of_sale',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    type: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }));
                            }
                        },
                        value: formValues.type_of_sale?.id
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
            <div className='col-span-1 w-full h-full rounded-2xl dark:bg-slate-700'>
                <Select
                    props={{
                        name: 'other',
                        onChange: (e) => {
                            if (setFormValues) {
                                setFormValues((prev: any) => ({
                                    ...prev,
                                    other: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }));
                            }
                        },
                        value: formValues.other?.id
                    }}
                    myOptions={other_options}
                    icon={<MoreIcon size={20} />}
                    label='Otros'
                />
            </div>
        </>
    );
};

export default FiltersPage;