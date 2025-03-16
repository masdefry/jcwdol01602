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
}) => {
  return (
    <div className="flex space-x-4 mb-4">
      <select
        value={filterEducation}
        onChange={(e) => setFilterEducation(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Education</option>
        <option value="doctorate">Doctorate</option>
        <option value="master">Master</option>
        <option value="bachelor">Bachelor</option>
        <option value="highschool">Highschool</option>
      </select>

      <select
        value={filterAgeRange}
        onChange={(e) => setFilterAgeRange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Age</option>
        <option value="18-24">18-24</option>
        <option value="25-34">25-34</option>
        <option value="35-44">35-44</option>
        <option value="45+">45+</option>
      </select>

      <select
        value={filterSalaryRange}
        onChange={(e) => setFilterSalaryRange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Salary</option>
        <option value="<10000000">&lt; 10,000,000</option>
        <option value="10000000-20000000">10,000,000 - 20,000,000</option>
        <option value=">20000000">&gt; 20,000,000</option>
        <option value="null">Not Stated</option>
      </select>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as ApplicantStatus | '')}
        className="border p-2 rounded"
      >
        <option value="">Status</option>
        <option value="pending">Pending</option>
        <option value="interview">Interview</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
};

export default FilterApplicant;
