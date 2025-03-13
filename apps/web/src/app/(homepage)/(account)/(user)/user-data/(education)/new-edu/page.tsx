'use client';
import { Heading } from '@/components/heading';
import axiosInstance from '@/lib/axios';
import { EduSchema } from '@/lib/eduSchema';
import { IEduForm } from '@/lib/interface';
import { Field, Form, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const NewEdu = () => {
  const [eduLevels, setEduLevels] = useState<string[]>([]);
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const respEduLevel = await axiosInstance.get(
          '/api/education/edu-level',
        );
        setEduLevels(respEduLevel.data.eduLevel);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    fetchEnums();
  }, []);
  const onSubmit = async (values: any) => {
    try {
      //   console.log('Value : ' + JSON.stringify(values));
      const { data } = await axiosInstance.post('/api/education/new', values);
      toast.success(data.message);
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
        title="New Education Data"
        description="Form to add new education"
      />
      <hr className="border-2 border-purple-500 rounded-full" />
      <div className="my-2">
        <Formik
          initialValues={{
            eduLevelName: '',
            school: '',
            discipline: '',
            beginDate: '',
            finishDate: '',
            isStillStudying: false,
            desc: '',
          }}
          validationSchema={EduSchema}
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
                    as="select"
                    className="formik-input"
                  >
                    <option value="" disabled>
                      Select education level
                    </option>
                    {eduLevels.map((eduLevel) => (
                      <option value={eduLevel} key={eduLevel}>
                        {eduLevel.charAt(0).toUpperCase() + eduLevel.slice(1)}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="mb-3">
                  <label>School :</label>
                  <Field
                    name="school"
                    className="formik-input"
                    placeholder="School name"
                  />
                </div>

                <div className="mb-3">
                  <label>Discipline :</label>
                  <Field
                    name="discipline"
                    className="formik-input"
                    placeholder="Field of study"
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
    </div>
  );
};

export default NewEdu;
