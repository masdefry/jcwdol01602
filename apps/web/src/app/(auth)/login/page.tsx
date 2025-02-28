'use client';
import React from 'react';
import Image from 'next/image';
import { Formik, Form, FormikProps, Field } from 'formik';
import { loginSchema } from '@/lib/schema';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '@/lib/axios';
import useAuthStore, { IAccount } from '@/stores/authStores';
import Logo from '@/components/logo';
import { BackToHomePage } from '@/components/button/backToHpBtn';

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { onAuthSuccess, account } = useAuthStore();
  interface ILogin {
    email: string;
    password: string;
  }

  const handleLogin = async () => {
    try {
      const access_token = getCookie('access_token') || '';
      if (access_token) {
        const account: IAccount = jwtDecode(access_token);
        onAuthSuccess(account);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      console.log(error);
    }
  };

  const onSubmit = async (values: ILogin) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/api/account/login', values);
      await handleLogin();
      toast.success(data.message);
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };
  return (
    <div className="relative flex h-screen bg-gradient-to-b  from-yellow-400 to-orange-400 overflow-hidden">
      {/* Left Section (Image) */}
      <div className="hidden md:block w-2/5 h-full ">
        <Image
          src="https://res.cloudinary.com/dnqgu6x1e/image/upload/final-project/web/wxewwasc4ibytes62jzy.jpg"
          alt="login-bg-img"
          fill
          className="object-cover"
        />
      </div>

      {/* Background shape */}
      <div className="relative w-full lg:w-3/5 flex bg-gradient-to-b from-fuchsia-600 to-purple-600 shape shadow-lg" />

      {/* Login Form */}
      <div className="absolute md:p-16 lg:p-28 w-full h-full flex items-center justify-center md:justify-end left z-10">
        <div>
          <div className="flex flex-row justify-between py-2">
            <div>
              <h1 className="font-bold text-2xl">Welcome to</h1>
              <Logo />
            </div>
            <div className="flex items-end">
              <BackToHomePage />
            </div>
          </div>
          <div className=" border rounded-lg p-8 shadow-md bg-white">
            <h1 className="font-bold text-2xl">Login</h1>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={loginSchema}
              onSubmit={(values) => {
                onSubmit(values);
              }}
            >
              {(props: FormikProps<ILogin>) => {
                const { values, errors, touched, validateForm, handleSubmit } =
                  props;
                return (
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validateForm().then((errors) => {
                        if (Object.keys(errors).length > 0) {
                          showValidationErrors(errors);
                        } else {
                          handleSubmit();
                        }
                      });
                    }}
                  >
                    {/* email */}
                    <div className="py-2">
                      <label htmlFor="email" className="formik-label">
                        Email :
                      </label>
                      <div>
                        <Field
                          className="formik-input"
                          type="text"
                          name="email"
                          value={values.email}
                        />
                      </div>
                    </div>

                    {/* password */}
                    <div className="py-1">
                      <label htmlFor="password" className="block text-base">
                        Password :
                      </label>
                      <div>
                        <Field
                          className="formik-input"
                          type="password"
                          name="password"
                          value={values.password}
                        />
                      </div>
                    </div>

                    <button
                      className="mt-5 bg-yellow-200 hover:bg-yellow-400 text-gray-800 hover:text-black ease-in-out transition duration-150 font-bold py-2 px-4 rounded-full "
                      type="submit"
                      disabled={loading}
                    >
                      Login
                    </button>
                  </Form>
                );
              }}
            </Formik>
            <p className="text-sm text-gray-400 mt-2">
              Don't have account? Register{' '}
              <Link
                href="/user-register"
                className="text-blue-400 hover:text-blue-600 cursor-pointer"
              >
                here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
