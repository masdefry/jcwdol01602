import {
  addSubsCatHandler,
  delSubsCatHandler,
  editSubsCatHandler,
  getSubsCatById,
  getSubsCatByName,
  getSubsCats,
} from '@/services/subsCtgHandler';
import { NextFunction, Request, Response } from 'express';

export class SubsCtgController {
  async allSubsCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const allSubsCtg = await getSubsCats();
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

  async newSubsCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, cv, skill, priority } = req.body;

      const findSubsCtg = await getSubsCatByName(name);
      if (findSubsCtg) throw new Error('Subscription category already exist');

      const newData = await addSubsCatHandler(name, price, cv, skill, priority);
      return res.status(201).send({
        message: 'Subscription category created successfully',
        subsCtg: newData,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSubsCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { subsCtgId } = req.params;
      if (!subsCtgId) {
        throw new Error('Id not available');
      }

      const findSubsCtg = await getSubsCatById(subsCtgId);
      if (!findSubsCtg) {
        throw new Error('Subscription category not found');
      }

      await delSubsCatHandler(subsCtgId);
      return res.status(200).send({
        message: `${findSubsCtg.name} subscription category deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }

  async editSubsCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new Error('Id not available');
      }

      const findSubsCtg = await getSubsCatById(id);
      if (!findSubsCtg) throw new Error('Subscription category not found');

      const { name, price, cv, skill, priority } = req.body;
      // Check if name already exist
      const findCtgName = await getSubsCatByName(name);
      if (findCtgName) throw new Error('Subscription category already exist');

      const updatedData = await editSubsCatHandler(
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

  async subsCtgById(req: Request, res: Response, next: NextFunction) {
    try {
      const { subsCtgId } = req.params;
      let subsCtg = null;
      subsCtg = await getSubsCatById(subsCtgId);
      res.status(200).send({
        message: 'Subscription category retrieved successfully',
        subsCtg,
      });
    } catch (error) {
      next(error);
    }
  }
}
