import React, { useEffect, useState } from 'react';
import { CashRegister } from '../../../types/modelType';
import useTranslations from '../../../hooks/useTranslations';
import Input from '../../../components/Input';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';
import { extractMessages } from '../../../utils/formUtils';
import { CursorPointer01Icon, DocumentCodeIcon, Note01Icon, StoreLocation01Icon } from 'hugeicons-react';
import { addCashRegister, deleteCashRegister, editCashRegister, getCashRegister } from '../../../services/CashRegister';
import Select from '../../../components/Select';

interface CrudPageProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number | undefined) => void;
    type: string;
    selected_id?: number | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<CashRegister>({ id: selected_id });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudPageProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getCashRegister(formValues);
                    const response_resp = response.resp;
                    setFormValues(response_resp);
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
                const response = await addCashRegister(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editCashRegister(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete') {
                const response = await deleteCashRegister(formValues);
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
            <div className='flex flex-col gap-2'>
                <div className='z-10'>
                    <Select
                        props={{
                            id: 'location',
                            name: 'location',
                            onChange: (e) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    location: {
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                    }
                                }));
                            },
                            value: formValues.location?.id,
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        endpoint='manage/locations'
                        endpoint_value='id'
                        endpoint_text='{name}'
                        icon={<StoreLocation01Icon size={20} />}
                        label={translations.location}
                        required={true}
                    />
                </div>
                <Input
                    props={{
                        id: 'no',
                        name: 'no',
                        value: formValues.no,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                no: e.target.value
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Numero de documento'
                    icon={<DocumentCodeIcon className='icon' size={24} />}
                    required={true}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'amount',
                        name: 'amount',
                        type: 'number',
                        value: formValues.amount,
                        min: 0,
                        step: 0.01,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            amount: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Monto'
                    icon='Q'
                    color={colorPage}
                    required={true}
                />
                <Input
                    props={{
                        id: 'description',
                        name: 'description',
                        value: formValues.description,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                description: e.target.value
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Descripcion'
                    icon={<Note01Icon className='icon' size={24} />}
                    required={true}
                    color={colorPage}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-3'>
                <div className='col-span-1 md:col-end-3 w-full mt-2'>
                    {(type === 'delete' || type === 'edit' || type === 'add') && (
                        <button type='submit' className={`btn btn-${colorPage} max-w-full h-12`}>
                            {translations[type]}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CrudPage;