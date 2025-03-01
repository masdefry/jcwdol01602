import { userProfIdMaker } from '@/lib/idUsers';
import prisma from '@/prisma';
import { Gender } from '@prisma/client';

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
