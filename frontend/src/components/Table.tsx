import React, { useState } from "react";
import { Search01Icon } from 'hugeicons-react';
import { handleChange } from '../utils/formUtils';
import InputGroup from "./InputGroup";

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
}

const Table: React.FC<TableProps> = ({ endpoint, header }) => {
    const [formValues, setFormValues] = useState({ search: '' });
    const [data, setData] = useState<DataRow[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = 2;

    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between gap-2'>
                <div className='w-full max-w-72 bg-gray-100 dark:bg-slate-700 rounded-2xl'>
                    <InputGroup
                        id='search'
                        name='search'
                        label='Search'
                        icon={<Search01Icon className='icon' size={20} />}
                        onChange={handleChange(setFormValues)}
                    />
                </div>
            </div>
            <div className='flex flex-col w-full'>
                <div className="relative overflow-x-auto rounded-lg w-full">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm text-black uppercase bg-gray-200 dark:bg-slate-600 dark:text-white">
                            <tr>
                                {header.map((header) => (
                                    <th key={header.name} scope="col" className="px-6 py-3">
                                        {header.headerName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index} className="text-sm text-gray-800 bg-gray-100 dark:bg-slate-700 dark:text-slate-200">
                                    {header.map((header) => (
                                        <td key={header.name} className="px-6 py-4">
                                            {row[header.name]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end items-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 mx-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded-lg"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-4 py-2 mx-1 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-600 dark:text-white'} rounded-lg`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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