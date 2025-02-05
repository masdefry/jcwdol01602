import prisma from '../prisma';

interface IAccountIdMaker {
  id: number;
  name: string;
}

const AccountIdMaker = async ({ id, name }: IAccountIdMaker) => {
  // Make account created date in format YYMMDD
  const today = new Date();
  const yy = today.getFullYear().toString().slice(2, 4);
  const mm = (today.getMonth() + 1).toString().padStart(2, '0');
  const dd = today.getDate().toString().padStart(2, '0');
  const createdDate = `${yy}${mm}${dd}`;

  // Get the sequence base on role
  const accountCount = await prisma.account.count({
    where: {
      roleId: id,
      createdAt: { gte: new Date(today.setHours(0, 0, 0, 0)) },
    },
  });

  // Format the sequence into 3 digits
  const accountNumber = (accountCount + 1).toString().padStart(3, '0');

  // Make customId
  const customId = `${name.charAt(0).toUpperCase()}${createdDate}-${accountNumber}`;

  return customId;
};

export { AccountIdMaker };
