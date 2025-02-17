import { cloudinary } from '@/config';
import { paymentProofIdMaker } from '@/lib/customId';

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
