'use client';
import { AddBtn, DeleteBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalCreate from '@/components/table/modalCreate';
import TableDashboard from '@/components/table/table';
import { Job } from '@/types/job';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import JobService from '@/services/job.service';
import useAuthStore from "@/stores/authStores";

interface IJobData {
  id: string;
  title: string;
  location: string;
  salaryRange?: string;
  applicantsCount: number;
  deadline: string;
}

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const account = useAuthStore((state) => state.account);

  const getJobList = async () => {
    setIsLoading(true);
    try {
      if (!account || !account.id) {
        setIsLoading(false);
        return;
      }
      const jobData = await JobService.getAllJobs(account.id);
      setJobs(jobData);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch jobs.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobList();
  }, [account]);

  const handleDelete = async (jobId: string) => {
    try {
      if (!account || !account.id) return;
      await JobService.deleteJob(jobId, account.id);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success('Job deleted successfully.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete job.';
      toast.error(errorMessage);
    }
  };

  const handleNewJob = async (values: Omit<Job, 'id'>) => {
    try {
      if (!account || !account.id) return;
      if (editJob) {
        await JobService.updateJob(editJob.id, values, account.id);
        setJobs((prev) =>
          prev.map((job) => (job.id === editJob.id ? { ...job, ...values } : job))
        );
        toast.success('Job updated successfully.');
      } else {
        await JobService.createJob(values, account.id);
        getJobList();
        toast.success('Job created successfully.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to perform job operation.';
      toast.error(errorMessage);
    } finally {
      setAddModalOpen(false);
      setEditJob(null);
    }
  };

  const handleTogglePublish = async (jobId: string, isPublished: boolean) => {
    try {
      if (!account || !account.id) return;
      await JobService.togglePublish(jobId, account.id);
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, isPublished: !isPublished } : job))
      );
      toast.success(`Job ${isPublished ? 'unpublished' : 'published'} successfully.`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to toggle publish status.';
      toast.error(errorMessage);
    }
  };

  const tableData: IJobData[] = jobs.map(job => ({
    id: job.id,
    title: job.title,
    location: job.location,
    salaryRange: job.salaryRange,
    applicantsCount: job.applicants.length,
    deadline: new Date(job.deadline).toLocaleDateString(),
    actions: () => (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setEditJob(job);
            setAddModalOpen(true);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <DeleteBtn runFunction={() => handleDelete(job.id)} />
        <button
          onClick={() => handleTogglePublish(job.id, job.isPublished)}
          className={`px-3 py-1 rounded ${job.isPublished ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
        >
          {job.isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    ),
  }));

  const initialValues: Omit<Job, 'id'> = editJob
    ? {
        ...editJob,
        deadline: editJob.deadline ? editJob.deadline.split('T')[0] : '',
        createdAt: editJob.createdAt,
      }
    : {
        title: '',
        description: '',
        category: '',
        location: '',
        salaryRange: '',
        deadline: '',
        companyId: '',
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicants: [],
      };

  const fields = [
    { name: 'title', label: 'Title', type: 'text' as const },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'category', label: 'Category', type: 'text' as const },
    { name: 'location', label: 'Location', type: 'text' as const },
    { name: 'salaryRange', label: 'Salary Range', type: 'text' as const },
    { name: 'deadline', label: 'Deadline', type: 'date' as const },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Heading title="Job Management Dashboard" description="Manage all jobs" />
        <AddBtn title="Add Job" runFunction={() => setAddModalOpen(true)} />
      </div>
      {isLoading ? (
        <p>Loading Jobs...</p>
      ) : (
        <TableDashboard
          columns={[
            'No',
            'Title',
            'Location',
            'Salary',
            'Applicants',
            'Deadline',
            'Actions',
          ]}
          datas={tableData}
          itemsPerPage={5}
        />
      )}
      {addModalOpen && (
        <ModalCreate
          title={editJob ? 'Edit Job' : 'Create New Job'}
          initialValues={initialValues}
          onSubmit={handleNewJob}
          isOpen={addModalOpen}
          setIsOpen={setAddModalOpen}
          disabled={false}
          fields={fields}
          validationSchema={undefined}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
