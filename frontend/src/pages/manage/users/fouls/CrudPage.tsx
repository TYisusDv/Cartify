import React, { useEffect, useState } from 'react';
import { Absence, SalePayment } from '../../../../types/modelType';
import { Calendar01Icon, Calendar02Icon, CreditCardIcon, Note01Icon, NoteIcon, PercentCircleIcon, StoreLocation01Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import Input from '../../../../components/Input';
import { addAlert } from '../../../../utils/Alerts';
import { generateUUID } from '../../../../utils/uuidGen';
import { extractMessages } from '../../../../utils/formUtils';
import { addAbsence, deleteAbsence, editAbsence, getAbsence } from '../../../../services/Absences';
import { UTCToLocalTimeInput } from '../../../../utils/DateFuncs';

interface CrudPageProps {
    queryID: number | undefined;
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number | undefined) => void;
    type: string;
    selected_id?: number | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ queryID, onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<Absence>({ id: selected_id, user_id: queryID });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudPageProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getAbsence(formValues);
                    const response_resp = response.resp;

                    setFormValues({...response_resp, user_id: queryID, date_reg: UTCToLocalTimeInput(response_resp.date_reg)});
                } catch (error) {}
            };

            fetchGet();
        }
    }, [type, selected_id]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {            
            let response_resp;
            if (type === 'add') {
                const response = await addAbsence(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editAbsence(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete') {
                const response = await deleteAbsence(formValues);
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
            <div className='flex flex-col gap-2 w-full'>                
                <Input
                    props={{
                        id: 'note',
                        name: 'note',
                        value: formValues.note,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            note: e.target.value || ''
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Nota'
                    icon={<NoteIcon className='icon' size={24} />}
                    color={colorPage}
                />
                <Input
                    props={{
                        id: 'date_reg',
                        name: 'date_reg',
                        value: formValues.date_reg,
                        type: 'date',
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            date_reg: e.target.value
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Fecha de registro'
                    icon={<Calendar01Icon className='icon' size={24} />}
                    color={colorPage}
                />
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
    );
};

export default CrudPage;