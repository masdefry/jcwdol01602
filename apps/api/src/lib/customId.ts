import { Role } from '@prisma/client';
import prisma from '../prisma';

interface IAccountIdMaker {
  name: Role;
}

const today = new Date();
// create date with format YYMMDD
const createDate = today.toISOString().slice(2, 10).replace(/-/g, '');

export const AccountIdMaker = async ({ name }: IAccountIdMaker) => {
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
  const customId = `${name.charAt(0).toLowerCase()}${createDate}-${accountNumber}`;

  return customId;
};

export const SubsCtgIdMaker = async () => {
  // Generate custom ID based on today's date
  const customIdPrefix = `sc${createDate}`;

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
  const customIdPrefix = `sd${createDate}`;

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
  const customIdPrefix = `inv${createDate}`;

  // Chech if the ID already exist for today's date
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
    const match = lastPayment.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  // Format the customId
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const paymentProofIdMaker = async (paymentId: string) => {
  const fileName = `pp${createDate}-${paymentId}`.trim();
  return fileName;
};

export const skillIdMaker = async () => {
  const customIdPrefix = `sk${createDate}`;

  // Check if the ID already exist for today's date
  const lastSkill = await prisma.skill.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });

  // Create the next increment for the ID
  let nextIdNumber = 1;
  if (lastSkill) {
    // Extract the last sequence number using regex
    const match = lastSkill.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const sQuestIdMaker = async () => {
  const customIdPrefix = `sq${createDate}`;

  // Check if the ID already exist for today's date
  const lastQuestion = await prisma.skillQuestion.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });

  // Create the next increment for the ID
  let nextIdNumber = 1;
  if (lastQuestion) {
    // Extract the last sequence number using regex
    const match = lastQuestion.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};

export const questImgNameMaker = async (sQuestId: string) => {
  const customId = `sqi${createDate}-${sQuestId}`;
  return customId;
};

export const sScoreIdMaker = async () => {
  const customIdPrefix = `scr${createDate}`;

  // Check if the ID already exist for today's date
  const lastScore = await prisma.skillScore.findFirst({
    where: { id: { startsWith: customIdPrefix } },
    orderBy: { id: 'desc' },
  });

  // Create the next increment for the ID
  let nextIdNumber = 1;
  if (lastScore) {
    // Extract the last sequence number using regex
    const match = lastScore.id.match(/-(\d+)$/);
    if (match) {
      nextIdNumber = parseInt(match[1], 10) + 1;
    }
  }
  const customId = `${customIdPrefix}-${nextIdNumber.toString().padStart(3, '0')}`;
  return customId;
};
