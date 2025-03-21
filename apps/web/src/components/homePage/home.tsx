'use client';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MapPinIcon, TagIcon, BanknotesIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { IJobsData } from '@/lib/interface2';
import { useRouter } from 'next/navigation';
import HomeJobCard from './HomeJobCard';
import ButtonCustom from '../button/btn';
import { ResetBtn } from '../button/moreBtn';

const Home = () => {
  const [jobsData, setJobsData] = useState<IJobsData>({
    jobs: [],
    pagination: { currentPage: 1, totalPages: 1, totalJobs: 0 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;
  const router = useRouter();
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<string | ''>('');

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const respLocations = await axiosInstance.get(
          '/api/job/locations-data',
        );
        const respCategories = await axiosInstance.get(
          '/api/job/categories-data',
        );
        setLocations(respLocations.data.locations);
        setCategories(respCategories.data.categories);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    fetchEnums();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [currentPage, selectedLocation, selectedCategory]);

  const fetchJobs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(selectedLocation && { location: selectedLocation }),
        ...(selectedCategory && { category: selectedCategory }),
      });

      const { data } = await axiosInstance.get(
        `/api/job/all-jobs?${queryParams}`,
      );
      setJobsData(data);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Error fetching jobs';
      toast.error(errorMessage);
    }
  };

  const handleApplyBtn = (jobId: string) => {
    router.push(`/${jobId}`);
  };

  const applyFilter = () => {
    setCurrentPage(1);
    fetchJobs();
  };

  const resetFilter = () => {
    setSelectedLocation('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  return (
    <div className="">
      <div className="bg-gradient-to-br from-fuchsia-500 to-purple-500 p-4 shadow-md">
        <h1 className="text-white font-bold text-2xl flex gap-1 justify-center">
          Find Jobs with Dream Jobs<span className="text-yellow-400">!</span>{' '}
          #MoreCertain
        </h1>
      </div>
      {/* Filter */}
      <div className="flex flex-row bg-slate-100 p-2 justify-between items-center">
        <div className="flex flex-row gap-2">
          <select
            className="border-2 p-1 rounded-lg"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            {locations.map((location, idx) => (
              <option value={location} key={idx}>
                {location}
              </option>
            ))}
          </select>
          <select
            className="border-2 p-1 rounded-lg"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category, idx) => (
              <option value={category} key={idx}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row gap-2">
          <ButtonCustom btnName="Apply Filter" onClick={applyFilter} />
          <ResetBtn title="Reset Filter" runFunction={resetFilter} />
        </div>
      </div>

      {/* Card */}
      {!jobsData ? (
        <div className="flex w-full">loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {jobsData.jobs.map((job) => (
              <HomeJobCard key={job.id} job={job} onApply={handleApplyBtn} />
              //   <div
              //     key={idx}
              //     className="border-2 bg-white p-2 rounded-lg shadow-md mx-1 my-2"
              //   >
              //     <div className="flex flex-row gap-2">
              //       <div className="w-14 h-14 relative bg-blue-200">
              //         <Image
              //           src={job.company.account.avatar}
              //           fill
              //           alt="company_avt.jpg"
              //         />
              //       </div>
              //       <div>
              //         <h1 className="font-semibold text-lg">{job.title}</h1>

              //         <p>{job.company.account.name}</p>
              //       </div>
              //     </div>
              //     <p className="text-slate-400 flex flex-row gap-1 items-center">
              //       <TagIcon width={20} height={20} />
              //       {capitalizeFirstLetter(job.category)}
              //     </p>
              //     <p className="flex flex-row gap-1 items-center">
              //       <MapPinIcon width={20} height={20} /> {job.location}
              //     </p>
              //     <p className="flex flex-row gap-1 items-center">
              //       <BanknotesIcon width={20} height={20} />±
              //       {rupiahFormat(Number(job.salaryRange))}
              //     </p>
              //     <div className="w-full flex justify-end">
              //       <ButtonCustom
              //         btnName="Apply Now"
              //         onClick={() => handleApplyBtn(job.id)}
              //       />
              //     </div>
              //   </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {jobsData.pagination.currentPage} of{' '}
              {jobsData.pagination.totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              disabled={currentPage === jobsData.pagination.totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
