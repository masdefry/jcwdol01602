'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface TableProps {
    columns: string[];
    itemsPerPage: number;
    datas: Array<Record<string, any>>;
    onStatusChange?: (id: string, status: string) => void;
}

export default function TableDashboard({
    columns,
    datas,
    itemsPerPage,
    onStatusChange,
}: TableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        name: '',
        age: '',
        salary: '',
        education: '',
    });

    const handleFilterChange = (field: string, value: string) => {
        setFilterCriteria({ ...filterCriteria, [field]: value });
        setCurrentPage(1);
    };

    const filteredData = datas.filter((data) => {
        const nameMatch = data.name.toLowerCase().includes(filterCriteria.name.toLowerCase());
        const ageMatch = filterCriteria.age === '' || String(data.age).includes(filterCriteria.age);
        const salaryMatch = filterCriteria.salary === '' || String(data.expectedSalary).includes(filterCriteria.salary);
        const educationMatch = data.education.toLowerCase().includes(filterCriteria.education.toLowerCase());
        const searchMatch = Object.values(data).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLocaleLowerCase())
        );

        return nameMatch && ageMatch && salaryMatch && educationMatch && searchMatch;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="overflow-x-auto">
            <div className="mb-4 mx-2 mt-2 flex flex-wrap gap-2">
                <input
                    type="text"
                    placeholder="Search ..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={filterCriteria.name}
                    onChange={(e) => handleFilterChange('name', e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Age"
                    value={filterCriteria.age}
                    onChange={(e) => handleFilterChange('age', e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Salary"
                    value={filterCriteria.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Education"
                    value={filterCriteria.education}
                    onChange={(e) => handleFilterChange('education', e.target.value)}
                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <table className="w-full text-sm text-left border">
                <thead>
                    <tr className="bg-blue-300 border">
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`px-4 py-2 border ${index === 0 ? 'w-16' : 'min-w-[150px]'}`}
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((data, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <td className="px-4 py-2 w-16"></td>
                            {Object.entries(data)
                                .filter(([key]) => !['id'].includes(key))
                                .map(([key, value], idx) => {
                                    if (key === 'status' && onStatusChange) {
                                        return (
                                            <td key={idx} className="px-4 py-2 border min-w-[150px]">
                                                <select
                                                    value={String(value)}
                                                    onChange={(e) => onStatusChange(data.id, e.target.value)}
                                                    className="border rounded p-1"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="interview">Interview</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td
                                                key={idx}
                                                className="px-4 py-2 border min-w-[150px] max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis"
                                            >
                                                {typeof value === 'function'
                                                    ? value()
                                                    : typeof value === 'boolean'
                                                        ? value
                                                            ? 'Yes'
                                                            : 'No'
                                                        : key === 'photo' && typeof value === 'object' && value !== null
                                                            ? <div className="w-10 h-10 relative">{value}</div>
                                                            : String(value)}
                                            </td>
                                        );
                                    }
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center items-center gap-4 mt-4 mb-2">
                <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
