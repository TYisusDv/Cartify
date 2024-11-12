import React, { cloneElement, ReactElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search01Icon } from 'hugeicons-react';
import { getTable } from '../services/componentsService';
import Input from "./Input";
import useTranslations from "../hooks/useTranslations";
import { extractMessages } from '../utils/formUtils';
import { generateKey, generateUUID } from '../utils/uuidGen';
import { addAlert } from '../utils/Alerts';

interface Header {
    name: string;
    headerName: string;
}

interface DataRow {
    [key: string]: any;
}

interface TableProps {
    unique?: string;
    endpoint: string;
    header: Header[];
    reloadTable: number;
    tbody: ReactElement;
    filters?: ReactElement;
    order_by?: string;
    order?: string;
    query?: string;
    id?: string | number;
    classNameFilters?: string;
    filters_params?: any;
    show_search?: boolean;
    show_pagination?: boolean;
}

const Table: React.FC<TableProps> = ({ unique, endpoint, header, reloadTable, tbody, filters, order_by = 'id', order = 'desc', query = 'table', id, classNameFilters, filters_params, show_search = true, show_pagination = true }) => {
    const { translations } = useTranslations();
    const [data, setData] = useState<DataRow[]>([]);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [formValues, setFormValues] = useState(() => {
        const savedForm = unique ? sessionStorage.getItem(`table-${unique}`) : null;
        return savedForm ? JSON.parse(savedForm) : { 
            query: query,
            id: id,
            page: 1,
            show: itemsPerPage,
            search: '',
            order_by: order_by,
            order: order,
            filters: filters_params
        };
    });   

    useEffect(() => {
        if(unique){
            sessionStorage.setItem(`table-${unique}`, JSON.stringify(formValues));
        }
    }, [formValues, unique]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTable(endpoint, formValues);
                const response_resp = response.resp;
                setData(response_resp);
                setTotalPages(response.total_pages);
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

        fetchData();
    }, [endpoint, reloadTable, formValues]);

    const handlePageChange = (page: number) => {
        const newFormValues = { ...formValues, page };
        setFormValues(newFormValues);
    };

    const toggleOrder = (column: string) => {
        if (column === '') {
            return;
        }

        const newOrder = formValues.order_by === column && formValues.order === 'asc' ? 'desc' : 'asc';
        const newFormValues = { ...formValues, order_by: column, order: newOrder };
        setFormValues(newFormValues);
    };

    const getOrderIcon = (column: string) => {
        if (formValues.order_by === column) {
            return formValues.order === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    
    useEffect(() => {
        setFormValues((prev: any) => ({ ...prev, filters: filters_params }));
    }, [filters_params]);

    return (
        <div className='flex flex-col gap-2'>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start gap-2 ${classNameFilters}`}>
                {show_search && (
                    <div className='col-span-1 w-full bg-gray-100 dark:bg-slate-700 rounded-2xl'>
                        <Input
                            props={{
                                id: 'search',
                                name: 'search',
                                onChange: (e) => {
                                    const newFormValues = { ...formValues, search: e.target.value };
                                    setFormValues(newFormValues);
                                },
                                value: formValues.search || ''
                            }}
                            label={translations.search}
                            icon={<Search01Icon className='icon' size={20} />}
                            required={false}
                        />
                    </div>
                )}
                {filters && cloneElement(filters, { formValues, setFormValues })}
            </div>
            <div className='flex flex-col w-full'>
                <div className="overflow-x-auto rounded-lg w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="select-none text-sm text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white">
                            <tr>
                                {header.map((header, index) => (
                                    <th
                                        key={generateKey(index)}
                                        scope="col"
                                        className="px-6 py-3 cursor-pointer"
                                        onClick={() => toggleOrder(header.name)}
                                    >
                                        {header.headerName} {getOrderIcon(header.name)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {cloneElement(tbody, { data })}
                    </table>
                </div>
                {show_pagination && (
                    <div className="flex justify-end items-center mt-4">
                        <button
                            onClick={() => handlePageChange(formValues.page - 1)}
                            disabled={formValues.page === 1}
                            className="px-3 py-2 mx-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded-lg"
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-4 py-2 mx-1 ${formValues.page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-600 dark:text-white'} rounded-lg`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(formValues.page + 1)}
                            disabled={formValues.page === totalPages}
                            className="px-3 py-2 mx-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded-lg"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Table;