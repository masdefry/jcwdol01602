import { InterviewScheduleController } from '@/controllers/interviewSchedule.controller';
import { verifyToken, adminDevGuard } from '@/middlewares/auth.middleware';
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
    this.router.post(
      '/',
      verifyToken,
      adminDevGuard,
      this.interviewScheduleController.createSchedule.bind(this.interviewScheduleController)
    );

    this.router.get(
      '/:scheduleId',
      verifyToken,
      adminDevGuard,
      this.interviewScheduleController.getSchedule.bind(this.interviewScheduleController)
    );

    this.router.patch(
      '/:scheduleId',
      verifyToken,
      adminDevGuard,
      this.interviewScheduleController.updateSchedule.bind(this.interviewScheduleController)
    );

    this.router.delete(
      '/:scheduleId',
      verifyToken,
      adminDevGuard,
      this.interviewScheduleController.deleteSchedule.bind(this.interviewScheduleController)
    );

    this.router.get(
      '/applicant/:applicantId',
      verifyToken,
      adminDevGuard,
      this.interviewScheduleController.getApplicantSchedules.bind(this.interviewScheduleController)
    );

    this.router.get(
      '/company/:companyAccountId',
      verifyToken,
      adminDevGuard,
      this.interviewScheduleController.getApplicantsByCompany.bind(this.interviewScheduleController)
    );

  }

  getRouter(): Router {
    return this.router;
  }
}
