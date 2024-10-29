import React from 'react';
import useTranslations from '../../hooks/useTranslations';
import Input from '../../components/Input';
import { addAlert } from '../../utils/Alerts';
import { generateUUID } from '../../utils/uuidGen';
import { extractMessages } from '../../utils/formUtils';
import { Calendar02Icon, StoreLocation01Icon } from 'hugeicons-react';
import Select from '../../components/Select';

interface CrudProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number | undefined) => void;
    type: string;
    selected_id?: number | undefined;
    formValues: any;
    setFormValues: (search: any) => void;
}

const Crud: React.FC<CrudProps> = ({ onClose, handleTableReload, setSelected, type, formValues, setFormValues }) => {
    const { translations } = useTranslations();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            onClose();
            if (handleTableReload) handleTableReload();
            if (setSelected) setSelected(undefined);
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
        <form autoComplete='off' onSubmit={onSubmit}>
            <div className='flex flex-col gap-2'>                
                <Input
                    props={{
                        id: 'date_1',
                        name: 'date_1',
                        type: 'date',
                        value: formValues?.date_1,
                        onChange: (e) => {
                            setFormValues((prev: any) => ({
                                ...prev,
                                date_1: e.target.value
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='De la fecha'
                    icon={<Calendar02Icon className='icon' size={24} />}
                    required={false}
                    color='yellow'
                />
                <Input
                    props={{
                        id: 'date_2',
                        name: 'date_2',
                        type: 'date',
                        value: formValues?.date_2,
                        onChange: (e) => {
                            setFormValues((prev: any) => ({
                                ...prev,
                                date_2: e.target.value
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='A la fecha'
                    icon={<Calendar02Icon className='icon' size={24} />}
                    required={false}
                    color='yellow'
                />
            </div>
        </form>
    );
};

export default Crud;