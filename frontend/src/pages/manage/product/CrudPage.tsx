import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { handleChange, handleSelectChange } from '../../../utils/formUtils';
import { Product } from '../../../types/modelType';
import { addProduct, deleteProduct, editProduct, getProduct } from '../../../services/productsService';
import { getTax } from '../../../services/taxesService';
import { Add01Icon, BarCode02Icon, DollarCircleIcon, InformationCircleIcon, Note04Icon, PercentCircleIcon, ProductLoadingIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
import InputGroup from '../../../components/InputGroup';
import SelectGroup from '../../../components/SelectGroup';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    toggleModal: (modalType: 'add_brand' | 'add_category' | 'add_supplier', isOpen: boolean) => void;
    handleTableReload?: () => void;
    setSelected?: (value: number) => void;
    type: string;
    selected_id: number;
}

const CrudPage: React.FC<CrudPageProps> = ({ addAlert, onClose, toggleModal, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Product>({ id: selected_id, cost_price: 0, cash_profit: 0, cash_price: 0, credit_profit: 0, credit_price: 0 });
    const [activeTab, setActiveTab] = useState<'home' | 'advisor'>('home');
    const [colorPage, setColorPage] = useState<string>('blue');
    const [updateFlag, setUpdateFlag] = useState(false);

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

    const handleForm = async () => {
        if (type === 'add') return addProduct(formValues);
        if (type === 'edit') return editProduct(formValues);
        if (type === 'delete') return deleteProduct(selected_id);
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
            if (setSelected) setSelected(0);
        }
    };

    useEffect(() => {
        const fetchGet = async () => {
            if (formValues.tax?.id && formValues.tax?.id.toString() !== '0') {
                try {
                    const response = await getTax(formValues.tax.id);
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(prev => ({
                        ...prev,
                        tax: response_data?.resp
                    }));
                } catch (error) { }
            } else {
                setFormValues(prev => ({
                    ...prev,
                    tax: {
                        id: 0,
                        name: '',
                        value: 0
                    }
                }));
            }

            setUpdateFlag(true);
        };

        fetchGet();
    }, [formValues.tax?.id]);

    useEffect(() => {
        if (!updateFlag) return;

        const costPrice = formValues.cost_price || 0;
        const cashProfit = formValues.cash_profit || 0;
        const tax = formValues.tax?.value || 0;

        if (costPrice > 0 && cashProfit >= 0) {
            const newCashPrice = costPrice * (1 + cashProfit / 100) * (1 + tax / 100);
            setFormValues(prev => ({
                ...prev,
                cash_price: parseFloat(newCashPrice.toFixed(2))
            }));
        }

        setUpdateFlag(false);
    }, [formValues.cost_price, formValues.cash_profit, formValues.tax?.value]);

    useEffect(() => {
        if (!updateFlag) return;

        const costPrice = formValues.cost_price || 0;
        const cashPrice = formValues.cash_price || 0;
        const tax = formValues.tax?.value || 0;

        if (costPrice > 0 && cashPrice > 0) {
            const effectiveCashPrice = cashPrice / (1 + tax / 100);
            const newCashProfit = ((effectiveCashPrice - costPrice) / costPrice) * 100;
            setFormValues(prev => ({
                ...prev,
                cash_profit: parseFloat(newCashProfit.toFixed(2))
            }));
        }

        setUpdateFlag(false);
    }, [formValues.cost_price, formValues.cash_price]);

    useEffect(() => {
        if (!updateFlag) return;

        const costPrice = formValues.cost_price || 0;
        const creditProfit = formValues.credit_profit || 0;
        const tax = formValues.tax?.value || 0;

        if (costPrice > 0 && creditProfit >= 0) {
            const newCreditPrice = costPrice * (1 + creditProfit / 100) * (1 + tax / 100);
            setFormValues(prev => ({
                ...prev,
                credit_price: parseFloat(newCreditPrice.toFixed(2))
            }));
        }

        setUpdateFlag(false);
    }, [formValues.cost_price, formValues.credit_profit, formValues.tax?.value]);

    useEffect(() => {
        if (!updateFlag) return;

        const costPrice = formValues.cost_price || 0;
        const creditPrice = formValues.credit_price || 0;
        const tax = formValues.tax?.value || 0;

        if (costPrice > 0 && creditPrice > 0) {
            const effectiveCreditPrice = creditPrice / (1 + tax / 100);
            const newCreditProfit = ((effectiveCreditPrice - costPrice) / costPrice) * 100;
            setFormValues(prev => ({
                ...prev,
                credit_profit: parseFloat(newCreditProfit.toFixed(2))
            }));
        }

        setUpdateFlag(false);
    }, [formValues.cost_price, formValues.credit_price]);

    return (
        <div>
            <div className="flex space-x-2 overflow-x-auto">
                {['home'].map(tab => (
                    <button
                        key={tab}
                        className={`tab ${tab === activeTab ? `tab-active tab-${colorPage}` : `hover:tab-${colorPage}`}`}
                        onClick={() => setActiveTab(tab as 'home' | 'advisor')}
                    >
                        {translations[tab]}
                    </button>
                ))}
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'home' === activeTab ? 'block' : 'hidden'}`}>
                        <InputGroup
                            id='barcode'
                            name='barcode'
                            label={translations.barcode}
                            icon={<BarCode02Icon className='icon' size={24} />}
                            onChange={handleChange({ setFormValues })}
                            required={false}
                            value={formValues.barcode || ''}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='name'
                                    name='name'
                                    label={translations.name}
                                    icon={<ProductLoadingIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues })}
                                    value={formValues.name || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='model'
                                    name='model'
                                    label={translations.model}
                                    icon={<InformationCircleIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues })}
                                    required={false}
                                    value={formValues.model || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[10] h-full'>
                                <div className='flex gap-1 h-full'>
                                    <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-11 rounded-2xl`} onClick={() => { toggleModal('add_brand', true) }}><Add01Icon /></button>
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full gap-2'>
                                        <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.brand}</h3>
                                        <div className='w-full'>
                                            <SelectGroup 
                                                endpoint='manage/product/brands' 
                                                name='brand.id' 
                                                onChange={handleSelectChange(setFormValues)} 
                                                value={formValues.brand?.id || 0}
                                                disabled={type === 'details' || type === 'delete' ? true : false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 z-[9]'>
                                <div className='flex gap-1'>
                                    <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-11 rounded-2xl`} onClick={() => { toggleModal('add_category', true) }}><Add01Icon /></button>
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full gap-2'>
                                        <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.category}</h3>
                                        <div className='w-full'>
                                            <SelectGroup 
                                                endpoint='manage/product/categories' 
                                                name='category.id' 
                                                onChange={handleSelectChange(setFormValues)} 
                                                value={formValues.category?.id || 0}
                                                disabled={type === 'details' || type === 'delete' ? true : false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-1 z-[8]'>
                            <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-10 rounded-2xl`} onClick={() => { toggleModal('add_supplier', true) }}><Add01Icon /></button>
                            <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full gap-2'>
                                <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.supplier}</h3>
                                <div className='w-full'>
                                    <SelectGroup 
                                        endpoint='manage/suppliers' 
                                        label='company_name' 
                                        name='supplier.id' 
                                        onChange={handleSelectChange(setFormValues)} 
                                        value={formValues.supplier?.id || 0}
                                        disabled={type === 'details' || type === 'delete' ? true : false}
                                    />
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
                            value={formValues.note || ''}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                        <hr className='border dark:border-slate-600 mx-2 my-2' />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[7]'>
                                <div className='flex gap-1 z-[8]'>
                                    <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-11 rounded-2xl`} onClick={() => { toggleModal('add_supplier', true) }}><Add01Icon /></button>
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full gap-2'>
                                        <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.tax}</h3>
                                        <div className='w-full'>
                                            <SelectGroup 
                                                endpoint='manage/taxes' 
                                                label_per='value' 
                                                name='tax.id' 
                                                onChange={handleSelectChange(setFormValues)}
                                                value={formValues.tax?.id || 0}
                                                disabled={type === 'details' || type === 'delete' ? true : false} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 h-full'>
                                <InputGroup
                                    id='cost_price'
                                    className='h-full'
                                    name='cost_price'
                                    label={translations.cost_price}
                                    icon={<DollarCircleIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues, setUpdateFlag })}
                                    required={false}
                                    value={formValues.cost_price}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='cash_profit'
                                    name='cash_profit'
                                    label={translations.profit}
                                    icon={<PercentCircleIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues, setUpdateFlag })}
                                    required={false}
                                    value={formValues.cash_profit}
                                    type='number'
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='cash_price'
                                    name='cash_price'
                                    label={translations.cash_price}
                                    icon={<DollarCircleIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues, setUpdateFlag })}
                                    required={false}
                                    value={formValues.cash_price}
                                    type='number'
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='credit_profit'
                                    name='credit_profit'
                                    label={translations.profit}
                                    icon={<PercentCircleIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues, setUpdateFlag })}
                                    required={false}
                                    value={formValues.credit_profit}
                                    type='number'
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='credit_price'
                                    name='credit_price'
                                    label={translations.credit_price}
                                    icon={<DollarCircleIcon className='icon' size={24} />}
                                    onChange={handleChange({ setFormValues, setUpdateFlag })}
                                    required={false}
                                    value={formValues.credit_price}
                                    type='number'
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
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
            </div>
        </div>
    );
};

export default CrudPage;