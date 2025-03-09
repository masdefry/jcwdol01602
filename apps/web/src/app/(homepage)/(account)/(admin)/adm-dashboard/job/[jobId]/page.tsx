'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { ApplicantStatus } from '@prisma/client';
import TableDashboard2 from '@/components/table/table2';
import { Heading } from '@/components/heading';
import toast from 'react-hot-toast';
import Image from 'next/image';

export interface Applicant {
    id: string;
    subsData: {
        accounts: {
            name: string;
            avatar?: string;
            email: string;
        };
        userProfilie: {
            dob: Date | null;
        }[];
        userEdu: {
            level: string;
        }[];
    };
    expectedSalary: number | null;
    appliedAt: Date;
    status: ApplicantStatus;
}

interface IApplicantData {
    photo: JSX.Element;
    name: string;
    email: string;
    age: number;
    education: string;
    status: string;
    expectedSalary: number | null;
    id: string;
    no: number;
}

const JobApplicants = () => {
    const router = useRouter();
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('JobId from useParams:', jobId);
        if (jobId) {
            fetchApplicants();
        } else {
            console.error("JobId is undefined");
        }
    }, [jobId]);

    const fetchApplicants = async () => {
        try {
            const apiUrl = `/api/applicant/job/${jobId}`;
            console.log("JobApplicants: Sending GET request to:", apiUrl);
            const { data } = await axiosInstance.get(apiUrl);
            console.log("JobApplicants: Fetched applicants:", data.applicants);
            setApplicants(data.applicants);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.dismiss();
            toast.error(errorMessage || "Failed to fetch applicants. Please try again.");
            setError(errorMessage || "Failed to fetch applicants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (
        applicantId: string,
        status: ApplicantStatus
    ) => {
        try {
            const apiUrl = `/api/applicant/${applicantId}`;
            console.log("JobApplicants: Sending PATCH request to", apiUrl, "with status:", status);
            const { data } = await axiosInstance.patch(apiUrl, { status });
            console.log("JobApplicants: Received response:", data.applicant);
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

    const tableData: IApplicantData[] = applicants.map((applicant, index) => ({
        no: index + 1,
        id: applicant.id,
        photo: (
            <Image
                src={applicant.subsData.accounts.avatar || '/avatar_default.jpg'}
                alt="Applicant Avatar"
                width={40}
                height={40}
                className="rounded-full"
            />
        ),
        name: applicant.subsData.accounts.name,
        email: applicant.subsData.accounts.email,
        age: applicant.subsData.userProfilie[0]?.dob
            ? new Date(applicant.subsData.userProfilie[0].dob).getFullYear()
            : 0,
        education: applicant.subsData.userEdu[0]?.level || 'N/A',
        expectedSalary: applicant.expectedSalary,
        status: applicant.status,
    }));

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <Heading title="Applicants" description="Manage all applicants" />
            </div>
            {loading ? (
                <p>Loading Applicants...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <TableDashboard2
                    columns={['No', 'Photo', 'Name', 'Email', 'Age', 'Education', 'Expected Salary', 'Status']}
                    datas={tableData}
                    itemsPerPage={5}
                    onStatusChange={(id, status) => handleUpdateStatus(id, status as ApplicantStatus)}
                />
            )}
        </div>
    );
};

export default JobApplicants;
