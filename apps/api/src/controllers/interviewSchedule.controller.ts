import { NextFunction, Request, Response } from 'express';
import {
  createInterviewSchedule,
  getInterviewScheduleById,
  updateInterviewSchedule,
  deleteInterviewSchedule,
  getInterviewSchedulesByApplicantId,
  getInterviewApplicantsByCompanyAccountId,
} from '@/services/interviewScheduleHandler';
import prisma from '@/prisma';
import { transporter } from '@/lib/mail';


export class InterviewScheduleController {
  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantId, startTime, endTime, location, notes } = req.body;
      const schedule = await createInterviewSchedule(
        applicantId,
        new Date(startTime),
        new Date(endTime),
        location,
        notes,
      );

      await this.sendInterviewNotification(applicantId, schedule);
      return res.status(201).json({ schedule });
    } catch (error) {
      next(error);
    }
  }

  async getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params;
      const schedule = await getInterviewScheduleById(scheduleId);
      return res.status(200).json({ schedule });
    } catch (error) {
      next(error);
    }
  }

  async updateSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params;
      const { startTime, endTime, location, notes } = req.body;
      const schedule = await updateInterviewSchedule(
        scheduleId,
        startTime ? new Date(startTime) : undefined,
        endTime ? new Date(endTime) : undefined,
        location,
        notes,
      );
      return res.status(200).json({ schedule });
    } catch (error) {
      next(error);
    }
  }

  async deleteSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheduleId } = req.params;
      const schedule = await deleteInterviewSchedule(scheduleId);
      return res.status(200).json({ schedule });
    } catch (error) {
      next(error);
    }
  }

  async getApplicantSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantId } = req.params;
      const schedules = await getInterviewSchedulesByApplicantId(applicantId);
      return res.status(200).json({ schedules });
    } catch (error) {
      next(error);
    }
  }

  async getApplicantsByCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyAccountId } = req.params;
      const applicants = await getInterviewApplicantsByCompanyAccountId(companyAccountId);
      return res.status(200).json({ applicants });
    } catch (error) {
      next(error);
    }
  }



  private async sendInterviewNotification(applicantId: string, schedule: any) {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id: applicantId },
        include: { subsData: { include: { accounts: true } } },
      });

      if (!applicant || !applicant.subsData?.accounts?.email) {
        throw new Error('Applicant or email not found');
      }

      const mailOptions = {
        to: applicant.subsData.accounts.email,
        subject: 'Your Interview Schedule Details',
        html: `
          <p>Dear ${'Applicant'},</p>
          <p>We are pleased to inform you that you have been scheduled for an interview.</p>
          <p><strong>Date:</strong> ${schedule.startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Time:</strong> ${schedule.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
          ${schedule.location ? `<p><strong>Location:</strong> ${schedule.location}</p>` : ''}
          ${schedule.notes ? `<p><strong>Notes:</strong> ${schedule.notes}</p>` : ''}
          <p>Please arrive on time. If you have any questions or need to reschedule, please contact us.</p>
          <p>We look forward to meeting you!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
