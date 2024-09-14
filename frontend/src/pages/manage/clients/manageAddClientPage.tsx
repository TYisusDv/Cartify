import React, { useEffect, useRef, useState } from 'react';
import { Add01Icon, Calendar01Icon, ComputerVideoIcon, Delete02Icon, JobSearchIcon, Location01Icon, Mail01Icon, MapsLocation01Icon, MosqueLocationIcon, Note04Icon, RoadLocation01Icon, SmartPhone01Icon, TelephoneIcon, UserAccountIcon, UserCircleIcon, UserIdVerificationIcon, UserQuestion02Icon } from 'hugeicons-react';
import { handleChange, handleSelectChange } from '../../../utils/formUtils';
import { AlertType } from '../../../types/alert';
import { v4 as uuidv4 } from 'uuid';
import { addClient } from '../../../services/clientsService';
import { Client, ClientContact, Person } from '../../../types/modelType';
import useTranslations from '../../../hooks/useTranslations';
import InputGroup from '../../../components/InputGroup';
import SelectGroup from '../../../components/SelectGroup';
import useFormSubmit from '../../../hooks/useFormSubmit';
import InputList from '../../../components/InputList';
import Modal from '../../../components/Modal';
import useMedia from '../../../hooks/useMedia';

interface ManageAddClientProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload: () => void;
}

const ManageAddClientPage: React.FC<ManageAddClientProps> = ({ addAlert, onClose, handleTableReload }) => {       
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Client>({'allow_credit': true});
    const [activeTab, setActiveTab] = useState<string>('information');
    const {
        isVideoActive: isVideoActiveProfile,
        startVideo: startVideoProfile,
        stopVideo: stopVideoProfile,
        takePicture: takePictureProfile,
        videoRef: videoRefProfile,
        capturedImages: capturedImagesProfile,
        setCapturedImages: setCapturedImagesProfile,
        canvasRef: canvasRefProfile,
    } = useMedia({ addAlert });    
    const inputProfilePicture = useRef<HTMLInputElement | null>(null);   
    const {
        isVideoActive: isVideoActiveDocuments,
        startVideo: startVideoDocuments,
        stopVideo: stopVideoDocuments,
        takePicture: takePictureDocuments,
        videoRef: videoRefDocuments,
        capturedImages: capturedImagesDocuments,
        setCapturedImages: setCapturedImagesDocuments,
        canvasRef: canvasRefDocuments,
    } = useMedia({ addAlert });   
    const inputDocumentsPicture = useRef<HTMLInputElement | null>(null);   
    const [contacts, setContacts] = useState<ClientContact[]>([]);
    const [isModalOpen, setIsModalOpen] = useState({ contacts: false });
    const [formContactValues, setFormContactValues] = useState<ClientContact>({});

    const handleToggleVideoProfile = () => {
        setCapturedImagesProfile([]);

        if(isVideoActiveProfile){
            stopVideoProfile();
        } else {            
            startVideoProfile();
        }
    }

    const handleToggleVideoDocuments = () => {
        if(isVideoActiveDocuments){
            stopVideoDocuments();
        } else {            
            startVideoDocuments();
        }
    }

    const deleteProfilePicture = () => {
        setCapturedImagesProfile([]);
        if (inputProfilePicture.current) {
            inputProfilePicture.current.value = '';
        }

        setFormValues(prevFormValues => ({
            ...prevFormValues,
            'profile_picture': null,
        }));
    }

    const deleteDocuments = () => {
        setCapturedImagesDocuments([]);
        if (inputDocumentsPicture.current) {
            inputDocumentsPicture.current.value = '';
        }

        setFormValues(prevFormValues => ({
            ...prevFormValues,
            'identification_pictures': [],
        }));
    }

    const toggleModal = (modalType: 'contacts', isOpen: boolean) => {
        setIsModalOpen(prev => ({ ...prev, [modalType]: isOpen }));
    };

    const handleFileChange = (objectField: keyof Client, nestedField?: keyof Person) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (files) {
            const filteredFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

            if (filteredFiles.length === 0) {
                alert('Please upload files in .jpg or .png format.');
                event.target.value = '';
                return;
            }
            
            if (objectField === 'person' && nestedField === 'profile_picture') {
                const file = files[0];
                stopVideoProfile();
                setCapturedImagesProfile([]);
                setCapturedImagesProfile(prev => [...prev, file]);
            } else {
                stopVideoDocuments();
                setCapturedImagesDocuments(prev => [...prev, ...Array.from(files)]);
            }
        }
    };

    const handleAddClient = async () => {
        const formData = new FormData();
    
        Object.entries(formValues).forEach(([key, value]) => {
            if (value instanceof FileList) {
                Array.from(value).forEach((file, index) => {
                    formData.append(`${key}[${index}]`, file);
                });
            } else if (value instanceof Array) {
                value.forEach((item, index) => {
                    if (typeof item === 'object') {
                        formData.append(`${key}[${index}]`, JSON.stringify(item));
                    } else {
                        formData.append(`${key}[${index}]`, item);
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                formData.append(key, JSON.stringify(value));
            } else if (value !== null && value !== undefined) {
                formData.append(key, value.toString());
            } else {
                formData.append(key, '');
            }
        });

        Array.from(capturedImagesProfile).forEach((file, index) => {
            formData.append('profile_picture', file);
        });

        Array.from(capturedImagesDocuments).forEach((file, index) => {
            formData.append(`identification_pictures[${index}]`, file);
        });
    
        formData.append('contacts', JSON.stringify(contacts));
    
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

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setContacts([...contacts, formContactValues]);

        toggleModal('contacts', false)
    };

    return (
        <div>
            <div className='flex space-x-2 overflow-x-auto'>
                <button className={`py-2 px-4 ${'information' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('information')}>
                    Informacion
                </button>
                <button className={`py-2 px-4 ${'details' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('details')}>
                    Detalles
                </button>
                <button className={`py-2 px-4 ${'contacts' === activeTab ? 'font-bold text-blue-500 border-b-2 border-blue-500' : 'text-gray-800 dark:text-slate-200 hover:text-blue-500'}`} onClick={() => setActiveTab('contacts')}>
                    Contactos
                </button>
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'information' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-20 gap-2'>
                            <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.location} <span className='text-red-500'>*</span></h3>
                            <div className='w-full'>
                                <SelectGroup endpoint='manage/locations' name='location.id' onChange={handleSelectChange(setFormValues)} />
                            </div>
                        </div>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1 z-10'>
                                <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10'>
                                    <h3 className='text-sm font-semibold  dark:text-gray-100 pl-1'>{translations.identification_type} <span className='text-red-500'>*</span></h3>
                                    <div className='min-w-40'>
                                        <SelectGroup endpoint='manage/typesids' name='person.type_id.id' onChange={handleSelectChange(setFormValues)} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='identification_id'
                                    name='person.identification_id'
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
                                    name='person.alias'
                                    label={translations.alias}
                                    icon={<UserQuestion02Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='occupation'
                                    name='person.occupation'
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
                                    name='person.firstname'
                                    label={translations.firstname}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='middlename'
                                    name='person.middlename'
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
                                    name='person.lastname'
                                    label={translations.lastname}
                                    icon={<UserAccountIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='second_lastname'
                                    name='person.second_lastname'
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
                                    name='person.mobile'
                                    label={translations.mobile_number}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='phone'
                                    name='person.phone'
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
                                        <SelectGroup endpoint='manage/countries' name='person.addresses[0].city.state.country.id' onChange={handleSelectChange(setFormValues)} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-span-1 z-50'>
                                <InputList
                                    id='state'
                                    name='person.addresses[0].city.state.name'
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
                                    name='person.addresses[0].street'
                                    label={translations.street}
                                    icon={<RoadLocation01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='area'
                                    name='person.addresses[0].area'
                                    label={translations.address_area}
                                    icon={<MosqueLocationIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputList
                                    id='city'
                                    name='person.addresses[0].city.name'
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
                                    type='date'
                                    name='person.birthdate'
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
                                        <button type='button' className='btn h-full px-3' onClick={handleToggleVideoProfile}><ComputerVideoIcon /></button>
                                    </div>
                                    <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                        <label htmlFor='profile_picture' className='text-sm font-semibold dark:text-gray-100'>
                                            {translations.profile_picture_client}
                                        </label>
                                        <input
                                            ref={inputProfilePicture}
                                            type='file'
                                            id='profile_picture'
                                            name='profile_picture'
                                            accept='.jpg,.jpeg,.png'
                                            capture='user'
                                            onChange={handleFileChange('person', 'profile_picture')}
                                            className='w-full text-sm text-black dark:text-white file:border-0 file:cursor-pointer file:mr-2 file:px-4 file:py-1 file:bg-blue-600 file:rounded-xl file:text-white file:font-bold'
                                        />
                                    </div>
                                </div>
                                <div className={`flex flex-col border-2 border-gray-200 rounded-2xl overflow-hidden gap-1 p-1 dark:border-slate-600 ${!isVideoActiveProfile && capturedImagesProfile.length <= 0 ? 'hidden' : ''}`}>
                                    <video ref={videoRefProfile} className={`rounded-xl ${!isVideoActiveProfile ? 'hidden' : ''}`} />
                                    <button type='button' onClick={takePictureProfile} className={`btn text-sm h-9 rounded-2xl ${!isVideoActiveProfile ? 'hidden' : ''}`}>Tomar foto</button>
                                    <div className={`flex flex-col items-center w-full h-full pb-1 gap-2 ${capturedImagesProfile.length <= 0  ? 'hidden' : ''}`}>
                                        <canvas ref={canvasRefProfile} className='rounded-xl h-56 w-full'></canvas>
                                        <p className='flex flex-col items-center text-sm dark:text-white'>
                                            <span className='px-2 font-bold'>Imagen capturada:</span> 
                                            {capturedImagesProfile[0]?.name} 
                                        </p>
                                    </div>
                                </div>
                                <div className='flex w-full'>
                                    <button type='button' className='flex items-center justify-center w-full text-bold h-9 bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={deleteProfilePicture}><Delete02Icon /></button>
                                </div>
                            </div>
                            <div className='flex flex-col col-span-1 gap-2'>
                                <div className='flex h-auto gap-2'>
                                    <div className='flex'>
                                        <button type='button' className='btn h-full px-3' onClick={handleToggleVideoDocuments}><ComputerVideoIcon /></button>
                                    </div>
                                    <div className='flex flex-col border-2 border-gray-200 rounded-2xl p-3 dark:border-slate-600 w-full gap-2'>
                                        <label htmlFor='profile_picture' className='text-sm font-semibold dark:text-gray-100'>
                                            {translations.identification_pictures_client}
                                        </label>
                                        <input
                                            ref={inputDocumentsPicture}
                                            type='file'
                                            id='identification_pictures'
                                            name='identification_pictures'
                                            accept='.jpg,.jpeg,.png'
                                            multiple={true}
                                            onChange={handleFileChange('person')}
                                            className='w-full text-sm text-black dark:text-white file:border-0 file:cursor-pointer file:mr-2 file:px-4 file:py-1 file:bg-blue-600 file:rounded-xl file:text-white file:font-bold'
                                        />
                                    </div>
                                </div>
                                <div className={`flex flex-col border-2 border-gray-200 rounded-2xl overflow-hidden gap-1 p-1 dark:border-slate-600 ${!isVideoActiveDocuments && capturedImagesDocuments.length <= 0 ? 'hidden' : ''}`}>
                                    <video ref={videoRefDocuments} className={`rounded-xl ${!isVideoActiveDocuments ? 'hidden' : ''}`} />
                                    <button type='button' onClick={takePictureDocuments} className={`btn text-sm h-9 rounded-2xl ${!isVideoActiveDocuments ? 'hidden' : ''}`}>Tomar foto</button>
                                    <div className={`flex flex-col items-center w-full pb-1 gap-2 ${capturedImagesDocuments.length <= 0 ? 'hidden' : ''}`}>
                                        <canvas ref={canvasRefDocuments} className={`rounded-xl h-56 w-full ${isVideoActiveDocuments ? 'hidden' : ''}`}></canvas>
                                        <p className='flex flex-col items-center text-sm dark:text-white'>
                                            <span className='px-2 font-bold'>
                                                Imagenes capturadas:
                                            </span>
                                            {capturedImagesDocuments.map((image, index) => (
                                                <span key={index}>{image.name}</span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex w-full'>
                                    <button type='button' className='flex items-center justify-center w-full text-bold h-9 bg-red-600 text-white border-2 border-red-600 hover:bg-red-600/20 hover:text-red-600 disabled:bg-gray-200 disabled:border-gray-200 disabled:text-black dark:hover:bg-red-600/40 dark:disabled:bg-slate-600 dark:disabled:border-slate-600 dark:disabled:text-white rounded-full p-3' onClick={deleteDocuments}><Delete02Icon /></button>
                                </div>
                            </div>
                        </div>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-20 gap-2'>
                            <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.class_client}</h3>
                            <div className='w-full'>
                                <SelectGroup endpoint='manage/clienttypes' name='type.id' onChange={handleSelectChange(setFormValues)} />
                            </div>
                        </div>
                        <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-10 h-14 pr-5'>
                            <h3 className='text-sm font-semibold dark:text-gray-100 pl-1'>{translations.allow_credit} <span className='text-red-500'>*</span></h3>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center'>
                                    <input id='allow_credit_1' type='radio' value='1' name='allow_credit' onChange={handleChange(setFormValues)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === true || formValues.allow_credit === '1'} />
                                    <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>Si</label>
                                </div>
                                <div className='flex items-center'>
                                    <input id='allow_credit_2' type='radio' value='0' name='allow_credit' onChange={handleChange(setFormValues)} className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600' checked={formValues.allow_credit === false || formValues.allow_credit === '0'} />
                                    <label htmlFor='allow_credit_1' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'contacts' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='flex gap-1'>
                            <button type='button' className='btn text-sm h-auto w-12 rounded-2xl' onClick={() => { toggleModal('contacts', true) }}><Add01Icon /></button>
                            <div className='overflow-x-auto rounded-lg w-full'>
                                <table className='w-full text-sm text-left'>
                                    <thead className='text-xs text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white'>
                                        <tr>
                                            <th scope='col' className='px-6 py-3'>
                                                Tipo
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Parentezco
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Nombre completo
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Direccion
                                            </th>
                                            <th scope='col' className='px-6 py-3'>
                                                Numero de telefono
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {contacts.map((contact, index) => (
                                            <tr key={index} className='text-xs text-gray-800 bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-700/80'>
                                                <td className='px-6 py-4'>{contact.type?.name}</td>
                                                <td className='px-6 py-4'>{contact.relationship}</td>
                                                <td className='px-6 py-4'>{contact.fullname}</td>
                                                <td className='px-6 py-4'>{contact.address}</td>
                                                <td className='px-6 py-4'>{contact.phone}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                        <div className='col-span-1 md:col-end-3 w-full'>
                            <button type='submit' className='btn h-12 max-w-48 float-end' disabled={isLoading}>{translations.add}</button>
                        </div>
                    </div>
                </form>
            </div>
            {isModalOpen.contacts && (
                <Modal title={translations.add_contact} onClose={() => toggleModal('contacts', false)}>
                    <form autoComplete='off' onSubmit={handleContactSubmit}>
                        <div className='flex flex-col gap-2 w-full tab-item'>
                            <div className='flex border-2 border-gray-200 rounded-2xl p-2 dark:border-slate-600 items-center justify-between w-full z-20 gap-2'>
                                <h3 className='w-auto text-sm font-semibold text-nowrap dark:text-gray-100 pl-1'>{translations.type} <span className='text-red-500'>*</span></h3>
                                <div className='w-full'>
                                    <SelectGroup endpoint='manage/contacttypes' name='type.id' onChange={handleSelectChange(setFormContactValues)} />
                                </div>
                            </div>
                            <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                                <div className='col-span-1'>
                                    <InputGroup
                                        id='contact_relationship'
                                        name='relationship'
                                        label={translations.relationship}
                                        icon={<UserQuestion02Icon className='icon' size={24} />}
                                        onChange={handleChange(setFormContactValues)}
                                        required={true}
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <InputGroup
                                        id='contact_fullname'
                                        name='fullname'
                                        label={translations.fullname}
                                        icon={<UserCircleIcon className='icon' size={24} />}
                                        onChange={handleChange(setFormContactValues)}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                                <div className='col-span-1'>
                                    <InputGroup
                                        id='contact_phone'
                                        name='phone'
                                        label={translations.phone_number}
                                        icon={<TelephoneIcon className='icon' size={24} />}
                                        onChange={handleChange(setFormContactValues)}
                                        required={true}
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <InputGroup
                                        id='contact_address'
                                        name='address'
                                        label={translations.street}
                                        icon={<RoadLocation01Icon className='icon' size={24} />}
                                        onChange={handleChange(setFormContactValues)}
                                        required={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 mt-2'>
                            <div className='col-span-1 md:col-end-3 w-full'>
                                <button type='submit' className='btn h-12 max-w-48 float-end' disabled={isLoading}>{translations.add}</button>
                            </div>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default ManageAddClientPage;