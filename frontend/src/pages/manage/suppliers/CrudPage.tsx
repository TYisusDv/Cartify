import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AlertType } from '../../../types/alert';
import { handleChange } from '../../../utils/formUtils';
import { Supplier } from '../../../types/modelType';
import { addSupplier, deleteSupplier, editSupplier, getSupplier } from '../../../services/suppliersService';
import { Mail01Icon, RoadLocation01Icon, SmartPhone01Icon, TelephoneIcon, UserCircleIcon, UserIdVerificationIcon } from 'hugeicons-react';
import useTranslations from '../../../hooks/useTranslations';
import useFormSubmit from '../../../hooks/useFormSubmit';
import InputGroup from '../../../components/InputGroup';

interface CrudPageProps {
    addAlert: (alert: AlertType) => void;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number) => void;
    type: string;
    selected_id?: number;
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
            if(setSelected) setSelected(0);
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
                                <InputGroup
                                    id='company_name'
                                    name='company_name'
                                    label={translations.name}
                                    icon={<UserCircleIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    value={formValues.company_name || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='company_identification'
                                    name='company_identification'
                                    label='NIT'
                                    icon={<UserIdVerificationIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                    value={formValues.company_identification || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='company_email'
                            name='company_email'
                            label={translations.email}
                            icon={<Mail01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                            value={formValues.company_email || ''}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='company_phone'
                                    name='company_phone'
                                    label={`${translations.phone_number} #1`}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                    value={formValues.company_phone || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='company_phone_2'
                                    name='company_phone_2'
                                    label={`${translations.phone_number} #2`}
                                    icon={<TelephoneIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                    value={formValues.company_phone_2 || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                        </div>
                        <InputGroup
                            id='company_address'
                            name='company_address'
                            label={translations.street}
                            icon={<RoadLocation01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                            value={formValues.company_address || ''}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                    </div>
                    <div className={`flex flex-col gap-2 w-full tab-item ${'advisor' === activeTab ? 'block' : 'hidden'}`}>
                        <InputGroup
                            id='advisor_fullname'
                            name='advisor_fullname'
                            label={translations.name}
                            icon={<UserCircleIcon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                            value={formValues.advisor_fullname || ''}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                        <InputGroup
                            id='advisor_email'
                            name='advisor_email'
                            label={translations.email}
                            icon={<Mail01Icon className='icon' size={24} />}
                            onChange={handleChange(setFormValues)}
                            required={false}
                            value={formValues.advisor_email || ''}
                            color={colorPage}
                            disabled={type === 'details' || type === 'delete' ? true : false}
                        />
                        <div className='grid items-center grid-cols-1 md:grid-cols-2 gap-2'>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='advisor_phone'
                                    name='advisor_phone'
                                    label={`${translations.phone_number} #1`}
                                    icon={<SmartPhone01Icon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                    value={formValues.advisor_phone || ''}
                                    color={colorPage}
                                    disabled={type === 'details' || type === 'delete' ? true : false}
                                />
                            </div>
                            <div className='col-span-1'>
                                <InputGroup
                                    id='advisor_phone_2'
                                    name='advisor_phone_2'
                                    label={`${translations.phone_number} #2`}
                                    icon={<TelephoneIcon className='icon' size={24} />}
                                    onChange={handleChange(setFormValues)}
                                    required={false}
                                    value={formValues.advisor_phone_2 || ''}
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