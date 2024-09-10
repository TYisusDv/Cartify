import React, { useEffect, useRef, useState } from 'react';
import { Calendar01Icon, ComputerVideoIcon, JobSearchIcon, Location01Icon, Mail01Icon, MapsLocation01Icon, Monocle01Icon, MosqueLocationIcon, Note04Icon, RoadLocation01Icon, SmartPhone01Icon, TelephoneIcon, UserAccountIcon, UserCircleIcon, UserIdVerificationIcon, UserQuestion02Icon } from 'hugeicons-react';
import { handleChange } from '../../../utils/formUtils';
import { AlertType } from '../../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import { listLocations } from '../../../services/locationsService';
import { addClient } from '../../../services/clientsService';
import { listTypesIds } from '../../../services/typesIdsService';
import { listCountries } from '../../../services/countriesService';
import { Client, initialClient } from '../../../types/clientsType';
import { listTypesClients } from '../../../services/typesClientsService';
import useTranslations from '../../../hooks/useTranslations';
import InputGroup from '../../../components/InputGroup';
import SelectGroup from '../../../components/SelectGroup';
import useFormSubmit from '../../../hooks/useFormSubmit';
import InputList from '../../../components/InputList';

interface ManageAddClientProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload: () => void;
}

interface Option {
    value: string;
    label: string;
}

const ManageAddClientPage: React.FC<ManageAddClientProps> = ({ addAlert, onClose, handleTableReload }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Client>(initialClient);
    const [locations, setLocations] = useState([]);
    const [typesIds, setTypesIds] = useState([]);
    const [typesClients, setTypesClients] = useState<Option[]>([]);
    const [countries, setCountries] = useState([]);
    const [activeTab, setActiveTab] = useState<string>('information');
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturedImage, setCapturedImage] = useState<File | null>(null);

    const handleFieldChange = (fieldName: keyof Client) => (value: any) => {
        setFormValues(prevFormValues => ({
            ...prevFormValues,
            [fieldName]: value,
        }));
    };

    const handleFileChange = (fieldName: keyof Client) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (file) {
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a file in .jpg or .png format.');
                event.target.value = '';
                return;
            }

            setFormValues(prevFormValues => ({
                ...prevFormValues,
                [fieldName]: file,
            }));

            if(fieldName === 'profile_picture'){
                setCapturedImage(file);
                drawImageOnCanvas(file);
            }
        }
    };

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await listLocations();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const locations_options = response_data.resp.map((location: any) => ({
                    value: location.id,
                    label: location.name,
                }));

                setLocations(locations_options);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching locations', type: 'danger', timeout: 3000 });
            }
        };

        const fetchTypesIds = async () => {
            try {
                const response = await listTypesIds();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const typesids_options = response_data.resp.map((type: any) => ({
                    value: type.id,
                    label: type.name,
                }));

                setTypesIds(typesids_options);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching types ids', type: 'danger', timeout: 3000 });
            }
        };

        const fetchCountries = async () => {
            try {
                const response = await listCountries();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const countries_options = response_data.resp.map((country: any) => ({
                    value: country.id,
                    label: country.name,
                }));

                setCountries(countries_options);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching countries', type: 'danger', timeout: 3000 });
            }
        };

        const fetchTypeClients = async () => {
            try {
                const response = await listTypesClients();
                const response_data = response.data;

                if (!response_data.success) {
                    addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                    return;
                }

                const typesclients_options: Option[] = response_data.resp.map((type: any) => ({
                    value: type.id,
                    label: type.name,
                }));

                const optionsWithSelect: Option[] = [{ value: '', label: 'Select an option' }, ...typesclients_options];
                setTypesClients(optionsWithSelect);
            } catch (error) {
                addAlert({ id: uuidv4(), text: 'Error fetching types clients', type: 'danger', timeout: 3000 });
            }
        };

        fetchLocations();
        fetchTypesIds();
        fetchCountries();
        fetchTypeClients();
    }, []);

    const handleAddClient = async () => {
        const formData = new FormData();

        Object.entries(formValues).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            } else {
                formData.append(key, '');
            }
        });

        return await addClient(formData);
    };

    const { handleSubmit, isLoading } = useFormSubmit(handleAddClient, addAlert);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await handleSubmit(formValues);
        if (response) {
            const response_data = response.data;
            if (!response_data.success) {
                addAlert({ id: uuidv4(), text: response_data.resp, type: 'danger', timeout: 3000 });
                return;
            }

            addAlert({ id: uuidv4(), text: response_data.resp, type: 'primary', timeout: 3000 });
            onClose();
            handleTableReload();
        }
    };

    const handleToggleVideo = async () => {
        if (isVideoActive) {
            stopVideoStream();
        } else {
            try {                
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setCapturedImage(null);
                }
            } catch (error) {
                console.error('Error al acceder a la cámara:', error);
            }
        }
        setIsVideoActive(!isVideoActive);
    };

    const stopVideoStream = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const takePicture = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'profile_picture.jpg', { type: 'image/jpeg' });
                        setCapturedImage(file);
                        setFormValues(prevFormValues => ({
                            ...prevFormValues,
                            'profile_picture': file,
                        }));
                    }
                }, 'image/jpeg');
            }
        }

        handleToggleVideo();
    };

    const drawImageOnCanvas = (file: File) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = function () {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (canvas && ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width - img.width * scaleFactor) / 2;
                    const y = (canvas.height - img.height * scaleFactor) / 2;

                    ctx.drawImage(img, x, y, img.width * scaleFactor, img.height * scaleFactor);
                }
            };
        };

        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div className='flex space-x-2'>
                <button className={`py-2 px-4 ${'information' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('information')}>
                    Informacion
                </button>
                <button className={`py-2 px-4 ${'details' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('details')}>
                    Detalles
                </button>
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'information' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-20 gap-2'>
                            <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.location} <span className='text-red-500'>*</span></h3>
                            <div className='w-full'>
                                <SelectGroup options={locations} onChange={handleFieldChange('location_id')} />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-10'>
                                <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10'>
                                    <h3 className='text-sm font-semibold  dark:text-gray-100 pl-1'>{translations.identification_type} <span className='text-red-500'>*</span></h3>
                                    <div className='min-w-40'>
                                        <SelectGroup options={typesIds} onChange={handleFieldChange('type_id_id')} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='identification_id'
                                    name='identification_id'
                                    label={translations.identification_id}
                                    icon={<UserIdVerificationIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='alias'
                                    name='alias'
                                    label={translations.alias}
                                    icon={<UserQuestion02Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='occupation'
                                    name='occupation'
                                    label={translations.occupation}
                                    icon={<JobSearchIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='firstname'
                                    name='firstname'
                                    label={translations.firstname}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='middlename'
                                    name='middlename'
                                    label={translations.middlename}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='lastname'
                                    name='lastname'
                                    label={translations.lastname}
                                    icon={<UserAccountIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='second_lastname'
                                    name='second_lastname'
                                    label={translations.second_lastname}
                                    icon={<UserAccountIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='email'
                            name='email'
                            label={translations.email}
                            icon={<Mail01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='mobile'
                                    name='mobile'
                                    label={translations.mobile_number}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='phone'
                                    name='phone'
                                    label={translations.phone_number}
                                    icon={<TelephoneIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <hr className='border dark:border-slate-600 mx-2 my-2' />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-10'>
                                <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10 gap-2'>
                                    <h3 className='text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.country} <span className='text-red-500'>*</span></h3>
                                    <div className='w-full'>
                                        <SelectGroup options={countries} onChange={handleFieldChange('country_id')} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 z-50'>
                                <InputList
                                    id='state'
                                    name='state'
                                    label={translations.address_state}
                                    icon={<MapsLocation01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    endpoint='manage/states'
                                />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-3 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='street'
                                    name='street'
                                    label={translations.street}
                                    icon={<RoadLocation01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='area'
                                    name='area'
                                    label={translations.address_area}
                                    icon={<MosqueLocationIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputList
                                    id='city'
                                    name='city'
                                    label={translations.address_city}
                                    icon={<Location01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    endpoint='manage/cities'
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'details' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='birthdate'
                                    name='birthdate'
                                    label={translations.birthdate}
                                    icon={<Calendar01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='note'
                                    name='note'
                                    label={translations.note}
                                    icon={<Note04Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='flex flex-col col-span-1 gap-2'>
                                <div className='flex h-auto gap-2'>
                                    <div className='flex'>
                                        <button type='button' className='btn h-full px-3' onClick={handleToggleVideo}><ComputerVideoIcon /></button>
                                    </div>
                                    <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                        <label htmlFor='profile_picture' className='text-sm font-semibold dark:text-gray-100'>
                                            {translations.profile_picture_client}
                                        </label>
                                        <input
                                            type='file'
                                            id='profile_picture'
                                            name='profile_picture'
                                            accept='.jpg,.jpeg,.png'
                                            capture='user'
                                            onChange={handleFileChange('profile_picture')}
                                            className='w-full text-sm text-black dark:text-white file:border-0 file:cursor-pointer file:mr-2 file:px-4 file:py-1 file:bg-blue-600 file:rounded-xl file:text-white file:font-bold'
                                        />
                                    </div>
                                </div>                                
                                <div className={`flex flex-col border-2 border-gray-200 rounded-2xl overflow-hidden gap-1 p-1 ${!isVideoActive && !capturedImage ? 'hidden': ''}`}>                                                                     
                                    <video ref={videoRef} className={`rounded-xl ${!isVideoActive ? 'hidden': ''}`} />                                    
                                    <button type='button' onClick={takePicture} className={`btn text-sm h-9 rounded-2xl ${!isVideoActive ? 'hidden': ''}`}>Tomar foto</button>                                    
                                    <div className={`flex flex-col items-center w-full h-full pb-1 gap-2 ${!capturedImage ? 'hidden': ''}`}>
                                        <canvas ref={canvasRef} className='rounded-xl h-56 w-full'></canvas>
                                        <p className='text-sm'><span className='px-2 font-bold'>Imagen capturada:</span> {capturedImage?.name ?? ''}</p>
                                    </div>  
                                </div>
                            </div>                            
                            <div className='col-span-1'>
                                <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                    <label htmlFor='profile_picture' className='text-sm font-semibold dark:text-gray-100'>
                                        {translations.identification_picture_client}
                                    </label>
                                    <input
                                        type='file'
                                        id='identification_picture'
                                        name='identification_picture'
                                        accept='.jpg,.jpeg,.png'
                                        onChange={handleFileChange('identification_picture')}
                                        className='w-full text-sm text-black dark:text-white file:border-0 file:cursor-pointer file:mr-2 file:px-4 file:py-1 file:bg-blue-600 file:rounded-xl file:text-white file:font-bold'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-20 gap-2'>
                            <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.class_client}</h3>
                            <div className='w-full'>
                                <SelectGroup options={typesClients} onChange={handleFieldChange('type_id')} />
                            </div>
                        </div>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10 h-14 pr-5'>
                            <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.allow_credit} <span className='text-red-500'>*</span></h3>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center'>
                                    <input id='allow_credit_1' type='radio' value='1' name='allow_credit' onChange={handleChange(setFormValues)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === '1'} />
                                    <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>Si</label>
                                </div>
                                <div className='flex items-center'>
                                    <input id='allow_credit_2' type='radio' value='0' name='allow_credit' onChange={handleChange(setFormValues)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === '0'} />
                                    <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                        <div className='col-span-1 md:col-end-3 w-full'>
                            <button type='submit' className='btn h-12 max-w-48 float-end' disabled={isLoading}>Agregar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageAddClientPage;