'use client';
import { DeleteBtn, AddBtn, DetailBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import AddTestModal from '@/components/adminDashboard/addTestModal';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStores';

interface IPreSelectionTest {
  id: string;
  jobId: string;
  jobTitle: string;
  isActive: boolean;
  createdAt: string;
}

interface ITableData {
  id: string;
  jobTitle: string;
  createdAt: string;
  actions: () => JSX.Element;
}

interface IJob {
  id: string;
  title: string;
}

const PreSelectionTestList = () => {
  const [tests, setTests] = useState<IPreSelectionTest[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const router = useRouter();
  const account = useAuthStore((state) => state.account);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true); // Added loading state

  const getPreSelectionTests = async () => {
    if (!account?.id) {
      toast.error('Account ID is not available.');
      return;
    }
    try {
      const { data } = await axiosInstance.get(`/api/preselectiontest/company/${account.id}`);
      const formattedTests = data.tests.filter((test: any) => test[0]).map((test: any) => ({
        id: test[0].id,
        jobId: test[0].jobId,
        jobTitle: test.jobTitle,
        isActive: test[0].isActive,
        createdAt: test[0].createdAt,
      }));
      setTests(formattedTests);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const getCompanyJobs = async () => {
    if (!account?.id) {
        toast.error('Account ID is not available.');
        setLoadingJobs(false);
        return;
    }
    setLoadingJobs(true);
    try {
        const { data } = await axiosInstance.get(`/api/job/company/${account.id}`);
        console.log(`/api/job/list?accountId=${account?.id}`);
        console.log("API Jobs Data:", data.jobs); // Log the API response
        setJobs(data.jobs);
        toast.success(data.message);
        console.log("Jobs State:", jobs); // Log the jobs state after setting
    } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
        console.error("Error fetching jobs:", error);
    } finally {
        setLoadingJobs(false);
        console.log("Loading Jobs State:", loadingJobs) //log the loading state.
    }
};

  useEffect(() => {
    getPreSelectionTests();
    getCompanyJobs();
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


  const handleToggleActive = async (test: IPreSelectionTest) => {
    try {
      const { data } = await axiosInstance.patch(`/api/preselectiontest/${test.id}`, { isActive: !test.isActive });
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
    jobTitle: test.jobTitle,
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
    {
        name: 'jobId',
        label: 'Job',
        type: 'select' as const,
        options: !loadingJobs && jobs ? jobs.map((job) => ({ value: job.id, label: job.title })) : [],
        disabled: loadingJobs,
    },
];

console.log("Fields Options:", fields[0].options)
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Pre-Selection Test List" description="List of all pre-selection tests" />
        <AddBtn title="Add New Test" runFunction={() => setAddModalOpen(true)} disabled={loadingJobs} />
      </div>
      <TableDashboard
        columns={['No', 'Job Title', 'Created At', 'Actions']}
        datas={tableData}
        itemsPerPage={5}
        onRowClick={(rowData, columnIndex) => {
          if (columnIndex !== 3) {
            router.push(`/adm-dashboard/pre-selection-test/result/${rowData.id}`);
          }
        }}
      />
      {addModalOpen && (
        <AddTestModal
          title="Create New Pre-Selection Test"
          initialValues={initialValues}
          validationSchema={undefined}
          onSubmit={handleNewTest}
          isOpen={addModalOpen}
          setIsOpen={setAddModalOpen}
          disabled={loadingJobs}
          fields={fields}
        />
      )}
    </>
  );
};

export default PreSelectionTestList;
