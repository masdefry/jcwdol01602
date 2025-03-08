import { NextFunction, Request, Response } from 'express';
import {
  createPreSelectionTest,
  getPreSelectionTestByJobId,
  updatePreSelectionTest,
  submitPreSelectionTestResult,
  getPreSelectionTestResult,
} from '@/services/preSelectionTestHandler';

export class PreSelectionTestController {
  async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, isActive, questions } = req.body;
      if (!jobId || !questions) {
        throw new Error('Job id and questions are required');
      }
      const test = await createPreSelectionTest(jobId, isActive, questions);
      return res.status(201).json({ message: 'Test created successfully', test });
    } catch (error: any) {
      next(error);
    }
  }

  async getTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      if (!jobId) throw new Error('Job id required');
      const test = await getPreSelectionTestByJobId(jobId);
      return res.status(200).json({ message: 'Test retrieved successfully', test });
    } catch (error: any) {
      next(error);
    }
  }

  async updateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId } = req.params;
      const { isActive, questions } = req.body;
      if (!testId) throw new Error('Test id required');
      const test = await updatePreSelectionTest(testId, isActive, questions);
      return res.status(200).json({ message: 'Test updated successfully', test });
    } catch (error: any) {
      next(error);
    }
  }

  async submitTestResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantId, testId, answers } = req.body;
      if (!applicantId || !testId || !answers) {
        throw new Error('Applicant id, test id, and answers are required');
      }
      const result = await submitPreSelectionTestResult(applicantId, testId, answers);
      return res.status(201).json({ message: 'Test result submitted successfully', result });
    } catch (error: any) {
      next(error);
    }
  }

  async getTestResult(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantId, testId } = req.query;
      if (!applicantId || !testId) {
        return res.status(400).json({ message: 'Missing applicantId or testId' });
      }
      const result = await getPreSelectionTestResult(applicantId as string, testId as string);
      return res.status(200).json({ message: 'Test result retrieved successfully', result });
    } catch (error: any) {
      next(error);
    }
  }
}
