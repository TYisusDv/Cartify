import React, { useEffect, useState } from 'react';
import { ProductBrand, SalePayment } from '../../../../types/modelType';
import { addProductBrand, deleteProductBrand, editProductBrand, getProductBrand } from '../../../../services/productBrandService';
import { CreditCardIcon, PercentCircleIcon, ProfileIcon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import Input from '../../../../components/Input';
import Switch from '../../../../components/Switch';
import { addAlert } from '../../../../utils/Alerts';
import { generateUUID } from '../../../../utils/uuidGen';
import { extractMessages } from '../../../../utils/formUtils';
import Select from '../../../../components/Select';
import { CustomChangeEvent } from '../../../../types/componentsType';

interface CrudPageProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string | undefined) => void;
    type: string;
    selected_id?: string | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<SalePayment>({ id: selected_id });
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
                        id: 'subtotal',
                        name: 'subtotal',
                        type: 'number',
                        value: formValues.subtotal || 0,
                        min: 0,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                subtotal: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                            }));
                        },
                    }}
                    label='Cuanto abonara?'
                    icon={'Q'}
                    required={false}
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
                            //setUpdateFlag(true);
                        },
                    }}
                    label='Descuento'
                    icon={<PercentCircleIcon className='icon' size={24} />}
                    required={false}
                />
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
                            //setUpdateFlag(true);
                        },
                    }}
                    label='Descuento'
                    icon={'Q'}
                    required={false}
                />
                <Input
                    props={{
                        id: 'pay',
                        name: 'pay',
                        type: 'number',
                        value: formValues.pay || 0,
                        min: 0,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                pay: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                            }));
                        },
                    }}
                    label='Con cuanto pago?'
                    icon={'Q'}
                    required={false}
                />
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

export default CrudPage;