import React, { useEffect, useState } from 'react';
import useTranslations from '../../../hooks/useTranslations';
import DelayedSuspense from '../../../components/DelayedSuspense';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Input from '../../../components/Input';
import { Add01Icon, CheckmarkCircle02Icon, CreditCardIcon, Mail01Icon, MoreIcon, PercentCircleIcon, Search01Icon, SecurityCheckIcon, ShoppingBasket01Icon, ShoppingCartAdd02Icon, ShoppingCartCheckIn02Icon, StoreLocation01Icon, TelephoneIcon, UserAccountIcon } from 'hugeicons-react';
import Select from '../../../components/Select';
import Modal from '../../../components/Modal';
import Table from '../../../components/Table';
import ClientsTablePage from '../../manage/clients/TablePage';
import { getClient } from '../../../services/clientsService';
import { Inventory, Sale, SalePayment } from '../../../types/modelType';
import { URL_BACKEND } from '../../../services/apiService';
import { CustomChangeEvent } from '../../../types/componentsType';
import CrudPage from '../../manage/clients/CrudPage';
import ProductsTablePage from '../../manage/product/TablePage';
import ProductsFiltersPage from '../../manage/product/filtersPage';
import { getProduct } from '../../../services/productsService';
import { generateUUID } from '../../../utils/uuidGen';
import { addSale } from '../../../services/SalesService';
import { extractMessages } from '../../../utils/formUtils';
import { addAlert } from '../../../utils/Alerts';

const AppPOSPage: React.FC = () => {
    const { translations } = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState({ select_client: false, add_client: false, select_product: false, edit_price: false, finish: false });
    const [selectedClient, setSelectedClient] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [reloadTableClient, setReloadTableClient] = useState(0);
    const [formValues, setFormValues] = useState<Sale>(() => {
        const savedForm = sessionStorage.getItem('posValues');
        return savedForm ? JSON.parse(savedForm) : {        
            client: { 
                id: selectedClient 
            },
            type: 1,
        };
    });

    const [formValuesPayment, setFormValuesPayment] = useState<SalePayment>({
        no: 0,
        subtotal: 0,
        commission: 0,
        discount_per: 0,
        discount: 0,
        total: 0,
        pay: 0,
        change: 0,
        payment_method: undefined,
    });

    const [formValuesDetails, setFormValuesDetails] = useState<Inventory[]>(() => {
        const savedForm = sessionStorage.getItem('posDetailsValues');
        return savedForm ? JSON.parse(savedForm) : [];
    });

    const [updateFlag, setUpdateFlag] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('posValues', JSON.stringify(formValues));
        sessionStorage.setItem('posDetailsValues', JSON.stringify(formValuesDetails));
    }, [formValues, formValuesDetails]);

    const handleTableReloadClient = () => {
        setReloadTableClient(prev => prev + 1);
    };

    const fetchGetClient = async (id: number) => {
        try {
            const { success, resp } = await getClient(id);
            if (success) {
                setFormValues(prev => ({ ...prev, client: resp }));
            }
        } catch (error) { }
    };

    const fetchGetProduct = async (id: string) => {
        try {
            const { success, resp } = await getProduct(id);
            if (success) {
                setFormValuesDetails(prevDetails => {
                    const existingProductIndex = prevDetails.findIndex(
                        detail => detail.product?.id === resp.id
                    );

                    if (existingProductIndex !== -1) {
                        prevDetails[existingProductIndex].quantity! += 1;
                    } else {
                        prevDetails.push({ quantity: 1, product: resp });
                    }

                    return [...prevDetails];
                });

                setFormValues(prev => ({
                    ...prev,
                    id: (formValues.id || 0) + 1,
                }));
            }
        } catch (error) { }
    };
    const handleSelectClient = (id: number) => {
        setSelectedClient(id);
        fetchGetClient(id);
        setIsModalOpen({ ...isModalOpen, select_client: false });
    }

    const handleSelectProduct = (id: string) => {
        setSelectedProduct('');
        fetchGetProduct(id);
        setIsModalOpen({ ...isModalOpen, select_product: false });
    }

    const handleQuantityChange = (index: number, newQuantity: number) => {
        setFormValuesDetails((prevDetails) => {
            if (!prevDetails.length) return prevDetails;

            const updatedDetails = prevDetails.map((detail, idx) => {
                if (idx === index && newQuantity > 0) {
                    return {
                        ...detail,
                        quantity: newQuantity,
                    };
                }
                return detail;
            });

            return updatedDetails;
        });
    };

    const table_header = [
        { name: 'person.identification_picture', headerName: '' },
        { name: 'person.alias', headerName: translations.alias },
        { name: 'person.firstname', headerName: translations.firstname },
        { name: 'person.middlename', headerName: translations.middlename },
        { name: 'person.lastname', headerName: translations.lastname },
        { name: 'person.second_lastname', headerName: translations.second_lastname },
        { name: 'person.phone', headerName: translations.phone },
        { name: 'person.birthdate', headerName: translations.birthdate },
        { name: 'person.addresses[0].city.name', headerName: translations.address_city },
    ];

    const type_of_sales_options = [
        { value: 1, label: translations.in_cash },
        { value: 2, label: translations.on_credit },
    ];

    useEffect(() => {
        setFormValues({
            ...formValues,
            id: (formValues.id || 0) + 1,
            total: 0,
        });

        setFormValuesPayment({
            ...formValuesPayment,
            id: generateUUID(),
            subtotal: 0,
            commission: 0,
            discount_per: 0,
            discount: 0,
            total: 0,
            pay: 0,
            change: 0,
            payment_method: undefined
        });
    }, [formValues.type]);

    useEffect(() => {
        setFormValuesPayment((prevFormValuesPayment) => {
            const { subtotal = 0, discount = 0, payment_method, pay = 0 } = prevFormValuesPayment;

            let updatedDetails = formValuesDetails?.map((row) => {
                if (formValues.type === 1) {
                    return row.product?.cash_price !== row.price
                        ? { ...row, price: row.product?.cash_price }
                        : row;
                } else if (formValues.type === 2) {
                    return row.product?.credit_price !== row.price
                        ? { ...row, price: row.product?.credit_price }
                        : row;
                } else {
                    return row.price !== 0 ? { ...row, price: 0 } : row;
                }
            }) || [];

            let sale_total = 0;
            let cart_subtotal = 0;

            if (updatedDetails.length) {
                sale_total = updatedDetails.reduce((subtotal, row) => subtotal + (row.price || 0) * (row.quantity || 0), 0);
            }

            if (formValues.type === 1) {
                cart_subtotal = sale_total;
            } else {
                cart_subtotal = subtotal;
            }

            const cart_commission = ((payment_method?.value || 0) * cart_subtotal) / 100;

            const cart_total = cart_subtotal + cart_commission - discount;
            const cart_change = pay - cart_total;

            const roundedSaleTotal = parseFloat(sale_total.toFixed(2));
            const roundedCartTotal = parseFloat(cart_total.toFixed(2));
            const roundedCartSubtotal = parseFloat(cart_subtotal.toFixed(2));
            const roundedCartCommission = parseFloat(cart_commission.toFixed(2));
            const roundedCartChange = parseFloat(cart_change.toFixed(2));

            if (
                roundedCartSubtotal !== prevFormValuesPayment.subtotal ||
                roundedSaleTotal !== formValues.total ||
                roundedCartTotal !== prevFormValuesPayment.total ||
                roundedCartCommission !== prevFormValuesPayment.commission ||
                roundedCartChange !== prevFormValuesPayment.change ||
                JSON.stringify(formValuesDetails) !== JSON.stringify(updatedDetails)
            ) {
                setFormValuesDetails(updatedDetails);
                setFormValues({ ...formValues, total: roundedSaleTotal });
                return {
                    ...prevFormValuesPayment,
                    subtotal: roundedCartSubtotal,
                    total: roundedCartTotal,
                    commission: roundedCartCommission,
                    change: roundedCartChange,
                };
            }

            return prevFormValuesPayment;
        });
    }, [
        formValuesPayment, formValues, formValuesDetails
    ]);

    useEffect(() => {
        if (!updateFlag) return;

        const discount_per = formValuesPayment.discount_per || 0;

        if (discount_per >= 0) {
            const newDiscount = (discount_per * ((formValuesPayment.subtotal || 0) + (formValuesPayment.commission || 0))) / 100;

            setFormValuesPayment(prev => ({
                ...prev,
                discount: parseFloat(newDiscount.toFixed(2))
            }));
        }

        setUpdateFlag(false);
    }, [formValuesPayment.discount_per]);

    useEffect(() => {
        if (!updateFlag) return;

        const discount = formValuesPayment.discount || 0;

        if (discount >= 0) {
            const newDiscountPer = (discount * 100) / ((formValuesPayment.subtotal || 0) + (formValuesPayment.commission || 0));

            setFormValuesPayment(prev => ({
                ...prev,
                discount_per: parseFloat(newDiscountPer.toFixed(2))
            }));
        }

        setUpdateFlag(false);
    }, [formValuesPayment.discount]);

    const handleInvoice = (id: string) => {
        window.open(`${URL_BACKEND}/pdf/payment?id=${id}`, '_blank');
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await addSale(formValues, formValuesDetails, formValuesPayment);
            const response_resp = response?.resp;
            
            handleInvoice(response_resp.id);

            addAlert({
                id: generateUUID(),
                title: 'Success',
                msg: response_resp.msg,
                icon: 'CheckmarkCircle02Icon',
                timeout: 2000
            });

            setIsModalOpen({ ...isModalOpen, finish: false })
            setFormValues({        
                client: { 
                    id: selectedClient 
                },
                type: 1,
            });
            setFormValuesPayment({
                no: 0,
                subtotal: 0,
                commission: 0,
                discount_per: 0,
                discount: 0,
                total: 0,
                pay: 0,
                change: 0,
                payment_method: undefined,
            });
            setFormValuesDetails([]);
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
        <DelayedSuspense fallback={<SkeletonLoader />} delay={1000}>
            <div className='flex items-center justify-between w-full p-8 animate__animated animate__fadeIn animate__faster'>
                <div className='flex flex-col'>
                    <h1 className='text-2xl font-bold dark:text-white'>{translations.pos}</h1>
                    <span className='text-sm text-gray-600 dark:text-slate-400'>{translations.app_pos_info}</span>
                </div>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-4 p-8 gap-2 animate__animated animate__fadeIn animate__faster'>
                <div className='col-span-1'>
                    <div className='flex flex-col items-center w-full gap-2 p-4 rounded-xl shadow-sm shadow-slate-600/30 dark:bg-slate-700'>
                        <div className='flex justify-between w-full gap-1'>
                            <div className='flex gap-1 dark:text-white'>
                                <div className='flex gap-1'>
                                    <span className='pt-[2px]'><UserAccountIcon size={23} /></span>
                                    <h1 className='font-bold text-lg'>Client:</h1>
                                </div>
                                <span className='mt-1 dark:text-slate-300'>#{formValues.client?.id || '-'}</span>
                            </div>
                            <div>
                                <button type='submit' className={`btn btn-blue rounded-full w-12 h-12`} onClick={() => setIsModalOpen({ ...isModalOpen, add_client: true })}>
                                    <Add01Icon size={20} />
                                </button>
                            </div>
                        </div>
                        <div className='h-28 w-28 border-[4px] border-slate-600 rounded-full mb-2'>
                            {formValues.client?.person?.profile_image ? <img src={`${URL_BACKEND}${formValues.client?.person?.profile_image}`} alt='Client' className='h-full w-full rounded-full' /> : <svg className='fill-slate-500 stroke-slate-500' version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="796 796 200 200" enableBackground="new 796 796 200 200" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M896,796c-55.14,0-99.999,44.86-99.999,100c0,55.141,44.859,100,99.999,100c55.141,0,99.999-44.859,99.999-100 C995.999,840.86,951.141,796,896,796z M896.639,827.425c20.538,0,37.189,19.66,37.189,43.921c0,24.257-16.651,43.924-37.189,43.924 s-37.187-19.667-37.187-43.924C859.452,847.085,876.101,827.425,896.639,827.425z M896,983.86 c-24.692,0-47.038-10.239-63.016-26.695c-2.266-2.335-2.984-5.775-1.84-8.82c5.47-14.556,15.718-26.762,28.817-34.761 c2.828-1.728,6.449-1.393,8.91,0.828c7.706,6.958,17.316,11.114,27.767,11.114c10.249,0,19.69-4.001,27.318-10.719 c2.488-2.191,6.128-2.479,8.932-0.711c12.697,8.004,22.618,20.005,27.967,34.253c1.144,3.047,0.425,6.482-1.842,8.817 C943.037,973.621,920.691,983.86,896,983.86z"></path> </g></svg>}
                        </div>
                        <Input
                            props={{
                                id: 'client_name',
                                name: 'client_name',
                                value: formValues.client?.person?.firstname || '',
                                disabled: true,
                            }}
                            label='Client name'
                            icon={<UserAccountIcon className='icon' size={24} />}
                            required={false}
                        />
                        <Input
                            props={{
                                id: 'client_email',
                                name: 'client_email',
                                value: formValues.client?.email || '',
                                disabled: true,
                            }}
                            label='Client email'
                            icon={<Mail01Icon className='icon' size={24} />}
                            required={false}
                        />
                        <Input
                            props={{
                                id: 'client_phone',
                                name: 'client_phone',
                                value: formValues.client?.person?.phone || '',
                                disabled: true,
                            }}
                            label='Client phone'
                            icon={<TelephoneIcon className='icon' size={24} />}
                            required={false}
                        />
                        <button type='submit' className={`btn btn-blue w-full h-12`} onClick={() => setIsModalOpen({ ...isModalOpen, select_client: true })}>
                            <Search01Icon size={20} />
                        </button>
                    </div>
                </div>
                <div className='col-span-1 xl:col-span-2'>
                    <div className='flex flex-col items-center w-full gap-2 p-4 rounded-xl shadow-sm h-full shadow-slate-600/30 dark:bg-slate-700'>
                        <div className='flex justify-between w-full gap-1 mb-2'>
                            <div className='flex items-center gap-1 dark:text-white'>
                                <div className='flex items-center gap-1'>
                                    <span><ShoppingCartAdd02Icon size={23} /></span>
                                    <h1 className='font-bold text-lg'>Carrito </h1>
                                </div>
                            </div>
                        </div>
                        <button type='submit' className={`btn btn-blue w-full h-14`} onClick={() => setIsModalOpen({ ...isModalOpen, select_product: true })}>
                            <Add01Icon size={20} /> Ingresar o escanear producto
                        </button>
                        <hr className='w-full border dark:border-slate-600 my-2' />
                        <div className='flex flex-col justify-between w-full h-full'>
                            <div className='flex flex-col gap-2 h-80'>
                                {formValuesDetails && formValuesDetails.length > 0 ? (
                                    formValuesDetails.map((row, index) => (
                                        <div className='flex gap-3 w-full p-4 rounded-lg cursor-pointer hover:scale-[1.02] dark:bg-slate-600 dark:text-white transition-all ease-in-out duration-200'>
                                            <div
                                                className='w-[4.4rem] h-16 bg-cover rounded-full border-[3px] dark:border-slate-500'
                                                style={{
                                                    backgroundImage: row.product?.product_images?.[0]?.image
                                                        ? `url("${URL_BACKEND}${row.product.product_images[0].image}")`
                                                        : 'none'
                                                }}
                                            ></div>
                                            <div className='flex justify-between w-full'>
                                                <div className='flex flex-col h-full'>
                                                    <span className='font-bold uppercase'>{row.product?.name}</span>
                                                    <span className='text-sm -mt-1 font-medium dark:text-slate-400'>{row.product?.model || '-'}</span>
                                                </div>
                                                <div className='flex gap-1 h-full items-center'>
                                                    <span className='font-medium uppercase dark:text-slate-200'>Q{row.price || 0}</span>
                                                    <span className='font-medium dark:text-slate-100'>x
                                                        <input
                                                            type='number'
                                                            className='ml-1 bg-transparent outline-none w-11'
                                                            value={row.quantity || 0}
                                                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                                        />
                                                    </span>
                                                    <span className='font-bold uppercase ml-2'>Q{((row.price || 0) * (row.quantity || 0)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))

                                ) : (
                                    <div className='flex items-center gap-3 w-full p-4 rounded-lg select-none dark:bg-slate-600 dark:text-white transition-all ease-in-out duration-200'>
                                        <div className='w-16 h-16 bg-cover rounded-full border-[3px] dark:border-slate-500'></div>
                                        <div className='flex justify-between'>
                                            <div className='flex flex-col h-full'>
                                                <span className='font-bold uppercase'>No products</span>
                                                <span className='text-sm -mt-1 font-medium dark:text-slate-400'>Add one...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t-2 border-slate-600'>
                                <div className='col-span-1 flex flex-col justify-end text-lg dark:text-slate-300'>
                                    <div className='flex justify-between gap-1'>
                                        <h2 className='font-bold dark:text-white'>Subtotal:</h2>
                                        <span className='font-medium'>Q{(formValuesPayment.subtotal || 0)}</span>
                                    </div>
                                    <div className='flex justify-between gap-1'>
                                        <h2 className='font-bold dark:text-white'>Comisión:</h2>
                                        <span className='font-medium'>Q{(formValuesPayment.commission || 0)}</span>
                                    </div>
                                    <div className='flex justify-between gap-1'>
                                        <h2 className='font-bold dark:text-white'>Descuento:</h2>
                                        <span className='font-medium'>Q{(formValuesPayment.discount || 0)}</span>
                                    </div>
                                </div>
                                <div className='col-span-1 flex flex-col justify-end text-lg gap-2 dark:text-slate-300'>
                                    <div className='flex flex-col items-end'>
                                        <h2 className='font-bold dark:text-white'>Total:</h2>
                                        <div className='flex items-center gap-1'>
                                            {formValues.type === 2 && (<span className='font-medium text-sm'>(Q{(formValues.total || 0)})</span>)}
                                            <span className='font-medium'>Q{(formValuesPayment.total || 0)}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <h2 className='font-bold dark:text-white'>Cambio:</h2>
                                        <span className='font-medium'>Q{(formValuesPayment.change || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-1 flex flex-col gap-2'>
                    <div className='flex flex-col items-center w-full gap-2 p-4 rounded-xl shadow-sm shadow-slate-600/30 dark:bg-slate-700'>
                        <div className='flex justify-between w-full gap-1 mb-2'>
                            <div className='flex items-center gap-1 dark:text-white'>
                                <div className='flex items-center gap-1'>
                                    <span><ShoppingCartCheckIn02Icon size={23} /></span>
                                    <h1 className='font-bold text-lg'>Nueva venta </h1>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='w-full z-10'>
                                <Select
                                    props={{
                                        id: 'location',
                                        name: 'location',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValuesPayment(prev => ({
                                                ...prev,
                                                location: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                                }
                                            }));
                                        },
                                        value: formValuesPayment.location?.id,
                                    }}
                                    endpoint='manage/locations'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<StoreLocation01Icon size={20} />}
                                    label={translations.location}
                                />
                            </div>
                            <div className='w-full z-[9]'>
                                <Select
                                    props={{
                                        id: 'type_of_sale',
                                        name: 'type_of_sale',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValues(prev => ({
                                                ...prev,
                                                type: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                            }));
                                        },
                                        value: formValues.type || 0,
                                    }}
                                    myOptions={type_of_sales_options}
                                    icon={<ShoppingBasket01Icon size={20} />}
                                    label={translations.type_of_sale}
                                />
                            </div>
                            <hr className='w-full border dark:border-slate-600 my-2' />
                            {formValues.type === 2 && (
                                <>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <div className='col-span-1 w-full'>
                                            <Input
                                                props={{
                                                    id: 'quantity_of_payments',
                                                    name: 'quantity_of_payments',
                                                    type: 'number',
                                                    value: formValues.quantity_of_payments || 2,
                                                    min: 2,
                                                    onChange: (e) => {
                                                        setFormValues(prev => ({
                                                            ...prev,
                                                            quantity_of_payments: isNaN(parseFloat(e.target.value)) ? 0 : parseInt(e.target.value)
                                                        }));
                                                    },
                                                }}
                                                label='Cantidad de pagos'
                                                icon={<MoreIcon size={20} />}
                                                required={false}
                                            />
                                        </div>
                                        <div className='col-span-1 w-full'>
                                            <Input
                                                props={{
                                                    id: 'payment_days',
                                                    name: 'payment_days',
                                                    type: 'number',
                                                    value: formValues.payment_days || 0,
                                                    min: 0,
                                                    onChange: (e) => {
                                                        setFormValues(prev => ({
                                                            ...prev,
                                                            payment_days: isNaN(parseFloat(e.target.value)) ? 0 : parseInt(e.target.value)
                                                        }));
                                                    },
                                                }}
                                                label='Cada cuantos dias'
                                                icon={<MoreIcon size={20} />}
                                                required={false}
                                            />
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            props={{
                                                id: 'subtotal',
                                                name: 'subtotal',
                                                type: 'number',
                                                value: formValuesPayment.subtotal || 0,
                                                min: 0,
                                                onChange: (e) => {
                                                    setFormValuesPayment(prev => ({
                                                        ...prev,
                                                        subtotal: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                                    }));
                                                },
                                            }}
                                            label='Primer pago'
                                            icon={'Q'}
                                            required={false}
                                        />
                                    </div>
                                </>
                            )}
                            <div className='w-full z-[8]'>
                                <Select
                                    props={{
                                        id: 'paymentmethod',
                                        name: 'paymentmethod',
                                        onChange: (e: CustomChangeEvent) => {
                                            setFormValuesPayment(prev => ({
                                                ...prev,
                                                payment_method: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value),
                                                    value: e.object?.value,
                                                }
                                            }));
                                        },
                                        value: formValuesPayment.payment_method?.id,
                                    }}
                                    endpoint='manage/paymentmethods'
                                    endpoint_value='id'
                                    endpoint_text='{name} ({value}%)'
                                    icon={<CreditCardIcon size={20} />}
                                    label={translations.payment_method}
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-2'>
                                <div className='col-span-1 w-full'>
                                    <Input
                                        props={{
                                            id: 'discount_per',
                                            name: 'discount_per',
                                            type: 'number',
                                            value: formValuesPayment.discount_per || 0,
                                            min: 0,
                                            onChange: (e) => {
                                                setFormValuesPayment(prev => ({
                                                    ...prev,
                                                    discount_per: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                                }));
                                                setUpdateFlag(true);
                                            },
                                        }}
                                        label='Descuento'
                                        icon={<PercentCircleIcon className='icon' size={24} />}
                                        required={false}
                                    />
                                </div>
                                <div className='col-span-1 w-full'>
                                    <Input
                                        props={{
                                            id: 'discount',
                                            name: 'discount',
                                            type: 'number',
                                            value: formValuesPayment.discount || 0,
                                            min: 0,
                                            onChange: (e) => {
                                                setFormValuesPayment(prev => ({
                                                    ...prev,
                                                    discount: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                                }));
                                                setUpdateFlag(true);
                                            },
                                        }}
                                        label='Descuento'
                                        icon={'Q'}
                                        required={false}
                                    />
                                </div>
                            </div>
                            <div className='w-full'>
                                <Input
                                    props={{
                                        id: 'pay',
                                        name: 'pay',
                                        type: 'number',
                                        value: formValuesPayment.pay || 0,
                                        min: 0,
                                        onChange: (e) => {
                                            setFormValuesPayment(prev => ({
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
                        </div>

                    </div>
                    <div className='flex flex-col items-center w-full gap-2 p-4 rounded-xl shadow-sm shadow-slate-600/30 dark:bg-slate-700'>
                        <div className='flex justify-between w-full gap-1 mb-2'>
                            <div className='flex items-center gap-1 dark:text-white'>
                                <div className='flex items-center gap-1'>
                                    <span><SecurityCheckIcon size={23} /></span>
                                    <h1 className='font-bold text-lg'>Finalizar venta </h1>
                                </div>
                            </div>
                        </div>
                        <button type='submit' className={`btn btn-blue w-full h-12`} onClick={() => setIsModalOpen({ ...isModalOpen, finish: true })} disabled={(formValues.total || 0) <= 0 || (formValuesPayment.change || 0) < 0}>
                            <CheckmarkCircle02Icon size={22} />
                        </button>
                    </div>
                </div>
            </div>
            {isModalOpen.select_client && (
                <Modal title={translations.clients} onClose={() => setIsModalOpen({ ...isModalOpen, select_client: false })} className='max-w-screen-xl'>
                    <div className='w-full p-2 rounded-xl'>
                        <Table
                            endpoint='manage/clients'
                            reloadTable={reloadTableClient}
                            header={table_header}
                            tbody={
                                <ClientsTablePage
                                    selected={selectedClient}
                                    setSelected={handleSelectClient}
                                    className='dark:bg-slate-800/20 dark:hover:bg-slate-800/50'
                                />
                            }
                        />
                    </div>
                </Modal>
            )}

            {isModalOpen.select_product && (
                <Modal title={translations.products} onClose={() => setIsModalOpen({ ...isModalOpen, select_product: false })} className='max-w-screen-xl'>
                    <div className='w-full p-2 rounded-xl'>
                        <Table
                            endpoint='manage/products'
                            reloadTable={reloadTableClient}
                            header={table_header}
                            tbody={
                                <ProductsTablePage
                                    selected={selectedProduct}
                                    setSelected={handleSelectProduct}
                                    className='dark:bg-slate-800/20 dark:hover:bg-slate-800/50'
                                />
                            }
                            filters={<ProductsFiltersPage />}
                        />
                    </div>
                </Modal>
            )}

            {isModalOpen.add_client && (
                <Modal title={translations.add_client} onClose={() => setIsModalOpen({ ...isModalOpen, add_client: false })} className='max-w-screen-xl'>
                    <CrudPage type='add' selected_id={selectedClient} onClose={() => setIsModalOpen({ ...isModalOpen, add_client: false })} handleTableReload={handleTableReloadClient} setSelected={setSelectedClient} />
                </Modal>
            )}

            {isModalOpen.edit_price && (
                <Modal title={translations.add_client} onClose={() => setIsModalOpen({ ...isModalOpen, add_client: false })} className='max-w-screen-xl'>
                    <form autoComplete='off'>
                        <div className='flex flex-col gap-2 w-full tab-item'>

                        </div>
                    </form>
                </Modal>
            )}

            {isModalOpen.finish && (
                <Modal title={translations.finish_sale_sure} onClose={() => setIsModalOpen({ ...isModalOpen, finish: false })}>
                    <form onSubmit={onSubmit} autoComplete='off'>
                        <button type='submit' className={`btn btn-blue w-full h-12`} disabled={(formValues.total || 0) <= 0 || (formValuesPayment.change || 0) < 0}>
                            <CheckmarkCircle02Icon size={22} /> Finish
                        </button>
                    </form>
                </Modal>
            )}
        </DelayedSuspense>
    );
};

export default AppPOSPage;