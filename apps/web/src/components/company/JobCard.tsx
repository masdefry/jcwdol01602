import React from 'react';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    category: string;
    location: string;
    salary?: string;
    deadline?: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-purple-50 p-6 rounded-xl shadow-md transition-transform transform hover:scale-105">
      <div className="border-b border-purple-200 pb-4 mb-4">
        <h3 className="text-xl font-semibold text-purple-800 mb-2">{job.title}</h3>
        <p className="text-sm text-purple-700">
          <span className="font-medium text-purple-600">Category:</span> {job.category}
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-base text-purple-800">
          <span className="font-medium text-purple-600">Location:</span> {job.location}
        </p>
        {job.salary && (
          <p className="text-base text-purple-800">
            <span className="font-medium text-purple-600">Salary:</span> 💰 {job.salary}
          </p>
        )}
        {job.deadline && (
          <p className="text-base text-purple-800">
            <span className="font-medium text-purple-600">Deadline:</span>{' '}
            {new Date(job.deadline).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default JobCard;
