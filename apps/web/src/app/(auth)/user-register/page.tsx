'use client';

import { Formik, Form, FormikProps, Field } from 'formik';
import { RegisterSchema } from '@/lib/schema';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/logo';
import { BackToHomePage } from '@/components/button/backToHpBtn';

export default function Register() {
  const router = useRouter();

  interface IRegister {
    name: string;
    email: string;
    password: string;
    retypePass: string;
  }

  const handleContinue = (values: IRegister) => {
    localStorage.setItem('userRegistData', JSON.stringify(values));
    toast.success('Registration data retrieved');
    setTimeout(() => router.push('/user-register/user-data'), 2000);
  };

  // Fungsi untuk menampilkan error dari Formik ke toast
  const showValidationErrors = (errors: Record<string, string>) => {
    Object.values(errors).forEach((error) => {
      toast.error(error);
    });
  };

  return (
    <div className="relative flex h-screen bg-gradient-to-b from-yellow-400 to-orange-400 overflow-hidden">
      {/* Left Section (Image) */}
      <div className="hidden md:block w-2/5 h-full">
        <Image
          src="https://res.cloudinary.com/dnqgu6x1e/image/upload/final-project/web/wxewwasc4ibytes62jzy.jpg"
          alt="login-bg-img"
          fill
          className="object-cover"
        />
      </div>

      {/* Background shape */}
      <div className="relative w-full lg:w-3/5 flex bg-gradient-to-b from-fuchsia-600 to-purple-600 shape shadow-lg" />

      {/* Register Form */}
      <div className="absolute md:p-16 lg:p-28 w-full h-full flex items-center justify-center md:justify-end left z-10">
        <div>
          <div className="flex flex-row justify-between py-2 gap-4">
            <div>
              <h1 className="font-bold text-2xl">Welcome to</h1>
              <Logo />
            </div>
            <div className="flex items-end">
              <BackToHomePage />
            </div>
          </div>

          <div className="border rounded-lg p-4 shadow-md bg-white">
            <h1 className="font-bold text-lg">Register as new jobseeker</h1>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                retypePass: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleContinue(values);
                setSubmitting(false);
              }}
            >
              {(props: FormikProps<IRegister>) => {
                const {
                  values,
                  errors,
                  handleChange,
                  isSubmitting,
                  handleSubmit,
                  validateForm,
                } = props;

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
                    {/* Step 1 - basic info */}
                    {/* Name */}
                    <div className="">
                      <label htmlFor="name" className="formik-label">
                        Name :
                      </label>
                      <Field
                        className="formik-input"
                        type="text"
                        name="name"
                        onChange={handleChange}
                        value={values.name}
                      />
                    </div>

                    {/* Email */}
                    <div className="">
                      <label htmlFor="email" className="formik-label">
                        Email :
                      </label>
                      <Field
                        className="formik-input"
                        type="text"
                        name="email"
                        onChange={handleChange}
                        value={values.email}
                      />
                    </div>

                    {/* Password */}
                    <div className="">
                      <label htmlFor="password" className="block text-base">
                        Password :
                      </label>
                      <Field
                        className="formik-input"
                        type="password"
                        name="password"
                        onChange={handleChange}
                        value={values.password}
                      />
                    </div>

                    {/* Retype Password */}
                    <div className="">
                      <label htmlFor="retypePass" className="block text-base">
                        Re-type Password :
                      </label>
                      <Field
                        className="formik-input"
                        type="password"
                        name="retypePass"
                        onChange={handleChange}
                        value={values.retypePass}
                      />
                    </div>
                    {/* Submit Button */}
                    <button
                      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Continue
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
        </div>
      </div>
    </div>
  );
}
