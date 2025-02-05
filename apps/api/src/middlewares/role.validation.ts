import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

interface IValidationMessage {
  name: {
    notEmpty: string;
    length: string;
  };
}

const ValidationMessage: IValidationMessage = {
  name: {
    notEmpty: 'Role name required!',
    length: 'Role name must be between 3 and 20 characters',
  },
};

const RoleValidation = [
  body('name')
    .notEmpty()
    .withMessage(ValidationMessage.name.notEmpty)
    .isLength({ min: 3, max: 20 })
    .withMessage(ValidationMessage.name.length),

  // Handler to validate
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
    } catch (error) {
      next(error);
    }
  },
];

export { RoleValidation };
