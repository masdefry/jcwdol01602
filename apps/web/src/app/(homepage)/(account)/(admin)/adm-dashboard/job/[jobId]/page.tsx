'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { ApplicantStatus } from '@prisma/client';
import TableDashboard2 from '@/components/table/table2';
import { Heading } from '@/components/heading';
import toast from 'react-hot-toast';
import Image from 'next/image';
import ApplicantDetailModal from '@/components/adminDashboard/applicantDetailModal';
import { Applicant, IApplicantData } from '@/types/applicantDetail';
import { format, differenceInYears } from 'date-fns';
import FilterApplicant from '@/components/adminDashboard/filterApplicant';
import { rupiahFormat } from '@/lib/stringFormat';

const JobApplicants = () => {
  const router = useRouter();
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterEducation, setFilterEducation] = useState<string | ''>('');
  const [filterAgeRange, setFilterAgeRange] = useState<string | ''>('');
  const [filterSalaryRange, setFilterSalaryRange] = useState<string | ''>('');
  const [filterStatus, setFilterStatus] = useState<ApplicantStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<boolean | ''>('');

  useEffect(() => {
    console.log('JobId from useParams:', jobId);
    if (jobId) {
      fetchApplicants();
    } else {
      console.error("JobId is undefined");
    }
  }, [jobId]);

  useEffect(() => {
    applyFilters();
  }, [applicants, filterEducation, filterAgeRange, filterSalaryRange, filterStatus, filterPriority]);

  const fetchApplicants = async () => {
    try {
      const apiUrl = `/api/applicant/job/${jobId}`;
      console.log("JobApplicants: Sending GET request to:", apiUrl);
      const { data } = await axiosInstance.get(apiUrl);
      console.log("JobApplicants: Fetched applicants:", data.applicants);

      const applicantsWithPriority = data.applicants.map((applicant: Applicant) => ({
        ...applicant,
        subsData: {
          ...applicant.subsData,
          isPriority: applicant.subsData.subsCtg?.priority,
        },
      }));

      setApplicants(applicantsWithPriority);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.dismiss();
      toast.error(errorMessage || "Failed to fetch applicants. Please try again.");
      setError(errorMessage || "Failed to fetch applicants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...applicants];

    if (filterPriority !== '') {
      filtered = filtered.filter((applicant) => applicant.subsData.subsCtg?.priority === filterPriority);
    }

    if (filterEducation) {
      filtered = filtered.filter((applicant) =>
        applicant.subsData.userEdu[0]?.level === filterEducation
      );
    }

    if (filterAgeRange) {
      filtered = filtered.filter((applicant) => {
        if (applicant.subsData.userProfile?.dob) {
          const age = differenceInYears(new Date(), new Date(applicant.subsData.userProfile.dob));
          if (filterAgeRange === '18-24') {
            return age >= 18 && age <= 24;
          } else if (filterAgeRange === '25-34') {
            return age >= 25 && age <= 34;
          } else if (filterAgeRange === '35-44') {
            return age >= 35 && age <= 44;
          } else if (filterAgeRange === '45+') {
            return age >= 45;
          }
        }
        return false;
      });
    }

    if (filterSalaryRange) {
      filtered = filtered.filter((applicant) => {
        const expectedSalary = applicant.expectedSalary;

        if (filterSalaryRange === '<10000000') {
          return expectedSalary !== null && expectedSalary !== undefined && expectedSalary < 10000000;
        } else if (filterSalaryRange === '10000000-20000000') {
          return expectedSalary !== null && expectedSalary !== undefined && expectedSalary >= 10000000 && expectedSalary <= 20000000;
        } else if (filterSalaryRange === '>20000000') {
          return expectedSalary !== null && expectedSalary !== undefined && expectedSalary > 20000000;
        } else if (filterSalaryRange === 'null') {
          return expectedSalary === null || expectedSalary === undefined;
        }
        return true;
      });
    }

    if (filterStatus) {
      filtered = filtered.filter((applicant) => applicant.status === filterStatus);
    }

    setFilteredApplicants(filtered);
  };

  const handleUpdateStatus = async (
    applicantId: string,
    status: ApplicantStatus
  ) => {
    try {
      const apiUrl = `/api/applicant/${applicantId}`;
      console.log("JobApplicants: Sending PATCH request to", apiUrl, "with status:", status);
      const { data } = await axiosInstance.patch(apiUrl, { status });
      console.log("JobApplicants:JobApplicants: Received response:", data.applicant);
      setApplicants((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.id === applicantId ? { ...applicant, status } : applicant
        )
      );
      toast.success('Applicant status updated successfully.');
    } catch (error: any) {
      console.error('JobApplicants: Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update applicant status.');
      toast.error(error.response?.data?.message || 'Failed to update applicant status.');
    }
  };

  const tableData: IApplicantData[] = filteredApplicants.map((applicant) => ({
    id: applicant.id,
    photo: (
      <div className="relative flex items-center">
        <Image
          src={applicant.subsData?.accounts?.avatar || '/avatar_default.jpg'}
          alt="Applicant Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        {applicant.subsData.subsCtg?.priority && (
          <span className="absolute bg-yellow-400 text-white text-[8px] px-0.5 py-0.25 rounded-full top-[-5px] left-[35px]">
            Priority
          </span>
        )}
      </div>
    ),
    name: applicant.subsData.accounts.name,
    email: applicant.subsData.accounts.email,
    education: applicant.subsData.userEdu[0]?.level || 'N/A',
    expectedSalary: rupiahFormat(applicant.expectedSalary),
    status: applicant.status,
  }));

  const handleRowClick = (applicant: Applicant, columnName: string) => {
    if (columnName !== 'Status') {
      setSelectedApplicant(applicant);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Heading title="Applicants" description="Manage all applicants" />
      </div>
      <FilterApplicant
        filterEducation={filterEducation}
        setFilterEducation={setFilterEducation}
        filterAgeRange={filterAgeRange}
        setFilterAgeRange={setFilterAgeRange}
        filterSalaryRange={filterSalaryRange}
        setFilterSalaryRange={setFilterSalaryRange}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />
      {loading ? (
        <p>Loading Applicants...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableDashboard2
          columns={[
            'No',
            'Photo',
            'Name',
            'Email',
            'Education',
            'Expected Salary',
            'Status',
          ]}
          datas={tableData}
          itemsPerPage={5}
          onStatusChange={(id, status) => handleUpdateStatus(id, status as ApplicantStatus)}
          onRowClick={(rowData, columnIndex) => {
            if (columnIndex !== 7) {
              const applicant = applicants.find((a) => a.id === rowData.id);
              if (applicant) {
                setSelectedApplicant(applicant);
                setIsModalOpen(true);
              }
            }
          }}
        />
      )}
      {selectedApplicant && (
        <ApplicantDetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          applicant={selectedApplicant}
        />
      )}
    </div>
  );
};

export default JobApplicants;
