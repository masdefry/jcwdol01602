// src/routes/preSelectionTest.router.ts
import { Router } from 'express';
import { PreSelectionTestController } from '@/controllers/preSelectionTest.controller';
import { verifyToken, adminDevGuard } from '@/middlewares/auth.middleware';

export class PreSelectionTestRouter {
    private router: Router;
    private preSelectionTestController: PreSelectionTestController;

    constructor() {
        this.router = Router();
        this.preSelectionTestController = new PreSelectionTestController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Create a new pre-selection test
        this.router.post('/create', verifyToken, adminDevGuard, this.preSelectionTestController.createTest);
        // Create pre-selection questions
        this.router.post('/questions', verifyToken, adminDevGuard, this.preSelectionTestController.createQuestions);
        // Get test by job id
        this.router.get('/job/:jobId', verifyToken, adminDevGuard, this.preSelectionTestController.getTest);
        // Update test by test id
        this.router.patch('/:testId', verifyToken, adminDevGuard, this.preSelectionTestController.updateTest);
        // Delete test by test id
        this.router.delete('/:testId', verifyToken, adminDevGuard, this.preSelectionTestController.deleteTest);
        // Submit test result
        this.router.post('/result', verifyToken, this.preSelectionTestController.submitTestResult);
        // Get test result (using query parameters)
        this.router.get('/result/:testId', verifyToken, adminDevGuard, this.preSelectionTestController.getTestResultbyId);
        // Get all tests by company (accountId)
        this.router.get('/company/:accountId', verifyToken, adminDevGuard, this.preSelectionTestController.getAllTestsByCompany);
        // Get test by test id
        this.router.get('/:testId', verifyToken, this.preSelectionTestController.getTestById);
        // Edit question by question id
        this.router.patch('/questions/:questionId', verifyToken, adminDevGuard, this.preSelectionTestController.editQuestion);

    }

    getRouter(): Router {
        return this.router;
    }
}
