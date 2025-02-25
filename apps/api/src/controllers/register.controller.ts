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

      if (
        !pob ||
        !dobString ||
        !genderName ||
        !address ||
        !eduLevelName ||
        !school ||
        !discipline ||
        !beginDate
      ) {
        throw new Error('Please complete your data');
      }

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
        message: 'User account created successfully',
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
