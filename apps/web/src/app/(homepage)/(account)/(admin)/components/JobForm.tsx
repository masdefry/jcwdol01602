import React, { useState } from 'react';
import { createJob, updateJob } from '@/services/admin.service';

const JobForm: React.FC<{ jobData?: any; onSuccess: () => void }> = ({ jobData, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: jobData?.title || '',
    category: jobData?.category || '',
    location: jobData?.location || '',
    salary: jobData?.salary || '',
    isPublished: jobData?.isPublished || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jobData) {
      await updateJob(jobData.id, formData);
    } else {
      await createJob(formData);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-gray-100">
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full p-2 border rounded mb-2" required />
      <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded mb-2" required />
      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded mb-2" required />
      <input type="text" name="salary" value={formData.salary} onChange={handleChange} placeholder="Salary (optional)" className="w-full p-2 border rounded mb-2" />
      <label className="flex items-center mb-2">
        <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={() => setFormData({ ...formData, isPublished: !formData.isPublished })} className="mr-2" />
        Publish Job
      </label>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        {jobData ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
};

export default JobForm;
