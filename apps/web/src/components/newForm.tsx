'use client';
import React, { useEffect, useState } from 'react';
import {
  Formik,
  Form,
  FormikProps,
  Field,
  FormikHelpers,
  FormikValues,
  FormikErrors,
} from 'formik';
import toast from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/solid';

// Tipe untuk field konfigurasi
interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'checkbox' | 'textarea' | 'select' | 'file';
  options?: { id: string; name: string }[];
}

// Tipe untuk props form yang menerima parameter generic T yang harus merupakan turunan dari FormikValues
interface FormProps<T extends FormikValues> {
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
  fields: FieldConfig[];
  options?: { id: string; name: string }[];
  disabled: boolean;
}

const NewForm = <T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  options = [],
  disabled,
}: FormProps<T>) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof initialValues.image === 'string' && initialValues.image) {
      setImagePreview(initialValues.image);
    } else {
      setImagePreview(null);
    }
  }, [initialValues.image]);

  // function to handle file change
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Check the file size
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Image size must be less than 1MB');
        setFieldValue('image', null);
        return;
      }
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only, JPG, JPEG and PNG files are allowed');
        setFieldValue('image', null);
        return;
      }
      setFieldValue('image', file);
      const fileURL = URL.createObjectURL(file);
      // console.log(fileURL);
      setImagePreview(fileURL);
    }
  };

  // Function to handle image delete
  const handleDeleteImage = (setFieldValue: any) => {
    setFieldValue('image', null); // Reset Formik field
    setImagePreview(null); // Reset preview
  };

  const showValidationErrors = (errors: FormikErrors<T>) => {
    Object.values(errors).forEach((error) => {
      if (typeof error === 'string') {
        toast.error(error);
      } else if (Array.isArray(error)) {
        error.forEach((subError) => {
          if (typeof subError === 'string') {
            toast.error(subError);
          }
        });
      }
    });
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(props: FormikProps<T>) => {
          const {
            values,
            validateForm,
            handleSubmit,
            handleChange,
            setFieldValue,
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
              {fields.map((field) => (
                <div key={field.name} className="py-2">
                  <label htmlFor={field.name} className="formik-label">
                    {field.label} :
                  </label>
                  <div>
                    {field.type === 'select' ? (
                      <Field
                        className="formik-input"
                        name={field.name}
                        as="select"
                        onChange={handleChange}
                      >
                        <option value="">Select an option</option>
                        {options.map((opt) => (
                          <option key={opt.id} value={opt.name}>
                            {opt.name}
                          </option>
                        ))}
                      </Field>
                    ) : field.type === 'checkbox' ? (
                      <Field
                        className=""
                        type="checkbox"
                        name={field.name}
                        checked={values[field.name as keyof T] as boolean}
                        onChange={handleChange}
                      />
                    ) : field.type === 'file' ? (
                      <div className="flex items-center justify-center border bg-gray-100 p-2">
                        {/* Image Preview */}
                        {imagePreview ? (
                          <div className="mr-4 relative">
                            <div className="absolute right-1 top-1">
                              <button
                                className="text-red-400 rounded-full bg-white font-bold border hover:border-red-500 border-white p-1 hover:bg-red-500 hover:text-black duration-150 ease-in-out"
                                onClick={() => handleDeleteImage(setFieldValue)}
                              >
                                <XMarkIcon width={20} height={20} />
                              </button>
                            </div>
                            <img
                              src={imagePreview}
                              alt="image Preview"
                              className="w-24 h-24 object-cover border border-gray-300 rounded"
                            />
                          </div>
                        ) : (
                          <div className="mr-4 w-24 h-24 object-cover border bg-white border-gray-300 rounded" />
                        )}
                        {/* File Input */}
                        <label htmlFor={field.name} className="cursor-pointer">
                          <div className="bg-blue-300 border rounded-lg p-2 hover:bg-blue-400 duration-150 ease-in-out">
                            Choose File
                          </div>
                          <input
                            type="file"
                            id={field.name}
                            name={field.name}
                            onChange={(e) => handleFileChange(e, setFieldValue)}
                            accept="image/*"
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <Field
                        className="formik-input"
                        as={field.type === 'textarea' ? 'textarea' : 'input'}
                        type={field.type}
                        name={field.name}
                        onChange={handleChange}
                        value={values[field.name as keyof T] as string}
                      />
                    )}
                  </div>
                </div>
              ))}
              <button
                className={`mt-5 hover:bg-blue-700  font-bold py-2 px-4 rounded bg-blue-500 text-white
                 `}
                type="submit"
                disabled={disabled}
              >
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewForm;
