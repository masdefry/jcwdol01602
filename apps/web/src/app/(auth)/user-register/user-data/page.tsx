'use client';
import React from 'react';
import { Formik, Form, Field, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UserRegistSchema } from '@/lib/schema';
import axiosInstance from '@/lib/axios';
import Logo from '@/components/logo';
import { BackToHomePage } from '@/components/button/backToHpBtn';
import BackToRegist from '@/components/button/backToRegister';

interface IUserProfie {
  pob: string;
  dobString: string;
  genderName: string;
  address: string;
  eduLevelName: string;
  school: string;
  discipline: string;
  beginDate: string;
  finishDate: string;
  isStillStudying: boolean;
}

const UserData = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const [genders, setGenders] = useState<string[]>([]);
  const [eduLevels, setEduLevels] = useState<string[]>([]);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const respGender = await axiosInstance.get('/api/account/gender');
        const respEduLevel = await axiosInstance.get(
          '/api/education/edu-level',
        );
        setGenders(respGender.data.gender);
        setEduLevels(respEduLevel.data.eduLevel);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Something went wrong!';
        toast.error(errorMessage);
      }
    };
    fetchEnums();
  }, []);

  //   Take the data from localStorega
  useEffect(() => {
    const savedData = localStorage.getItem('userRegistData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      router.push('/user-register');
    }
  }, [router]);

  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };

  const backToRegister = () => {
    router.push('/register');
  };

  const onSubmit = async (values: any) => {
    try {
      const finalData = { ...formData, ...values };
      const { data } = await axiosInstance.post(
        '/api/account/new-user',
        finalData,
      );
      toast.success(data.message, { duration: 3000 });
      setTimeout(() => router.push('/'), 4000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong!';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-b flex flex-col from-fuchsia-600 to-purple-600">
      <div className="mb-2 flex justify-between">
        <div>
          <Logo />
          <h1 className="text-black font-semibold text-xl">
            Please fullfill your personal data
          </h1>
        </div>
        <div className="flex items-end">
          <BackToHomePage />
        </div>
      </div>
      <div className="bg-white rounded-lg p-4">
        <Formik
          initialValues={{
            pob: '',
            dobString: '',
            genderName: '',
            address: '',
            eduLevelName: '',
            school: '',
            discipline: '',
            beginDate: '',
            finishDate: '',
            isStillStudying: false,
          }}
          validationSchema={UserRegistSchema}
          onSubmit={onSubmit}
        >
          {(props: FormikProps<IUserProfie>) => {
            const { errors, validateForm, handleSubmit, isSubmitting } = props;
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
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                  {/* Step 2 - Additional Info */}
                  <div className="mb-3">
                    <label>Place of Birth</label>
                    <Field name="pob" className="formik-input" />
                  </div>
                  <div className="mb-3">
                    <label>Date of Birth</label>
                    <Field
                      name="dobString"
                      type="date"
                      className="formik-input"
                    />
                  </div>
                  <div className="mb-3">
                    <label>Gender</label>
                    <Field
                      name="genderName"
                      as="select"
                      className="formik-input"
                    >
                      <option value="">Select Gender</option>
                      {genders.map((gender) => (
                        <option value={gender} key={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-3">
                    <label>Address</label>
                    <Field name="address" className="formik-input" />
                  </div>
                  <div className="mb-3">
                    <label>Education level</label>
                    <Field
                      name="eduLevelName"
                      as="select"
                      className="formik-input"
                    >
                      <option value="">Select education level</option>
                      {eduLevels.map((eduLevel) => (
                        <option value={eduLevel} key={eduLevel}>
                          {eduLevel.charAt(0).toUpperCase() + eduLevel.slice(1)}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="mb-3">
                    <label>School</label>
                    <Field name="school" className="formik-input" />
                  </div>
                  <div className="mb-3">
                    <label>Discipline</label>
                    <Field name="discipline" className="formik-input" />
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
      <div className="my-2">
        <BackToRegist url="/user-register" />
      </div>
    </div>
  );
};

export default UserData;
