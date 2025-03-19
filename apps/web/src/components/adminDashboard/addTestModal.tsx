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
    type: 'text' | 'checkbox' | 'textarea' | 'select' | 'file' | 'date' | 'string' | 'datetime-local';
    options?: { value: string; label: string }[];
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

const AddTestModal = <T extends FormikValues>({
    title = 'Add New Test',
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
            className={`fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 modal-overlay ${isOpen ? 'open' : ''
                }`}
        >
            <div
                ref={modalRef}
                className={`bg-white p-6 rounded-lg shadow-lg w-[400px] lg:w-[600px] max-h-[90vh] overflow-y-auto modal-content ${show ? 'open' : ''
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
                            handleChange,
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
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </Field>
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

export default AddTestModal;
