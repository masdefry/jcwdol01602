import { Router } from 'express';
import { PreSelectionTestController } from '@/controllers/preSelectionTest.controller';
import { verifyToken } from '@/middlewares/auth.middleware';

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
    this.router.post('/', verifyToken, this.preSelectionTestController.createTest);
    // Get test by job id
    this.router.get('/job/:jobId', verifyToken, this.preSelectionTestController.getTest);
    // Update test by test id
    this.router.patch('/:testId', verifyToken, this.preSelectionTestController.updateTest);
    // Submit test result
    this.router.post('/result', verifyToken, this.preSelectionTestController.submitTestResult);
    // Get test result (using query parameters)
    this.router.get('/result', verifyToken, this.preSelectionTestController.getTestResult);
  }
}
