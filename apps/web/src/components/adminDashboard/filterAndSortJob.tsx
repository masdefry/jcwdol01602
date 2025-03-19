'use client';
import React from 'react';
import { Categories } from '@/types/job';

interface FilterSortControlsProps {
  filterCategory: Categories | '';
  setFilterCategory: (category: Categories | '') => void;
  sortColumn: 'title' | 'deadline' | 'category' | null;
  setSortColumn: (column: 'title' | 'deadline' | 'category' | null) => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (direction: 'asc' | 'desc') => void;
}

const FilterSortControls: React.FC<FilterSortControlsProps> = ({
  filterCategory,
  setFilterCategory,
  sortColumn,
  setSortColumn,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value as Categories | '')}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="">Category</option>
        {Object.values(Categories).map((category) => (
          <option key={category} value={category} className="text-gray-700">
            {category}
          </option>
        ))}
      </select>
      <select
        value={sortColumn || ''}
        onChange={(e) => {
          setSortColumn(e.target.value as 'title' | 'deadline' | 'category' | null);
          setSortDirection('asc');
        }}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="">Sort By</option>
        <option value="title" className="text-gray-700">Title</option>
        <option value="deadline" className="text-gray-700">Deadline</option>
        <option value="category" className="text-gray-700">Category</option>
      </select>
      {sortColumn && (
        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          className="px-4 py-2 rounded-lg border border-purple-300 bg-purple-200 text-purple-700 hover:bg-purple-300 transition-colors duration-200"
        >
          {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      )}
    </div>
  );
};

export default FilterSortControls;
