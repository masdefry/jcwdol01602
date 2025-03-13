'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Field, Form, Formik, FormikProps } from 'formik';
import { Heading } from '@/components/heading';
import { WorkSchema } from '@/lib/workSchema';
import toast from 'react-hot-toast';
import { ICompanyData, IWorkerForm } from '@/lib/interface';
import axiosInstance from '@/lib/axios';

const NewWork = () => {
  const [companies, setCompanies] = useState<ICompanyData[]>([]);
  const router = useRouter();
  const [customCompany, setCustomCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    const getCompanyData = async () => {
      try {
        const { data } = await axiosInstance.get('/api/account/company');
        setCompanies(data.company);
        console.log(data.company);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getCompanyData();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const { data } = await axiosInstance.post(`/api/worker/new-work`, values);
      toast.success(data.message);
      setTimeout(() => router.push('/user-data/profile'), 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  };

  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };
  return (
    <div className="p-2">
      <Heading title="New Work" description="Form to add new work experience" />
      <hr className="border-2 border-purple-500 rounded-full" />
      <div className="my-2">
        <Formik
          initialValues={{
            companyName: '',
            position: '',
            beginDate: '',
            finishDate: '',
            isStillWorking: false,
            desc: '',
          }}
          validationSchema={WorkSchema}
          onSubmit={(values) => onSubmit(values)}
        >
          {(props: FormikProps<IWorkerForm>) => {
            const { validateForm, handleSubmit, isSubmitting } = props;
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
                <div className="flex flex-col">
                  {/* CompanyName */}
                  <div className="mb-3">
                    <label htmlFor="companyName">Company Name :</label>
                    <Field
                      as="select"
                      name="companyName"
                      className="formik-input"
                      value={selectedCompany} // Menggunakan state untuk memastikan opsi tetap
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const selectedValue = e.target.value;
                        setSelectedCompany(selectedValue); // Simpan nilai yang dipilih
                        setCustomCompany(selectedValue === 'other');
                        props.setFieldValue(
                          'companyName',
                          selectedValue === 'other' ? '' : selectedValue,
                        );
                      }}
                    >
                      <option value="" disabled>
                        Select company
                      </option>
                      {companies.map((company, idx) => (
                        <option value={company.name} key={idx}>
                          {company.name.charAt(0).toUpperCase() +
                            company.name.slice(1)}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </Field>

                    {customCompany && (
                      <Field
                        name="companyName"
                        className="formik-input mt-2"
                        placeholder="Enter company name"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setSelectedCompany('other'); // Pastikan select tetap menunjukkan "Other"
                          props.setFieldValue('companyName', e.target.value);
                        }}
                      />
                    )}
                  </div>

                  {/* Position */}
                  <div className="mb-3">
                    <label htmlFor="position">Positon :</label>
                    <Field name="position" className="formik-input" />
                  </div>
                </div>

                {/* Begin Date */}
                <div className="mb-3">
                  <label>Start Date :</label>
                  <Field
                    name="beginDate"
                    type="date"
                    className="formik-input"
                  />
                </div>

                {/* End Date */}
                <div className="mb-3">
                  <label>End date :</label>
                  <Field
                    className="formik-input"
                    type="date"
                    name="finishDate"
                    disabled={props.values.isStillWorking}
                  />
                  <div className="flex gap-2 items-center mt-2">
                    <Field
                      type="checkbox"
                      name="isStillWorking"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        props.setFieldValue('isStillWorking', e.target.checked);
                        props.setFieldValue(
                          'finishDate',
                          e.target.checked ? '' : props.values.finishDate,
                        );
                      }}
                    />
                    <label htmlFor="isStillWorking">
                      I am still working here
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="desc">Description (optional) :</label>
                  <Field
                    as="textarea"
                    name="desc"
                    className="bg-gray-100 border text-black border-gray-300 focus:border-gray-300 placeholder-slate-400 w-full rounded-lg p-2 text-base h-28 resize-none"
                    placeholder="Describe your role and responsibilities"
                  />
                </div>

                <div className="flex items-center justify-end md:px-16">
                  <button
                    type="submit"
                    className="w-fit bg-yellow-200 hover:bg-yellow-400 px-4 font-semibold text-gray-800 hover:text-black py-2 rounded ease-in-out duration-150"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default NewWork;
