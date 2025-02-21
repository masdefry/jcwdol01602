import React, { useEffect, useState } from 'react';
import { fetchJobs, deleteJob } from '@/services/admin.service';
import JobCard from './JobCard';
const JobList: React.FC<{ onEdit: (id: string) => void }> = ({ onEdit }) => {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  const handleDelete = async (id: string) => {
    await deleteJob(id);
    loadJobs();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default JobList;
