import { getJobsPerPage } from '@/services/jobGetHandler';
import { Categories, Locations } from '@prisma/client';
import { Response, Request, NextFunction } from 'express';

export class JobGetController {
  async jobsPerPage(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 2;
      const offset = (page - 1) * limit;
      const location = req.query.location as string | undefined;
      const category = req.query.category as string | undefined;

      const { jobs, total } = await getJobsPerPage(
        offset,
        limit,
        location,
        category,
      );
      return res.status(200).json({
        message: 'Jobs retrieved successfully',
        jobs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalJobs: total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async jobLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = Object.values(Locations);
      return res.status(200).send({
        message: `Locations retrieved successfully`,
        locations,
      });
    } catch (error) {
      next(error);
    }
  }
  async jobCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = Object.values(Categories);
      return res.status(200).send({
        message: `Categories retrieved successfully`,
        categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
