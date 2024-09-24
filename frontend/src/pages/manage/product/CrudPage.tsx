import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { handleChange, handleFileChange, handleSelectChange } from '../../../utils/formUtils';
import { Product } from '../../../types/modelType';
import { addProduct, deleteProduct, editProduct, getProduct } from '../../../services/productsService';
import { getTax } from '../../../services/taxesService';
import { Add01Icon, BarCode02Icon, ComputerVideoIcon, Delete02Icon, DollarCircleIcon, InformationCircleIcon, LiftTruckIcon, Note04Icon, PercentCircleIcon, ProductLoadingIcon } from 'hugeicons-react';
import { URL_BACKEND } from '../../../services/apiService';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
import InputGroup from '../../../components/InputGroup';
import SelectGroup from '../../../components/SelectGroup';
import useMedia from '../../../hooks/useMedia';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    toggleModal: (modalType: 'add_brand' | 'add_category' | 'add_supplier' | 'add_tax' | 'product_images', isOpen: boolean) => void;
    handleTableReload?: () => void;
    setSelected?: (value: string) => void;
    setImageUrl?: (url: string) => void;
    type: string;
    selected_id: string;
}

const CrudPage: React.FC<CrudPageProps> = ({ addAlert, onClose, toggleModal, handleTableReload, setSelected, setImageUrl, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Product>({ id: selected_id, status: true, cost_price: 0, cash_profit: 0, cash_price: 0, credit_profit: 0, credit_price: 0, min_stock: 0 });
    const [activeTab, setActiveTab] = useState<'home' | 'product_images'>('home');
    const [colorPage, setColorPage] = useState<string>('blue');
    const [productImages, setProductImages] = useState<{ image: string }[]>([]);
    const [updateFlag, setUpdateFlag] = useState(false);
    const {
        isVideoActive,
        startVideo,
        stopVideo,
        takePicture,
        videoRef,
        capturedImages,
        setCapturedImages,
        canvasRef
    } = useMedia({ addAlert });
    const inputImages = useRef<HTMLInputElement | null>(null);

    const handleToggleVideo = () => {
        if (isVideoActive) {
            stopVideo();
        } else {
            startVideo();
        }
    }

    const deleteImages = () => {
        setCapturedImages([]);
        if (inputImages.current) {
            inputImages.current.value = '';
        }
    }

    const handleMultipleFileUpload = handleFileChange(
        ['image/jpg', 'image/jpeg', 'image/png'],
        setCapturedImages,
        stopVideo,
        false
    );

    const handleImage = (url: string) => {
        if (setImageUrl) setImageUrl(url);
        toggleModal('product_images', true);
    }

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
                    setProductImages(response_data?.resp?.product_images);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching product', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const handleForm = async () => {
        let modFormValues = formValues;
        console.log(capturedImages)

        if (type === 'add' || type === 'edit') {
            const imagePromises = capturedImages.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file)
                });
            });

            const imagesBase64 = await Promise.all(imagePromises);

            modFormValues = {
                ...formValues,
                images: imagesBase64,
            };
        }
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
                        onClick={() => setActiveTab(tab as 'home')}
                    >
                        {translations[tab]}
                    </button>
                ))}
                {(type === 'delete' || type === 'edit' || type === 'details') && (
                    ['product_images'].map(tab => (
                        <button
                            key={tab}
                            className={`tab ${tab === activeTab ? `tab-active tab-${colorPage}` : `hover:tab-${colorPage}`}`}
                            onClick={() => setActiveTab(tab as 'home' | 'product_images')}
                        >
                            {translations[tab]}
                        </button>
                    ))
                )}
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'home' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            {(type === 'edit' || type === 'add') && (
                                <div className='col-span-1'>
                                    <div className='flex flex-col col-span-1 gap-2'>
                                        <div className='flex h-auto gap-2'>
                                            <div className='flex'>
                                                <button type='button' className={`btn btn-${colorPage} h-full px-3`} onClick={handleToggleVideo}><ComputerVideoIcon /></button>
                                            </div>
                                            <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                                <label htmlFor='images' className='text-sm font-semibold dark:text-gray-100'>
                                                    {translations.product_images}
                                                </label>
                                                <input
                                                    ref={inputImages}
                                                    type='file'
                                                    id='images'
                                                    name='images'
                                                    accept='.jpg,.jpeg,.png'
                                                    multiple={true}
                                                    onChange={handleMultipleFileUpload}
                                                    className={`input-file file-${colorPage}`}
                                                />
                                            </div>
                                        </div>
                                        <div className={`flex flex-col border-2 border-gray-200 rounded-2xl overflow-hidden gap-1 p-1 dark:border-slate-600 ${!isVideoActive && capturedImages.length <= 0 ? 'hidden' : ''}`}>
                                            <video ref={videoRef} className={`rounded-xl ${!isVideoActive ? 'hidden' : ''}`} />
                                            <div className={`flex flex-col items-center w-full pb-1 gap-2 ${capturedImages.length <= 0 ? 'hidden' : ''}`}>
                                                <canvas ref={canvasRef} className={`rounded-xl h-56 w-full ${isVideoActive ? 'hidden' : ''}`}></canvas>
                                                <p className='flex flex-col items-center text-sm dark:text-white'>
                                                    <span className='px-2 font-bold'>
                                                        Imagenes capturadas:
                                                    </span>
                                                    {capturedImages.map((image, index) => (
                                                        <span key={index}>{image.name}</span>
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                        {capturedImages.length > 0 && !isVideoActive && (
                                            <div className='flex w-full'>
                                                <button type='button' className={`btn btn-${colorPage} text-sm h-9`} onClick={deleteImages}><Delete02Icon /></button>
                                            </div>
                                        )}
                                        <button type='button' onClick={takePicture} className={`btn btn-${colorPage} text-sm h-9 ${!isVideoActive ? 'hidden' : ''}`}>Tomar foto</button>
                                    </div>
                                </div>
                            )}
                            <div className='col-span-1'>
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
                            </div>
                        </div>
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
                                    {(type === 'edit' || type === 'add') && (
                                        <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-11 rounded-2xl`} onClick={() => { toggleModal('add_brand', true) }}><Add01Icon /></button>
                                    )}
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
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
                                    {(type === 'edit' || type === 'add') && (
                                        <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-11 rounded-2xl`} onClick={() => { toggleModal('add_category', true) }}><Add01Icon /></button>
                                    )}
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
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
                            {(type === 'edit' || type === 'add') && (
                                <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-10 rounded-2xl`} onClick={() => { toggleModal('add_supplier', true) }}><Add01Icon /></button>
                            )}
                            <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
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
                        <hr className='border dark:border-slate-600 mx-2 my-2' />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[7]'>
                                <div className='flex gap-1 z-[8]'>
                                    {(type === 'edit' || type === 'add') && (
                                        <button type='button' className={`btn btn-${colorPage} text-sm h-auto w-11 rounded-2xl`} onClick={() => { toggleModal('add_tax', true) }}><Add01Icon /></button>
                                    )}
                                    <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full gap-2'>
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
                        <hr className='border dark:border-slate-600 mx-2 my-2' />
                        <InputGroup
                            id='min_stock'
                            name='min_stock'
                            type='number'
                            label={translations.min_stock}
                            icon={<LiftTruckIcon className='icon' size={24} />}
                            onChange={handleChange({ setFormValues })}
                            required={false}
                            value={formValues.min_stock || 0}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 select-none dark:border-slate-600 items-center justify-between w-full z-10 gap-2'>
                            <label className='inline-flex items-center cursor-pointer'>
                                <span className='ml-1 me-2 text-sm font-bold text-gray-900 dark:text-gray-300'>{translations.visible}</span>
                                <input type='checkbox'
                                    value={formValues.status ? '1' : '0'}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                    className='sr-only peer'
                                    name='status'
                                    onChange={handleChange({ setFormValues })}
                                    checked={formValues.status ? true : false}
                                />
                                <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 peer-focus:ring-transparent rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${colorPage === 'blue' ? 'peer-checked:bg-blue-500' : colorPage === 'orange' ? 'peer-checked:bg-orange-500' : colorPage === 'red' ? 'peer-checked:bg-red-500' : colorPage === 'yellow' ? 'peer-checked:bg-yellow-500' : 'peer-checked:bg-blue-500'}`}>
                                </div>
                            </label>
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
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'product_images' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                            {productImages.map((image, index) => (
                                <div key={index} className='col-span-1 flex justify-center p-2 border-2 rounded-xl dark:border-slate-600 overflow-hidden'>
                                    <img
                                        className='cursor-pointer rounded-lg w-full h-32 object-cover'
                                        src={`${URL_BACKEND}${image.image}`}
                                        alt='Document'
                                        onClick={() => { handleImage(image.image) }}
                                    />
                                </div>
                            ))}
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