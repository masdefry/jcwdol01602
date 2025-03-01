import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { Account } from '@/custom';

export class CompanyController {
  async editCompany(req: Request, res: Response, next: NextFunction) {
    try {
      // name, phone, address, website, description, logo
      const admin = req.account as Account;
      const { name, phone, address, website, desc } = req.body;

      const company = await prisma.company.findUnique({
        where: { accountId: admin.id },
        include: { account: true },
      });
      if (!company) throw new Error(`Company profile data not found`);

      let upName = company.account.name;
      let upPhone = company.phone;
      let upAddress = company.address;
      let upWebsite = company.website;
      let upDesc = company.description;

      if (name) {
        upName = name;
      }
      if (phone) {
        upPhone = phone;
      }
      if (address) {
        upAddress = address;
      }
      if (desc) {
        upDesc = desc;
      }
      if (website) {
        upWebsite = website;
      }

      const updateAccount = await prisma.account.update({
        where: { id: admin.id },
        data: {
          name: upName,
        },
      });
      const updateCompany = await prisma.company.update({
        where: { id: company.id },
        data: {
          phone: upPhone,
          address: upAddress,
          website: upWebsite,
          description: upDesc,
        },
      });

      return res.status(201).json({
        message: 'Company created successfully',
        editComp: { updateAccount, updateCompany },
      });
    } catch (error) {
      next(error);
    }
  }
}
