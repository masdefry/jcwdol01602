import { config } from 'dotenv';
import { resolve } from 'path';
import { v2 as cloudinary } from 'cloudinary';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../.env`) });
// config({ path: resolve(__dirname, `../${envFile}`) });
// config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

// cloudinary config
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const WEB_URL = process.env.BASE_WEB_URL || '';
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL || '';
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS || '';
export const SECRET_KEY = process.env.SECRET_KEY || '';
export const BANK_ACCOUNT = process.env.BANK_ACCOUNT || '';

export { cloudinary };
