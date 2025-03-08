import { useState, useEffect } from "react";
import { fetchJobs } from "@/services/job.service";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
  onEdit: (id: string) => void;
  onDelete: (jobId: string) => Promise<void>;
}

const JobList: React.FC<JobListProps> = ({ jobs, onEdit, onDelete }) => {
  const [filterText, setFilterText] = useState("");

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(filterText.toLowerCase()) ||
    job.category.toLowerCase().includes(filterText.toLowerCase()) ||
    job.location.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Job List</h2>
      <input
        type="text"
        placeholder="Filter jobs..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      {filteredJobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Published</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id}>
                <td className="border px-4 py-2">{job.title}</td>
                <td className="border px-4 py-2">{job.category}</td>
                <td className="border px-4 py-2">{job.location}</td>
                <td className="border px-4 py-2">{job.isPublished ? "Yes" : "No"}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => onEdit(job.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobList;
