'use client';

import { Formik, Form, FormikProps, Field } from 'formik';
import { RegiserSchema } from '@/lib/schema';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import axiosInstance from '@/lib/axios';

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  interface IRegister {
    name: string;
    email: string;
    password: string;
  }

  const onSubmit = async (values: IRegister) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        '/api/account/register',
        values,
      );
      //   console.log(values);
      //   toast.success('We did it');
      toast.success(data.message);
      setTimeout(() => router.push('/login'), 1500);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-8 shadow-md">
      <h1 className="font-bold">Register Here!</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
        }}
        validationSchema={RegiserSchema}
        onSubmit={(values) => onSubmit(values)}
      >
        {(props: FormikProps<IRegister>) => {
          const { values, errors, touched, handleChange } = props;
          return (
            <Form>
              {/* Name */}
              <div className="py-2">
                <label htmlFor="name" className="formik-label">
                  Name :
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                  />
                  {touched.name && errors.name ? (
                    <div className="text-red-600 h-6">{errors.name}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

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
                Register
              </button>
            </Form>
          );
        }}
      </Formik>
      <p className="text-sm text-gray-400 mt-2">
        Have an account? Login{' '}
        <Link
          href="/login"
          className="text-blue-400 hover:text-blue-600 cursor-pointer"
        >
          here
        </Link>
      </p>
    </div>
  );
}
