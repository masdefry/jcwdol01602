import { useEffect, useState } from 'react';
import { IEmployee } from '@/lib/interface';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

const useWorkerByCompany = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  useEffect(() => {
    const getWorkerByCompany = async () => {
      try {
        const { data } = await axiosInstance.get('/api/worker/by-company');
        setEmployees(data.allWorkerCompany);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getWorkerByCompany();
  }, []);

  return { employees, setEmployees };
};

export default useWorkerByCompany;
