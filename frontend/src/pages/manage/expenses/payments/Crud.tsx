import React, { useEffect, useState } from 'react';
import { ExpensePayments } from '../../../../types/modelType';
import { BarCode02Icon } from 'hugeicons-react';
import useTranslations from '../../../../hooks/useTranslations';
import Input from '../../../../components/Input';
import { addAlert } from '../../../../utils/Alerts';
import { generateUUID } from '../../../../utils/uuidGen';
import { extractMessages } from '../../../../utils/formUtils';
import Select from '../../../../components/Select';
import { addExpensePayments, deleteExpensePayments, editExpensePayments, getExpensePayments } from '../../../../services/ExprensePayments';

interface CrudProps {
    onClose: () => void;
    handleTableReload?: () => void;
    setSelected?: (value: number | undefined) => void;
    type: string;
    selected_id?: number | undefined;
    expenseId?: string | undefined;
}

const Crud: React.FC<CrudProps> = ({ onClose, handleTableReload, setSelected, type, selected_id, expenseId }) => {
    const { translations } = useTranslations();
    const [formValues, setFormValues] = useState<ExpensePayments>({ id: selected_id, expense_id: expenseId });
    const [colorPage, setColorPage] = useState<'blue' | 'orange' | 'red' | 'yellow'>('blue');

    useEffect(() => {
        const colorMapping: { [key in CrudProps['type']]: string } = {
            delete: 'red',
            details: 'orange',
            edit: 'yellow',
            add: 'blue',
        };
        setColorPage(colorMapping[type] as 'blue' | 'orange' | 'red' | 'yellow');

        if ((type === 'details' || type === 'delete' || type === 'edit') && selected_id) {
            const fetchGet = async () => {
                try {
                    const response = await getExpensePayments(formValues);
                    const response_resp = response.resp;

                    setFormValues({ ...response_resp, expense_id: expenseId, product_id: response_resp.product.id });
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
                const response = await addExpensePayments(formValues);
                response_resp = response?.resp;
            } else if (type === 'edit') {
                const response = await editExpensePayments(formValues);
                response_resp = response?.resp;
            } else if (type === 'delete' && selected_id) {
                const response = await deleteExpensePayments(formValues);
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
                        id: 'amount',
                        name: 'amount',
                        value: formValues.amount,
                        min: 0,
                        onChange: (e) => setFormValues(prev => ({
                            ...prev,
                            amount: !isNaN(parseFloat(e.target.value)) ? parseFloat(e.target.value) : 0
                        })),
                        disabled: ['details', 'delete'].includes(type)
                    }}
                    label='Monto'
                    icon={'Q'}
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

export default Crud;