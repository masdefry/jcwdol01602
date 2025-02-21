import { Request, Response } from 'express';
import prisma from '@/prisma';

export class JobController {
  // Create a new job
  async createJob(req: Request, res: Response) {
    try {
      const { title, description, category, location, salaryRange, tags, deadline, companyId } = req.body;
      const job = await prisma.job.create({
        data: {
          title,
          description,
          category,
          location,
          salaryRange,
          tags,
          deadline,
          isPublished: false,
          company: {
            connect: { id: companyId },
          },
        },
      });
      return res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create job' });
    }
  }

  // Update job posting
  async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Check if companyId is being updated:
      if (data.companyId) {
        data.company = { connect: { id: data.companyId } };
        delete data.companyId;
      }
      const updatedJob = await prisma.job.update({
        where: { id },
        data: data,
      });
      return res.json({ message: 'Job updated successfully', updatedJob });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update job' });
    }
  }

  // Delete job posting
  async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.job.delete({ where: { id } });
      return res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete job' });
    }
  }

  // Get all jobs with filters & sorting
  async getAllJobs(req: Request, res: Response) {
    try {
      const { title, category, sort } = req.query;
      const jobs = await prisma.job.findMany({
        where: { title: { contains: title as string }, category: category as string },
        orderBy: { title: sort === 'asc' ? 'asc' : 'desc' },
        include: { applicants: true },
      });
      return res.json(jobs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  // Get job details (including applicants count)
  async getJobDetails(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await prisma.job.findUnique({
        where: { id },
        include: { applicants: true },
      });
      return res.json(job);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch job details' });
    }
  }

  // Toggle Publish / Unpublish job
  async togglePublish(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const job = await prisma.job.findUnique({ where: { id } });

      if (!job) return res.status(404).json({ error: 'Job not found' });

      const updatedJob = await prisma.job.update({
        where: { id },
        data: { isPublished: !job.isPublished },
      });

      return res.json({ message: `Job ${updatedJob.isPublished ? 'published' : 'unpublished'}`, updatedJob });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update job status' });
    }
  }
}
