'use client';

import { Formik, Form, FormikProps, Field } from 'formik';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { CompanySchema } from '@/lib/companySchema';

interface ICompany {
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  logo: string;
  socialMedia: string;
}

export default function CompanyForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (values: ICompany) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post('/api/company/create-company', values);
      toast.success(data.message);
      setTimeout(() => router.push('/dashboard'), 1500); // Redirect to dashboard or wherever appropriate
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-8 shadow-md">
      <h1 className="font-bold">Company Profile</h1>
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          description: '',
          logo: '',
          socialMedia: '',
        }}
        validationSchema={CompanySchema}
        onSubmit={onSubmit}
      >
        {(props: FormikProps<ICompany>) => {
          const { values, errors, touched, handleChange } = props;
          return (
            <Form>
              {/* Name */}
              <div className="py-2">
                <label htmlFor="name" className="formik-label">
                  Company Name:
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

              {/* Email */}
              <div className="py-2">
                <label htmlFor="email" className="formik-label">
                  Email:
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="email"
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

              {/* Phone */}
              <div className="py-2">
                <label htmlFor="phone" className="formik-label">
                  Phone:
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    value={values.phone}
                  />
                  {touched.phone && errors.phone ? (
                    <div className="text-red-600 h-6">{errors.phone}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="py-2">
                <label htmlFor="address" className="formik-label">
                  Address:
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="address"
                    onChange={handleChange}
                    value={values.address}
                  />
                  {touched.address && errors.address ? (
                    <div className="text-red-600 h-6">{errors.address}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              {/* Website */}
              <div className="py-2">
                <label htmlFor="website" className="formik-label">
                  Website:
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="website"
                    onChange={handleChange}
                    value={values.website}
                  />
                  {touched.website && errors.website ? (
                    <div className="text-red-600 h-6">{errors.website}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="py-2">
                <label htmlFor="description" className="formik-label">
                  Description:
                </label>
                <div>
                  <Field
                    as="textarea"
                    className="formik-input"
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                  />
                  {touched.description && errors.description ? (
                    <div className="text-red-600 h-6">{errors.description}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              {/* Logo */}
              <div className="py-2">
                <label htmlFor="logo" className="formik-label">
                  Logo URL:
                </label>
                <div>
                  <Field
                    className="formik-input"
                    type="text"
                    name="logo"
                    onChange={handleChange}
                    value={values.logo}
                  />
                  {touched.logo && errors.logo ? (
                    <div className="text-red-600 h-6">{errors.logo}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="py-2">
                <label htmlFor="socialMedia" className="formik-label">
                  Social Media (JSON):
                </label>
                <div>
                  <Field
                    as="textarea"
                    className="formik-input"
                    name="socialMedia"
                    onChange={handleChange}
                    value={values.socialMedia}
                  />
                  {touched.socialMedia && errors.socialMedia ? (
                    <div className="text-red-600 h-6">{errors.socialMedia}</div>
                  ) : (
                    <div className="h-6" />
                  )}
                </div>
              </div>

              <button
                className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
                disabled={loading}
              >
                Submit Company Profile
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
