// components/FilterSortControls.tsx
'use client';
import React from 'react';

interface FilterSortControlsProps {
  filterCategory: string;
  setFilterCategory: (category: string) => void;
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
    <div className="flex space-x-4 mb-4">
      <input
        type="text"
        placeholder="Filter by Category"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="border p-2 rounded"
      />
      <select
        value={sortColumn || ''}
        onChange={(e) => {
          setSortColumn(e.target.value as 'title' | 'deadline' | 'category' | null);
          setSortDirection('asc');
        }}
        className="border p-2 rounded"
      >
        <option value="">Sort By</option>
        <option value="title">Title</option>
        <option value="deadline">Deadline</option>
        <option value="category">Category</option>
      </select>
      {sortColumn && (
        <button
          onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          className="border p-2 rounded"
        >
          {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      )}
    </div>
  );
};

export default FilterSortControls;
