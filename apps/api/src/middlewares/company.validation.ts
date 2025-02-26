import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

interface IValidateMessage {
  nameLength: string;
  websiteFormat: string;
  descLength: string;
}

const validationMessage: IValidateMessage = {
  nameLength: 'Name must be 3 characters minimum and 30 characters maximum',
  websiteFormat: 'Invalid company website url format',
  descLength: 'Description must be 300 characters maximum',
};

export const companyValidation = [
  body('name')
    .isLength({ min: 3, max: 30 })
    .withMessage(validationMessage.nameLength),
  body('website').isURL().withMessage(validationMessage.websiteFormat),
  body('desc').isLength({ max: 300 }).withMessage(validationMessage.descLength),

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
