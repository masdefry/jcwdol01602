"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/stores/authStores";
import TableDashboard from "@/components/table/table";
import { Heading } from "@/components/heading";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

interface InterviewSchedule {
  id: string;
  applicantId: string;
  startTime: Date;
  endTime: Date;
  location: string | null;
  notes: string | null;
}

interface ApplicantSchedule {
  applicantId: string;
  jobId: string;
  InterviewSchedule: InterviewSchedule[] | undefined | null;
  subsData: {
    accounts: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
}

interface IApplicantData {
  photo: JSX.Element;
  name: string;
  email: string;
  jobId: string;
  schedule: string;
  action: JSX.Element;
  id: string;
}

function InterviewScheduleFrontend() {
  const [applicantSchedules, setApplicantSchedules] = useState<ApplicantSchedule[] | undefined>(undefined); // Initialize as undefined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const compaccount = useAuthStore((state) => state.account);

  useEffect(() => {
    if (compaccount?.id) {
      fetchApplicantsByCompany(compaccount.id);
    } else {
      setLoading(false);
    }
  }, [compaccount?.id]);

  const fetchApplicantsByCompany = async (companyId: string) => {
    setLoading(true);
    try {
      const apiUrl = `/api/interviewschedule/company/${companyId}`;
      console.log("InterviewScheduleFrontend: Sending GET request to:", apiUrl);
      const response = await axiosInstance.get<{ applicants: ApplicantSchedule[] }>(apiUrl);
      console.log("InterviewScheduleFrontend: Fetched schedules:", response.data.applicants);
      setApplicantSchedules(response.data.applicants);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to fetch applicants.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const tableData: IApplicantData[] = applicantSchedules
    ? applicantSchedules.map((applicantSchedule, applicantIndex) => ({
        id: applicantSchedule.applicantId,
        photo: (
            <Image
                src={applicantSchedule.subsData.accounts.avatar || '/avatar_default.jpg'}
                alt="Applicant Avatar"
                width={40}
                height={40}
                className="rounded-full"
            />
        ),
        name: applicantSchedule.subsData.accounts.name,
        email: applicantSchedule.subsData.accounts.email,
        jobId: applicantSchedule.jobId,
        schedule: applicantSchedule.InterviewSchedule && applicantSchedule.InterviewSchedule.length > 0 ? "Scheduled" : "Not Scheduled",
        action: (
          <Link href={`/interview/schedule/${applicantSchedule.applicantId}`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
              Select Schedule
            </button>
          </Link>
        ),
      }))
    : []; // Return an empty array if applicantSchedules is undefined

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <Heading title="Interview Schedules" description="Manage all interview schedules" />
      </div>
      {loading ? (
        <p>Loading Schedules...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableDashboard
          columns={['No', 'Photo', 'Name', 'Email', 'Job ID', 'Schedule', 'Action']}
          datas={tableData}
          itemsPerPage={5}
        />
      )}
    </div>
  );
}

export default InterviewScheduleFrontend;
