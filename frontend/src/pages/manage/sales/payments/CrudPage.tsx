import React, { useEffect, useState } from 'react';
import { SalePayment } from '../../../../types/modelType';
import { Calendar02Icon, CreditCardIcon, Note01Icon, PercentCircleIcon, StoreLocation01Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import Input from '../../../../components/Input';
import { addAlert } from '../../../../utils/Alerts';
import { generateUUID } from '../../../../utils/uuidGen';
import { extractMessages } from '../../../../utils/formUtils';
import Select from '../../../../components/Select';
import { CustomChangeEvent } from '../../../../types/componentsType';
import { addPayment, editPayment, getPayment } from '../../../../services/SalesService';
import { URL_BACKEND } from '../../../../services/apiService';

interface CrudPageProps {
    saleId: number | undefined;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string | undefined) => void;
    type: string;
    selected_id?: string | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ saleId, onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [updateFlag, setUpdateFlag] = useState(false);
    const [formValues, setFormValues] = useState<SalePayment>({ id: selected_id, sale_id: saleId });
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
                    const response = await getPayment(formValues);
                    const response_resp = response.resp;

                    setFormValues(() => {
                        let response = response_resp;
                        response['sale_id'] = saleId;
                        return response;
                    });
                } catch (error) {
                }
            };

            fetchGet();
        }
    }, [type, selected_id]);

    const handleInvoice = (id: string) => {
        window.open(`${URL_BACKEND}/pdf/payment?id=${id}&one=true`, '_blank');
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response_resp;
            if (type === 'add') {
                const response = await addPayment(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editPayment(formValues);
                response_resp = response?.resp;
            }

            handleInvoice(response_resp.id);
            addAlert({
                id: generateUUID(),
                title: 'Success',
                msg: response_resp.msg,
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

    useEffect(() => {
        if (['add'].includes(type)) {
            if (!updateFlag) return;

            const discount_per = formValues.discount_per || 0;

            if (discount_per >= 0) {
                const newDiscount = (discount_per * ((formValues.subtotal || 0) + (formValues.surcharge || 0) + (formValues.commission || 0))) / 100;

                setFormValues(prev => ({
                    ...prev,
                    discount: parseFloat(newDiscount.toFixed(2))
                }));
            }

            setUpdateFlag(false);
        }
    }, [formValues.discount_per]);

    useEffect(() => {
        if (['add'].includes(type)) {
            if (!updateFlag) return;

            const discount = formValues.discount || 0;

            if (discount >= 0) {
                const newDiscountPer = (discount * 100) / ((formValues.subtotal || 0) + (formValues.surcharge || 0) + (formValues.commission || 0));

                setFormValues(prev => ({
                    ...prev,
                    discount_per: parseFloat(newDiscountPer.toFixed(2))
                }));
            }

            setUpdateFlag(false);
        }
    }, [formValues.discount]);

    useEffect(() => {
        if (['add'].includes(type)) {
            setFormValues((prevFormValues) => {
                const { subtotal = 0, discount = 0, payment_method, pay = 0, surcharge = 0 } = prevFormValues;

                let cart_subtotal = subtotal;

                const cart_commission = ((payment_method?.value || 0) * (cart_subtotal + surcharge)) / 100;

                const cart_total = cart_subtotal + cart_commission + surcharge - discount;
                const cart_change = pay - cart_total;

                const roundedCartTotal = parseFloat(cart_total.toFixed(2));
                const roundedCartSubtotal = parseFloat(cart_subtotal.toFixed(2));
                const roundedCartCommission = parseFloat(cart_commission.toFixed(2));
                const roundedCartSurcharge = parseFloat(surcharge.toFixed(2));
                const roundedCartChange = parseFloat(cart_change.toFixed(2));

                if (
                    roundedCartSubtotal !== prevFormValues.subtotal ||
                    roundedCartTotal !== prevFormValues.total ||
                    roundedCartCommission !== prevFormValues.commission ||
                    roundedCartSurcharge !== prevFormValues.surcharge ||
                    roundedCartChange !== prevFormValues.change
                ) {
                    return {
                        ...prevFormValues,
                        subtotal: roundedCartSubtotal,
                        total: roundedCartTotal,
                        commission: roundedCartCommission,
                        surcharge: roundedCartSurcharge,
                        change: roundedCartChange,
                    };
                }

                return prevFormValues;
            });
        }
    }, [
        formValues
    ]);

    return (
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 w-full'>
                <div className='w-full z-10'>
                    <Select
                        props={{
                            id: 'location',
                            name: 'location',
                            onChange: (e: CustomChangeEvent) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    location: {
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                    }
                                }));
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
                <Input
                    props={{
                        id: 'subtotal',
                        name: 'subtotal',
                        type: 'number',
                        value: formValues.subtotal || 0,
                        min: 0,
                        step: 0.01,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                subtotal: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={['add'].includes(type) ? 'Cuanto abonara?' : 'Total a abonar'}
                    icon={'Q'}
                    required={false}
                    color={colorPage}
                />
                <div className='w-full z-[8]'>
                    <Select
                        props={{
                            id: 'paymentmethod',
                            name: 'paymentmethod',
                            onChange: (e: CustomChangeEvent) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    note: undefined,
                                    payment_method: {
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                        value: e.object?.value,
                                        allow_discount: e.object?.allow_discount,
                                        allow_note: e.object?.allow_note,
                                    }
                                }));
                            },
                            value: formValues.payment_method?.id,
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        endpoint='manage/paymentmethods'
                        endpoint_value='id'
                        endpoint_text='{name} ({value}%)'
                        icon={<CreditCardIcon size={20} />}
                        label={translations.payment_method}
                    />
                </div>
                <Input
                    props={{
                        name: 'surcharge',
                        type: 'number',
                        value: formValues.surcharge || 0,
                        min: 0,
                        step: 0.01,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                surcharge: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Recargo'
                    icon={'Q'}
                    required={false}
                    color={colorPage}
                />
                {['edit', 'details'].includes(type) && (
                    <Input
                        props={{
                            id: 'commission',
                            name: 'commission',
                            type: 'number',
                            value: formValues.commission || 0,
                            min: 0,
                            step: 0.01,
                            onChange: (e) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    commission: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                }));
                            },
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        label='Commision'
                        icon={'Q'}
                        required={false}
                        color={colorPage}
                    />
                )}
                {formValues.payment_method?.allow_discount && (
                    <div className='grid grid-cols-2 gap-2'>
                        <div className='col-span-1 w-full'>
                            <Input
                                props={{
                                    id: 'discount_per',
                                    name: 'discount_per',
                                    type: 'number',
                                    value: formValues.discount_per || 0,
                                    min: 0,
                                    onChange: (e) => {
                                        setFormValues(prev => ({
                                            ...prev,
                                            discount_per: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                        }));
                                        setUpdateFlag(true);
                                    },
                                    disabled: ['details', 'delete'].includes(type)
                                }}
                                label='Descuento'
                                icon={<PercentCircleIcon className='icon' size={24} />}
                                required={false}
                                color={colorPage}
                            />
                        </div>
                        <div className='col-span-1 w-full'>
                            <Input
                                props={{
                                    id: 'discount',
                                    name: 'discount',
                                    type: 'number',
                                    value: formValues.discount || 0,
                                    min: 0,
                                    onChange: (e) => {
                                        setFormValues(prev => ({
                                            ...prev,
                                            discount: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                        }));
                                        setUpdateFlag(true);
                                    },
                                    disabled: ['details', 'delete'].includes(type)
                                }}
                                label='Descuento'
                                icon={'Q'}
                                required={false}
                                color={colorPage}
                            />
                        </div>
                    </div>
                )}
                {formValues.payment_method?.allow_note && (
                    <Input
                        props={{
                            name: 'note',
                            value: formValues.note,
                            onChange: (e) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    note: e.target.value
                                }));
                            },
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        label='Nota'
                        icon={<Note01Icon />}
                        required={false}
                        color={colorPage}
                    />
                )}
                {['edit', 'details'].includes(type) && (
                    <Input
                        props={{
                            id: 'total',
                            name: 'total',
                            type: 'number',
                            value: formValues.total || 0,
                            min: 0,
                            step: 0.01,
                            onChange: (e) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    total: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                }));
                            },
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        label='Total abonado'
                        icon={'Q'}
                        required={false}
                        color={colorPage}
                    />
                )}
                <div className='flex gap-2'>
                    <Input
                        props={{
                            id: 'pay',
                            name: 'pay',
                            type: 'number',
                            value: formValues.pay || 0,
                            min: 0,
                            step: 0.01,
                            onChange: (e) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    pay: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                }));
                            },
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        label='Con cuanto pago?'
                        icon={'Q'}
                        required={false}
                        color={colorPage}
                    />
                    {['edit', 'details'].includes(type) && (
                        <Input
                            props={{
                                id: 'change',
                                name: 'change',
                                type: 'number',
                                value: formValues.change || 0,
                                min: 0,
                                step: 0.01,
                                onChange: (e) => {
                                    setFormValues(prev => ({
                                        ...prev,
                                        change: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    }));
                                },
                                disabled: ['details', 'delete'].includes(type)
                            }}
                            label='Cambio'
                            icon={'Q'}
                            required={false}
                            color={colorPage}
                        />
                    )}
                </div>
                {['edit', 'details'].includes(type) && (
                    <Input
                        props={{
                            id: 'date_limit',
                            name: 'date_limit',
                            type: 'datetime-local',
                            value: formValues.date_limit
                                ? new Date(formValues.date_limit).toISOString().slice(0, 16)
                                : '',
                            onChange: (e) => {
                                setFormValues(prev => ({
                                    ...prev,
                                    date_limit: e.target.value ? new Date(e.target.value).toISOString() : undefined
                                }));
                            },
                            disabled: ['details', 'delete'].includes(type)
                        }}
                        label='Fecha limite'
                        icon={<Calendar02Icon />}
                        required={false}
                        color={colorPage}
                    />
                )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-3'>
                {['add'].includes(type) && (
                    <>
                        <div className='col-span-1 flex flex-col text-lg border-t-0 py-2 dark:border-slate-600 dark:text-slate-300'>
                            <div className='flex justify-between gap-1'>
                                <h2 className='font-bold dark:text-white'>Subtotal:</h2>
                                <span className='font-medium'>Q{formValues.subtotal || 0}</span>
                            </div>
                            <div className='flex justify-between gap-1'>
                                <h2 className='font-bold dark:text-white'>Recargo:</h2>
                                <span className='font-medium'>Q{formValues.surcharge || 0}</span>
                            </div>
                            <div className='flex justify-between gap-1'>
                                <h2 className='font-bold dark:text-white'>Comisión:</h2>
                                <span className='font-medium'>Q{formValues.commission || 0}</span>
                            </div>
                            <div className='flex justify-between gap-1'>
                                <h2 className='font-bold dark:text-white'>Descuento:</h2>
                                <span className='font-medium'>Q{formValues.discount || 0}</span>
                            </div>
                        </div>
                        <div className='col-span-1 flex flex-col items-end text-lg border-t-0 py-2 dark:border-slate-600 dark:text-slate-300'>
                            <div className='flex flex-col items-end'>
                                <h2 className='font-bold dark:text-white'>Total:</h2>
                                <span className='font-medium'>Q{formValues.total || 0}</span>
                            </div>
                            <div className='flex flex-col items-end'>
                                <h2 className='font-bold dark:text-white'>Cambio:</h2>
                                <span className='font-medium'>Q{formValues.change || 0}</span>
                            </div>
                        </div>
                    </>
                )}
                <div className='col-span-1 md:col-span-2 w-full mt-2'>
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