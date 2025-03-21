import { NextFunction, Request, Response } from 'express';
import {
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
  getAllJobsHandler,
  getJobDetailsHandler,
  togglePublishHandler,
  getJobsCompanyHandler,
  getJobsByCompanyIdHandler,
} from '@/services/jobHandler';

export class JobController {
  async createJob(req: Request, res: Response) {
    try {
      const { accountId } = req.body;
      if (!accountId || typeof accountId !== 'string') {
        return res
          .status(400)
          .json({ error: 'AccountId is required in the request body' });
      }

      const job = await createJobHandler(req.body, accountId);
      return res.status(201).json({ message: 'Job created successfully', job });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create job' });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const updatedJob = await updateJobHandler(id, req.body);
      return res.json({ message: 'Job updated successfully', updatedJob });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to update job' });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { accountId } = req.body;

      if (!accountId || typeof accountId !== 'string') {
        return res
          .status(400)
          .json({ error: 'AccountId is required in the request body' });
      }

      await deleteJobHandler(id, accountId);
      return res.json({ message: 'Job deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to delete job' });
    }
  }

  async getAllJobs(req: Request, res: Response) {
    try {
      console.log('Query Params:', req.query);

      const { accountId } = req.query;
      if (!accountId || typeof accountId !== 'string') {
        return res
          .status(400)
          .json({ error: 'AccountId is required as a query parameter' });
      }

      const jobs = await getAllJobsHandler(accountId);
      return res.json(jobs);
    } catch (error: any) {
      console.error('Error in getAllJobs:', error);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  async getJobsCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId } = req.params;

      if (!accountId) {
        return res
          .status(400)
          .json({ error: 'AccountId is required as a route parameter' });
      }

      const jobs = await getJobsCompanyHandler(accountId);
      return res.json({ jobs });
    } catch (error: any) {
      console.error('Error in getJobsCompany:', error); // Corrected error log
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  async getJobDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { accountId } = req.query;

      if (!accountId || typeof accountId !== 'string') {
        return res
          .status(400)
          .json({ error: 'AccountId is required as a query parameter.' });
      }

      const job = await getJobDetailsHandler(id, accountId);

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      return res.json(job);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch job details' });
    }
  }

  async getJobsByCompanyId(req: Request, res: Response) {
    try {
      const { companyId } = req.params;

      if (!companyId || typeof companyId !== 'string') {
        return res
          .status(400)
          .json({ error: 'CompanyId is required as a route parameter' });
      }

      const jobs = await getJobsByCompanyIdHandler(companyId);
      return res.json(jobs);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  async togglePublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { accountId } = req.body;

      if (!accountId || typeof accountId !== 'string') {
        return res
          .status(400)
          .json({ error: 'AccountId is required in the request body' });
      }

      const updatedJob = await togglePublishHandler(id, accountId);
      return res.json({
        message: `Job ${updatedJob.isPublished ? 'published' : 'unpublished'}`,
        updatedJob,
      });
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to update job status' });
    }
  }
}
