import z from "zod";
import { MIN_PASSWORD_LENGTH } from "./const";

const passwordSchema = z
  .string()
  .trim()
  .nonempty("Password is required")
  .min(MIN_PASSWORD_LENGTH, "At least 8 characters long")
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
    confirmPassword: z.string().trim().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormDto = z.infer<typeof signUpFormSchema>;
