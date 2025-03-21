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
import useJobsByCompanyId from '@/hooks/useCompanyJob';
import JobCard from '@/components/company/JobCard';

const CompanyPage = () => {
  const { account } = useAuthStore();
  const { subsData } = useUserSubsData();
  const { companyId } = useParams() as { companyId: string };
  const { company } = useCompanyProfileById(companyId);
  const { reviews, setReviews } = useShowCompReview(companyId);
  const [openNewReview, setOpenNewReview] = useState<boolean>(false);
  const { jobs, loading: jobsLoading, error: jobsError } = useJobsByCompanyId(companyId);

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
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
          <div className="flex gap-6 items-start">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-purple-300">
              <Image
                src={company.account.avatar}
                alt={`${company.account.name}' avatar`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold text-purple-800">{company.account.name}</h1>
                <p className="text-gray-600">{company.account.email}</p>
                <p className="text-gray-700">{company.phone || 'No phone number provided'}</p>
                <p className="text-gray-700">{company.address || 'No address provided'}</p>
                <p className="text-gray-700">{company.website || 'No website provided'}</p>
                <p className="text-gray-700">{company.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          {/* Job Card Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">Jobs at {company.account.name}</h2>
            {jobsLoading && <p className="text-gray-600">Loading jobs...</p>}
            {jobsError && <p className="text-red-600">Error loading jobs: {jobsError}</p>}
            {jobs && jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No jobs available at this company.</p>
            )}
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
