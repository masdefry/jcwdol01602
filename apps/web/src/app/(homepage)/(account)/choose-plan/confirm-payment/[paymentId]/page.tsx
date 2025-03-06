'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStores';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { IPayment, ISubsCtg } from '@/lib/interface';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import ButtonCustom from '@/components/button/btn';
import { midtransText, transferText } from '@/lib/copywriting';

const page = () => {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState<IPayment>();
  const { account } = useAuthStore();
  const router = useRouter();
  const [subsCtg, setSubsCtg] = useState<ISubsCtg>();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [payOptions, setPayOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPayOptions = async () => {
      try {
        const { data } = await axiosInstance.get('/api/payment/options');
        setPayOptions(data.optionPayment);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    fetchPayOptions();
  }, []);

  useEffect(() => {
    if (!account) {
      setTimeout(() => router.push('/login'), 1000);
      return;
    }
    const getPayment = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/payment/data/${paymentId}`,
        );
        toast.dismiss();
        setPayment(data.payment);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
    };
    getPayment();
  }, [account, paymentId, router]);

  useEffect(() => {
    if (!payment) return;
    const getSubsCtg = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/subscription/category/${payment.subsCtgId}`,
        );
        setSubsCtg(data.subsCtg);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
    };
    getSubsCtg();
  }, [payment]);

  const onSubmit = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method!');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.patch(
        `/api/payment/method/${paymentId}`,
        { method: selectedMethod },
      );
      toast.success(data.message, { duration: 3000 });
      setTimeout(() => {
        router.push(`/`);
      }, 4000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {payment && subsCtg && (
        <div className="my-4 flex justify-center items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-xl bg-gradient-to-b from-fuchsia-600 to-purple-600 shadow-md rounded-lg text-white p-4">
              Please confirm your payment method
            </h1>
            <div className="flex flex-col bg-gray-200 shadow-md rounded-lg p-4">
              <div className="flex justify-between ">
                <div className="font-semibold">Invoice Number </div>
                <div>{payment.id}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Category</div>
                <div>{capitalizeFirstLetter(subsCtg.name)}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-semibold">Price</div>
                <div>{rupiahFormat(subsCtg.price)}</div>
              </div>
              {/* Dropdown list */}
              <div className="flex flex-col mt-4">
                <label className="font-semibold">Select Payment Method</label>
                <select
                  className="p-2 text-black rounded-lg mt-1 cursor-pointer"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  <option value="" disabled>
                    Select a method
                  </option>
                  {payOptions.map((method) => (
                    <option key={method} value={method}>
                      {capitalizeFirstLetter(method)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Button Submit */}
              <div className="mt-4 flex w-full justify-center">
                <ButtonCustom
                  btnName="Confirm Payment Method"
                  onClick={onSubmit}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="my-6 mx-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 rounded-lg">
        <h2 className="font-bold text-lg">To Be Noted</h2>
        <p className="mt-2">
          💳 <span className="font-semibold">Bank Transfer:</span>
          {transferText}
        </p>
        <p className="mt-2">
          ⚡ <span className="font-semibold">Midtrans:</span> {midtransText}
        </p>
      </div>
    </>
  );
};

export default page;
