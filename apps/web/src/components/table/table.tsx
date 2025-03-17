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

  const filteredData = datas.filter((data) =>
    Object.values(data).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLocaleLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 mx-2 mt-2">
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
              className={`hover:bg-purple-50 cursor-pointer transition-colors duration-200 border-b border-purple-200`}
            >
              <td className="px-4 py-3 w-16 text-gray-700">{startIndex + index + 1}</td>
              {Object.entries(data)
                .filter(([key]) => key !== 'id')
                .map(([key, value], idx) => (
                  <td
                    key={idx}
                    className="px-2 py-3 border-l border-purple-200 min-w-[150px] max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis text-gray-700"
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
