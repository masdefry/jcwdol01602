import { userProfIdMaker } from '@/lib/idUsers';
import prisma from '@/prisma';
import { Gender } from '@prisma/client';
import { getSubsDataByUser } from './subsDataHandler';

const findGender = (gender: String): Gender => {
  if (!Object.values(Gender).includes(gender as Gender)) {
    throw new Error(`Gender not found`);
  }
  return gender as Gender;
};

export const addUserProf = async (
  subsDataId: string,
  genderName: string,
  pob: string,
  dobString: string,
  address: string,
) => {
  try {
    const userProfileId = await userProfIdMaker();
    const gender = findGender(genderName);
    const dob = new Date(dobString);

    const data = await prisma.userProfile.create({
      data: {
        id: userProfileId,
        subsDataid: subsDataId,
        gender,
        pob,
        dob,
        address,
      },
    });
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - addUserProf :' + error);
  }
};

export const getProfileBySubsData = async (userId: string) => {
  try {
    const subsData = await getSubsDataByUser(userId);
    if (!subsData) throw new Error('No subscription data exist');
    const data = await prisma.userProfile.findFirst({
      where: { subsDataid: subsData.id },
    });
    if (!data) throw new Error('No profile data exist');
    return data;
  } catch (error: any) {
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('Unexpected error - getProfileBySubsData :' + error);
  }
};
