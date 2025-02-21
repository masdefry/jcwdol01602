// import { Request, Response, NextFunction } from 'express';
// import prisma from '@/prisma';

// export class ApplicantController {
//   async getApplicantsByJob(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { jobId } = req.params;
//       const { name, minAge, maxAge, minSalary, maxSalary, education } = req.query;

//       const applicants = await prisma.applicant.findMany({
//         where: {
//           jobId,
//           user: {
//             accounts: {
//               name: name ? { contains: name as string, mode: 'insensitive' } : undefined, // Tambahkan mode insensitive
//             },
//           },
//           expectedSalary: {
//             gte: minSalary ? Number(minSalary) : undefined,
//             lte: maxSalary ? Number(maxSalary) : undefined,
//           },
//           user: {
//             accounts: {
//               Profile: {  // Correctly filter Profile
//                 some: { // Use "some" to filter if ANY related profile matches
//                   birthDate: {
//                     gte: maxAge ? new Date(new Date().setFullYear(new Date().getFullYear() - Number(maxAge))) : undefined,
//                     lte: minAge ? new Date(new Date().setFullYear(new Date().getFullYear() - Number(minAge))) : undefined,
//                   },
//                   education: education ? { contains: education as string, mode: 'insensitive' } : undefined,
//                 },
//               },
//             },
//           },
//         },
//         include: {
//           user: {
//             include: {
//               accounts: {
//                 select: { name: true, avatar: true, Profile: true },
//               },
//             },
//           },
//           job: true,
//         },
//         orderBy: { appliedAt: 'asc' },
//       });

//       res.status(200).json(applicants);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getApplicantDetails(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { applicantId } = req.params;
//       const applicant = await prisma.applicant.findUnique({
//         where: { id: applicantId },
//         include: {
//           user: {
//             include: {
//               accounts: {
//                 include: { Profile: true },
//               },
//             },
//           },
//           job: true,
//         },
//       });

//       if (!applicant) {
//         return res.status(404).json({ error: 'Applicant not found' });
//       }

//       res.status(200).json(applicant);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async updateApplicantStatus(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { applicantId } = req.params;
//       const { status } = req.body;

//       if (!['pending', 'interview', 'accepted', 'rejected'].includes(status)) {
//         throw new Error('Invalid status');
//       }

//       const updatedApplicant = await prisma.applicant.update({
//         where: { id: applicantId },
//         data: { status },
//       });

//       res.status(200).json(updatedApplicant);
//     } catch (error) {
//       next(error);
//     }
//   }
// }
