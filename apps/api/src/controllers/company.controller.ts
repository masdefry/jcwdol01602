import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';

export class CompanyController {
  async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the authenticated admin's details from req.account (set by verifyToken middleware)
      const account = req.account;
      if (!account || account.role !== 'admin') {
        return res.status(403).json({ message: 'Only admins can create a company' });
      }

      // Extract company details from request body
      const {
        name,
        email,
        phone,
        address,
        website,
        description,
        logo,
        socialMedia,
      } = req.body;

      // Check if a company with the same name or email already exists
      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { name },
            { email },
          ],
        },
      });

      if (existingCompany) {
        return res.status(409).json({ message: 'A company with this name or email already exists' });
      }

      // Create a new company record in the database
      const newCompany = await prisma.company.create({
        data: {
          accountId: account.id,
          name,
          email,
          phone,
          address,
          website,
          description,
          logo,
          socialMedia,
        },
      });

      return res.status(201).json({
        message: 'Company created successfully',
        company: newCompany,
      });
    } catch (error) {
      next(error);
    }
  }
}
