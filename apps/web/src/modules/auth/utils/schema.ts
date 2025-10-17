import z from "zod";
import { MIN_PASSWORD_LENGTH } from "./const";

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .trim()
    .nonempty("Password is required")
    .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
});

export type LoginFormDto = z.infer<typeof loginFormSchema>;
