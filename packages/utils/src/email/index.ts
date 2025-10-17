import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = ({
  to,
  url,
}: {
  to: string;
  url: string;
}) =>
  resend.emails.send({
    from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject: "Verify your email address",
    text: `Click the link to verify your email: ${url}`,
  });

export const sendResetPasswordEmail = ({
  to,
  url,
}: {
  to: string;
  url: string;
}) =>
  resend.emails.send({
    from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_FROM_ADDRESS}>`,
    to,
    subject: "Reset your password",
    text: `Click the link to reset your password: ${url}`,
  });
