import { Request, Response, NextFunction } from 'express';
import { Account } from '@/custom';
import addAccHandler from '@/services/newAccount';

export class RegisterController {
  async newUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        email,
        password,
        retypePass,
        pob,
        dobString,
        genderName,
        address,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
      } = req.body;
      if (!pob) throw new Error('Pob required');
      if (!dobString) throw new Error('dobString required');
      if (!genderName) throw new Error('genderName required');
      if (!address) throw new Error('address required');
      if (!eduLevelName) throw new Error('eduLevelName required');
      if (!school) throw new Error('school required');
      if (!discipline) throw new Error('discipline required');
      if (!beginDate) throw new Error('beginDate required');
      if (typeof finishDate !== 'string')
        throw new Error('finishDate required');

      // use function createNewAccount to shorten the code
      const newUser = await addAccHandler(
        name,
        email,
        password,
        retypePass,
        'user',
        undefined,
        pob,
        dobString,
        genderName,
        address,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
      );

      return res.status(201).send({
        message:
          'User account created successfully. Please check your email to verify your account',
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async newAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass, compPhone } = req.body;
      const newAdmin = await addAccHandler(
        name,
        email,
        password,
        retypePass,
        'admin',
        compPhone,
      );

      if (!compPhone) throw new Error(`Please insert company phone`);
      return res.status(201).send({
        message: 'Admin account created successfully',
        admin: newAdmin,
      });
    } catch (error) {
      next(error);
    }
  }

  async newDev(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, retypePass } = req.body;
      const newDev = await addAccHandler(
        name,
        email,
        password,
        retypePass,
        'developer',
      );

      return res.status(201).send({
        message: 'Developer account created successfully',
        dev: newDev,
      });
    } catch (error) {
      next(error);
    }
  }
}
