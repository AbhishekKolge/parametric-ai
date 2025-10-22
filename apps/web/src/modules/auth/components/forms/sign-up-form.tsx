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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { EMAIL_VERIFICATION_CALLBACK_URL } from "../../utils/const";
import { type SignUpFormDto, signUpFormSchema } from "../../utils/schema";

export const SignUpForm = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const form = useForm<SignUpFormDto>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ name, email, password }: SignUpFormDto) => {
    await authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL: EMAIL_VERIFICATION_CALLBACK_URL,
      },
      {
        onSuccess: () => {
          router.push("/auth/login");
          toast.success("Please check your email to verify your account");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign up");
        },
      }
    );
  };

  const passwordVisibilityHandler = () => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      password: !prev.password,
    }));
  };

  const confirmPasswordVisibilityHandler = () => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      confirmPassword: !prev.confirmPassword,
    }));
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id="name"
                    placeholder="John Doe"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="password"
                      type={isPasswordVisible.password ? "text" : "password"}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={passwordVisibilityHandler}
                        size="icon-xs"
                      >
                        {isPasswordVisible.password ? (
                          <EyeClosed />
                        ) : (
                          <EyeIcon />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="confirmPassword"
                      type={
                        isPasswordVisible.confirmPassword ? "text" : "password"
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        onClick={confirmPasswordVisibilityHandler}
                        size="icon-xs"
                      >
                        {isPasswordVisible.confirmPassword ? (
                          <EyeClosed />
                        ) : (
                          <EyeIcon />
                        )}
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
            form="sign-up-form"
            type="submit"
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Create Account
            </LoadingSwap>
          </Button>
          <FieldDescription className="text-center">
            Already have an account? <Link href="/auth/login">Login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
};
