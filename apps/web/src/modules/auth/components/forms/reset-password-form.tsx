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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@parametric-ai/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@parametric-ai/ui/components/input-group";
import { LoadingSwap } from "@parametric-ai/ui/components/loading-swap";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { INVALID_RESET_PASSWORD_TOKEN_ERROR } from "../../utils/const";
import {
  type ResetPasswordFormDto,
  resetPasswordFormSchema,
} from "../../utils/schema";
import { InvalidResetPasswordVerificationAlert } from "../alerts/invalid-reset-password-verification-alert";

export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInvalidToken =
    searchParams.get("error") === INVALID_RESET_PASSWORD_TOKEN_ERROR;
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const form = useForm<ResetPasswordFormDto>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async ({ newPassword }: ResetPasswordFormDto) => {
    await authClient.resetPassword(
      {
        newPassword,
        token: searchParams.get("token") || "",
      },
      {
        onSuccess: () => {
          router.push("/auth/login");
          toast.success("Password reset successfully! Please login.");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to reset password");
        },
      }
    );
  };

  const passwordVisibilityHandler = () => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      newPassword: !prev.newPassword,
    }));
  };

  const confirmPasswordVisibilityHandler = () => {
    setIsPasswordVisible((prev) => ({
      ...prev,
      confirmPassword: !prev.confirmPassword,
    }));
  };

  return (
    <>
      {!isInvalidToken && (
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="reset-password-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="newPassword">Password</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          aria-invalid={fieldState.invalid}
                          id="newPassword"
                          type={
                            isPasswordVisible.newPassword ? "text" : "password"
                          }
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            onClick={passwordVisibilityHandler}
                            size="icon-xs"
                          >
                            {isPasswordVisible.newPassword ? (
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
                            isPasswordVisible.confirmPassword
                              ? "text"
                              : "password"
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
                form="reset-password-form"
                type="submit"
              >
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Reset
                </LoadingSwap>
              </Button>
            </Field>
          </CardFooter>
        </Card>
      )}
      <InvalidResetPasswordVerificationAlert />
    </>
  );
};
