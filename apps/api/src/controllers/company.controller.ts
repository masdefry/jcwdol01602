import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { Account } from '@/custom';
import { getCompanyById, editCompany } from '@/services/companyHandler';

export class CompanyController {
  async editCompany(req: Request, res: Response, next: NextFunction) {
    try {
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

      const updateCompany = await editCompany(company.id, {
        phone: upPhone,
        address: upAddress === null ? undefined : upAddress,
        website: upWebsite === null ? undefined : upWebsite,
        description: upDesc === null ? undefined : upDesc,
      });

      return res.status(201).json({
        message: 'Company updated successfully',
        editComp: { updateAccount, updateCompany },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyData(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      if (!companyId) throw new Error(`Company id required`);
      const company = await getCompanyById(companyId);
      return res.status(200).send({
        message: 'Company data retrieved successfully',
        company,
      });
    } catch (error) {
      next(error);
    }
  }
}
