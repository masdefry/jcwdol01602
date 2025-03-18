import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { ISubsData } from '@/lib/interface';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStores';

const useUserSubsData = () => {
  const { account } = useAuthStore();
  const [subsData, setSubsData] = useState<ISubsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserSubsData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/subscription/my-data');
      setSubsData(data.subsData);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to fetch subscription data';
      toast.dismiss();
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (account) getUserSubsData();
  }, [account, getUserSubsData]);

  return { subsData, loading, error, refreshSubsData: getUserSubsData };
};

export default useUserSubsData;
