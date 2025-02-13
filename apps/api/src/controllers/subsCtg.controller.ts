import {
  getCategories,
  addCategory,
  getCategoryByName,
  getCategoryById,
  deleteCategory,
  updateCategory,
} from '@/services/subsCtgHandler';
import { NextFunction, Request, Response } from 'express';

export class SubsCtgController {
  async getAllSubsCtg(req: Request, res: Response, next: NextFunction) {
    try {
      const allSubsCtg = await getCategories();
      if (allSubsCtg.length === 0) {
        return res
          .status(200)
          .send({ message: 'No data', subsCtg: allSubsCtg });
      }

      return res.status(200).send({
        message: 'Subscription categories retrieved successfully',
        subsCtg: allSubsCtg,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubsCtg(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, cv, skill, priority } = req.body;

      const findSubsCtg = await getCategoryByName(name);
      if (findSubsCtg) throw new Error('Subscription category already exist');

      const newData = await addCategory(name, price, cv, skill, priority);
      return res.status(201).send({
        message: 'Subscription category created successfully',
        subsCtg: newData,
      });
    } catch (error) {
      next(error);
    }
  }

  async delSubsCtg(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Id not available');
      }

      const findSubsCtg = await getCategoryById(id);
      if (!findSubsCtg) {
        throw new Error('Subscription category not found');
      }

      await deleteCategory(id);
      return res.status(200).send({
        message: `${findSubsCtg.name} subscription category deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  async editSubsCtg(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Id not available');
      }

      const findSubsCtg = await getCategoryById(id);
      if (!findSubsCtg) throw new Error('Subscription category not found');

      const { name, price, cv, skill, priority } = req.body;
      // Check if name already exist
      const findCtgName = await getCategoryByName(name);
      if (findCtgName) throw new Error('Subscription category already exist');

      const updatedData = await updateCategory(
        id,
        name,
        price,
        cv,
        skill,
        priority,
      );
      return res.status(201).send({
        message: `${findSubsCtg.name} subscription category updated successfully`,
        subsCtg: updatedData,
      });
    } catch (error) {
      next(error);
    }
  }
}
