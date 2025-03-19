'use client';
import React, { useState } from 'react';

interface TableProps {
    columns: string[];
    itemsPerPage: number;
    datas: Array<Record<string, any>>;
    onStatusChange?: (id: string, status: string) => void;
    onRowClick?: (rowData: Record<string, any>, columnIndex: number) => void;
}

export default function TableDashboard({
    columns,
    datas,
    itemsPerPage,
    onStatusChange,
    onRowClick,
}: TableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = datas.filter((data) => {
        const searchMatch = Object.values(data).some((value) =>
            String(value)?.toLowerCase().includes(searchQuery.toLocaleLowerCase())
        );
        return searchMatch;
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
                            onClick={(e) => {
                                if (onRowClick && e.target instanceof HTMLTableCellElement) {
                                    const columnIndex = e.target.cellIndex;
                                    onRowClick(data, columnIndex);
                                }
                            }}
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
