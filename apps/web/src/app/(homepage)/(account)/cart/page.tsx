'use client';
import axiosInstance from '@/lib/axios';
import { IPayment } from '@/lib/interface';
import useAuthStore from '@/stores/authStores';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TrashIcon } from '@heroicons/react/24/solid';
import { capitalizeFirstLetter, rupiahFormat } from '@/lib/stringFormat';
import ButtonCustom from '@/components/button/btn';
import ImageUploader from '@/components/imageUpload';

const Cart = () => {
  const { account } = useAuthStore();
  const [payments, setPayments] = useState<IPayment[]>([]);
  const router = useRouter();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const bankAccount = 'BCA-123456789';
  useEffect(() => {
    if (!account) {
      setTimeout(() => router.push('/login'), 1500);
      return;
    }
    const getAllPayments = async () => {
      try {
        const { data } = await axiosInstance.get('/api/payment/my-invoices');
        setPayments(data.payments);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message;
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

  const deletePayement = async (paymentId: string) => {
    const toastDelete = toast.loading('Deleting payment...');
    if (selectedPayment)
      try {
        const { data } = await axiosInstance.delete(
          `/api/payment/delete/${paymentId}`,
        );
        toast.dismiss(toastDelete);
        toast.success(data.message, { duration: 2000 });
        setPayments((prevPayments) =>
          prevPayments.filter((payment) => payment.id !== paymentId),
        );
      } catch (error: any) {
        toast.dismiss(toastDelete);
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
  };

  return (
    <div className="md:flex md:flex-row h-full bg-blue-300">
      <div className="hidden md:flex bg-yellow-200 md:basis-1/5">
        Profile Navigation
      </div>
      <div className="bg-green-200 md:basis-4/5 p-4">
        {payments.length > 0 ? (
          payments.map((payment, idx) => (
            <div key={idx} className="bg-white p-2 rounded-xl shadow-lg">
              <div className="bg-gradient-to-b from-fuchsia-600 to-purple-600 p-2 rounded-lg text-white  flex gap-4 justify-between items-center">
                <div className="items-baseline flex gap-4">
                  <h1 className="font-bold text-xl">Invoice Number</h1>
                  <p className="font-semibold text-lg">{payment.id}</p>
                </div>
                <div>
                  <button
                    className={`p-2 rounded-lg ${payment.proof ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-white text-red-500 hover:bg-red-500 hover:text-white ease-in-out duration-150'}`}
                    onClick={() => deletePayement(payment.id)}
                    disabled={payment.proof !== null}
                  >
                    <TrashIcon width={20} height={20} />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 my-2 mx-2">
                <h2>Subscription Plan :</h2>
                <p className="font-semibold">
                  {payment.subsCtg?.name
                    ? capitalizeFirstLetter(payment.subsCtg.name)
                    : 'Not Available'}
                </p>
              </div>
              <div className="flex gap-2 my-2 mx-2">
                <h2>Subscription Price :</h2>
                <p className="font-semibold">
                  {payment.subsCtg?.price
                    ? rupiahFormat(payment.subsCtg.price)
                    : 'Not Available'}
                </p>
              </div>
              <div className="flex flex-col gap-2 my-2 mx-2">
                <div className="flex gap-2">
                  <h2>Payment Option :</h2>
                  <p className="font-semibold">
                    {payment.method
                      ? capitalizeFirstLetter(payment.method)
                      : 'Not Available'}
                  </p>
                </div>
                {payment.method === 'transfer' && !payment.proof && (
                  <div className="bg-yellow-200 p-2 rounded-lg border-l-4 border-yellow-500">
                    <p>Please proceed payment and transfer to {bankAccount} </p>
                  </div>
                )}
              </div>

              {payment.method === 'transfer' && (
                <div className="flex gap-2 my-2 mx-2 items-center">
                  <h2 className="text-nowrap">Payment receipt :</h2>
                  {payment.proof ? (
                    <div className="flex flex-row items-center justify-between">
                      <p className="basis-1/2">{payment.proof}</p>
                      <div>
                        <ButtonCustom
                          btnName="Re-upload image"
                          onClick={() => {
                            setSelectedPayment(payment.id);
                            setIsUploaderOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <ButtonCustom
                        btnName="Upload image"
                        onClick={() => {
                          setSelectedPayment(payment.id);
                          setIsUploaderOpen(true);
                        }}
                      />
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2 my-2 mx-2">
                {payment.isApproved === null && (
                  <p className="bg-yellow-200 p-2 rounded-lg border-l-4 border-yellow-500">
                    Please make sure already proceed the payment and please wait
                    for approval
                  </p>
                )}
                {payment.isApproved === false && (
                  <p className="bg-red-200 p-2 rounded-lg border-l-4 border-red-500">
                    Your payment is not approved by our admin, please check your
                    receipt.
                  </p>
                )}
                {payment.isApproved === true && (
                  <p className="bg-gray-400 text-white p-4 rounded-lg">
                    Approved
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No payments found.</p>
        )}
      </div>
      {isUploaderOpen && selectedPayment && (
        <ImageUploader
          title="Upload imgae"
          setIsOpen={setIsUploaderOpen}
          onSubmit={handleUpload}
        />
      )}
    </div>
  );
};

export default Cart;

/*
    "bg-white text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white ease-in-out duration-150"
*/

/*
    {payment.isApproved === true ? (
                  <div className="">
                    <h1 className="text-lg font-semibold bg-gradient-to-r from-yellow-200 to-orange-400 p-4 rounded-lg text-black">
                      Approved
                    </h1>
                  </div>
                ) : (
                  <>
                    <p className="bg-gray-200 p-2 rounded-lg border-l-4 border-gray-500">
                      Please make sure you already proceed the payment and wait
                      for approval
                    </p>
                  </>
                )}
*/
