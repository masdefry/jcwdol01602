import { useEffect, useState } from 'react';
import { ICompReview } from '@/lib/interface2';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

const useShowCompReview = (companyId: string) => {
  const [reviews, setReviews] = useState<ICompReview[]>([]);

  useEffect(() => {
    const getCompanyReviews = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/company/reviews/${companyId}`,
        );
        setReviews(data.compReview);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getCompanyReviews();
  }, []);

  return { reviews, setReviews };
};

export default useShowCompReview;
