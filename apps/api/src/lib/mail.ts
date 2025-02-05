import nodemailer from 'nodemailer';
import { NODEMAILER_EMAIL, NODEMAILER_PASS } from '@/config';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASS,
  },
});
