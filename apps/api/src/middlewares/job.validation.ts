import { body } from 'express-validator';

export const JobValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('deadline').notEmpty().isISO8601().toDate().withMessage('Invalid deadline'),
];
