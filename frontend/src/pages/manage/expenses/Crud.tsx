import React, { useEffect, useState } from 'react';
import { Expense } from '../../../types/modelType';
import { Calendar01Icon, DistributionIcon, Invoice01Icon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import Input from '../../../components/Input';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';
import { extractMessages } from '../../../utils/formUtils';
import { addExpense, deleteExpense, editExpense, getExpense } from '../../../services/Exprenses';
import Select from '../../../components/Select';
import { UTCToLocalTimeInput } from '../../../utils/DateFuncs';

interface CrudProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string | undefined) => void;
    type: string;
    selected_id?: string | undefined;
}

const Crud: React.FC<CrudProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Expense>({ id: selected_id });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getExpense(formValues);
                    const response_resp = response.resp;
                    
                    setFormValues({...response_resp, supplier_id: response_resp.supplier?.id, date_reg: UTCToLocalTimeInput(response_resp.date_reg)});
                } catch (error) {
                }
            };

            fetchGet();
        }
    }, [type, selected_id]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response_resp;
            if (type === 'add') {
                const response = await addExpense(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editExpense(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete' && selected_id) {
                const response = await deleteExpense(formValues);
                response_resp = response?.resp;
            }

            addAlert({
                id: generateUUID(),
                title: 'Success',
                msg: response_resp,
                icon: 'CheckmarkCircle02Icon',
                timeout: 2000
            });

            onClose();

            if (handleTableReload) handleTableReload();
            if (setSelected) setSelected(undefined);
        } catch (error) {
            const messages = extractMessages(error);
            messages.forEach(msg => {
                addAlert({
                    id: generateUUID(),
                    title: 'An error has occurred.',
                    msg: msg,
                    icon: 'Alert01Icon',
                    color: 'red',
                    timeout: 2000
                });
            });
        }
    };

    return (
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 w-full'>
                <Input
                    props={{
                        id: 'date_reg',
                        name: 'date_reg',
                        value: formValues.date_reg,
                        type: 'date',
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            date_reg: e.target.value
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Fecha de registro'
                    icon={<Calendar01Icon className='icon' size={24} />}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'no',
                        name: 'no',
                        value: formValues.no,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            no: e.target.value
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Numero'
                    icon={<Invoice01Icon className='icon' size={24} />}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'transaction_number',
                        name: 'transaction_number',
                        value: formValues.transaction_number,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            transaction_number: e.target.value
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Numero de transaccion'
                    icon={<Invoice01Icon className='icon' size={24} />}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'total',
                        name: 'total',
                        value: formValues.total,
                        type: 'number',
                        step: 0.01,
                        min: 0,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            total: !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : 0
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Total'
                    icon={'Q'}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'date_limit',
                        name: 'date_limit',
                        value: formValues.date_limit,
                        type: 'date',
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            date_limit: e.target.value
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Fecha limite'
                    icon={<Invoice01Icon className='icon' size={24} />}
                    color={colorPage}
                />
                <div className='z-10'>
                    <Select
                        props={{
                            id: 'supplier',
                            name: 'supplier',
                            onChange: (e) => {
                                if (setFormValues) {
                                    setFormValues((prev) => ({
                                        ...prev,
                                        supplier_id: e.target.value
                                    }));
                                }
                            },
                            disabled: ['details', 'delete'].includes(type),
                            value: formValues.supplier_id
                        }}
                        endpoint='manage/suppliers'
                        endpoint_value='id'
                        endpoint_text='{company_name}'
                        icon={<DistributionIcon size={20} />}
                        label={translations.supplier}
                    />
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                <div className='col-span-1 md:col-end-3 w-full'>
                    {(type === 'delete' || type === 'edit' || type === 'add') && (
                        <button type='submit' className={`btn btn-${colorPage} max-w-48 h-12 float-end`}>
                            {translations[type]}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default Crud;