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

        this.router.post('/create', verifyToken, adminDevGuard, this.preSelectionTestController.createTest);
        this.router.post('/questions', verifyToken, adminDevGuard, this.preSelectionTestController.createQuestions);
        this.router.get('/job/:jobId', verifyToken, adminDevGuard, this.preSelectionTestController.getTest);
        this.router.patch('/:testId', verifyToken, adminDevGuard, this.preSelectionTestController.updateTest);
        this.router.delete('/:testId', verifyToken, adminDevGuard, this.preSelectionTestController.deleteTest);
        this.router.post('/result', verifyToken, this.preSelectionTestController.submitTestResult);
        this.router.get('/result/:testId', verifyToken, adminDevGuard, this.preSelectionTestController.getTestResultbyId);
        this.router.get('/company/:accountId', verifyToken, adminDevGuard, this.preSelectionTestController.getAllTestsByCompany);
        this.router.get('/:testId', verifyToken, this.preSelectionTestController.getTestById);
        this.router.patch('/questions/:questionId', verifyToken, adminDevGuard, this.preSelectionTestController.editQuestion);

    }

    getRouter(): Router {
        return this.router;
    }
}
