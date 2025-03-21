'use client';
import { Heading } from '@/components/heading';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface IApplicantResult {
    id: string;
    applicantId: string;
    testId: string;
    score: number;
    total: number;
    createdAt: string;
    updatedAt: string;
    applicant: {
      id: string;
      subsDataId: string;
      jobId: string;
      appliedAt: string;
      expectedSalary: number;
      cvPath: string;
      status: string;
      subsData: {
        id: string;
        accountId: string;
        subsCtgId: string;
        startDate: string;
        endDate: string;
        isSubActive: boolean;
        cvId: string;
        createdAt: string;
        updatedAt: string;
        accounts: {
          id: string;
          role: string;
          email: string;
          password: string;
          isVerified: boolean;
          name: string;
          avatar: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    };
  }

interface ITableData {
    id: string;
    applicantName: string;
    score: number;
    total: number;
    createdAt: string;
}

const PreSelectionTestResults = () => {
    const { testId } = useParams();
    const [results, setResults] = useState<IApplicantResult[]>([]);

    const getTestResults = async () => {
        if (!testId) {
            toast.error('Test ID is missing.');
            return;
        }
        try {
            const { data } = await axiosInstance.get(`/api/preselectiontest/result/${testId}`);
            setResults(data.test);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        getTestResults();
    }, [testId]);

    const tableData: ITableData[] = results.map((result) => ({
        id: result.id,
        applicantName: result.applicant.subsData.accounts.name || 'Unknown',
        score: result.score,
        total: result.total,
        createdAt: new Date(result.createdAt).toLocaleDateString(),
    }));

    return (
        <>
            <Heading title="Pre-Selection Test Results" description={`Results for Pre-Selection Test`} />
            <TableDashboard
                columns={['No', 'Name', 'Score', 'Total', 'Submitted At']}
                datas={tableData}
                itemsPerPage={10}
            />
        </>
    );
};

export default PreSelectionTestResults;
