import { useEffect, useState } from 'react';
import { ICompanyById, ICompanyData } from '@/lib/interface';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

const useCompanyProfileById = (companyId: string) => {
  const [company, setCompany] = useState<ICompanyById>();
  useEffect(() => {
    const getCompanyDataById = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/company/data/${companyId}`,
        );
        setCompany(data.company);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getCompanyDataById();
  }, [companyId]);

  return { company };
};

export default useCompanyProfileById;
