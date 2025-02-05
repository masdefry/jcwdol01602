import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';

export class RoleController {
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      // get role from request body
      const { name } = req.body;

      // check if role already exist on database
      const findRole = await prisma.role.findFirst({
        where: { name },
      });
      if (findRole) {
        const error = new Error('Role already exist');
        return next(error);
      }

      // create role on database
      const newRole = await prisma.role.create({
        data: {
          name,
        },
      });
      return res.status(201).send({
        message: 'Role created successfully',
        role: newRole,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getRoles(req: Request, res: Response, next: NextFunction) {
    try {
      // get all roles from database
      const roles = await prisma.role.findMany();
      if (roles.length === 0) {
        const error = new Error('No Data in Database');
        return next(error);
      }
      return res.status(200).send({
        message: 'Roles retrieved successfully',
        roles,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      // check if id exist on params
      if (!id) {
        const error = new Error('Id is required');
        return next(error);
      }

      // Check if roleId exist on db
      const findRole = await prisma.role.findUnique({
        where: { id: Number(id) },
      });
      if (!findRole) {
        const error = new Error('Role not found');
        return next(error);
      }

      //   delete role from database
      await prisma.role.delete({
        where: { id: Number(id) },
      });

      return res.status(200).send({
        message: ` Role ${findRole.name} is deleted successfully`,
      });
    } catch (error: any) {
      next(error);
    }
  }
}
