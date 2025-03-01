import { useApplicantStore } from "@/stores/applicantStore";
import { useState } from 'react';

interface Props {
  jobId: string;
}

const FilterBar: React.FC<Props> = ({ jobId }) => {
  const { fetchApplicants } = useApplicantStore();
  const [filters, setFilters] = useState({ name: '', minAge: '', maxAge: '', education: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex gap-2">
      <input name="name" placeholder="Name" className="border p-2" onChange={handleChange} />
      <input name="minAge" placeholder="Min Age" className="border p-2" onChange={handleChange} />
      <input name="maxAge" placeholder="Max Age" className="border p-2" onChange={handleChange} />
      <input name="education" placeholder="Education" className="border p-2" onChange={handleChange} />
      <button onClick={() => fetchApplicants(jobId, filters)} className="bg-blue-500 text-white p-2">
        Filter
      </button>
    </div>
  );
};

export default FilterBar;
