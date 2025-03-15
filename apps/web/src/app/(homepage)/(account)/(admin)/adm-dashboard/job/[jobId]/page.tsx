'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { ApplicantStatus } from '@prisma/client';
import TableDashboard2 from '@/components/table/table2';
import { Heading } from '@/components/heading';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Modal from '@/components/adminDashboard/applicantModal';
import { Applicant, IApplicantData } from '@/types/applicantDetail';
import { format } from 'date-fns';

const JobApplicants = () => {
    const router = useRouter();
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        education: applicant.subsData.userEdu[0]?.level || 'N/A',
        expectedSalary: applicant.expectedSalary,
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
            {loading ? (
                <p>Loading Applicants...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <TableDashboard2
                    columns={['No', 'Photo', 'Name', 'Email', 'Education', 'Expected Salary', 'Status']}
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
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <div className="p-4">
                        <div className="flex flex-col md:flex-row">
                            {selectedApplicant.subsData.cvPath && (
                                <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
                                    <iframe
                                        src={selectedApplicant.subsData.cvPath}
                                        width="100%"
                                        height="500px"
                                    ></iframe>
                                </div>
                            )}
                            <div className="md:w-1/2">
                                <table className="w-full table-auto">
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Name:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.accounts.name}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Email:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.accounts.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Gender:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.userProfile?.gender}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Birthdate:</td>
                                            <td className="py-2 text-left">
                                                {selectedApplicant.subsData.userProfile?.dob
                                                    ? format(new Date(selectedApplicant.subsData.userProfile.dob), 'yyyy-MM-dd')
                                                    : 'N/A'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Place of Birth:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.userProfile?.pob}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Phone:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.userProfile?.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Education:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.userEdu[0]?.level || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">University:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.userEdu[0]?.school || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Discipline:</td>
                                            <td className="py-2 text-left">{selectedApplicant.subsData.userEdu[0]?.discipline || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Expected Salary:</td>
                                            <td className="py-2 text-left">{selectedApplicant.expectedSalary}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold pr-4 py-2 text-left">Status:</td>
                                            <td className="py-2 text-left">{selectedApplicant.status}</td>
                                        </tr>
                                        <tr><td className="font-semibold pr-4 py-2 text-left">Preselection Test Result:</td>
                                            <td className="py-2 text-left">{selectedApplicant.PreSelectionTestResult && selectedApplicant.PreSelectionTestResult.length > 0 ? selectedApplicant.PreSelectionTestResult.score : 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default JobApplicants;
