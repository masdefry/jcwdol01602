// lib/schema.ts

import * as Yup from 'yup';

export const CompanySchema = Yup.object().shape({
  name: Yup.string().required('Company name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  website: Yup.string().url('Invalid URL').required('Website is required'),
  description: Yup.string().required('Description is required'),
  logo: Yup.string().url('Invalid URL').required('Logo URL is required'),
  socialMedia: Yup.string()
    .test('is-json', 'Social media must be valid JSON', (value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    }),
});

export const RegiserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
