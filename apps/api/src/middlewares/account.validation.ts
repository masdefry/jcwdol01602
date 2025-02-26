import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

interface IValidateMessage {
  name: {
    notEmpty: string;
    length: string;
  };
  email: {
    notEmpty: string;
    isEmail: string;
  };
  password: {
    notEmpty: string;
    format: string;
  };
  compPhoneRequire: string;
  pobRequire: string;
  dobStringRequire: string;
  genderNameRequire: string;
  addressRequire: string;
  eduLevelNameRequire: string;
  schoolRequire: string;
  disciplineRequire: string;
  beginDateRequire: string;
}

const validationMessage: IValidateMessage = {
  name: {
    notEmpty: 'Name is required',
    length: 'Name must be 3 characters minimum and 30 characters maximum',
  },
  email: {
    notEmpty: 'Email is required',
    isEmail: 'Invalid email address',
  },
  password: {
    notEmpty: 'Password is required',
    format:
      'Password need to have atleast 6 characters with 1 Uppercase and 1 Special character',
  },
  compPhoneRequire: 'Company Phone is required',
  pobRequire: 'POB is required',
  dobStringRequire: 'DOB is required',
  genderNameRequire: 'Gender name is required',
  addressRequire: 'Address is required',
  eduLevelNameRequire: 'Education level is required',
  schoolRequire: 'School name is required',
  disciplineRequire: 'Education discipline is required',
  beginDateRequire: 'Education begin date is required',
};

// Register Validation
export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage(validationMessage.name.notEmpty)
    .isLength({ min: 3, max: 30 })
    .withMessage(validationMessage.name.length),
  body('email')
    .notEmpty()
    .withMessage(validationMessage.email.notEmpty)
    .isEmail()
    .withMessage(validationMessage.email.isEmail),
  body('password')
    .notEmpty()
    .withMessage(validationMessage.password.notEmpty)
    .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/)
    .withMessage(validationMessage.password.format),

  // Handler to validate
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
      next();
    } catch (err) {
      next(err);
    }
  },
];

export const userRegistValidation = [
  body('name')
    .notEmpty()
    .withMessage(validationMessage.name.notEmpty)
    .isLength({ min: 3, max: 30 })
    .withMessage(validationMessage.name.length),
  body('email')
    .notEmpty()
    .withMessage(validationMessage.email.notEmpty)
    .isEmail()
    .withMessage(validationMessage.email.isEmail),
  body('password')
    .notEmpty()
    .withMessage(validationMessage.password.notEmpty)
    .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/)
    .withMessage(validationMessage.password.format),
  body('pob').notEmpty().withMessage(validationMessage.pobRequire),
  body('dobString').notEmpty().withMessage(validationMessage.dobStringRequire),
  body('genderName')
    .notEmpty()
    .withMessage(validationMessage.genderNameRequire),
  body('address').notEmpty().withMessage(validationMessage.addressRequire),
  body('school').notEmpty().withMessage(validationMessage.schoolRequire),
  body('discipline')
    .notEmpty()
    .withMessage(validationMessage.disciplineRequire),
  body('beginDate').notEmpty().withMessage(validationMessage.beginDateRequire),

  // Handler to validate
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
      next();
    } catch (err) {
      next(err);
    }
  },
];

export const adminRegistValidation = [
  body('name')
    .notEmpty()
    .withMessage(validationMessage.name.notEmpty)
    .isLength({ min: 3, max: 30 })
    .withMessage(validationMessage.name.length),
  body('email')
    .notEmpty()
    .withMessage(validationMessage.email.notEmpty)
    .isEmail()
    .withMessage(validationMessage.email.isEmail),
  body('password')
    .notEmpty()
    .withMessage(validationMessage.password.notEmpty)
    .matches(/^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/)
    .withMessage(validationMessage.password.format),
  body('compPhone').notEmpty().withMessage(validationMessage.compPhoneRequire),

  // Handler to validate
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
      next();
    } catch (err) {
      next(err);
    }
  },
];

export const loginValidation = [
  body('email').isEmail().withMessage(validationMessage.email.isEmail),

  // Handler to validate
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
      next();
    } catch (error) {
      next(error);
    }
  },
];
