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
    score: number;
    total: number;
    createdAt: string;
}

interface ITableData {
    id: string;
    applicantId: string;
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
        applicantId: result.applicantId,
        score: result.score,
        total: result.total,
        createdAt: new Date(result.createdAt).toLocaleDateString(),
    }));

    return (
        <>
            <Heading title="Pre-Selection Test Results" description={`Results for test ID: ${testId}`} />
            <TableDashboard
                columns={['No', 'Applicant ID', 'Score', 'Total', 'Created At']}
                datas={tableData}
                itemsPerPage={10}
            />
        </>
    );
};

export default PreSelectionTestResults;
