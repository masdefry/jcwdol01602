'use client';
import { Heading } from '@/components/heading';
import axiosInstance from '@/lib/axios';
import { IWorker, IWorkerForm } from '@/lib/interface';
import { WorkSchema } from '@/lib/workSchema';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const page = () => {
  const { workerId } = useParams();
  const [work, setWork] = useState<IWorker>();
  const router = useRouter();

  useEffect(() => {
    const getWorkData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/worker/work-data/${workerId}`,
        );
        setWork(data.work);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getWorkData();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      //   console.log(`values : ${JSON.stringify(values)}`);
      const { data } = await axiosInstance.patch(
        `/api/worker/update/${workerId}`,
        values,
      );
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
      <Heading
        title="Edit Work Experience"
        description="Form to edit your work experience"
      />
      <hr className="border-2 border-purple-500 rounded-full" />
      {work ? (
        <div className="my-2">
          <Formik
            initialValues={{
              companyName: work.companyName,
              position: work.position,
              beginDate: new Date(work.startDate).toISOString().split('T')[0],
              finishDate: work.endDate
                ? new Date(work.endDate).toISOString().split('T')[0]
                : '',
              isStillWorking: false,
              desc: work.description ? work.description : '',
            }}
            enableReinitialize
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
                        name="companyName"
                        className="bg-gray-100 border text-slate-400 border-gray-300 focus:border-gray-300 placeholder-slate-400 w-full rounded-lg p-2 text-base"
                        disabled
                      />
                    </div>

                    {/* Position */}
                    <div className="mb-3">
                      <label htmlFor="position">Positon :</label>
                      <Field
                        name="position"
                        className="bg-gray-100 border text-slate-400 border-gray-300 focus:border-gray-300 placeholder-slate-400 w-full rounded-lg p-2 text-base"
                        disabled
                      />
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
                          props.setFieldValue(
                            'isStillWorking',
                            e.target.checked,
                          );
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

                  <div className="flex items-center justify-end">
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
      ) : (
        <div>...loading</div>
      )}
    </div>
  );
};

export default page;
