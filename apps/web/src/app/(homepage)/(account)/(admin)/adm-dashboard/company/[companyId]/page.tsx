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
;


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
      )}
    </>
  );
};

export default CompanyPage;
