import { Request, Response, NextFunction } from 'express';
import prisma from '@/prisma';
import { Account } from '@/custom';
import { getCompanyById, editCompany, getCompanyByAdmin } from '@/services/companyHandler';

export class CompanyController {
  async editCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId } = req.params;
      const { name, phone, address, website, desc } = req.body;

      const company = await getCompanyByAdmin(accountId);

      if (!company) {
        return res.status(404).json({ message: 'Company profile data not found' });
      }

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

      await prisma.account.update({
        where: { id: accountId },
        data: {
          name: upName,
        },
      });

      const updatedCompany = await editCompany(accountId, {
        phone: upPhone,
        address: upAddress === null ? undefined : upAddress,
        website: upWebsite === null ? undefined : upWebsite,
        description: upDesc === null ? undefined : upDesc,
      });

      return res.status(200).json({
        message: 'Company updated successfully',
        editComp: { updatedCompany },
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

  async getCompanyDatabyAdminId(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId } = req.params;
      if (!accountId) throw new Error(`accountId required`);
      const company = await getCompanyByAdmin(accountId);
      return res.status(200).send({
        message: 'Company data retrieved successfully',
        company,
      });
    } catch (error) {
      next(error);
    }
  }
}
