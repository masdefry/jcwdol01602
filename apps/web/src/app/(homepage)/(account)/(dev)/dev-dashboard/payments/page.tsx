'use client';
import {
  ApproveBtn,
  DeleteBtn,
  DetailBtn,
  EditBtn,
  RejectBtn,
} from '@/components/button/moreBtn';
import { Heading } from '@/components/heading';
import ModalDetail from '@/components/table/modalDetail';
import TableDashboard from '@/components/table/table';
import axiosInstance from '@/lib/axios';
import { IPayment } from '@/lib/interface';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ITableData {
  id: string;
  paymentId: string;
  method: string | null;
  proof: string;
  isApproved: boolean | null;
  details: (setIsOpen: (isOpen: boolean) => void) => JSX.Element;
}

const Payments = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const router = useRouter();
  const getPayment = async () => {
    try {
      const { data } = await axiosInstance.get('/api/payment/datas');
      console.log(data.payments);
      setPayments(data.payments);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    getPayment();
  }, []);

  const handleApprove = async (paymentId: string) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/payment/approval/${paymentId}`,
        { isApproved: true },
      );
      toast.success(data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const handleReject = async (paymentId: string) => {
    try {
      const { data } = await axiosInstance.patch(
        `/api/payment/approval/${paymentId}`,
        { isApproved: false },
      );
      toast.success(data.message);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  // Action Button for projects
  interface IActionButton {
    payment: IPayment;
  }
  const ActionButton = ({ payment }: IActionButton) => {
    return (
      <>
        <div className="flex flex-col lg:flex-row gap-2">
          <ApproveBtn
            runFunction={() => handleApprove(payment.id)}
            disabled={payment.isApproved === true}
          />
          <RejectBtn
            runFunction={() => handleReject(payment.id)}
            disabled={payment.isApproved !== null}
          />
        </div>
      </>
    );
  };

  const handleDetailModal = (project: IPayment) => {
    setSelectedPayment(project);
    setIsDetailOpen(true);
  };

  const tableData: ITableData[] = payments.map((payment) => ({
    id: payment.id,
    paymentId: payment.id,
    method: payment.method,
    proof: payment.proof ? 'Uploaded' : 'null',
    isApproved: payment.isApproved,
    details: () => <DetailBtn runFunction={() => handleDetailModal(payment)} />,
    actions: () => <ActionButton payment={payment} />,
  }));
  return (
    <>
      <div className="flex justify-between px-2">
        <Heading title="Payment List" description="List of all user payment" />
      </div>
      <TableDashboard
        columns={[
          'No',
          'Payment Id',
          'Method',
          'Proof',
          'IsApproved',
          'Details',
          'Actions',
        ]}
        datas={tableData}
        itemsPerPage={5}
      />
      {isDetailOpen && selectedPayment && (
        <ModalDetail data={selectedPayment} setIsOpen={setIsDetailOpen} />
      )}
    </>
  );
};

export default Payments;
