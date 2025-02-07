import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

interface IValidateMessage {
  name: {
    notEmpty: string;
    length: string;
  };
  price: {
    format: string;
  };
  cv: {
    format: string;
  };
  skill: {
    format: string;
  };
  priority: {
    format: string;
  };
}

const ValidationMessage: IValidateMessage = {
  name: {
    notEmpty: 'Name is required',
    length: 'Name must be 3 characters minimum and 30 characters maximum',
  },
  price: {
    format: 'Price must be a number',
  },
  cv: {
    format: 'Invalid cv input format, please insert boolean',
  },
  skill: {
    format: 'Invalid skill input format, please insert boolean',
  },
  priority: {
    format: 'Invalid priority input format, please insert boolean',
  },
};

// New Subs Category
const NewSubsCtgValidation = [
  body('name')
    .notEmpty()
    .withMessage(ValidationMessage.name.notEmpty)
    .isLength({ min: 3, max: 30 })
    .withMessage(ValidationMessage.name.length),
  body('price').isNumeric().withMessage(ValidationMessage.price.format),
  body('cv').isBoolean().withMessage(ValidationMessage.cv.format),
  body('skill').isBoolean().withMessage(ValidationMessage.skill.format),
  body('priority').isBoolean().withMessage(ValidationMessage.skill.format),

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

export { NewSubsCtgValidation };
