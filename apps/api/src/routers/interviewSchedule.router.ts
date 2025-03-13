import { InterviewScheduleController } from '@/controllers/interviewSchedule.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class InterviewScheduleRouter {
  private router: Router;
  private interviewScheduleController: InterviewScheduleController;

  constructor() {
    this.interviewScheduleController = new InterviewScheduleController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', verifyToken, this.interviewScheduleController.createSchedule);
    this.router.get('/:scheduleId', verifyToken, this.interviewScheduleController.getSchedule);
    this.router.patch('/:scheduleId', verifyToken, this.interviewScheduleController.updateSchedule);
    this.router.delete('/:scheduleId', verifyToken, this.interviewScheduleController.deleteSchedule);
    this.router.get('/applicant/:applicantId', verifyToken, this.interviewScheduleController.getApplicantSchedules);
  }

  getRouter(): Router {
    return this.router;
  }
}
