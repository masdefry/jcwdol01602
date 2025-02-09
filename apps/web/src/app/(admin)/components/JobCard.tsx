import React from 'react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    category: string;
    location: string;
    salary?: string;
    isPublished: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-sm text-gray-600">{job.category} - {job.location}</p>
      {job.salary && <p className="text-sm text-gray-500">💰 {job.salary}</p>}
      <p className={`text-sm ${job.isPublished ? 'text-green-500' : 'text-red-500'}`}>
        {job.isPublished ? 'Published' : 'Unpublished'}
      </p>
      <div className="mt-2">
        <button onClick={() => onEdit(job.id)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">
          Edit
        </button>
        <button onClick={() => onDelete(job.id)} className="px-3 py-1 bg-red-500 text-white rounded">
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
