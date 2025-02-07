'use client';
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

export default function Login() {
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
      router.push('/tes');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="border rounded-lg p-8 shadow-md">
      <h1 className="font-bold">Verify that you are the owner!</h1>
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
          const { values, errors, touched, handleChange } = props;
          return (
            <Form>
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
                    onChange={handleChange}
                    value={values.email}
                  />
                  {touched.email && errors.email ? (
                    <div className="text-red-600 h-6">{errors.email}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              {/* password */}
              <div className="py-2">
                <label htmlFor="password" className="block text-base">
                  Password :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <div className="text-red-600 h-6">{errors.password}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <button
                className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
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
          href="/register"
          className="text-blue-400 hover:text-blue-600 cursor-pointer"
        >
          here
        </Link>
      </p>
    </div>
  );
}
