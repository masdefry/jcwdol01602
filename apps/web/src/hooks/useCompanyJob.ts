import { useEffect, useState } from 'react';

import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

interface IJobData {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  salaryRange?: string;
  deadline?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const useJobsByCompanyId = (companyId: string | null) => {
  const [jobs, setJobs] = useState<IJobData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!companyId) {
        setJobs([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get(`/api/job/user/${companyId}`);
        setJobs(data);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Failed to fetch jobs.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [companyId]);

  return { jobs, loading, error };
};

export default useJobsByCompanyId;
