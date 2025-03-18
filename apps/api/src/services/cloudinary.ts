import { cloudinary } from '@/config';
import { avatarIdMaker } from '@/lib/cldIdHandler';
import { createDate } from '@/lib/createDate';
import { paymentProofIdMaker, questImgNameMaker } from '@/lib/customId';
import { cldCvIdMaker } from '@/lib/cvIdMaker';

export const avatarUrl = cloudinary.url(
  'https://res.cloudinary.com/dnqgu6x1e/image/upload/avatar_default.jpg',
  {
    secure: true,
  },
);

// Delete Avatar
export const delCldAvatar = async (url: string) => {
  try {
    const publicIdMatch = url.match(/final-project\/avatar\/(.+)\.[a-z]+$/);
    if (publicIdMatch) {
      const publicId = `final-project/avatar/${publicIdMatch[1]}`;
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    throw error;
  }
};

// Upload payment proof
export const addCldPayProof = async (
  image: Express.Multer.File,
  paymentId: string,
) => {
  try {
    const newImageName = await paymentProofIdMaker(paymentId);
    // convert to buffer
    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    // upload to cloudinary
    const imageUrl = await cloudinary.uploader.upload(base64Image, {
      folder: 'final-project/payment-proof',
      public_id: newImageName,
      overwrite: true,
    });
    if (!imageUrl)
      throw new Error(
        'Unexpected error while upload payment proof, please try again later',
      );
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

// bnr-idcompany-yymmdd-01
// Delete Payment Proof
export const delCldPayProof = async (url: string) => {
  try {
    const publicIdMatch = url.match(
      /final-project\/payment-proof\/(.+)\.[a-z]+$/,
    );
    if (publicIdMatch) {
      const publicId = `final-project/payment-proof/${publicIdMatch[1]}`;
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    throw error;
  }
};

export const addCldQuestImage = async (
  image: Express.Multer.File,
  sQuestId: string,
) => {
  try {
    const imageName = await questImgNameMaker(sQuestId);
    // convert to buffer
    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    const imageUrl = await cloudinary.uploader.upload(base64Image, {
      folder: 'final-project/skill-question',
      public_id: imageName,
      overwrite: true,
    });
    if (!imageUrl || !imageUrl.secure_url)
      throw new Error(
        'Unexpected error while upload payment proof, please try again later',
      );
    return imageUrl.secure_url;
  } catch (error) {
    throw error;
  }
};

export const delCldSQuestImage = async (url: string) => {
  try {
    const publicIdMatch = url.match(
      /final-project\/skill-question\/(.+)\.[a-z]+$/,
    );
    if (!publicIdMatch) {
      throw new Error('Invalid image URL format');
    }
    const publicId = `final-project/skill-question/${publicIdMatch[1]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

export const addCldAvatar = async (
  image: Express.Multer.File,
  accountId: string,
) => {
  try {
    const imageName = await avatarIdMaker(accountId);
    const base64Image = `data:${image.mimetype};base64,${image.buffer.toString('base64')}`;
    const imageUrl = await cloudinary.uploader.upload(base64Image, {
      folder: 'final-project/avatar',
      public_id: imageName,
      overwrite: true,
    });
    if (!imageUrl || !imageUrl.secure_url)
      throw new Error(
        'Unexpected error while upload company logo, please try again later',
      );
    return imageUrl.secure_url;
  } catch (error) {
    throw error;
  }
};

export const addCldCv = async (
  userId: string,
  cvId: string,
  file: Express.Multer.File,
) => {
  try {
    const fileName = await cldCvIdMaker(userId, cvId);
    const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const fileUrl = await cloudinary.uploader.upload(base64File, {
      folder: 'final-project/cv',
      public_id: fileName,
      overwrite: true,
    });
    if (!fileUrl || !fileUrl.secure_url)
      throw new Error(
        'Unexpected error while upload company logo, please try again later',
      );
    return fileUrl.secure_url;
  } catch (error) {
    throw error;
  }
};

export const delCldCv = async (url: string) => {
  try {
    const publicIdMatch = url.match(/final-project\/cv\/(.+)\.[a-z]+$/);
    if (publicIdMatch) {
      const publicId = `final-project/cv/${publicIdMatch[1]}`;
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    throw error;
  }
};
