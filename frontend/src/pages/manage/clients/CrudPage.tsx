import React, { useEffect, useRef, useState } from 'react';
import { Client } from '../../../types/modelType';
import { addClient, deleteClient, editClient, getClient } from '../../../services/clientsService';
import useTranslations from '../../../hooks/useTranslations';
import Select from '../../../components/Select';
import { Calendar01Icon, ComputerVideoIcon, Delete02Icon, JobSearchIcon, Location01Icon, Mail01Icon, MosqueLocationIcon, Note04Icon, RoadLocation01Icon, StoreLocation01Icon, UserAccountIcon, UserCircleIcon, UserQuestion02Icon } from 'hugeicons-react';
import Input from '../../../components/Input';
import useMedia from '../../../hooks/useMedia';
import { extractMessages, handleFileChange } from '../../../utils/formUtils';
import { URL_BACKEND } from '../../../services/apiService';
import ModalPhotos from '../../../components/ModalPhotos';
import { addAlert } from '../../../utils/Alerts';
import { generateUUID } from '../../../utils/uuidGen';

interface CrudPageProps {
    onClose: () => void;
    handleTableReload?: () => void;
    selected_id: number;
    setSelected?: (value: number) => void;
    type: string;
}

const CrudPage: React.FC<CrudPageProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Client>({ id: selected_id });
    const [activeTab, setActiveTab] = useState<'information' | 'details' | 'identification_images_client'>('information');
    const [colorPage, setColorPage] = useState<string>('blue');
    const [country, setCountry] = useState(0);
    const [state, setState] = useState(0);
    const [identificationPictures, setIdentificationPictures] = useState([{ image: '' }]);
    const [isModalOpen, setIsModalOpen] = useState({ image: false });
    const [image, setImage] = useState('');
    const {
        isVideoActive: isVideoActiveClient,
        startVideo: startVideoClient,
        stopVideo: stopVideoClient,
        takePicture: takePictureClient,
        videoRef: videoRefClient,
        capturedImages: capturedImagesClient,
        setCapturedImages: setCapturedImagesClient,
        canvasRef: canvasRefClient
    } = useMedia();
    const inputImageClient = useRef<HTMLInputElement | null>(null);

    const handleToggleVideoClient = () => {
        if (isVideoActiveClient) {
            stopVideoClient();
        } else {
            startVideoClient();
        }
    }

    const deleteImageClient = () => {
        setCapturedImagesClient([]);
        if (inputImageClient.current) {
            inputImageClient.current.value = '';
        }
    }

    const handleFileUpload = handleFileChange(
        ['image/jpg', 'image/jpeg', 'image/png'],
        setCapturedImagesClient,
        stopVideoClient,
        true
    );

    useEffect(() => {
        if (capturedImagesClient.length > 1) {
            setCapturedImagesClient([capturedImagesClient[capturedImagesClient.length - 1]]);
        }
    }, [capturedImagesClient, setCapturedImagesClient])

    const {
        isVideoActive,
        startVideo,
        stopVideo,
        takePicture,
        videoRef,
        capturedImages,
        setCapturedImages,
        canvasRef
    } = useMedia();
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
                    const response = await getClient(selected_id);
                    const response_resp = response.resp;

                    setFormValues(response_resp);
                    setIdentificationPictures(response_resp.person?.identification_images || []);
                } catch (error) {
                }
            };

            fetchGet();
        }
    }, [type, selected_id]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let modFormValues = formValues;

            if (type === 'add' || type === 'edit') {
                const imagesPromises = capturedImages.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result as string);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file)
                    });
                });

                const imagesBase64 = await Promise.all(imagesPromises);

                modFormValues = {
                    ...formValues,
                    person: {
                        ...formValues.person,
                        identification_images: imagesBase64
                    },
                };

                const imagePromises = capturedImagesClient.map(file => {
                    return new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve(reader.result as string);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file)
                    });
                });

                const imageBase64 = await Promise.all(imagePromises);

                modFormValues = {
                    ...modFormValues,
                    person: {
                        ...modFormValues.person,
                        profile_image: imageBase64[0]
                    },
                };
            }

            let response_resp;
            if (type === 'add') {
                const response = await addClient(modFormValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editClient(modFormValues);
                response_resp = response?.resp;
            } else if (type === 'delete' && selected_id) {
                const response = await deleteClient(selected_id);
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
            if (setSelected) setSelected(0);
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

    const handleImage = (image: string) => {
        setImage(image);
        setIsModalOpen({ image: true });
    }

    return (
        <>
            <div className="flex space-x-2 overflow-x-auto">
                {['information', 'details'].map(tab => (
                    <button
                        key={`${tab}-${Math.random()}`}
                        className={`tab ${tab === activeTab ? `tab-active tab-${colorPage}` : `hover:tab-${colorPage}`}`}
                        onClick={() => setActiveTab(tab as 'information')}
                    >
                        {translations[tab]}
                    </button>
                ))}
                {['edit', 'details', 'delete'].includes(type) && ['identification_images_client'].map(tab => (
                    <button
                        key={`${tab}-${Math.random()}`}
                        className={`tab ${tab === activeTab ? `tab-active tab-${colorPage}` : `hover:tab-${colorPage}`}`}
                        onClick={() => setActiveTab(tab as 'information')}
                    >
                        {translations[tab]}
                    </button>
                ))}
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'information' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='z-10'>
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
                                label={translations.location}
                            />
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[9]'>
                                <Select
                                    props={{
                                        id: 'typesids',
                                        name: 'typesids',
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                type_id: {
                                                    id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                                }
                                            }
                                        })),
                                        value: formValues.person?.type_id?.id,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/typesids'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<UserAccountIcon size={20} />}
                                    label={translations.identification_type}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'identification_id',
                                        name: 'identification_id',
                                        value: formValues.person?.identification_id,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                identification_id: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.identification_id}
                                    icon={<UserAccountIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'alias',
                                        name: 'alias',
                                        value: formValues.person?.alias,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                alias: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.alias}
                                    icon={<UserQuestion02Icon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'occupation',
                                        name: 'occupation',
                                        value: formValues.person?.occupation,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                occupation: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.occupation}
                                    icon={<JobSearchIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'firstname',
                                        name: 'firstname',
                                        value: formValues.person?.firstname,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                firstname: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.firstname}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={true}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'middlename',
                                        name: 'middlename',
                                        value: formValues.person?.middlename,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                middlename: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.middlename}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'lastname',
                                        name: 'lastname',
                                        value: formValues.person?.lastname,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                lastname: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.lastname}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={true}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'second_lastname',
                                        name: 'second_lastname',
                                        value: formValues.person?.second_lastname,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                second_lastname: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.second_lastname}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        <Input
                            props={{
                                id: 'email',
                                name: 'email',
                                value: formValues.email,
                                onChange: (e) => setFormValues(prev => ({
                                    ...prev,
                                    email: e.target.value
                                })),
                                disabled: ['details', 'delete'].includes(type)
                            }}
                            label={translations.email}
                            icon={<Mail01Icon className='icon' size={24} />}
                            color={colorPage}
                            required={false}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'mobile_number',
                                        name: 'mobile_number',
                                        value: formValues.person?.mobile,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                mobile: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.mobile_number}
                                    icon={<JobSearchIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'phone_number',
                                        name: 'phone_number',
                                        value: formValues.person?.phone,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                phone: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.phone_number}
                                    icon={<JobSearchIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        <hr className='border dark:border-slate-600 mx-2 my-2' />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-[8]'>
                                <Select
                                    props={{
                                        id: 'countries',
                                        name: 'countries',
                                        onChange: (e) => setCountry(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)),
                                        value: country,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/countries'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<UserAccountIcon size={20} />}
                                    label={translations.country}
                                />
                            </div>
                            <div className='col-span-1 z-[7]'>
                                <Select
                                    props={{
                                        id: 'state',
                                        name: 'state',
                                        onChange: (e) => setState(isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)),
                                        value: state,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/states'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<UserAccountIcon size={20} />}
                                    label={translations.address_state}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-3 gap-2'>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'street',
                                        name: 'street',
                                        value: formValues.person?.addresses?.[0]?.street,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                addresses: [{
                                                    ...prev.person?.addresses?.[0],
                                                    street: e.target.value
                                                }]
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.street}
                                    icon={<RoadLocation01Icon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'area',
                                        name: 'area',
                                        value: formValues.person?.addresses?.[0]?.area,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                addresses: [{
                                                    ...prev.person?.addresses?.[0],
                                                    area: e.target.value
                                                }]
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.address_area}
                                    icon={<MosqueLocationIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1 z-[6]'>
                                <Select
                                    props={{
                                        id: 'city',
                                        name: 'city',
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                addresses: [{
                                                    ...prev.person?.addresses?.[0],
                                                    city: {
                                                        id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                                    }
                                                }]
                                            }
                                        })),
                                        value: formValues.person?.addresses?.[0]?.city?.id,
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    endpoint='manage/cities'
                                    endpoint_value='id'
                                    endpoint_text='{name}'
                                    icon={<Location01Icon size={20} />}
                                    label={translations.address_city}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'details' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'birthdate',
                                        name: 'birthdate',
                                        value: formValues.person?.birthdate,
                                        type: 'date',
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            person: {
                                                ...prev.person,
                                                birthdate: e.target.value
                                            }
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.birthdate}
                                    icon={<Calendar01Icon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'note',
                                        name: 'note',
                                        value: formValues.note,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            note: e.target.value
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={translations.note}
                                    icon={<Note04Icon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        {(type === 'edit' || type === 'add') && (
                            <div className='grid items-start grid-cols-1 md:grid-cols-2 gap-2'>
                                <div className='col-span-1'>
                                    <div className='flex flex-col col-span-1 gap-2'>
                                        <div className='flex h-auto gap-2'>
                                            <div className='flex'>
                                                <button type='button' className={`btn btn-${colorPage} h-full px-3`} onClick={handleToggleVideoClient}><ComputerVideoIcon /></button>
                                            </div>
                                            <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                                <label htmlFor='images' className='text-sm font-semibold dark:text-gray-100'>
                                                    {translations.profile_image_client}
                                                </label>
                                                <input
                                                    ref={inputImageClient}
                                                    type='file'
                                                    id='images'
                                                    name='images'
                                                    accept='.jpg,.jpeg,.png'
                                                    multiple={false}
                                                    onChange={handleFileUpload}
                                                    className={`input-file file-${colorPage}`}
                                                />
                                            </div>
                                        </div>
                                        <div className={`flex flex-col border-2 border-gray-200 rounded-2xl overflow-hidden gap-1 p-1 dark:border-slate-600 ${!isVideoActiveClient && capturedImagesClient.length <= 0 ? 'hidden' : ''}`}>
                                            <video ref={videoRefClient} className={`rounded-xl ${!isVideoActiveClient ? 'hidden' : ''}`} />
                                            <div className={`flex flex-col items-center w-full pb-1 gap-2 ${capturedImagesClient.length <= 0 ? 'hidden' : ''}`}>
                                                <canvas ref={canvasRefClient} className={`rounded-xl w-full ${isVideoActiveClient ? 'hidden' : ''}`}></canvas>
                                                <p className='flex flex-col items-center text-sm dark:text-white'>
                                                    <span className='px-2 font-bold'>
                                                        Imagen capturada:
                                                    </span>
                                                    {capturedImagesClient.map((image, index) => (
                                                        <span key={`${index}-${Math.random()}`} >{image.name}</span>
                                                    ))}
                                                </p>
                                            </div>
                                        </div>
                                        {capturedImagesClient.length > 0 && !isVideoActiveClient && (
                                            <div className='flex w-full'>
                                                <button type='button' className={`btn btn-${colorPage} text-sm h-9`} onClick={deleteImageClient}><Delete02Icon /></button>
                                            </div>
                                        )}
                                        <button type='button' onClick={takePictureClient} className={`btn btn-${colorPage} text-sm h-9 ${!isVideoActiveClient ? 'hidden' : ''}`}>Tomar foto</button>
                                    </div>
                                </div>
                                <div className='col-span-1'>
                                    <div className='flex flex-col col-span-1 gap-2'>
                                        <div className='flex h-auto gap-2'>
                                            <div className='flex'>
                                                <button type='button' className={`btn btn-${colorPage} h-full px-3`} onClick={handleToggleVideo}><ComputerVideoIcon /></button>
                                            </div>
                                            <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                                <label htmlFor='images' className='text-sm font-semibold dark:text-gray-100'>
                                                    {translations.identification_images_client}
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
                                                <canvas ref={canvasRef} className={`rounded-xl w-full ${isVideoActive ? 'hidden' : ''}`}></canvas>
                                                <p className='flex flex-col items-center text-sm dark:text-white'>
                                                    <span className='px-2 font-bold'>
                                                        Imagenes capturadas:
                                                    </span>
                                                    {capturedImages.map((image, index) => (
                                                        <span key={`${index}-${Math.random()}`} >{image.name}</span>
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
                            </div>
                        )}
                        <div className='z-[6]'>
                            <Select
                                props={{
                                    id: 'clienttype',
                                    name: 'clienttype',
                                    onChange: (e) => setFormValues(prev => ({
                                        ...prev,
                                        type: {
                                            id: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                                        }
                                    })),
                                    value: formValues.type?.id,
                                    disabled: ['details', 'delete'].includes(type)
                                }}
                                endpoint='manage/clienttypes'
                                endpoint_value='id'
                                endpoint_text='{name}'
                                icon={<UserAccountIcon size={20} />}
                                label={translations.class_client}
                                required={false}
                            />
                        </div>
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'identification_images_client' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                            {identificationPictures.map((item, index) => (
                                <div key={`${index}-${Math.random()}`} className='col-span-1 flex justify-center p-2 border-2 rounded-xl dark:border-slate-600'>
                                    <img className='cursor-pointer rounded-lg h-32' src={`${URL_BACKEND}${item.image}`} alt='Document' onClick={() => { handleImage(item.image) }} />
                                </div>
                            ))}
                        </div>
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
            </div>
            {isModalOpen.image && (
                <ModalPhotos onClose={() => setIsModalOpen({ image: false })}>
                    <div className='flex w-full h-full justify-center'>
                        <img src={`${URL_BACKEND}${image}`} alt='Product' className='rounded-2xl' />
                    </div>
                </ModalPhotos>
            )}
        </>
    );
};

export default CrudPage;