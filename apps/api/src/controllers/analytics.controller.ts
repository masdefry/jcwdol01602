import { NextFunction, Request, Response } from 'express';
import {
  getUserDemographics,
  getSalaryTrends,
  getApplicantInterests,
  getJobPostStatistics,
  getNewUsersPerMonth,
} from '@/services/analyticsHandler';

export class AnalyticsController {
  async getUserDemographics(req: Request, res: Response, next: NextFunction) {
    try {
      const demographics = await getUserDemographics();
      return res.status(200).json(demographics);
    } catch (error) {
      next(error);
    }
  }

  async getSalaryTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const salaryTrends = await getSalaryTrends();
      return res.status(200).json(salaryTrends);
    } catch (error) {
      next(error);
    }
  }

  async getApplicantInterests(req: Request, res: Response, next: NextFunction) {
    try {
      const applicantInterests = await getApplicantInterests();
      return res.status(200).json(applicantInterests);
    } catch (error) {
      next(error);
    }
  }

  async getJobPostStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const jobStats = await getJobPostStatistics();
      return res.status(200).json(jobStats);
    } catch (error) {
      next(error);
    }
  }

  async getNewUsersPerMonth(req: Request, res: Response, next: NextFunction) {
    try {
      const userCounts = await getNewUsersPerMonth();
      return res.status(200).json(userCounts);
    } catch (error) {
      next(error);
    }
  }
}
