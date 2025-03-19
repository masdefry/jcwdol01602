'use client';
import axiosInstance from '@/lib/axios';
import { IPayment, ISubsData } from '@/lib/interface';
import useAuthStore from '@/stores/authStores';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/imageUpload';
import PaymentCard from '@/components/paymentCard';
import { capitalizeFirstLetter } from '@/lib/stringFormat';

const Plan = () => {
  const { account } = useAuthStore();
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [subsData, setSubsData] = useState<ISubsData>();

  useEffect(() => {
    const getUserSubsData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/subscription/my-data');
        setSubsData(data.subsData);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.dismiss();
        toast.error(errorMessage);
      }
    };
    getUserSubsData();
  }, [account]);

  const bankAccount = 'BCA-123456789';
  useEffect(() => {
    const getAllPayments = async () => {
      try {
        const { data } = await axiosInstance.get('/api/payment/my-invoices');
        setPayments(data.payments);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.dismiss();
        toast.error(errorMessage);
      }
    };
    getAllPayments();
  }, [account]);

  const handleUpload = async (image: File | null) => {
    if (!image) return;
    const formData = new FormData();
    formData.append('image', image);
    const toastId = toast.loading('Uploading image...');
    try {
      const { data } = await axiosInstance.patch(
        `/api/payment/proof/${selectedPayment}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      toast.dismiss(toastId);
      toast.success(data.message);
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === selectedPayment
            ? { ...payment, proof: data.payment.proof }
            : payment,
        ),
      );
      setIsUploaderOpen(false);
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      const { data } = await axiosInstance.delete(
        `/api/payment/delete/${paymentId}`,
      );
      toast.success(data.message, { duration: 2000 });
      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== paymentId),
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="m-4 bg-white p-4 shadow-lg rounded-xl flex flex-col gap-2">
        <h1 className="font-semibold text-xl">
          My Current <span className="text-fuchsia-600">Subscription</span>
        </h1>
        <hr />
        <div className="flex flex-col gap-2">
          {subsData ? (
            <>
              <div className="flex flex-row gap-2">
                <h2>Subscripton Plan :</h2>
                <p className="font-semibold">
                  {subsData.subsCtg?.name
                    ? capitalizeFirstLetter(subsData.subsCtg?.name)
                    : 'No data'}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <h2>Subscripton Status :</h2>
                <p className="font-semibold">
                  {subsData.isSubActive ? 'Approved' : 'On process'}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <h2>Subscripton Start Date :</h2>
                <p className="font-semibold">
                  {subsData.startDate
                    ? new Date(subsData.startDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <h2>Subscripton End Date :</h2>
                <p className="font-semibold">
                  {subsData.endDate
                    ? new Date(subsData.endDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </>
          ) : (
            <div>No data</div>
          )}
        </div>
      </div>
      <div className="mx-6 flex flex-col">
        <h1 className="font-semibold text-xl">
          My <span className="text-fuchsia-600">Payments</span>
        </h1>
      </div>
      {payments.length > 0 ? (
        payments.map((payment, idx) => (
          <PaymentCard
            key={payment.id}
            payment={payment}
            bankAccount={bankAccount}
            onDelete={deletePayment}
            onUpload={(id) => {
              setSelectedPayment(id);
              setIsUploaderOpen(true);
            }}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">No payments found.</p>
      )}
      {isUploaderOpen && selectedPayment && (
        <ImageUploader
          title="Upload imgae"
          setIsOpen={setIsUploaderOpen}
          onSubmit={handleUpload}
        />
      )}
    </>
  );
};

export default Plan;
