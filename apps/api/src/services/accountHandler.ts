import { SECRET_KEY } from '@/config';
import prisma from '@/prisma';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { getSubsDataByUser } from './subsDataHandler';
import { getPayBySubsData } from './paymentHandler';
import { delCldAvatar, delCldPayProof } from './cloudinary';

export const loginAccHandler = async (email: string, password: string) => {
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

export const verifyAccHandler = async (email: string) => {
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

export const getAccById = async (userId: string) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: userId },
    });
    return account;
  } catch (error) {
    throw error;
  }
};

export const delAccHandler = async (accountId: string) => {
  try {
    const findAccount = await getAccById(accountId);
    if (!findAccount) throw new Error('Account not found');

    let subsData = null;

    if (findAccount.role === 'user') {
      // get subsData by user Id
      subsData = await getSubsDataByUser(accountId);
      if (!subsData) throw new Error('No subsData: Invalid userId');

      // delete payment proof in cloudinary
      for (const payment of subsData.payment) {
        if (payment.proof) {
          await delCldPayProof(payment.proof);
        }
      }
    }
    await delCldAvatar(findAccount.avatar);

    await prisma.account.delete({
      where: { id: findAccount.id },
    });
    return findAccount.role === 'user'
      ? { findAccount, subsData }
      : findAccount;
  } catch (error: any) {
    if (error.message) throw new Error(error.message);
    throw new Error('Unexpected error while deleting account' + error);
  }
};

export const getAccAllHandler = async () => {
  try {
    let accounts = null;
    accounts = await prisma.account.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isVerified: true,
        role: true,
        createdAt: true,
      },
    });
    if (accounts.length === 0) {
      return (accounts = 'No data');
    }
    return accounts;
  } catch (error) {
    throw error;
  }
};
