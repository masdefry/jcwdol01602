'use client';
import Navbar from '@/components/navbar';
import axiosInstance from '@/lib/axios';
import AuthProvider from '@/provider/authProvider';
import useAuthStore from '@/stores/authStores';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const page = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');
  const router = useRouter();

  useEffect(() => {
    const approvePayment = async () => {
      if (!orderId || !transactionStatus) {
        toast.error('Invalid transaction data.');
        return;
      }
      try {
        const { data } = await axiosInstance.patch(
          '/api/payment/midtrans/success',
          { orderId, transactionStatus },
        );
        toast.dismiss();
        toast.success(data.message);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.dismiss();
        toast.error(errorMessage);
      }
    };
    approvePayment();
  }, [orderId, transactionStatus]);
  return (
    <>
      <AuthProvider>
        <Navbar />
        <div className="mx-auto my-auto">
          <h1 className="font-bold text-xl">
            Thank you for paying with Midtrans.
          </h1>
        </div>
      </AuthProvider>
    </>
  );
};

export default page;
