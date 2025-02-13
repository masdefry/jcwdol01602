import { SECRET_KEY } from '@/config';
import prisma from '@/prisma';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

export const login = async (email: string, password: string) => {
  try {
    // Check if email exist in database and verified
    const findAccount = await prisma.account.findUnique({
      where: { email },
    });
    if (!findAccount) throw new Error('Invalid email!');
    if (!findAccount.isVerified)
      throw new Error('Please verify your account first');
    // Compare password with salt and check if password is valid
    const validPassword = await compare(password, findAccount.password);
    if (!validPassword) throw new Error('Invalid password!');
    // Use JWT
    const payload = {
      email,
      id: findAccount.id,
      name: findAccount.name,
      role: findAccount.role,
      avatar: findAccount.avatar,
    };
    const token = sign(payload, SECRET_KEY as string, { expiresIn: '1h' });
    return token;
  } catch (error) {
    throw error;
  }
};

export const verify = async (email: string) => {
  try {
    const account = await prisma.account.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });
    return account;
  } catch (error) {
    throw error;
  }
};

export const getAccount = async (id: string) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id },
    });
    return account;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (id: string) => {
  try {
    await prisma.account.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export const getAccounts = async () => {
  try {
    let accounts = null;
    accounts = await prisma.account.findMany({
      select: { id: true, name: true, email: true, avatar: true },
    });
    if (accounts.length === 0) {
      return (accounts = 'No data');
    }
    return accounts;
  } catch (error) {
    throw error;
  }
};
