'use client';
import Navbar from '@/components/navbar';
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
      // console.log(token);

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
    <div className=" h-full">
      <Navbar />
      <div className="flex justify-center items-center">
        <div className="mx-20 my-20 bg-gradient-to-br from-fuchsia-600 to-purple-600 px-4 py-4 text-center rounded-xl shadow-md w-2/3 text-white">
          <div className="flex">
            <h1 className="text-2xl font-bold">
              Dream Jobs<span className="text-yellow-400 font-bold">!</span>
            </h1>
          </div>
          <h1 className="font-bold text-2xl p-1">
            Thank you for joining with us!
          </h1>
          <p className="p-1">
            Please click the button below to verify your account!
          </p>
          <button
            className="bg-yellow-200 hover:bg-yellow-400 px-4 font-semibold text-gray-800 hover:text-black py-2 rounded ease-in-out duration-150"
            onClick={() => verifyAccount()}
          >
            Verify my Account
          </button>
        </div>
      </div>
    </div>
  );
}
