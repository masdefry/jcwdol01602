'use client';
import React, { useState } from 'react';

interface TableProps {
    columns: string[];
    itemsPerPage: number;
    datas: Array<Record<string, any>>;
    onRowClick?: (rowData: Record<string, any>, columnIndex: number) => void;
}

export default function TableDashboard({
    columns,
    datas,
    itemsPerPage,
    onRowClick,
}: TableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter data based on searchQuery
    const filteredData = datas.filter((data) =>
        Object.values(data).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLocaleLowerCase())
        )
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Calculate first and end index for data slicing
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    // Function to page navigation
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="overflow-x-auto">
            {/* Search bar */}
            <div className="mb-4 mx-2 mt-2">
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
            </div>

            {/* Table */}
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
                            className={`hover:bg-gray-100 cursor-pointer ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                            <td className="px-4 py-2 w-16">{startIndex + index + 1}</td>
                            {Object.entries(data)
                                .filter(([key]) => key !== 'id')
                                .map(([key, value], idx) => (
                                    <td
                                        key={idx}
                                        className="px-2 py-2 border min-w-[150px] max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis"
                                        onClick={() => onRowClick && onRowClick(data, idx + 1)}
                                    >
                                        {typeof value === 'function'
                                            ? value()
                                            : typeof value === 'boolean'
                                                ? value
                                                    ? 'Yes'
                                                    : 'No'
                                                : React.isValidElement(value)
                                                    ? value
                                                    : String(value)}
                                    </td>
                                ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
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
