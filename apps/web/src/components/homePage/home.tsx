'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { IJobHomePage, IJobsData } from '@/lib/interface2';
import { useRouter } from 'next/navigation';
import HomeJobCard from './HomeJobCard';
import ButtonCustom from '../button/btn';
import { ResetBtn } from '../button/moreBtn';
import ApplyModal from '../applyModal';
import useAuthStore from '@/stores/authStores';

const Home = () => {
  const { account } = useAuthStore();
  const [jobsData, setJobsData] = useState<IJobsData>({
    jobs: [],
    pagination: { currentPage: 1, totalPages: 1, totalJobs: 0 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;
  const router = useRouter();
  const [locations, setLocations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<string | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJobHomePage>();

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

  const handleApplyBtn = async (jobId: string, expectedSalary: number) => {
    if (!account) {
      toast.error('Please login first!');
      return;
    }
    try {
      const { data } = await axiosInstance.post('api/applicant/apply', {
        jobId,
        expectedSalary,
      });
      toast.success(data.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Failed to apply for the job!';
      toast.error(errorMessage);
    }
  };

  const handleOpenDetail = (job: IJobHomePage) => {
    setIsModalOpen(true);
    setSelectedJob(job);
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
              <HomeJobCard
                key={job.id}
                job={job}
                onApply={() => handleOpenDetail(job)}
              />
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
      {isModalOpen && selectedJob && (
        <ApplyModal
          job={selectedJob}
          setIsOpen={setIsModalOpen}
          runFunction={(expectedSalary) =>
            handleApplyBtn(selectedJob.id, expectedSalary)
          }
        />
      )}
    </div>
  );
};

export default Home;
