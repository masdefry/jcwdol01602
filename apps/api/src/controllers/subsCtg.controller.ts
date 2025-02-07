import { SubsCtgIdMaker } from '@/lib/customId';
import { getSubsCategories } from '@/lib/subs';
import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';

export class SubsCtgController {
  async getAllSubsCtg(req: Request, res: Response, next: NextFunction) {
    try {
      const AllSubsCtg = await getSubsCategories();

      return res.status(200).send({
        message: 'Subscription categories retrieved successfully',
        SubsCtg: AllSubsCtg,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubsCtg(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, cv, skill, priority } = req.body;

      // Check if name already exist in database
      const findSubsCtg = await prisma.subsCtg.findFirst({
        where: { name },
      });
      if (findSubsCtg) throw new Error('Subscription category already exist');

      // Make CustomId
      const customId = await SubsCtgIdMaker();

      // Insert data to database
      const newData = await prisma.subsCtg.create({
        data: {
          id: customId,
          name,
          price,
          cvGenerator: cv,
          skillAssessment: skill,
          priority,
        },
      });
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
      // check if id not available
      if (!id) {
        throw new Error('Id not available');
      }

      // Check if id exist in database
      const findSubsCtg = await prisma.subsCtg.findFirst({
        where: { id },
      });
      if (!findSubsCtg) {
        throw new Error('Subscription category not found');
      }

      // Delete category
      await prisma.subsCtg.delete({
        where: { id: findSubsCtg.id },
      });
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

      // Check if SubsCtg exist
      const findSubsCtg = await prisma.subsCtg.findUnique({ where: { id } });
      if (!findSubsCtg) throw new Error('Subscription category not found');

      const { name, price, cv, skill, priority } = req.body;
      // Check if name already exist
      const findCtgName = await prisma.subsCtg.findFirst({
        where: { name },
      });
      if (findCtgName) throw new Error('Subscription category already exist');

      //   If new data not exist in db
      const updatedData = await prisma.subsCtg.update({
        where: { id },
        data: {
          name,
          price,
          cvGenerator: cv,
          skillAssessment: skill,
          priority,
        },
      });
      return res.status(201).send({
        message: `${findSubsCtg.name} subscription category updated successfully`,
        subsCtg: updatedData,
      });
    } catch (error) {
      next(error);
    }
  }
}
