import React, { cloneElement, ReactElement, useEffect, useState } from "react";
import { Search01Icon } from 'hugeicons-react';
import { handleChange } from '../utils/formUtils';
import { getTable } from '../services/componentsService';
import InputGroup from "./InputGroup";
import useTranslations from "../hooks/useTranslations";

interface Header {
    name: string;
    headerName: string;
}

interface DataRow {
    [key: string]: any;
}

interface TableProps {
    endpoint: string;
    header: Header[];
    reloadTable: number;
    tbody: ReactElement;
    filters?: ReactElement;
}

const Table: React.FC<TableProps> = ({ endpoint, header, reloadTable, tbody, filters }) => {
    const { translations } = useTranslations();
    const [data, setData] = useState<DataRow[]>([]);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState(1);
    const [formValues, setFormValues] = useState({ query: 'table', page: 1, show: itemsPerPage, search: '', order_by: 'id', order: 'desc' });

    useEffect(() => {
        const fetchData = async () => {
            try {                
                const response = await getTable(endpoint, formValues);
                const response_data = response.data;
                if (response_data) {
                    setData(response_data.resp); 
                    setTotalPages(response_data.total_pages);
                }
            } catch (error) {}
        };

        fetchData();
    }, [endpoint, reloadTable, formValues]);

    const handlePageChange = (page: number) => {
        setFormValues(prev => ({
            ...prev,
            page: page
        }));
    };

    const toggleOrder = (column: string) => {
        setFormValues(prev => ({
            ...prev,
            order_by: column,
            order: prev.order_by === column && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getOrderIcon = (column: string) => {
        if (formValues.order_by === column) {
            return formValues.order === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    return (
        <div className='flex flex-col gap-2'>
           <div className='flex items-center gap-2'>
                <div className='w-full max-w-72 h-full bg-gray-100 dark:bg-slate-700 rounded-2xl'>
                    <InputGroup
                        id='search'
                        name='search'
                        label={translations.search}
                        icon={<Search01Icon className='icon' size={20} />}
                        onChange={handleChange({ setFormValues })}
                        required={false}
                    />
                </div>
                {filters && cloneElement(filters, { formValues, setFormValues })}
            </div>
            <div className='flex flex-col w-full'>
                <div className="overflow-x-auto rounded-lg w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="select-none text-sm text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white">
                            <tr>
                                {header.map((header) => (
                                    <th 
                                        key={header.name} 
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
            </div>
        </div>
    );
};


export default Table;