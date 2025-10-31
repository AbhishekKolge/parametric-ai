import prisma from "@parametric-ai/db";
import {
  DEFAULT_CREDITS,
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
      enabled: false,
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
      secure: true,
      signed: true,
      sameSite: "none",
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  user: {
    additionalFields: {
      credits: {
        type: "number",
        input: false,
        defaultValue: DEFAULT_CREDITS,
      },
      creditResetTime: {
        type: "date",
        input: false,
      },
    },
  },
});
