import { object, string, InferType, ref } from 'yup';

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
  retypePass: {
    notEmpty: string;
    notMatch: string;
  };
  pobRequired: string;
  dobStringRequired: string;
  genderNameRequired: string;
  addressRequired: string;
  eduLevelNameRequired: string;
  schoolRequired: string;
  disciplineRequired: string;
  beginDateRequired: string;
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
  retypePass: {
    notEmpty: 'Please retype your password',
    notMatch: "Your retyped password doesn't match with your password",
  },
  pobRequired: 'Place of birth is required',
  dobStringRequired: 'Date of birth is required',
  genderNameRequired: 'Gender is required',
  addressRequired: 'Address is required',
  eduLevelNameRequired: 'Education level is required',
  schoolRequired: 'School is required',
  disciplineRequired: 'Discipline is required',
  beginDateRequired: 'Education begin date is required',
};

export const RegisterSchema = object({
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
  retypePass: string()
    .required(validationMessage.retypePass.notEmpty)
    .oneOf([ref('password')], validationMessage.retypePass.notMatch),
});

export const UserRegistSchema = object({
  pob: string().required(validationMessage.pobRequired),
  dobString: string().required(validationMessage.dobStringRequired),
  genderName: string().required(validationMessage.genderNameRequired),
  address: string().required(validationMessage.addressRequired),
  eduLevelName: string().required(validationMessage.eduLevelNameRequired),
  school: string().required(validationMessage.schoolRequired),
  discipline: string().required(validationMessage.disciplineRequired),
  beginDate: string().required(validationMessage.beginDateRequired),
  finishDate: string().nullable(),
});

export const loginSchema = object({
  email: string()
    .email(validationMessage.accountEmail.isEmail)
    .required(validationMessage.accountEmail.notEmpty),
  password: string().required(validationMessage.password.notEmpty),
});
