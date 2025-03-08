import React, { useState } from 'react';
import { createJob, updateJob } from '@/services/job.service';

interface JobFormProps {
  jobData?: any;
  onSuccess: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ jobData, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: jobData?.title || '',
    description: jobData?.description || '',
    category: jobData?.category || '',
    location: jobData?.location || '',
    salaryRange: jobData?.salaryRange || '',
    deadline: jobData?.deadline ? new Date(jobData.deadline).toISOString().substring(0, 10) : '',
    isPublished: jobData?.isPublished || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (jobData) {
        await updateJob(jobData.id, formData);
      } else {
        await createJob(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('JobForm submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-100">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="w-full p-2 border rounded mb-2"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Job Description"
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 border rounded mb-2"
        required
      />
      <input
        type="text"
        name="salaryRange"
        value={formData.salaryRange}
        onChange={handleChange}
        placeholder="Salary Range (optional)"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="w-full p-2 border rounded mb-2"
      />
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleCheckboxChange}
          className="mr-2"
        />
        Publish Job
      </label>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {jobData ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
};

export default JobForm;
