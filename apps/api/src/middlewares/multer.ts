import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
const storage = multer.memoryStorage();

// Filter to only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png formats are allowed!'));
  }
};

export const uploadImage = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const multerUpload = multer({
      storage: storage,
      limits: { fileSize: 1 * 1024 * 1024 },
      fileFilter: fileFilter,
    }).single('image');

    // Cutsom error handling
    multerUpload(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res
            .status(400)
            .send({ message: 'Image must be less than 1MB' });
        }
      } else if (err) {
        return res
          .status(400)
          .send({ message: `Unexpected error occured : ${err.message}` });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};
