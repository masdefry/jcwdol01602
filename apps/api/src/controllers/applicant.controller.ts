import { NextFunction, Request, Response } from 'express';
import {
    getApplicantById,
    getApplicantWithUserAndJob,
    getApplicantsByJobId,
    updateApplicantStatus,
    applyJobService
} from '@/services/applicantHandler';
import { Account } from '@prisma/client';


export class ApplicantController {
    async getApplicantsByJob(req: Request, res: Response, next: NextFunction) {
        try {
            const { jobId } = req.params;
            const applicants = await getApplicantsByJobId(jobId);

            return res.status(200).json({ applicants });
        } catch (error) {
            console.error('Error in getApplicantsByJob controller:', error);
            next(error);
        }
    }

    async getApplicantDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { applicantId } = req.params;
            const applicant = await getApplicantWithUserAndJob(applicantId);

            if (!applicant) {
                return res.status(404).json({ message: 'Applicant not found' });
            }

            return res.status(200).json({ applicant });
        } catch (error) {
            console.error('Error in getApplicantDetails controller:', error);
            next(error);
        }
    }

    async updateApplicantStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { applicantId } = req.params;
            const { status } = req.body;
            const updatedApplicant = await updateApplicantStatus(applicantId, status);
            return res.status(200).json({
                message: 'Applicant status updated successfully',
                applicant: updatedApplicant,
            });
        } catch (error) {
            console.error('Error in updateApplicantStatus controller:', error);
            next(error);
        }
    }

    async applyJob(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.account as Account;
            const { jobId, expectedSalary } = req.body;
            const data = await applyJobService(user, jobId, expectedSalary);
            return res.status(201).send({
                message: 'Successfully applied for job',
                data,
            });
        } catch (error) {
            console.error('Error in applyJob controller:', error);
            next(error);
        }
    }

    async getApplicantById(req: Request, res: Response, next: NextFunction) {
        try {
            const { applicantId } = req.params;
            const applicant = await getApplicantById(applicantId);

            if (!applicant) {
                return res.status(404).json({ message: 'Applicant not found' });
            }

            return res.status(200).json({ applicant });
        } catch (error) {
            console.error('Error in getApplicantById controller:', error);
            next(error);
        }
    }
}
