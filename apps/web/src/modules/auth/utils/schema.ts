import z from "zod";
import {
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "./const";

const passwordSchema = z
  .string()
  .trim()
  .min(MIN_PASSWORD_LENGTH, `At least ${MIN_PASSWORD_LENGTH} characters long`)
  .max(MAX_PASSWORD_LENGTH, `At most ${MAX_PASSWORD_LENGTH} characters long`)
  .nonempty("Password is required")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/[a-z]/, "At least one lowercase letter")
  .regex(/[0-9]/, "At least one number")
  .regex(/[@$!%*?&#]/, "At least one special character");

export const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: passwordSchema,
});

export type LoginFormDto = z.infer<typeof loginFormSchema>;

export const signUpFormSchema = loginFormSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(MIN_NAME_LENGTH, `At least ${MIN_NAME_LENGTH} characters long`)
      .max(MAX_NAME_LENGTH, `At most ${MAX_NAME_LENGTH} characters long`)
      .nonempty("Name is required"),
    confirmPassword: z.string().trim().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormDto = z.infer<typeof signUpFormSchema>;

export const forgotPasswordFormSchema = z.object({
  email: z.email("Invalid email address"),
});

export type ForgotPasswordFormDto = z.infer<typeof forgotPasswordFormSchema>;

export const resetPasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().trim().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormDto = z.infer<typeof resetPasswordFormSchema>;
