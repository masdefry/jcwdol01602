import { createDate } from './createDate';

// cmplgYYMMDD-companyId
export const avatarIdMaker = async (accountId: string) => {
  const fileName = `avt${createDate}-${accountId}`.trim();
  return fileName;
};
