"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@parametric-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@parametric-ai/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@parametric-ai/ui/components/field";
import { Input } from "@parametric-ai/ui/components/input";
import { LoadingSwap } from "@parametric-ai/ui/components/loading-swap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { FORGOT_PASSWORD_REDIRECT_URL } from "../../utils/const";
import {
  type ForgotPasswordFormDto,
  forgotPasswordFormSchema,
} from "../../utils/schema";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<ForgotPasswordFormDto>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "hesayij166@nrlord.com",
    },
  });

  const onSubmit = async ({ email }: ForgotPasswordFormDto) => {
    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: FORGOT_PASSWORD_REDIRECT_URL,
      },
      {
        onSuccess: () => {
          router.push("/auth/login");
          toast.success("Password reset email sent!");
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Failed to send password reset email"
          );
        },
      }
    );
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Send Password Reset Email</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="email"
                    placeholder="ai@example.com"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field>
          <Button form="forgot-password-form" type="submit">
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Send Reset Email
            </LoadingSwap>
          </Button>
          <FieldDescription className="text-center">
            <Link href="/auth/login">Go back to Login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
};
