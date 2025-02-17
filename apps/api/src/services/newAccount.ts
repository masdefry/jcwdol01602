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
) => {
  try {
    // Check if password is the same as retypePass
    if (password !== retypePass) {
      throw new Error('Passwords do not match');
    }

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

    // Get User Roles
    const role = findRole(roleName);

    // Make Custom Id
    const accountId = await AccountIdMaker({ name: role });

    // Variable to store subsData if the role is 'user'
    let subsData = null;

    // Create Account in DB
    const newAccount = await prisma.$transaction(async (prisma) => {
      // 1. Create account first
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

      // 2. Create Subs data if role is 'user
      if (role === Role.user) {
        // Get Subscription Category
        const subCtg = await getSubsCatByName('free');
        if (!subCtg)
          throw new Error(
            'No subscription category found, please check your database.',
          );
        // Input user data into Subs Data
        subsData = await addSubsData(account.id, subCtg.id);
      }
      return account;
    });

    // Making payload for verification
    const payload = {
      email,
      id: newAccount.id,
      name: newAccount.name,
      role: newAccount.role,
      avatar: newAccount.avatar,
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
    return role === Role.user ? { newAccount, subsData } : newAccount;
  } catch (error) {
    throw error;
  }
};

export default addAccHandler;
