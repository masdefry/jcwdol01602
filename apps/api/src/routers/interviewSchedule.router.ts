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
    this.router.post('/', verifyToken, (req, res, next) => this.interviewScheduleController.createSchedule(req, res, next));
    this.router.get('/:scheduleId', verifyToken, (req, res, next) => this.interviewScheduleController.getSchedule(req, res, next));
    this.router.patch('/:scheduleId', verifyToken, (req, res, next) => this.interviewScheduleController.updateSchedule(req, res, next));
    this.router.delete('/:scheduleId', verifyToken, (req, res, next) => this.interviewScheduleController.deleteSchedule(req, res, next));
    this.router.get('/applicant/:applicantId', verifyToken, (req, res, next) => this.interviewScheduleController.getApplicantSchedules(req, res, next));
    this.router.get('/company/:companyAccountId', verifyToken, (req, res, next) =>
    this.interviewScheduleController.getApplicantsByCompany(req, res, next)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
