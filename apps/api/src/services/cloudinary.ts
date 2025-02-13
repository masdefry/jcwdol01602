import { cloudinary } from '@/config';

// Delete Avatar
export const deleteAvatar = async (url: string) => {
  const publicIdMatch = url.match(/final-project\/avatar\/(.+)\.[a-z]+$/);
  if (publicIdMatch) {
    const publicId = `final-project/avatar/${publicIdMatch[1]}`;
    await cloudinary.uploader.destroy(publicId);
  }
};
