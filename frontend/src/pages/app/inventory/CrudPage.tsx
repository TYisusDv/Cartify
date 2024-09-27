import React, { useEffect, useState } from 'react';
import { Add01Icon, BarCode02Icon, Cancel01Icon, LiftTruckIcon, Note04Icon, SearchAreaIcon, StoreLocation01Icon, UserAccountIcon } from 'hugeicons-react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { Inventory } from '../../../types/modelType';
import { addInventory, deleteInventory, editInventory, getInventory } from '../../../services/inventoryService';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
import Modal from '../../../components/Modal';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { CustomChangeEvent } from '../../../types/componentsType';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string | undefined) => void;
    type: string;
    selected_id: string | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ addAlert, onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Inventory>({ id: selected_id, quantity: 0 });
    const [colorPage, setColorPage] = useState<string>('blue');
    const [isModalOpen, setIsModalOpen] = useState({ add: false });
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
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(response_data?.resp);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching inventory', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const toggleModal = (modalType: 'add', isOpen: boolean) => {
        setFormValues({ id: selected_id, quantity: 0 });
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const inventory_type_options = [
        { value: 1, label: 'Entrada' },
        { value: 2, label: 'Salida' },
        { value: 3, label: 'Traslado' },
    ];

    useEffect(() => {
        if (formValues.type?.toString() !== '3') {
            setFormValues(prev => (
                {
                    ...prev,
                    location_transfer: { id: 0 },
                    user_transfer: { id: 0 }
                }
            ))
        }
    }, [formValues.type])

    const handleForm = async () => {
        if (type === 'add') return addInventory(movements);
        else if (type === 'edit') return editInventory(formValues);
        else if (type === 'delete') return deleteInventory(selected_id);
    };

    const { handleSubmit, isLoading } = useFormSubmit(handleForm, addAlert);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleSubmit(formValues);

        if (response) {
            if (!response?.data?.success) {
                addAlert({ id: uuidv4(), text: response?.data?.resp, type: 'danger', timeout: 3000 });
                return;
            }

            addAlert({ id: uuidv4(), text: response?.data?.resp, type: 'primary', timeout: 3000 });
            onClose();

            if (handleTableReload) handleTableReload();
            if (setSelected) setSelected(undefined);
        }
    };

    const onAddMovementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValues.product?.id || formValues.product?.id === '0' || !formValues.location?.id || formValues.location?.id === 0 || formValues.type === 0) {
            addAlert({ id: uuidv4(), text: translations.missing_fields, type: 'danger', timeout: 3000 });
            return;
        }

        setMovements([...movements, formValues]);

        toggleModal('add', false);
    };

    const handleDeleteMovement = (index: number) => {
        const updatedMovements = [...movements];
        updatedMovements.splice(index, 1);
        setMovements(updatedMovements);
        addAlert({ id: uuidv4(), text: 'Movimiento eliminado', type: 'success', timeout: 3000 });
    };

    return (
        <div>
            <form autoComplete='off' onSubmit={onSubmit}>
                <div className={`flex flex-col gap-2 w-full tab-item`}>
                    {type === 'add' &&
                        (
                            <div className='flex gap-1'>
                                <button type='button' className='btn btn-blue h-auto w-12 rounded-xl' onClick={() => { toggleModal('add', true) }}><Add01Icon /></button>
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
                                                    Ubicacion traslado
                                                </th>
                                                <th scope='col' className='px-6 py-3'>
                                                    Usuario traslado
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
                                                                {
                                                                    (movement.type)?.toString() === '1' ? 'Entrada'
                                                                        : (movement.type)?.toString() === '2' ? 'Salida'
                                                                            : (movement.type)?.toString() === '3' ? 'Traslado'
                                                                                : '-'
                                                                }
                                                            </td>
                                                            <td className='px-6 py-4'>{movement.location_transfer?.name || '-'}</td>
                                                            <td className='px-6 py-4'>{movement.user_transfer?.first_name || '-'}</td>
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
                        )
                    }

                    {['edit', 'details', 'delete'].includes(type) && (
                        <>
                            <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                                <div className='col-span-1 z-[10]'>
                                    <Select
                                        props={{
                                            id: 'product',
                                            name: 'product',
                                            onChange: (e) => setFormValues(prev => ({
                                                ...prev,
                                                product: {
                                                    id: e.target.value
                                                }
                                            })),
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
                                            disabled: ['details', 'delete'].includes(type)
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
                                            onChange: (e) => setFormValues(prev => ({
                                                ...prev,
                                                location: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                                }
                                            })),
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
                                            id: 'type',
                                            name: 'type',
                                            onChange: (e) => setFormValues(prev => ({
                                                ...prev,
                                                type: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                            })),
                                            value: formValues.type,
                                            disabled: ['details', 'delete'].includes(type)
                                        }}
                                        myOptions={inventory_type_options}
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
                            {formValues.type?.toString() === '3' && (
                                <>
                                    <hr className='border dark:border-slate-600 mx-2 mt-5' />
                                    <h1 className='text-black font-bold dark:text-white mx-2 my-1'>Traslado</h1>
                                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                                        <div className='col-span-1 z-[7]'>
                                            <Select
                                                props={{
                                                    id: 'location_transfer',
                                                    name: 'location_transfer',
                                                    onChange: (e) => setFormValues(prev => ({
                                                        ...prev,
                                                        location_transfer: {
                                                            id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                                        }
                                                    })),
                                                    value: formValues.location_transfer?.id,
                                                    disabled: ['details', 'delete'].includes(type)
                                                }}
                                                endpoint='manage/locations'
                                                endpoint_value='id'
                                                endpoint_text='{name}'
                                                icon={<StoreLocation01Icon size={20} />}
                                                label={translations.location_entry}
                                            />
                                        </div>
                                        <div className='col-span-1 z-[6]'>
                                            <Select
                                                props={{
                                                    id: 'user_transfer',
                                                    name: 'user_transfer',
                                                    onChange: (e) => setFormValues(prev => ({
                                                        ...prev,
                                                        user_transfer: {
                                                            id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                                        }
                                                    })),
                                                    value: formValues.user_transfer?.id,
                                                    disabled: ['details', 'delete'].includes(type)
                                                }}
                                                endpoint='manage/users'
                                                endpoint_value='id'
                                                endpoint_text='{first_name}'
                                                icon={<UserAccountIcon size={20} />}
                                                label={translations.dealer}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                    <div className='col-span-1 md:col-end-3 w-full'>
                        {(type === 'delete' || type === 'edit' || type === 'add') && (
                            <button type='submit' className={`btn btn-${colorPage} max-w-48 h-12 float-end`} disabled={isLoading}>
                                {translations[type]}
                            </button>
                        )}
                    </div>
                </div>
            </form>
            {isModalOpen.add && (
                <Modal title={translations.add_movement} onClose={() => toggleModal('add', false)}>
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
                                            disabled: ['details', 'delete'].includes(type)
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
                                        label={formValues.type?.toString() === '3'? translations.location_exit : translations.location}
                                    />
                                </div>
                                <div className='col-span-1 z-[8]'>
                                    <Select
                                        props={{
                                            id: 'type',
                                            name: 'type',
                                            onChange: (e) => setFormValues(prev => ({
                                                ...prev,
                                                type: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                            })),
                                            value: formValues.type,
                                            disabled: ['details', 'delete'].includes(type)
                                        }}
                                        myOptions={inventory_type_options}
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
                            {formValues.type?.toString() === '3' && (
                                <>
                                    <hr className='border dark:border-slate-600 mx-2 mt-5' />
                                    <h1 className='text-black font-bold dark:text-white mx-2 my-1'>Traslado</h1>
                                    <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                                        <div className='col-span-1 z-[7]'>
                                            <Select
                                                props={{
                                                    id: 'location_transfer',
                                                    name: 'location_transfer',
                                                    onChange: (e: CustomChangeEvent) => {
                                                        setFormValues(prev => ({
                                                            ...prev,
                                                            location_transfer: {
                                                                id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                                name: e.object?.name,
                                                            }
                                                        }));
                                                    },
                                                    value: formValues.location_transfer?.id,
                                                    disabled: ['details', 'delete'].includes(type)
                                                }}
                                                endpoint='manage/locations'
                                                endpoint_value='id'
                                                endpoint_text='{name}'
                                                icon={<StoreLocation01Icon size={20} />}
                                                label={translations.location_entry}
                                            />
                                        </div>
                                        <div className='col-span-1 z-[7]'>
                                            <Select
                                                props={{
                                                    id: 'user_transfer',
                                                    name: 'user_transfer',
                                                    onChange: (e: CustomChangeEvent) => {
                                                        setFormValues(prev => ({
                                                            ...prev,
                                                            user_transfer: {
                                                                id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                                first_name: e.object?.first_name,
                                                            }
                                                        }));
                                                    },
                                                    value: formValues.user_transfer?.id,
                                                    disabled: ['details', 'delete'].includes(type)
                                                }}
                                                endpoint='manage/users'
                                                endpoint_value='id'
                                                endpoint_text='{first_name}'
                                                icon={<UserAccountIcon size={20} />}
                                                label={translations.dealer}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                            <div className='col-span-1 md:col-end-3 w-full'>
                                <button type='submit' className='btn btn-blue max-w-48 h-12 float-end' disabled={isLoading}>
                                    {translations.add}
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CrudPage;