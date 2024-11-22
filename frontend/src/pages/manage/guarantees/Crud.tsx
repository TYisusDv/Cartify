import React, { useEffect, useState } from 'react';
import { Warranty } from '../../../types/modelType';
import { Invoice01Icon, NoteIcon, ShoppingBasketSecure03Icon, UserIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import Input from '../../../components/Input';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';
import { extractMessages } from '../../../utils/formUtils';
import { addWarranty, deleteWarranty, editWarranty, getWarranty } from '../../../services/Guarantees';
import Select from '../../../components/Select';
import { CustomChangeEvent } from '../../../types/componentsType';

interface CrudProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number) => void;
    type: string;
    selected_id?: number;
}

const Crud: React.FC<CrudProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Warranty>({ id: selected_id });
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
                    const response = await getWarranty(formValues);
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
                const response = await addWarranty(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editWarranty(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete' && selected_id) {
                const response = await deleteWarranty(formValues);
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
            if (setSelected) setSelected(0);
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
                <div className='z-10'>
                    <Select
                        props={{
                            id: 'client',
                            name: 'client',
                            onChange: (e) => setFormValues(prev => ({
                                ...prev,
                                sale: {
                                    ...prev.sale,
                                    client: {
                                        ...prev.sale?.client,
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                    }
                                }
                            })),
                            value: formValues.sale?.client?.id,
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        endpoint='manage/clients'
                        endpoint_value='id'
                        endpoint_text='{person.firstname} {person.middlename} {person.lastname} {person.second_lastname}'
                        icon={<UserIcon size={20} />}
                        label='Cliente'
                    />
                </div>
                <div className='z-[9]'>
                    <Select
                        props={{
                            id: 'sale',
                            name: 'sale',
                            onChange: (e) => setFormValues(prev => ({
                                ...prev,
                                sale: {
                                    ...prev.sale,
                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                }
                            })),
                            value: formValues.sale?.id,
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        endpoint='manage/sales'
                        endpoint_value='id'
                        endpoint_text='Factura {id} - {client.person.firstname} {client.person.middlename} {client.person.lastname} {client.person.second_lastname}'
                        icon={<ShoppingBasketSecure03Icon size={20} />}
                        label='Venta'
                        filters={{
                            client_id: formValues.sale?.client?.id
                        }}
                    />
                </div>
                <div className='z-[8]'>
                    <Select
                        props={{
                            id: 'expense_datail',
                            name: 'expense_datail',
                            onChange: (e: CustomChangeEvent) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    expense_detail: {
                                        ...e.object
                                    }
                                }));
                            },
                            value: formValues.expense_detail?.id,
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        endpoint='manage/expenses/details'
                        endpoint_value='id'
                        endpoint_text='{serial_number} - {product.name}'
                        icon={<Invoice01Icon size={20} />}
                        label='Numero de serie'
                        filters={{
                            client_id: formValues.sale?.client?.id
                        }}
                    />
                </div>
                <Input
                    props={{
                        id: 'note',
                        name: 'note',
                        value: formValues.note,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            note: e.target.value || ''
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Nota/Descripcion del problema'
                    icon={<NoteIcon className='icon' size={24} />}
                    color={colorPage}
                />
                <div className='grid grid-cols-1 md:grid-cols-3 w-full p-2 text-black dark:text-white'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-bold'>Numero de factura:</h1>
                        <span>{formValues.expense_detail?.expense?.no || '-'}</span>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-bold'>Numero de transaccion:</h1>
                        <span>{formValues.expense_detail?.expense?.transaction_number || '-'}</span>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-bold'>Fecha de registro:</h1>
                        <span>
                            {formValues.expense_detail?.expense?.date_reg ?
                                new Date(formValues.expense_detail?.expense?.date_reg).toLocaleString('es-MX', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                }).replace(',', '')
                            : '-'}
                        </span>
                    </div>
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