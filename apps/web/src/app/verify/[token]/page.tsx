'use client';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerificationPage({
  params,
}: {
  params: { token: string };
}) {
  const router = useRouter();
  const verifyAccount = async () => {
    try {
      const { token } = await params;
      console.log(token);

      // Token to API
      const { data } = await axiosInstance.patch(
        '/api/account/verify',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      // console.log(data);
      toast.success(data.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Unexpected error occured');
    }
  };
  return (
    <div>
      <div className="mx-20 my-20 bg-slate-200 px-4 py-4 text-center rounded-xl shadow-md">
        <h1 className="font-bold text-2xl p-1">
          Thank you for joining with us!
        </h1>
        <p className="p-1">
          Please click the button below to verify your account!
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white p-1 font-bold py-2 px-4 rounded duration-300"
          onClick={() => verifyAccount()}
        >
          Verify my Account
        </button>
      </div>
    </div>
  );
}
