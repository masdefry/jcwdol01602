'use client';
import { AddBtn, DeleteBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import TableDashboard from '@/components/table/table';
import { Job, Categories, Locations } from '@/types/job';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import JobService from '@/services/job.service';
import useAuthStore from "@/stores/authStores";
import { useRouter } from 'next/navigation';
import FilterSortControls from '@/components/adminDashboard/filterAndSortJob';
import JobModal from '@/components/adminDashboard/jobModal';

interface IJobData {
  id: string;
  title: string;
  location: string;
  applicantsCount: number;
  deadline: string;
}

const AdminDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const account = useAuthStore((state) => state.account);
  const router = useRouter();
  const [filterCategory, setFilterCategory] = useState<Categories | ''>('');
  const [sortColumn, setSortColumn] = useState<'title' | 'deadline' | 'category' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        await JobService.updateJob(editJob.id, values);
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

  const filteredJobs = jobs.filter(job =>
    filterCategory ? job.category === filterCategory : true
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortColumn === 'title') {
      return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    } else if (sortColumn === 'deadline') {
      const dateA = new Date(a.deadline).getTime();
      const dateB = new Date(b.deadline).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortColumn === 'category') {
      return sortDirection === 'asc' ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
    }
    return 0;
  });

  const tableData: IJobData[] = sortedJobs.map(job => ({
    id: job.id,
    title: job.title,
    location: job.location,
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
          {job.isPublished ? 'Unpublish' : 'Published'}
        </button>
      </div>
    ),
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Heading title="Job Management Dashboard" description="Manage all jobs" />
        <AddBtn title="Add Job" runFunction={() => setAddModalOpen(true)} />
      </div>
      <FilterSortControls
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortColumn={sortColumn}
        setSortColumn={setSortColumn}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
      {isLoading ? (
        <p>Loading Jobs...</p>
      ) : (
        <TableDashboard
          columns={[
            'No',
            'Title',
            'Location',
            'Applicants',
            'Deadline',
            'Actions',
          ]}
          datas={tableData}
          itemsPerPage={5}
          onRowClick={(rowData, columnIndex) => {
            if (columnIndex !== 5) {
              router.push(`/adm-dashboard/job/${rowData.id}`);
            }
          }}
        />
      )}
      <JobModal
        editJob={editJob}
        addModalOpen={addModalOpen}
        setAddModalOpen={setAddModalOpen}
        handleNewJob={handleNewJob}
        categories={Object.values(Categories)}
        locations={Object.values(Locations)}
      />
    </div>
  );
};

export default AdminDashboard;
