import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

interface IValidationMessage {
  questionRequired: string;
  questionLength: string;
  optionsRequired: string;
  optionLength: string;
  answerRequired: string;
  answerInOptions: string;
}

const validationMessage: IValidationMessage = {
  questionRequired: 'Question required',
  questionLength:
    'Question text must be 1 character minimum and 200 character maximum',
  optionsRequired: 'Question must have exactly 4 options',
  optionLength:
    'Options text must be 1 character minimum and 200 character maximum',
  answerRequired: 'Question must have a correct answer',
  answerInOptions: 'The correct answer must be one of the provided options',
};

export const skillQuestValidation = [
  body('question')
    .notEmpty()
    .withMessage(validationMessage.questionRequired)
    .isLength({ min: 1, max: 200 })
    .withMessage(validationMessage.questionLength),
  body('options').custom((value) => {
    let options;
    try {
      options = JSON.parse(value); // Parse options karena dikirim sebagai string
      console.log(typeof options);
    } catch (error) {
      throw new Error('Options must be a valid JSON array');
    }
    if (!Array.isArray(options) || options.length !== 4) {
      console.log(typeof options);
      throw new Error(`is not array}`);
      // throw new Error(validationMessage.optionsRequired);
    }
    if (
      !options.every(
        (opt) =>
          typeof opt === 'string' && opt.length >= 1 && opt.length <= 200,
      )
    ) {
      throw new Error(validationMessage.optionLength);
    }
    return true;
  }),
  body('answer').custom((value, { req }) => {
    let options;
    try {
      options = JSON.parse(req.body.options); // Parse options dari req.body
    } catch (error) {
      throw new Error('Options must be a valid JSON array');
    }
    if (!options.includes(value)) {
      throw new Error(validationMessage.answerInOptions);
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new Error(errors.array()[0].msg);
      }
      next();
    } catch (error) {
      next(error);
    }
  },
];

export const updateSkillQuestValidation = [
  body('question')
    .isLength({ min: 1, max: 200 })
    .withMessage(validationMessage.questionLength),
  body('options').custom((value) => {
    let options;
    try {
      options = JSON.parse(value); // Parse options karena dikirim sebagai string
      console.log(typeof options);
    } catch (error) {
      throw new Error('Options must be a valid JSON array');
    }
    if (!Array.isArray(options) || options.length !== 4) {
      console.log(typeof options);
      throw new Error(validationMessage.optionsRequired);
      // throw new Error(validationMessage.optionsRequired);
    }
    if (
      !options.every(
        (opt) =>
          typeof opt === 'string' && opt.length >= 1 && opt.length <= 200,
      )
    ) {
      throw new Error(validationMessage.optionLength);
    }
    return true;
  }),
  body('answer')
    .notEmpty()
    .withMessage(validationMessage.answerRequired)
    .custom((value, { req }) => {
      let options;
      try {
        options = JSON.parse(req.body.options); // Parse options dari req.body
      } catch (error) {
        throw new Error('Options must be a valid JSON array');
      }
      if (!options.includes(value)) {
        console.log(options);
        console.log(value);
        throw new Error(validationMessage.answerInOptions);
      }
      return true;
    }),
];
