'use client';
import useAuthStore from '@/stores/authStores';
import React from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { account, clearAuth } = useAuthStore();
  const router = useRouter();
  return (
    <div className="">
      <h1>Hello {account?.name} !</h1>

      <button
        onClick={() => {
          clearAuth();
          toast.success('Logout successfully');
          router.push('login');
        }}
        className="block p-2 text-gray-700 hover:bg-red-400 w-full text-left rounded-lg hover:font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
