import React, { useEffect, useState } from 'react';
import { Add01Icon, BarCode02Icon, Cancel01Icon, LiftTruckIcon, Note04Icon, SearchAreaIcon, StoreLocation01Icon } from 'hugeicons-react';
import { Inventory } from '../../../types/modelType';
import { addInventory, deleteInventory, editInventory, getInventory } from '../../../services/inventoryService';
import useTranslations from '../../../hooks/useTranslations';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { CustomChangeEvent } from '../../../types/componentsType';
import { extractMessages } from '../../../utils/formUtils';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';

interface CrudPageProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string | undefined) => void;
    type: string;
    selected_id: string | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Inventory>({ id: selected_id, quantity: 0 });
    const [colorPage, setColorPage] = useState<string>('blue');
    const [movements, setMovements] = useState<Inventory[]>([]);

    useEffect(() => {
        const colorMapping: { [key in CrudPageProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type]);

        if (type === 'details' || type === 'delete' || type === 'edit') {
            const fetchGet = async () => {
                try {
                    const response = await getInventory(selected_id);
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
            if (type === 'add'){
                const response = await addInventory(movements);
                response_resp = response?.resp;
            } else if (type === 'edit'){
                const response = await editInventory(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete'){
                const response = await deleteInventory(selected_id);
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

    const onAddMovementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValues.product?.id || formValues.product?.id === '0' || !formValues.location?.id || formValues.location?.id === 0 || !formValues.type?.id || formValues.type?.id === 0 || !formValues.quantity || formValues.quantity <= 0) {
            return;
        }

        setMovements([...movements, formValues]);
    };

    const handleDeleteMovement = (index: number) => {
        const updatedMovements = [...movements];
        updatedMovements.splice(index, 1);
        setMovements(updatedMovements);
    };

    return (
        <div>
            {type === 'add' && (
                <form autoComplete='off' onSubmit={onAddMovementSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item`}>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[10]'>
                                <Select
                                    props={{
                                        id: 'product',
                                        name: 'product',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                product: {
                                                    id: e.target.value,
                                                    name: e.object?.name,
                                                }
                                            }));
                                        },
                                        value: formValues.product?.id,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/products'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<BarCode02Icon size={20} />}
                                    label={translations.product}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'quantity',
                                        name: 'quantity',
                                        type: 'number',
                                        value: formValues.quantity || 0,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            quantity: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                        })),
                                        disabled: ['details', 'delete'].includes(type),
                                        min: 0
                                    }}
                                    label={translations.quantity}
                                    icon={<LiftTruckIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[9]'>
                                <Select
                                    props={{
                                        id: 'location',
                                        name: 'location',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                location: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                    name: e.object?.name,
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
                                    label={formValues.type?.toString() === '3' ? translations.location_exit : translations.location}
                                />
                            </div>
                            <div className='col-span-1 z-[8]'>
                                <Select
                                    props={{
                                        id: 'inventory_type',
                                        name: 'inventory_type',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                type: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                    name: e.object?.name,
                                                }
                                            }));
                                        },
                                        value: formValues.type?.id,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/inventory/types'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<SearchAreaIcon size={20} />}
                                    label={translations.type}
                                />
                            </div>
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
                            label={translations.note}
                            icon={<Note04Icon className='icon' size={24} />}
                            color={colorPage}
                            required={false}
                        />
                        <button className='btn btn-blue w-full h-10 rounded-xl'><Add01Icon /></button>
                        <div className='flex gap-1'>
                            <div className='overflow-x-auto rounded-lg w-full'>
                                <table className='w-full text-sm text-left'>
                                    <thead className='text-xs text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white'>
                                        <tr>
                                            <th scope='col' className='px-6 py-3'>
                                                Cantidad
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Producto
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Ubicacion
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Tipo
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Nota
                                            </th>
                                            <th scope='col' className='px-6 py-3'></th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {movements.length > 0 ?
                                            (
                                                movements.map((movement, index) => (
                                                    <tr key={index} className='text-xs text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80'>
                                                        <td className='px-6 py-4'>{movement.quantity || 0}</td>
                                                        <td className='px-6 py-4'>
                                                            {movement.product?.name || '-'}
                                                        </td>
                                                        <td className='px-6 py-4'>{movement.location?.name || '-'}</td>
                                                        <td className='px-6 py-4'>
                                                            {movement.type?.name || '-'}
                                                        </td>
                                                        <td className='px-6 py-4'>{movement.note || '-'}</td>
                                                        <td className='px-6 py-4'>
                                                            <button
                                                                type='button'
                                                                className='btn btn-red text-sm h-6 w-6'
                                                                onClick={() => handleDeleteMovement(index)}
                                                                aria-label='Delete movement'
                                                            >
                                                                <Cancel01Icon />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )
                                            :
                                            (
                                                <tr>
                                                    <td colSpan={8} className='px-6 py-6 text-center dark:text-white'>{translations.no_data}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            <form autoComplete='off' onSubmit={onSubmit}>
                {['edit', 'details', 'delete'].includes(type) && (
                    <div className={`flex flex-col gap-2 w-full tab-item`}>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[10]'>
                                <Select
                                    props={{
                                        id: 'product',
                                        name: 'product',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                product: {
                                                    id: e.target.value,
                                                    name: e.object?.name,
                                                }
                                            }));
                                        },
                                        value: formValues.product?.id,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/products'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<BarCode02Icon size={20} />}
                                    label={translations.product}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'quantity',
                                        name: 'quantity',
                                        type: 'number',
                                        value: formValues.quantity || 0,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            quantity: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                        })),
                                        disabled: ['details', 'delete'].includes(type),
                                        min: 0
                                    }}
                                    label={translations.quantity}
                                    icon={<LiftTruckIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[9]'>
                                <Select
                                    props={{
                                        id: 'location',
                                        name: 'location',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                location: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                    name: e.object?.name,
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
                                    label={formValues.type?.toString() === '3' ? translations.location_exit : translations.location}
                                />
                            </div>
                            <div className='col-span-1 z-[8]'>
                            <Select
                                    props={{
                                        id: 'inventory_type',
                                        name: 'inventory_type',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                type: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                    name: e.object?.name,
                                                }
                                            }));
                                        },
                                        value: formValues.type?.id,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/inventory/types'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<SearchAreaIcon size={20} />}
                                    label={translations.type}
                                />
                            </div>
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
                            label={translations.note}
                            icon={<Note04Icon className='icon' size={24} />}
                            color={colorPage}
                            required={false}
                        />
                    </div>
                )}
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
        </div>
    );
};

export default CrudPage;