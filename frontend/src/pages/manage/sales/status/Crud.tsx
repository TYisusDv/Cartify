import React, { useEffect, useState } from 'react';
import { SaleStatus } from '../../../../types/modelType';
import useTranslations from '../../../../hooks/useTranslations';
import Input from '../../../../components/Input';
import { addAlert } from '../../../../utils/Alerts';
import { generateUUID } from '../../../../utils/uuidGen';
import { extractMessages } from '../../../../utils/formUtils';
import { CursorPointer01Icon } from 'hugeicons-react';
import Switch from '../../../../components/Switch';
import { addSaleStatus, deleteSaleStatus, editSaleStatus, getSaleStatus } from '../../../../services/SaleStatus';

interface CrudPageProps { 
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number | undefined) => void;
    type: string;
    selected_id?: number | undefined;
}

const CrudPage: React.FC<CrudPageProps> = ({ onClose, handleTableReload, setSelected, type, selected_id }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<SaleStatus>({ id: selected_id, calculate: true });
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
                    const response = await getSaleStatus(formValues);
                    const response_resp = response.resp;
                    setFormValues(response_resp);
                } catch (error) {
                }
            };

            fetchGet();
        }
    }, [type, selected_id]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let response_resp;
            if (type === 'add') {
                const response = await addSaleStatus(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editSaleStatus(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete') {
                const response = await deleteSaleStatus(formValues);
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
            <div className='flex flex-col gap-2'>
                <Input
                    props={{
                        id: 'name',
                        name: 'name',
                        value: formValues.name,
                        onChange: (e) => {
                            setFormValues(prev => ({
                                ...prev,
                                name: e.target.value
                            }));
                        },
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label={translations.name}
                    icon={<CursorPointer01Icon className='icon' size={24} />}
                    required={false}
                    color={colorPage}
                />
                <Switch
                    props={{
                        id: 'calculate',
                        name: 'calculate',
                        checked: !!(formValues.calculate === true || formValues.calculate === 1 || formValues.calculate === '1'),
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            calculate: e.target.checked ? true : false
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Permite calcular?'
                    color={colorPage}
                />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-3'>
                <div className='col-span-1 md:col-end-3 w-full mt-2'>
                    {(type === 'delete' || type === 'edit' || type === 'add') && (
                        <button type='submit' className={`btn btn-${colorPage} max-w-full h-12`}>
                            {translations[type]}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default CrudPage;