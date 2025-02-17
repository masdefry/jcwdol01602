import { Role } from '@prisma/client';
import prisma from '../prisma';

interface IAccountIdMaker {
  name: Role;
}

export const AccountIdMaker = async ({ name }: IAccountIdMaker) => {
  // Make account created date in format YYMMDD
  const today = new Date();
  const yy = today.getFullYear().toString().slice(2, 4);
  const mm = (today.getMonth() + 1).toString().padStart(2, '0');
  const dd = today.getDate().toString().padStart(2, '0');
  const createdDate = `${yy}${mm}${dd}`;

  // Get the sequence base on role
  const accountCount = await prisma.account.count({
    where: {
      role: name,
      createdAt: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    },
  });

  // Format the sequence into 3 digits
  const accountNumber = (accountCount + 1).toString().padStart(3, '0');

  // Make customId
  const customId = `${name.charAt(0).toLowerCase()}${createdDate}-${accountNumber}`;

  return customId;
};

export const SubsCtgIdMaker = async () => {
  // Generate custom ID based on today's date
  const today = new Date();
  const YYMMDD = today.toISOString().slice(2, 10).replace(/-/g, '');
  const customIdPrefix = `sc${YYMMDD}`;

  // Check if the ID already exists for today's date
  const lastSubsCtg = await prisma.subsCtg.findFirst({
    where: {
      id: {
        startsWith: customIdPrefix,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  // Create the next increment for the ID
  let nextIdNumber = 1;
  if (lastSubsCtg) {
    // Extract the last number and increment it
    const lastIdNumber = parseInt(lastSubsCtg.id.slice(-2), 10);
    nextIdNumber = lastIdNumber + 1;
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(2, '0')}`;

  return customId;
};

export const SubsDataIdMaker = async (userId: string) => {
  // Generate custom ID based on today's date
  const today = new Date();
  const YYMMDD = today.toISOString().slice(2, 10).replace(/-/g, '');
  const customIdPrefix = `sd${YYMMDD}`;

  //  Check if the ID already exist for today's date
  const lastSubsData = await prisma.subsData.findFirst({
    where: {
      id: {
        startsWith: customIdPrefix,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  // Create the next increment for the ID
  let nextIdNumber = 1;
  if (lastSubsData) {
    // Extract the last sequence number using regex
    const match = lastSubsData.id.match(/-(\d+)-/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10 + 1);
    }
  }
  // Format the customId
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}-${userId}`;
  return customId;
};

export const PaymentIdMaker = async () => {
  // console.log('PaymentIdMaker: called');
  // Make payment created date in format YYMMDD
  const today = new Date();
  const YYMMDD = today.toISOString().slice(2, 10).replace(/-/g, '');
  const customIdPrefix = `inv${YYMMDD}`;

  // Chech if the ID laready exist for today's date
  const lastPayment = await prisma.payment.findFirst({
    where: {
      id: {
        startsWith: customIdPrefix,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  // Create the next increment for the ID
  let nextIdNumber = 1;
  if (lastPayment) {
    // Extract the last sequence number using regex
    const match = lastPayment.id.match(/-(\d+)-/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10 + 1);
    }
  }
  // Format the customId
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')} `;
  return customId;
};

export const paymentProofIdMaker = async (paymentId: string) => {
  const date = new Date();
  const formattedDate = date.toISOString().slice(2, 10).replace(/-/g, '');
  const fileName = `pp${formattedDate}-${paymentId}`.trim();
  return fileName;
};
