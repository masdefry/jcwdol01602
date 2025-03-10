import { NextFunction, Request, Response } from 'express';
import {
    createPreSelectionTest,
    createPreSelectionQuestions,
    updatePreSelectionTest,
    submitPreSelectionTestResult,
    getPreSelectionTestResult,
    getAllPreSelectionTestsByCompany,
    getPreSelectionTestByJobId,
    deletePreSelectionTest,
    getPreSelectionTestById,
} from '@/services/preSelectionTestHandler';

export class PreSelectionTestController {
    async createTest(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.body;
            if (!jobId) {
                throw new Error('Job id is required');
            }
            const test = await createPreSelectionTest(jobId);
            return res.status(201).json({ message: 'Test created successfully', test });
        } catch (error: any) {
            next(error);
        }
    }

    async createQuestions(req: Request, res: Response, next: NextFunction) {
        try {
            const { testId, questions } = req.body;
            if (!testId || !questions || !Array.isArray(questions)) {
                throw new Error('Test ID and questions array are required');
            }
            const createdQuestions = await createPreSelectionQuestions(testId, questions);
            return res.status(201).json({ message: 'Questions created successfully', questions: createdQuestions });
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
            const { isActive } = req.body;
            if (!testId) throw new Error('Test id required');
            const test = await updatePreSelectionTest(testId, isActive);
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

    async getAllTestsByCompany(req: Request, res: Response, next: NextFunction) {
        try {
            const { accountId } = req.params;
            if (!accountId) {
                return res.status(400).json({ message: 'Account ID is required' });
            }
            const tests = await getAllPreSelectionTestsByCompany(accountId);
            return res.status(200).json({ message: 'Tests retrieved successfully', tests });
        } catch (error: any) {
            next(error);
        }
    }

    async getTestById(req: Request, res: Response, next: NextFunction) {
        try {
            const { testId } = req.params;
            if (!testId) throw new Error('Test id required');
            const test = await getPreSelectionTestById(testId);
            return res.status(200).json({ message: 'Test retrieved successfully', test });
        } catch (error: any) {
            next(error);
        }
    }

    async deleteTest(req: Request, res: Response, next: NextFunction) {
        try {
            const { testId } = req.params;
            if (!testId) throw new Error('Test id required');
            const test = await deletePreSelectionTest(testId);
            return res.status(200).json({ message: 'Test deleted successfully', test });
        } catch (error: any) {
            next(error);
        }
    }
}
