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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@parametric-ai/ui/components/input-group";
import { LoadingSwap } from "@parametric-ai/ui/components/loading-swap";
import { EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDisclosure } from "@/hooks/use-disclosure";
import { authClient } from "@/lib/auth-client";
import {
  EMAIL_NOT_VERIFIED_ERROR_CODE,
  EMAIL_VERIFICATION_CALLBACK_URL,
} from "../../utils/const";
import { type LoginFormDto, loginFormSchema } from "../../utils/schema";
import { InvalidEmailVerificationAlert } from "../alerts/invalid-email-verification-alert";
import { ResendEmailVerificationAlert } from "../alerts/resend-email-verification-alert";

export const LoginForm = () => {
  const resendEmailVerificationDisclosure = useDisclosure({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<LoginFormDto>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "test@user.com",
      password: "Test@123",
    },
  });

  const onSubmit = async ({ email, password }: LoginFormDto) => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          toast.success("Logged in successfully!");
        },
        onError: (ctx) => {
          if (ctx.error.code === EMAIL_NOT_VERIFIED_ERROR_CODE) {
            resendEmailVerificationDisclosure.open();
            return;
          }
          toast.error(ctx.error.message || "Failed to login");
        },
      }
    );
  };

  const resendEmailVerificationHandler = () =>
    authClient.sendVerificationEmail(
      {
        email: form.getValues("email"),
        callbackURL: EMAIL_VERIFICATION_CALLBACK_URL,
      },
      {
        onSuccess: () => {
          resendEmailVerificationDisclosure.close();
        },
        onError: () => {
          resendEmailVerificationDisclosure.close();
        },
      }
    );

  const passwordVisibilityHandler = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to your Parametric AI account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
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
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <FieldDescription>
                        <Link href="/auth/forgot-password">
                          Forgot your password?
                        </Link>
                      </FieldDescription>
                    </div>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={passwordVisibilityHandler}
                          size="icon-xs"
                        >
                          {isPasswordVisible ? <EyeClosed /> : <EyeIcon />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>

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
            <Button
              disabled={form.formState.isSubmitting}
              form="login-form"
              type="submit"
            >
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                Login
              </LoadingSwap>
            </Button>
            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up">Sign up</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
      <InvalidEmailVerificationAlert />
      <ResendEmailVerificationAlert
        {...resendEmailVerificationDisclosure}
        onResend={resendEmailVerificationHandler}
      />
    </>
  );
};
