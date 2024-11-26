import React, { useEffect, useState } from 'react';
import { BarCode02Icon, MoreIcon, TextIcon } from 'hugeicons-react';
import useTranslations from '../hooks/useTranslations';
import Input from '../components/Input';
import { addAlert } from '../utils/Alerts';
import { generateUUID } from '../utils/uuidGen';
import { extractMessages } from '../utils/formUtils';
import Select from '../components/Select';
import { addProduct } from '../services/productsService';
import { URL_BACKEND } from '../services/apiService';
import { getToken } from '../utils/authUtils';

interface CrudPriceProps {
    onClose: () => void;
    type: string;
}

const CrudPrice: React.FC<CrudPriceProps> = ({ onClose, type }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState({
        id: '',
        payments: 0,
        observations: ''
    });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');;

    useEffect(() => {
        const colorMapping: { [key in CrudPriceProps['type']]: string } = {
            price: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

    }, [type]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${URL_BACKEND}/pdf/price`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formValues),
            });
    
            if (!response.ok) {
                throw new Error('Error al generar el PDF.');
            }
    
            const pdfBlob = await response.blob();
            const pdfURL = URL.createObjectURL(pdfBlob);
    
            window.open(pdfURL, '_blank');
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
                            id: 'product',
                            name: 'product',
                            onChange: (e) => {
                                if (setFormValues) {
                                    setFormValues((prev: any) => ({
                                        ...prev,
                                        id: e.target.value
                                    }));
                                }
                            },
                            value: formValues.id
                        }}
                        endpoint='manage/products'
                        endpoint_value='id'
                        endpoint_text='{name}'
                        icon={<BarCode02Icon size={20} />}
                        label='Producto'
                    />
                </div>
                <Input
                    props={{
                        id: 'payments',
                        name: 'payments',
                        type: 'number',
                        min: '1',
                        value: formValues.payments,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            payments: !isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : 0,
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Pagos'
                    icon={<MoreIcon className='icon' size={24} />}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'observations',
                        name: 'observations',
                        value: formValues.observations,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            observations: e.target.value,
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Observacion'
                    icon={<TextIcon className='icon' size={24} />}
                    color={colorPage}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                <div className='col-span-1 md:col-end-3 w-full'>
                    {(type === 'price') && (
                        <button type='submit' className={`btn btn-${colorPage} max-w-48 h-12 float-end`}>
                            Cotizar
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CrudPrice;