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
          className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
        />
      </div>

      <table className="w-full text-sm text-left border border-purple-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 border-b border-purple-700 ${
                  index === 0 ? 'w-16' : 'min-w-[150px]'
                }`}
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
              className="cursor-pointer hover:bg-purple-50 transition-colors duration-200 border-b border-purple-200"
              onClick={(e) => {
                if (onRowClick && e.target instanceof HTMLTableCellElement) {
                  const columnIndex = e.target.cellIndex;
                  onRowClick(data, columnIndex);
                }
              }}
            >
              <td className="px-4 py-3 w-16 text-gray-700"></td>
              {Object.entries(data)
                .filter(([key]) => !['id'].includes(key))
                .map(([key, value], idx) => {
                  if (key === 'status' && onStatusChange) {
                    return (
                      <td key={idx} className="px-4 py-3 border-l border-purple-200">
                        <select
                          value={String(value)}
                          onChange={(e) =>
                            onStatusChange(data.id, e.target.value)
                          }
                          className="border border-purple-300 rounded p-1 bg-purple-50 text-gray-700 focus:ring-purple-500 focus:border-purple-500"
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
                        className="px-4 py-3 border-l border-purple-200 min-w-[150px] max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis text-gray-700"
                      >
                        {typeof value === 'function'
                          ? value()
                          : typeof value === 'boolean'
                          ? value
                            ? 'Yes'
                            : 'No'
                          : key === 'photo' &&
                            typeof value === 'object' &&
                            value !== null
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
          className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg disabled:opacity-50 hover:bg-purple-300 transition-colors duration-200"
        >
          Prev
        </button>
        <span className="text-purple-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-purple-200 text-purple-700 rounded-lg disabled:opacity-50 hover:bg-purple-300 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
