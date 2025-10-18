import prisma from "@parametric-ai/db";
import {
  SESSION_COOKIE_MAX_AGE,
  SESSION_EXPIRES_IN,
  SESSION_UPDATE_AGE,
} from "@parametric-ai/utils/auth/const";
import {
  sendEmailVerification,
  sendResetPasswordEmail,
} from "@parametric-ai/utils/email/helper";
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  session: {
    expiresIn: SESSION_EXPIRES_IN,
    updateAge: SESSION_UPDATE_AGE,
    cookieCache: {
      enabled: true,
      maxAge: SESSION_COOKIE_MAX_AGE,
    },
  },
  rateLimit: {
    storage: "database",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await sendResetPasswordEmail({
          to: user.email,
          url,
        });
      } catch {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Failed to send reset password email",
        });
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await sendEmailVerification({
          to: user.email,
          url,
        });
      } catch {
        throw new APIError("INTERNAL_SERVER_ERROR", {
          message: "Failed to send verification email",
        });
      }
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});
