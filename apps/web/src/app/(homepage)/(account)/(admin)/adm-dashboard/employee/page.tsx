'use client';
import { ApproveBtn, DetailBtn } from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalDetail from '@/components/table/modalDetail';
import TableDashboard from '@/components/table/table';
import useWorkerByCompany from '@/hooks/useWorkerByCompany';
import axiosInstance from '@/lib/axios';
import { IEmployee, IWorker } from '@/lib/interface';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ITableData {
  id: string;
  name: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isVerified: boolean;
}

const Employee = () => {
  const { employees, setEmployees } = useWorkerByCompany();
  const [selectedEmployee, setSelectedEmployee] = useState<IWorker | null>(
    null,
  );

  const handleApprove = async (employeeId: string) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/worker/verify/${employeeId}`,
        {
          isVerified: true,
        },
      );
      toast.success(data.message);
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === employeeId
            ? { ...employee, isVerified: true }
            : employee,
        ),
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };


  interface IActionButton {
    employee: IEmployee;
  }
  const ActionButton = ({ employee }: IActionButton) => {
    return (
      <div className="flex flex-col lg:flex-row gap-2">
        <ApproveBtn
          runFunction={() => handleApprove(employee.id)}
          disabled={employee.isVerified === true}
        />
      </div>
    );
  };

  const tableData: ITableData[] = employees.map((employee) => ({
    id: employee.id,
    name: employee.subsData.accounts.name,
    position: employee.position,
    startDate: new Date(employee.startDate).toLocaleDateString(),
    endDate: employee.endDate
      ? new Date(employee.endDate).toLocaleDateString()
      : 'On going',
    isVerified: employee.isVerified,
    actions: () => <ActionButton employee={employee} />,
  }));
  return (
    <div>
      <div>
        <Heading title="Employee Data" description="List of employement" />
      </div>
      <TableDashboard
        columns={[
          'No',
          'Name',
          'Position',
          'Start Date',
          'End Date',
          'IsVerified',
          'Actions',
        ]}
        datas={tableData}
        itemsPerPage={5}
      />
    </div>
  );
};

export default Employee;
