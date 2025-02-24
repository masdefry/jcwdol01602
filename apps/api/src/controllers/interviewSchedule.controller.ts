import { NextFunction, Request, Response } from 'express';
import { createInterviewSchedule,
  getInterviewScheduleById,
  updateInterviewSchedule,
  deleteInterviewSchedule,
  getInterviewSchedulesByAdminId,
  getInterviewSchedulesByApplicantId,
 } from '@/services/interviewscheduleHandler';
import { Account } from '@/custom';
import nodemailer from 'nodemailer';
import prisma from '@/prisma';

export class InterviewScheduleController {
  async createSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicantId, startTime, endTime, location, notes } = req.body;
      const admin = req.account as Account;
      const schedule = await createInterviewSchedule(
        applicantId,
        admin.id,
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

  async getAdminSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.account as Account;
      const schedules = await getInterviewSchedulesByAdminId(admin.id);
      return res.status(200).json({ schedules });
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

  private async sendInterviewNotification(applicantId: string, schedule: any) {
    try {
      const applicant = await prisma.applicant.findUnique({
        where: { id: applicantId },
        include: { subsData: { include: { accounts: true } } },
      });

      if (!applicant || !applicant.subsData.accounts.email) {
        throw new Error('Applicant or email not found');
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password',
        },
      });

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: applicant.subsData.accounts.email,
        subject: 'Jadwal Wawancara Anda',
        text: `Anda telah dijadwalkan wawancara pada ${schedule.startTime}.`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
