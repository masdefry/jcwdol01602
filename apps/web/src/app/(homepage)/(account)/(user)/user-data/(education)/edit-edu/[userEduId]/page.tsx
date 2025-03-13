'use client';
import { Heading } from '@/components/heading';
import axiosInstance from '@/lib/axios';
import { EduSchema } from '@/lib/eduSchema';
import { IEduForm, IUserEdu } from '@/lib/interface';
import { capitalizeFirstLetter } from '@/lib/stringFormat';
import { Field, Form, Formik, FormikProps } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const EditEdu = () => {
  const { userEduId } = useParams();
  const [userEdu, setUserEdu] = useState<IUserEdu>();
  const router = useRouter();

  useEffect(() => {
    const getUserEdu = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/education/data/${userEduId}`,
        );
        setUserEdu(data.userEdu);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    getUserEdu();
  }, []);

  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };

  const onSubmit = async (values: any) => {
    try {
      //   console.log('Value : ' + JSON.stringify(values));
      const { data } = await axiosInstance.patch(
        `/api/education/update/${userEduId}`,
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

  return (
    <div className="p-2">
      <Heading
        title="New Education Data"
        description="Form to add new education"
      />
      <hr className="border-2 border-purple-500 rounded-full" />
      {userEdu ? (
        <div className="my-2">
          <Formik
            initialValues={{
              eduLevelName: userEdu.level,
              school: userEdu.school,
              discipline: userEdu.discipline,
              beginDate: new Date(userEdu.startDate)
                .toISOString()
                .split('T')[0],
              finishDate: userEdu.endDate
                ? new Date(userEdu.endDate).toISOString().split('T')[0]
                : '',
              isStillStudying: false,
              desc: userEdu.description ? userEdu.description : '',
            }}
            validationSchema={EduSchema}
            enableReinitialize
            onSubmit={(values) => onSubmit(values)}
          >
            {(props: FormikProps<IEduForm>) => {
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
                  <div className="mb-3">
                    <label>Education level :</label>
                    <Field
                      name="eduLevelName"
                      className="bg-gray-100 border text-slate-400 border-gray-300 focus:border-gray-300 placeholder-slate-400 w-full rounded-lg mt-1 p-2 text-base"
                      placeholder="School name"
                      value={capitalizeFirstLetter(props.values.eduLevelName)}
                      disabled
                    ></Field>
                  </div>

                  <div className="mb-3">
                    <label>School :</label>
                    <Field
                      name="school"
                      className="bg-gray-100 border text-slate-400 border-gray-300 focus:border-gray-300 placeholder-slate-400 w-full rounded-lg mt-1 p-2 text-base"
                      placeholder="School name"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label>Discipline :</label>
                    <Field
                      name="discipline"
                      className="bg-gray-100 border text-slate-400 border-gray-300 focus:border-gray-300 placeholder-slate-400 w-full rounded-lg mt-1 p-2 text-base"
                      placeholder="Field of study"
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label>Education start date</label>
                    <Field
                      className="formik-input"
                      type="date"
                      name="beginDate"
                    />
                  </div>

                  <div className="mb-3">
                    <label>Education end date</label>
                    <Field
                      className="formik-input"
                      type="date"
                      name="finishDate"
                      disabled={props.values.isStillStudying}
                    />
                    <div className="flex gap-2 items-center mt-2">
                      <Field
                        type="checkbox"
                        name="isStillStudying"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          props.setFieldValue(
                            'isStillStudying',
                            e.target.checked,
                          );
                          props.setFieldValue(
                            'finishDate',
                            e.target.checked ? '' : props.values.finishDate,
                          );
                        }}
                      />
                      <label htmlFor="isStillStudying">
                        I am still studying here
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
                      placeholder="Tell us about your GPA and your field of study"
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

export default EditEdu;
