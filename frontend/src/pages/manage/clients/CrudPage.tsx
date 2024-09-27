import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { handleFileChange } from '../../../utils/formUtils';
import { Product } from '../../../types/modelType';
import { addProduct, deleteProduct, editProduct, getProduct } from '../../../services/productsService';
import { getTax } from '../../../services/taxesService';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
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
                
            </div>
        </div>
    );
};

export default CrudPage;