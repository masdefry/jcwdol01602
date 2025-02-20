import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

interface IValidateMessage {
  skillName: {
    notEmpty: string;
    length: string;
  };
}

const validationMessage: IValidateMessage = {
  skillName: {
    notEmpty: 'Skill name is required',
    length: 'Skill name must be 3 characters minimum and 30 characters maximum',
  },
};

export const skillInputValidation = [
  body('skillName')
    .notEmpty()
    .withMessage(validationMessage.skillName.notEmpty)
    .isLength({ min: 3, max: 30 })
    .withMessage(validationMessage.skillName.length),

  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new Error(errors.array()[0].msg);
    } catch (error) {
      next(error);
    }
  },
];
