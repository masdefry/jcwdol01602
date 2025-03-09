import { AnalyticsController } from '@/controllers/analytics.controller';
import { verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class AnalyticsRouter {
    private router: Router;
    private analyticsController: AnalyticsController;

    constructor() {
        this.analyticsController = new AnalyticsController();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(
            '/demographics',
            verifyToken,
            this.analyticsController.getUserDemographics.bind(this.analyticsController)
        );

        this.router.get(
            '/salary',
            verifyToken,
            this.analyticsController.getSalaryTrends.bind(this.analyticsController)
        );

        this.router.get(
            '/interests',
            verifyToken,
            this.analyticsController.getApplicantInterests.bind(this.analyticsController)
        );

        this.router.get(
            '/jobpost',
            verifyToken,
            this.analyticsController.getJobPostStatistics.bind(this.analyticsController)
        );

        this.router.get(
            '/newuser',
            verifyToken,
            this.analyticsController.getNewUsersPerMonth.bind(this.analyticsController)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}
