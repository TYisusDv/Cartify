import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { Supplier } from '../../../types/modelType';
import { addSupplier, deleteSupplier, editSupplier, getSupplier } from '../../../services/suppliersService';
import { Mail01Icon, RoadLocation01Icon, SmartPhone01Icon, TelephoneIcon, UserCircleIcon, UserIdVerificationIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
import Input from '../../../components/Input';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: string) => void;
    type: string;
    selected_id?: string;
}

const CrudPage: React.FC<CrudPageProps> = ({ addAlert, onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Supplier>({id: selected_id});
    const [activeTab, setActiveTab] = useState<'company' | 'advisor'>('company');
    const [colorPage, setColorPage] = useState<string>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudPageProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type]);

        if((type === 'details' || type === 'delete' || type === 'edit') && selected_id){
            const fetchGet = async () => {
                try {
                    const response = await getSupplier(selected_id);
                    const response_data = response.data;

                    if (!response_data.success) {
                        addAlert({ id: uuidv4(), text: response_data.message, type: 'danger', timeout: 3000 });
                        return;
                    }

                    setFormValues(response_data?.resp);
                } catch (error) {
                    addAlert({ id: uuidv4(), text: 'Error fetching supplier', type: 'danger', timeout: 3000 });
                }
            };

            fetchGet();
        }
    }, [type, addAlert, selected_id]);

    const handleForm = async () => {
        if (type === 'add') return addSupplier(formValues);
        if (type === 'edit') return editSupplier(formValues);
        if (type === 'delete' && selected_id) return deleteSupplier(selected_id);
    };

    const { handleSubmit, isLoading } = useFormSubmit(handleForm, addAlert);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await handleSubmit(formValues);
        
        if(response){
            if (!response?.data?.success) {
                addAlert({ id: uuidv4(), text: response?.data?.resp, type: 'danger', timeout: 3000 });
                return;
            }
            
            addAlert({ id: uuidv4(), text: response?.data?.resp, type: 'primary', timeout: 3000 });
            onClose();
            if(handleTableReload) handleTableReload();
            if(setSelected) setSelected('');
        }        
    };

    return (
        <div>
            <div className="flex space-x-2 overflow-x-auto">
                {['company', 'advisor'].map(tab => (
                    <button
                        key={tab}
                        className={`tab ${tab === activeTab ? `tab-active tab-${colorPage}` : `hover:tab-${colorPage}`}`}
                        onClick={() => setActiveTab(tab as 'company' | 'advisor')}
                    >
                        {translations[tab]}
                    </button>
                ))}
            </div>
            <div className='mt-4'>
                <form autoComplete='off' onSubmit={onSubmit}>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'company' === activeTab ? 'block' : 'hidden'}`}>
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'company_name',
                                        name: 'company_name',
                                        value: formValues.company_name,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            company_name: e.target.value || ''
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }} 
                                    label={translations.name}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    color={colorPage}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'company_identification',
                                        name: 'company_identification',
                                        value: formValues.company_identification,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            company_identification: e.target.value || ''
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label='NIT'
                                    icon={<UserIdVerificationIcon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        <Input
                            props={{
                                id: 'company_email',
                                name: 'company_email',
                                value: formValues.company_email,
                                onChange: (e) => setFormValues(prev => ({
                                    ...prev,
                                    company_email: e.target.value || ''
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
                                        id: 'company_phone',
                                        name: 'company_phone',
                                        value: formValues.company_phone,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            company_phone: e.target.value || ''
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={`${translations.phone_number} #1`}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'company_phone_2',
                                        name: 'company_phone_2',
                                        value: formValues.company_phone_2,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            company_phone_2: e.target.value || ''
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={`${translations.phone_number} #2`}
                                    icon={<TelephoneIcon className='icon' size={24} />}                                    
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                        </div>
                        <Input
                            props={{
                                id: 'company_address',
                                name: 'company_address',
                                value: formValues.company_address,
                                onChange: (e) => setFormValues(prev => ({
                                    ...prev,
                                    company_address: e.target.value || ''
                                })),
                                disabled: ['details', 'delete'].includes(type)
                            }}                            
                            label={translations.street}
                            icon={<RoadLocation01Icon className='icon' size={24} />}                            
                            color={colorPage}
                            required={false}
                        />
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'advisor' === activeTab ? 'block' : 'hidden'}`}>
                        <Input
                            props={{
                                id: 'advisor_fullname',
                                name: 'advisor_fullname',
                                value: formValues.advisor_fullname,
                                onChange: (e) => setFormValues(prev => ({
                                    ...prev,
                                    advisor_fullname: e.target.value || ''
                                })),
                                disabled: ['details', 'delete'].includes(type)
                            }}   
                            label={translations.name}
                            icon={<UserCircleIcon className='icon' size={24} />}
                            color={colorPage}
                            required={false}
                        />
                        <Input
                            props={{
                                id: 'advisor_email',
                                name: 'advisor_email',
                                value: formValues.advisor_email,
                                onChange: (e) => setFormValues(prev => ({
                                    ...prev,
                                    advisor_email: e.target.value || ''
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
                                        id: 'advisor_phone',
                                        name: 'advisor_phone',
                                        value: formValues.advisor_phone,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            advisor_phone: e.target.value || ''
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={`${translations.phone_number} #1`}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}                                    
                                    color={colorPage}
                                    required={false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <Input
                                    props={{
                                        id: 'advisor_phone_2',
                                        name: 'advisor_phone_2',
                                        value: formValues.advisor_phone_2,
                                        onChange: (e) => setFormValues(prev => ({
                                            ...prev,
                                            advisor_phone_2: e.target.value || ''
                                        })),
                                        disabled: ['details', 'delete'].includes(type)
                                    }}
                                    label={`${translations.phone_number} #2`}
                                    icon={<TelephoneIcon className='icon' size={24} />}                                    
                                    color={colorPage}
                                    required={false}
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