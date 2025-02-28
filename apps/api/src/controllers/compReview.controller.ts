import { Request, Response, NextFunction } from 'express';
import { Account } from '@/custom';
import {
  addCompReview,
  delCompReview,
  editCompReview,
} from '@/services/compReviewAddEditDel';
import { getCompReviewForAdmin } from '@/services/compReviewGet';

export class CompReviewController {
  async newCompReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { companyId } = req.params;
      if (!companyId) throw new Error(`Company Id required`);
      const { salary, culture, wlb, facility, career, desc } = req.body;
      const compReview = await addCompReview(
        user.id,
        companyId,
        salary,
        culture,
        wlb,
        facility,
        career,
        desc,
      );
      return res.status(200).send({
        message: `Review added successfully`,
        compReview,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCompReview(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.account as Account;
      const { compReviewId } = req.params;
      if (!compReviewId) throw new Error(`Review Id required`);
      const { salary, culture, wlb, facility, career, desc } = req.body;
      const compReview = await editCompReview(
        user.id,
        compReviewId,
        salary,
        culture,
        wlb,
        facility,
        career,
        desc,
      );
      return res.status(200).send({
        message: `Review updated successfully`,
        compReview,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompReview(req: Request, res: Response, next: NextFunction) {
    try {
      const account = req.account as Account;
      const { compReviewId } = req.params;
      if (!compReviewId) throw new Error(`Review id required`);
      const compReview = await delCompReview(account, compReviewId);
      return res.status(200).send({
        message: `Review deleted successfully`,
        compReview,
      });
    } catch (error) {
      next(error);
    }
  }

  async compReviewForCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = req.account as Account;
      let compReview = null;
      compReview = await getCompReviewForAdmin(admin.id);
      if (compReview.length === 0) compReview = 'No Data';
      return res.status(200).send({
        message: `Company review retieved successfully`,
        compReview,
      });
    } catch (error) {
      next(error);
    }
  }
}
