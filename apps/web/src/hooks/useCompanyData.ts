import { useEffect, useState } from 'react';
import { ICompanyData } from '@/lib/interface';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

const useCompanyData = () => {
  const [companies, setCompanies] = useState<ICompanyData[]>([]);

  useEffect(() => {
    const getCompanyData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/account/company');
        setCompanies(data.company);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getCompanyData();
  }, []);

  return { companies };
};

export default useCompanyData;
