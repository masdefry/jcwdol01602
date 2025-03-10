'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Formik,
  Form,
  Field,
  FormikProps,
  FormikValues,
  FormikHelpers,
  FormikErrors,
} from 'formik';
import { XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import ButtonCustom from '../button/btn';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'checkbox' | 'textarea' | 'select' | 'file' | 'date' | 'string' | 'datetime-local' ;
  options?: { id: string; name: string }[];
}

interface ModalCreateProps<T extends FormikValues> {
  title?: string;
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: T, helpers: FormikHelpers<T>) => Promise<void>;
  fields: FieldConfig[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  disabled: boolean;
}

const ModalCreate = <T extends FormikValues>({
  title = 'Create Data',
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  isOpen,
  setIsOpen,
  disabled,
}: ModalCreateProps<T>) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [imagePreview, setImagePreview] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
    fieldName: string,
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Image size must be less than 1MB');
        setFieldValue(fieldName, null);
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPG, JPEG, and PNG files are allowed');
        setFieldValue(fieldName, null);
        return;
      }
      setFieldValue(fieldName, file);
      const fileURL = URL.createObjectURL(file);
      setImagePreview((prev) => ({ ...prev, [fieldName]: fileURL }));
    }
  };

  const handleDeleteImage = (setFieldValue: any, fieldName: string) => {
    setFieldValue(fieldName, null);
    setImagePreview((prev) => ({ ...prev, [fieldName]: null }));
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

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 modal-overlay ${
        isOpen ? 'open' : ''
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white p-6 rounded-lg shadow-lg w-[400px] lg:w-[600px] max-h-[90vh] overflow-y-auto modal-content ${
          show ? 'open' : ''
        }`}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{title}</h1>
          <button
            onClick={closeModal}
            className="text-red-500 border-red-500 border-2 bg-white p-1 rounded-full hover:bg-red-500 hover:text-white transition duration-150"
          >
            <XMarkIcon width={20} height={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props: FormikProps<T>) => {
            const {
              values,
              handleChange,
              setFieldValue,
              validateForm,
              handleSubmit,
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
                          as="select"
                          name={field.name}
                          onChange={handleChange}
                          className="formik-input"
                        >
                          <option value="">Select an option</option>
                          {field.options?.map((opt) => (
                            <option key={opt.id} value={opt.name}>
                              {opt.name}
                            </option>
                          ))}
                        </Field>
                      ) : field.type === 'checkbox' ? (
                        <Field
                          type="checkbox"
                          name={field.name}
                          checked={values[field.name as keyof T] as boolean}
                          onChange={handleChange}
                        />
                      ) : field.type === 'file' ? (
                        <div className="flex items-center justify-center border bg-gray-100 p-2">
                          {imagePreview[field.name] ? (
                            <div className="mr-4 relative">
                              <div className="absolute right-1 top-1">
                                <button
                                  className="text-red-400 rounded-full bg-white font-bold border hover:border-red-500 border-white p-1 hover:bg-red-500 hover:text-black duration-150 ease-in-out"
                                  onClick={() =>
                                    handleDeleteImage(setFieldValue, field.name)
                                  }
                                >
                                  X
                                </button>
                              </div>
                              <img
                                src={imagePreview[field.name] as string}
                                alt="image Preview"
                                className="w-24 h-24 object-cover border border-gray-300 rounded"
                              />
                            </div>
                          ) : (
                            <div className="mr-4 w-24 h-24 object-cover border bg-white border-gray-300 rounded" />
                          )}
                          <label
                            htmlFor={field.name}
                            className="cursor-pointer"
                          >
                            <div className="bg-blue-300 border rounded-lg p-2 hover:bg-blue-400 duration-150 ease-in-out">
                              Choose File
                            </div>
                            <input
                              type="file"
                              id={field.name}
                              name={field.name}
                              onChange={(e) =>
                                handleFileChange(e, setFieldValue, field.name)
                              }
                              accept="image/*"
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : field.type === 'date' ? (
                        <Field
                          type="date"
                          name={field.name}
                          className="formik-input"
                        />
                      ) : (
                        <Field
                          className="formik-input"
                          as={field.type === 'textarea' ? 'textarea' : 'input'}
                          type={field.type}
                          name={field.name}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <ButtonCustom
                  btnName="Submit"
                  disabled={disabled}
                  type="submit"
                />
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ModalCreate;
