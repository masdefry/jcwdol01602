'use client';
import AddReviewBox from '@/components/compReview/addReviewBox';
import useCompanyProfileById from '@/hooks/useCompanyProfile';
import useUserSubsData from '@/hooks/userSubsData';
import useShowCompReview from '@/hooks/useShowCompReview';
import axiosInstance from '@/lib/axios';
import { ICompReviewForm } from '@/lib/interface';
import useAuthStore from '@/stores/authStores';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ReviewSection from '@/components/compReview/compReview';

const CompanyPage = () => {
  const { account } = useAuthStore();
  const { subsData } = useUserSubsData();
  const { companyId } = useParams() as { companyId: string };
  const { company } = useCompanyProfileById(companyId);
  const { reviews, setReviews } = useShowCompReview(companyId);
  const [openNewReview, setOpenNewReview] = useState<boolean>(false);

  const handleAddReview = () => {
    if (!account) {
      return toast.error('Please login first');
    }
    if (!subsData) {
      return toast.error('Please login first');
    }
    const worker = subsData.worker.find(
      (worker) => worker.companyId === companyId,
    );
    if (!worker) {
      return toast.error('You are not associated with this company');
    }
    if (!worker.isVerified) {
      return toast.error(
        'Your working experience is not verified by your company',
      );
    }

    setOpenNewReview(true);
  };

  const handleNewReview = async (values: ICompReviewForm) => {
    try {
      // console.log(`Values : ${JSON.stringify(values)}`);
      const { data } = await axiosInstance.post(
        `/api/company/add-review/${companyId}`,
        values,
      );
      toast.success(data.message);
      setTimeout(() => setOpenNewReview(false), 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };
  return (
    <>
      {!company ? (
        <div>Loading data</div>
      ) : (
        <div className="p-2">
          <div className="flex gap-2">
            <div className="relative bg-blue-400 border-2 border-black w-32 h-32 overflow-clip">
              <Image
                src={company.account.avatar}
                alt={`${company.account.name}' avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">{company.account.name}</h1>
              <p className="text-slate-400">{company.account.email}</p>
              <p>{company.phone}</p>
              <p>{company.address ? company.address : ''}</p>
              <p>{company.website ? company.website : ''}</p>
              <p>{company.description ? company.description : ''}</p>
            </div>
          </div>
          <ReviewSection reviews={reviews} handleAddReview={handleAddReview} />
        </div>
      )}
      {company && openNewReview && (
        <AddReviewBox
          setIsOpen={setOpenNewReview}
          runFunction={handleNewReview}
          companyName={company.account.name}
        />
      )}
    </>
  );
};

export default CompanyPage;
