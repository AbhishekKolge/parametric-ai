import nodemailer from "nodemailer";
import { NODE_MAILER_CONFIG } from "./const";

export const sendEmail = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport(NODE_MAILER_CONFIG);

  return transporter.sendMail({
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ID}>`,
    to,
    subject,
    html,
  });
};

export const sendEmailVerification = ({
  to,
  url,
}: {
  to: string;
  url: string;
}) => {
  const html = `<p>Click the link to verify your email: <a href="${url}">verify email</a></p>`;

  return sendEmail({
    to,
    subject: `${process.env.APP_NAME} Email Confirmation Link`,
    html,
  });
};

export const sendResetPasswordEmail = ({
  to,
  url,
}: {
  to: string;
  url: string;
}) => {
  const html = `<p>Click the link to reset your password: <a href="${url}">reset password</a></p>`;

  return sendEmail({
    to,
    subject: `${process.env.APP_NAME} Reset Password Link`,
    html,
  });
};
