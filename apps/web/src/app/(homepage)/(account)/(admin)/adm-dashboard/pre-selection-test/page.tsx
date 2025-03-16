'use client';
import { DeleteBtn, AddBtn, DetailBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalCreate from '@/components/table/modalCreate';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStores';

interface IPreSelectionTest {
    id: string;
    jobId: string;
    isActive: boolean;
    createdAt: string;
}

interface ITableData {
    id: string;
    jobId: string;
    createdAt: string;
    actions: () => JSX.Element;
}

const PreSelectionTestList = () => {
    const [tests, setTests] = useState<IPreSelectionTest[]>([]);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const router = useRouter();
    const account = useAuthStore((state) => state.account);

    const getPreSelectionTests = async () => {
        if (!account?.id) {
            toast.error('Account ID is not available.');
            return;
        }
        try {
            const { data } = await axiosInstance.get(`/api/preselectiontest/company/${account.id}`);
            setTests(data.tests);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        getPreSelectionTests();
    }, [account?.id]);

    const handleDelete = async (testId: string) => {
        try {
            const { data } = await axiosInstance.delete(`/api/preselectiontest/${testId}`);
            toast.success(data.message);
            getPreSelectionTests();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    const handleAddQuestionTest = (testId: string) => {
        router.push(`/adm-dashboard/pre-selection-test/new-question/${testId}`);
    };

    const handleViewQuestions = (testId: string) => {
        router.push(`/adm-dashboard/pre-selection-test/questions/${testId}`);
    };

    const handleViewApplicantResults = (testId: string) => {
        router.push(`/adm-dashboard/pre-selection-test/result/${testId}`);
    };

    const handleToggleActive = async (test: IPreSelectionTest) => {
        try {
            const { data } = await axiosInstance.put(`/api/preselectiontest/active/${test.id}`);
            toast.success(data.message);
            getPreSelectionTests();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        }
    };

    const ActionButton = ({ test }: { test: IPreSelectionTest }) => {
        return (
            <div className="flex flex-col lg:flex-row gap-2">
                <DetailBtn runFunction={() => handleViewQuestions(test.id)} />
                <DeleteBtn runFunction={() => handleDelete(test.id)} />
                <button
                    className={`px-4 py-2 rounded-md ${test.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    onClick={() => handleToggleActive(test)}
                >
                    {test.isActive ? 'Active' : 'Inactive'}
                </button>
            </div>
        );
    };

    const tableData: ITableData[] = tests.map((test) => ({
        id: test.id,
        jobId: test.jobId,
        createdAt: new Date(test.createdAt).toLocaleDateString(),
        actions: () => <ActionButton test={test} />,
    }));

    const initialValues = {
        jobId: '',
    };

    const handleNewTest = async (values: typeof initialValues) => {
        if (!account?.id) {
            toast.error('Account ID is not available.');
            return;
        }
        try {
            const { data } = await axiosInstance.post(`/api/preselectiontest/create`, { jobId: values.jobId });
            toast.success(data.message);
            setAddModalOpen(false);
            router.push(`/adm-dashboard/pre-selection-test/questions/${data.test.id}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong!';
            toast.error(errorMessage);
        }
    };

    const fields = [
        { name: 'jobId', label: 'Job ID', type: 'text' as const },
    ];

    const handleRowClick = (testId: string, event: React.MouseEvent<HTMLTableRowElement>) => {
        const target = event.target as HTMLElement;
        const isAction = target.closest('[data-cell-type="actions"]');

        if (isAction) {
            return;
        }

        handleViewApplicantResults(testId);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title="Pre-Selection Test List" description="List of all pre-selection tests" />
                <AddBtn title="Add New Test" runFunction={() => setAddModalOpen(true)} />
            </div>
            <TableDashboard
                columns={['No', 'Job ID', 'Created At', 'Actions']}
                datas={tableData}
                itemsPerPage={5}
                onRowClick={(rowData, columnIndex) => {
                    if (columnIndex !== 3) {
                        router.push(`/adm-dashboard/job/${rowData.id}`);
                    }
                }}
            />
            {addModalOpen && (
                <ModalCreate
                    title="Create New Pre-Selection Test"
                    initialValues={initialValues}
                    validationSchema={undefined}
                    onSubmit={handleNewTest}
                    isOpen={addModalOpen}
                    setIsOpen={setAddModalOpen}
                    disabled={false}
                    fields={fields}
                />
            )}
        </>
    );
};

export default PreSelectionTestList;
