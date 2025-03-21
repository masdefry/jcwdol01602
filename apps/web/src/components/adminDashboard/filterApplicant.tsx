'use client';
import React from 'react';
import { ApplicantStatus } from '@prisma/client';

interface FilterSortControlsProps {
  filterEducation: string | '';
  setFilterEducation: (education: string | '') => void;
  filterAgeRange: string | '';
  setFilterAgeRange: (ageRange: string | '') => void;
  filterSalaryRange: string | '';
  setFilterSalaryRange: (salaryRange: string | '') => void;
  filterStatus: ApplicantStatus | '';
  setFilterStatus: (status: ApplicantStatus | '') => void;
  filterPriority: boolean | '';
  setFilterPriority: (status: boolean | '') => void;
}

const FilterApplicant: React.FC<FilterSortControlsProps> = ({
  filterEducation,
  setFilterEducation,
  filterAgeRange,
  setFilterAgeRange,
  filterSalaryRange,
  setFilterSalaryRange,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <select
        value={filterEducation}
        onChange={(e) => setFilterEducation(e.target.value)}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="" className="text-gray-700">Education</option>
        <option value="doctorate" className="text-gray-700">Doctorate</option>
        <option value="master" className="text-gray-700">Master</option>
        <option value="bachelor" className="text-gray-700">Bachelor</option>
        <option value="highschool" className="text-gray-700">Highschool</option>
      </select>

      <select
        value={filterAgeRange}
        onChange={(e) => setFilterAgeRange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="" className="text-gray-700">Age</option>
        <option value="18-24" className="text-gray-700">18-24</option>
        <option value="25-34" className="text-gray-700">25-34</option>
        <option value="35-44" className="text-gray-700">35-44</option>
        <option value="45+" className="text-gray-700">45+</option>
      </select>

      <select
        value={filterSalaryRange}
        onChange={(e) => setFilterSalaryRange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="" className="text-gray-700">Salary</option>
        <option value="<10000000" className="text-gray-700">&lt; 10,000,000</option>
        <option value="10000000-20000000" className="text-gray-700">10,000,000 - 20,000,000</option>
        <option value=">20000000" className="text-gray-700">&gt; 20,000,000</option>
        <option value="null" className="text-gray-700">Not Stated</option>
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as ApplicantStatus | '')}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="" className="text-gray-700">Status</option>
        <option value="pending" className="text-gray-700">Pending</option>
        <option value="interview" className="text-gray-700">Interview</option>
        <option value="accepted" className="text-gray-700">Accepted</option>
        <option value="rejected" className="text-gray-700">Rejected</option>
      </select>
      <select
        value={filterPriority === true ? 'true' : filterPriority === false ? 'false' : ''}
        onChange={(e) => setFilterPriority(e.target.value === 'true' ? true : e.target.value === 'false' ? false : '')}
        className="px-4 py-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-purple-50 text-purple-800"
      >
        <option value="" className="text-gray-700">Priority</option>
        <option value="true" className="text-gray-700">Priority</option>
        <option value="false" className="text-gray-700">Not Priority</option>
      </select>
    </div>
  );
};

export default FilterApplicant;
