'use client';
import { BackToHomePage } from '@/components/button/backToHpBtn';
import Logo from '@/components/logo';
import axiosInstance from '@/lib/axios';
import { CompRegistSchema } from '@/lib/schema';
import { Formik, Form, Field, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface IAdminRegist {
  name: string;
  email: string;
  password: string;
  retypePass: string;
  compPhone: string;
}

const CompRegist = () => {
  const router = useRouter();
  const onSubmit = async (values: any) => {
    try {
      const { data } = await axiosInstance.post(
        '/api/account/new-admin',
        values,
      );
      toast.success(data.message);
      setTimeout(() => router.push('/'), 2000);
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
    <div className="p-4 bg-gradient-to-b from-fuchsia-600 to-purple-600 h-screen flex justify-center items-center ">
      <div className="mb-2 flex flex-col gap-4">
        <div className="flex flex-row gap-4 justify-between">
          <div className="flex flex-col">
            <Logo />
            <h1 className="text-black font-semibold text-xl">
              Registration for Company
            </h1>
          </div>
          <div className="flex items-end">
            <BackToHomePage />
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h1 className="font-bold text-lg">Register company</h1>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              retypePass: '',
              compPhone: '',
            }}
            validationSchema={CompRegistSchema}
            onSubmit={(values, { setSubmitting }) => {
              onSubmit(values);
              setSubmitting(false);
            }}
          >
            {(props: FormikProps<IAdminRegist>) => {
              const { values, isSubmitting, handleSubmit, validateForm } =
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
                  <div className="">
                    <label htmlFor="name" className="formik-label">
                      Name :
                    </label>
                    <Field className="formik-input" type="text" name="name" />
                  </div>
                  <div className="">
                    <label htmlFor="email" className="formik-label">
                      Email :
                    </label>
                    <Field className="formik-input" type="text" name="email" />
                  </div>
                  <div className="">
                    <label htmlFor="password" className="block text-base">
                      Password :
                    </label>
                    <Field
                      className="formik-input"
                      type="password"
                      name="password"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="retypePass" className="block text-base">
                      Re-type Password :
                    </label>
                    <Field
                      className="formik-input"
                      type="password"
                      name="retypePass"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="retypePass" className="block text-base">
                      Company Phone :
                    </label>
                    <Field
                      className="formik-input"
                      type="text"
                      name="compPhone"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-fit bg-yellow-200 hover:bg-yellow-400 px-4 font-semibold text-gray-800 hover:text-black py-2 rounded ease-in-out duration-150"
                  >
                    Submit
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CompRegist;
