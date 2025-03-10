import { NextFunction, Request, Response } from 'express';
import {
  getUserDob,
  getUserGender,
  getUserLocation,
  getSalaryTrends,
  getApplicantInterests,
  getJobPostStatistics,
  getNewUsersPerMonth,
} from '@/services/analyticsHandler';

export class AnalyticsController {
  async getUserDob(req: Request, res: Response, next: NextFunction) {
    try {
      const dobs = await getUserDob();
      return res.status(200).json(dobs);
    } catch (error) {
      next(error);
    }
  }

  async getUserGender(req: Request, res: Response, next: NextFunction) {
    try {
      const genders = await getUserGender();
      return res.status(200).json(genders);
    } catch (error) {
      next(error);
    }
  }

  async getUserLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await getUserLocation();
      return res.status(200).json(locations);
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
