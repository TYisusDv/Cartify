import React, { useEffect, useState } from 'react';
import { SalePayment } from '../../../../types/modelType';
import { CreditCardIcon, PercentCircleIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import Input from '../../../../components/Input';
import { addAlert } from '../../../../utils/Alerts';
import { generateUUID } from '../../../../utils/uuidGen';
import { extractMessages } from '../../../../utils/formUtils';
import Select from '../../../../components/Select';
import { CustomChangeEvent } from '../../../../types/componentsType';
import { addPayment, editPayment, getPayment } from '../../../../services/SalesService';

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

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response_resp = translations.success;
            if (type === 'add') {
                const response = await addPayment(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editPayment(formValues);
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

    useEffect(() => {
        if (['add'].includes(type)) {
            if (!updateFlag) return;

            const discount_per = formValues.discount_per || 0;

            if (discount_per >= 0) {
                const newDiscount = (discount_per * ((formValues.subtotal || 0) + (formValues.commission || 0))) / 100;

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
                const newDiscountPer = (discount * 100) / ((formValues.subtotal || 0) + (formValues.commission || 0));

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
                const { subtotal = 0, discount = 0, payment_method, pay = 0 } = prevFormValues;

                let cart_subtotal = subtotal;

                const cart_commission = ((payment_method?.value || 0) * cart_subtotal) / 100;

                const cart_total = cart_subtotal + cart_commission - discount;
                const cart_change = pay - cart_total;

                const roundedCartTotal = parseFloat(cart_total.toFixed(2));
                const roundedCartSubtotal = parseFloat(cart_subtotal.toFixed(2));
                const roundedCartCommission = parseFloat(cart_commission.toFixed(2));
                const roundedCartChange = parseFloat(cart_change.toFixed(2));

                if (
                    roundedCartSubtotal !== prevFormValues.subtotal ||
                    roundedCartTotal !== prevFormValues.total ||
                    roundedCartCommission !== prevFormValues.commission ||
                    roundedCartChange !== prevFormValues.change
                ) {
                    return {
                        ...prevFormValues,
                        subtotal: roundedCartSubtotal,
                        total: roundedCartTotal,
                        commission: roundedCartCommission,
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
                                    payment_method: {
                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                        value: e.object?.value,
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
                <div className='flex gap-2'>
                    <Input
                        props={{
                            id: 'discount_per',
                            name: 'discount_per',
                            type: 'number',
                            value: formValues.discount_per || 0,
                            min: 0,
                            step: 0.01,
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
                    <Input
                        props={{
                            id: 'discount',
                            name: 'discount',
                            type: 'number',
                            value: formValues.discount || 0,
                            min: 0,
                            step: 0.01,
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