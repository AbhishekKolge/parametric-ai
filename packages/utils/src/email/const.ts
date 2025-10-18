import type { TransportOptions } from "nodemailer";

export const NODE_MAILER_CONFIG = {
  host: process.env.SENDGRID_HOST,
  port: process.env.SENDGRID_PORT,
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_API_KEY,
  },
} as TransportOptions;
