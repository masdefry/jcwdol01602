import prisma from '@/prisma';
import { cloudinary, SECRET_KEY, WEB_URL } from '@/config';
import { AccountIdMaker, SubsDataIdMaker } from './customId';
import { genSalt, hash } from 'bcrypt';
import { transporter } from './mail';
import path from 'path';
import handlebars from 'handlebars';
import fs from 'fs';
import { sign } from 'jsonwebtoken';

const findRole = async (name: string) => {
  const role = await prisma.role.findFirst({ where: { name } });
  return role;
};

const avatarUrl = cloudinary.url(
  'https://res.cloudinary.com/dnqgu6x1e/image/upload/avatar_default.jpg',
  {
    secure: true,
  },
);

const createNewAccount = async (
  name: string,
  email: string,
  password: string,
  roleName: string,
) => {
  try {
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
    const role = await findRole(roleName);
    if (role === null) {
      throw new Error('Role not found');
    }

    // Make Custom Id
    const userId = await AccountIdMaker({ id: role.id, name: role.name });

    // Variable to store subsData if the role is 'user'
    let subsData = null;

    // Create Account in DB
    const newAccount = await prisma.$transaction(async (prisma) => {
      // 1. Create account first
      const account = await prisma.account.create({
        data: {
          id: userId,
          name,
          email,
          password: hashPassword,
          avatar: avatarUrl,
          roleId: role.id,
        },
      });

      // 2. Create Subs data if role is 'user
      if (role.name === 'user') {
        // Get Subscription Category
        const subCtg = await prisma.subsCtg.findFirst({
          where: { name: 'free' },
        });
        if (!subCtg)
          throw new Error(
            'No subscription category found, please check your database.',
          );
        //  Create SubsData Id
        const subsDataId = await SubsDataIdMaker(userId);
        // Input user data into Subs Data
        subsData = await prisma.subsData.create({
          data: {
            id: subsDataId,
            accountId: account.id,
            subsCtgId: subCtg.id,
          },
        });
      }
      return account;
    });

    // Making payload for verification
    const payload = {
      email,
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
    return role.name === 'user' ? { newAccount, subsData } : newAccount;
  } catch (error) {
    throw error;
  }
};

export default createNewAccount;
