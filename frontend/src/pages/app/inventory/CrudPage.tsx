import React, { useEffect, useState } from 'react';
import { Add01Icon, LiftTruckIcon, Note04Icon } from 'hugeicons-react';
import { handleChange, handleSelectChange } from '../../../utils/formUtils';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { Inventory } from '../../../types/modelType';
import { addProduct, deleteProduct, editProduct, getProduct } from '../../../services/productsService';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
import Modal from '../../../components/Modal';
import SelectGroup from '../../../components/SelectGroup';
import InputGroup from '../../../components/InputGroup';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string) => void;
    type: string;
    selected_id: string;
}

const CrudPage: React.FC<CrudPageProps> = ({ addAlert, onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Inventory>({ id: selected_id });
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
                    const response = await getProduct(selected_id);
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(response_data?.resp);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching product', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const toggleModal = (modalType: 'add', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const inventory_type_options = [
        { value: 1, label: 'Entrada' },
        { value: 2, label: 'Salida' },
    ];

    const handleForm = async () => {
        let modFormValues = formValues;

        if (type === 'add') return addProduct(modFormValues);
        else if (type === 'edit') return editProduct(modFormValues);
        else if (type === 'delete') return deleteProduct(selected_id);
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
            if (setSelected) setSelected('');
        }
    };

    const onAddMovementSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formValues.product?.id || formValues.product?.id === '0' || !formValues.location?.id || formValues.location?.id === 0 || formValues.type === 0) {
            return;
        }

        setMovements([...movements, formValues]);

        toggleModal('add', false);
    };

    return (
        <div>
            <form autoComplete='off' onSubmit={onSubmit}>
                <div className={`flex flex-col gap-2 w-full tab-item`}>
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
                                            Nota
                                        </th>
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
                                                        { (movement.type)?.toString() === '1' ? 'Entrada'
                                                        : (movement.type)?.toString() === '2' ? 'Salida'
                                                        : '-'}
                                                    </td>
                                                    <td className='px-6 py-4'>{movement.note || '-'}</td>
                                                </tr>
                                            ))
                                        )
                                        :
                                        (
                                            <tr>
                                                <td colSpan={5} className='px-6 py-6 text-center dark:text-white'>{translations.no_data}</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                    <div className='col-span-1 md:col-end-3 w-full'>
                        {(type === 'delete' || type === 'edit' || type === 'add') && (
                            <button type="submit" className={`btn btn-${colorPage} max-w-48 h-12 float-end`} disabled={isLoading}>
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
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
                                        <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.product} <span className='text-red-500'>*</span></h3>
                                        <div className='w-full'>
                                            <SelectGroup
                                                endpoint='manage/products'
                                                name='product.id'
                                                onChange={handleSelectChange(setFormValues)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-1'>
                                    <InputGroup
                                        id='quantity'
                                        name='quantity'
                                        type='number'
                                        label={translations.quantity}
                                        icon={<LiftTruckIcon className='icon' size={24} />}
                                        onChange={handleChange({ setFormValues })}
                                        required={false}
                                        color={colorPage}
                                    />
                                </div>
                            </div>
                            <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                                <div className='col-span-1 z-[9]'>
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
                                        <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.location} <span className='text-red-500'>*</span></h3>
                                        <div className='w-full'>
                                            <SelectGroup
                                                endpoint='manage/locations'
                                                name='location.id'
                                                onChange={handleSelectChange(setFormValues)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-1 z-[8]'>
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
                                        <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.type} <span className='text-red-500'>*</span></h3>
                                        <div className='w-full'>
                                            <SelectGroup
                                                name='type'
                                                myOptions={inventory_type_options}
                                                onChange={handleSelectChange(setFormValues)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <InputGroup
                                id='note'
                                name='note'
                                label={translations.note}
                                icon={<Note04Icon className='icon' size={24} />}
                                onChange={handleChange({ setFormValues })}
                                required={false}
                                color={colorPage}
                            />
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                            <div className='col-span-1 md:col-end-3 w-full'>
                                {(type === 'delete' || type === 'edit' || type === 'add') && (
                                    <button type="submit" className={`btn btn-${colorPage} max-w-48 h-12 float-end`} disabled={isLoading}>
                                        {translations[type]}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default CrudPage;