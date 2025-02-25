import prisma from '@/prisma';
import { cloudinary, SECRET_KEY, WEB_URL } from '@/config';
import { AccountIdMaker } from '../lib/customId';
import { genSalt, hash } from 'bcrypt';
import { transporter } from '../lib/mail';
import path from 'path';
import handlebars from 'handlebars';
import fs from 'fs';
import { sign } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { getSubsCatByName } from './subsCtgHandler';
import { addSubsData } from './subsDataHandler';
import { addUserProf } from './userProfileHandler';
import { addUserEdu } from './userEduHandler';
import { delAccHandler } from './accountHandler';
import { newCompany } from './companyHandler';

const findRole = (name: string): Role => {
  if (!Object.values(Role).includes(name as Role)) {
    throw new Error(`Role not found`);
  }
  return name as Role;
};

const avatarUrl = cloudinary.url(
  'https://res.cloudinary.com/dnqgu6x1e/image/upload/avatar_default.jpg',
  {
    secure: true,
  },
);

const addAccHandler = async (
  name: string,
  email: string,
  password: string,
  retypePass: string,
  roleName: string,
  compPhone?: string,
  pob?: string,
  dobString?: string,
  genderName?: string,
  address?: string,
  eduLevelName?: string,
  school?: string,
  discipline?: string,
  beginDate?: string,
  finishDate?: string | null,
) => {
  try {
    // Check if password is the same as retypePass
    if (password !== retypePass) {
      throw new Error('Passwords do not match');
    }

    console.log(roleName);
    // Check account Roles
    const role = findRole(roleName);

    // Check if email already exist
    const findAccount = await prisma.account.findUnique({
      where: { email },
    });

    if (findAccount) {
      throw new Error('Email already exist');
    }

    // Convert plain password to hash
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    // Make Custom Id
    const accountId = await AccountIdMaker({ name: role });

    // Variable to store subsData, userProfile and userEdu if the role is 'user'
    let subsData = null;
    let userProfile = null;
    let userEdu = null;

    if (role === Role.admin) {
      const checkComp = await prisma.account.findFirst({
        where: { name },
      });
      if (checkComp) throw new Error('Company name already exist');
    }

    const account = await prisma.account.create({
      data: {
        id: accountId,
        name,
        email,
        password: hashPassword,
        avatar: avatarUrl,
        role: role,
      },
    });

    if (role === Role.user) {
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
        await delAccHandler(account.id);
        throw new Error('User data incomplete');
      }
      const subCtg = await getSubsCatByName('free');
      if (!subCtg)
        throw new Error(
          'No subscription category found, please check your database.',
        );
      // Input user data into Subs Data
      subsData = await addSubsData(account.id, subCtg.id);
      userProfile = await addUserProf(
        subsData.id,
        genderName,
        pob,
        dobString,
        address,
      );
      userEdu = await addUserEdu(
        subsData.id,
        eduLevelName,
        school,
        discipline,
        beginDate,
        finishDate,
      );
    }

    let company = null;
    if (role === Role.admin) {
      if (!compPhone) {
        await delAccHandler(account.id);
        throw new Error('Admin data incomplete');
      }
      company = await newCompany(account.id, compPhone);
    }

    // Making payload for verification
    const payload = {
      email,
      id: account.id,
      name: account.name,
      role: account.role,
      avatar: account.avatar,
    };
    const token = sign(payload, SECRET_KEY as string, {
      expiresIn: '1h',
    });

    // // Specify the location of registerMail.hbs
    const templatePath = path.join(
      __dirname,
      '../templates',
      'registerMail.hbs',
    );
    const templateSource = await fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateSource);

    // // verification url
    const verificationUrl = WEB_URL + `/verify/${token}`;
    const html = compiledTemplate({
      name,
      email,
      verificationUrl,
    });
    // Send verification email to new account
    await transporter.sendMail({
      to: email,
      subject: 'Registration',
      html,
    });

    // return base on role
    if (role === Role.user) {
      return { account, subsData, userProfile, userEdu };
    } else if (role == Role.admin) {
      return { account, company };
    } else {
      return { account };
    }
  } catch (error) {
    throw error;
  }
};

export default addAccHandler;
