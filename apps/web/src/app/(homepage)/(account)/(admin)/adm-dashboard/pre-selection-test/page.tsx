'use client';
import { AddBtn, DeleteBtn, DetailBtn } from '@/components/button/moreBtn';
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
  isActive: () => JSX.Element;
  createdAt: string;
  questions: () => JSX.Element;
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
  }, [account?.id]); // Tambahkan account?.id sebagai dependency

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

  const handleEditTest = (testId: string) => {
    router.push(`/dev-dashboard/pre-selection-test/edit/${testId}`);
  };

  const handleViewQuestions = (testId: string) => {
    router.push(`/adm-dashboard/pre-selection-test/questions/${testId}`);
  };

  interface IActionButton {
    test: IPreSelectionTest;
  }

  const ActionButton = ({ test }: IActionButton) => {
    return (
      <>
        <div className="flex flex-col lg:flex-row gap-2">
          <DeleteBtn runFunction={() => handleDelete(test.id)} />
          <AddBtn title="Edit Test" runFunction={() => handleEditTest(test.id)} />
        </div>
      </>
    );
  };

  const tableData: ITableData[] = tests.map((test) => ({
    id: test.id,
    jobId: test.jobId,
    isActive: () => (test.isActive ? <span className="text-green-500">Active</span> : <span className="text-red-500">Inactive</span>),
    createdAt: new Date(test.createdAt).toLocaleDateString(),
    questions: () => <DetailBtn runFunction={() => handleViewQuestions(test.id)} />,
    actions: () => <ActionButton test={test} />,
  }));

  const initialValues = {
    jobId: '',
    isActive: false,
  };

  const handleNewTest = async (values: typeof initialValues) => {
    if (!account?.id) {
      toast.error('Account ID is not available.');
      return;
    }
    try {
      const { data } = await axiosInstance.post(`/api/preselectiontest/create`, { ...values, accountId: account.id });
      toast.success(data.message);
      getPreSelectionTests();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setAddModalOpen(false);
    }
  };

  const fields = [
    { name: 'jobId', label: 'Job ID', type: 'text' as const },
    // { name: 'isActive', label: 'Active', type: 'checkbox' as const },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Pre-Selection Test List" description="List of all pre-selection tests" />
        <AddBtn title="Add New Test" runFunction={() => setAddModalOpen(true)} />
      </div>
      <TableDashboard
        columns={['No', 'Job ID', 'Active', 'Created At', 'Questions', 'Actions']}
        datas={tableData}
        itemsPerPage={5}
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
