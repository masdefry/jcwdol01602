'use client';
import useAuthStore from '@/stores/authStores';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

type Token = {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  iat: number;
  exp: number;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onAuthSuccess, clearAuth } = useAuthStore();
  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true); //add loading to check if account is logged in

  // function to check if user already logged in
  const checkLogin = async () => {
    try {
      // get token from cookies
      const access_token = await getCookie('access_token');

      // Check if token is available
      if (!access_token) {
        // clearAuth();
        // toast.dismiss();
        // toast.error(`You need to login first`);
        // router.push('/');

        setIsAuthLoading(false);
        return;
      }

      // Decode token if any
      const token: Token = jwtDecode(access_token);

      // Check wether token is expired or not
      if (Date.now() >= token.exp * 1000) {
        toast.dismiss();
        toast.error('Session expired, please relogin');
        clearAuth();
        router.push('/login');
      } else {
        onAuthSuccess({
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          avatar: token.avatar,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      checkLogin();
    }
  }, []);
  if (isAuthLoading) return <div>Loading authentication...</div>;
  return <>{children}</>;
}
