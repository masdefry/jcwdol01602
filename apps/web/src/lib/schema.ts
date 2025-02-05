import { object, string, InferType } from 'yup';

interface IValidationMessage {
  accountName: {
    notEmpty: string;
    length: string;
  };
  accountEmail: {
    notEmpty: string;
    isEmail: string;
  };
  password: {
    notEmpty: string;
    format: string;
  };
}

const validationMessage: IValidationMessage = {
  accountName: {
    notEmpty: 'Name is required',
    length: 'Name must be 3 characters minimum and 30 characters maximum!',
  },
  accountEmail: {
    notEmpty: 'Email is required',
    isEmail: 'Invalid email address',
  },
  password: {
    notEmpty: 'Password is required',
    format:
      'Password need to have atleast 6 characters with 1 Uppercase and 1 Special character',
  },
};

export const RegiserSchema = object({
  name: string()
    .required(validationMessage.accountName.notEmpty)
    .min(3, validationMessage.accountName.length)
    .max(30, validationMessage.accountName.length),
  email: string()
    .email(validationMessage.accountEmail.isEmail)
    .required(validationMessage.accountEmail.notEmpty),
  password: string()
    .required(validationMessage.password.notEmpty)
    .matches(
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      validationMessage.password.format,
    ),
});

export const loginSchema = object({
  email: string()
    .email(validationMessage.accountEmail.isEmail)
    .required(validationMessage.accountEmail.notEmpty),
  password: string().required(validationMessage.password.notEmpty),
});
