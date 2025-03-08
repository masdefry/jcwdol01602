"use client";

import React, { useState, useEffect } from 'react';
import JobList from '../../../../../components/adminDashboard/JobList';
import JobForm from '../../../../../components/adminDashboard/JobForm';
import { fetchJobs, deleteJob } from '@/services/job.service';
import useAuthStore from "@/stores/authStores";
import { Job } from '@/types/job';

const AdminDashboard: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    const loadJobs = async () => {
      if (!account || !account.id) {
        setError('User not authenticated or account ID missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const jobsData = await fetchJobs(account.id);
        setJobs(jobsData);
      } catch (err) {
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [account]); // Depend on account to refetch when it changes

  const handleEdit = (id: string) => {
    const jobToEdit = jobs.find(job => job.id === id);
    if (jobToEdit) {
      setSelectedJob(jobToEdit);
      setShowForm(true);
    }
  };

  const handleSuccess = () => {
    setSelectedJob(null);
    setShowForm(false);
    reloadJobs();
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      reloadJobs();
    } catch (error) {
      setError('Failed to delete job. Please try again.');
    }
  };

  const reloadJobs = async () => {
    if (account && account.id) {
      try {
        const updatedJobs = await fetchJobs(account.id);
        setJobs(updatedJobs);
      } catch {
        setError('Failed to reload jobs.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Management Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        + Add Job
      </button>

      {showForm && <JobForm jobData={selectedJob} onSuccess={handleSuccess} />}

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <JobList jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AdminDashboard;
