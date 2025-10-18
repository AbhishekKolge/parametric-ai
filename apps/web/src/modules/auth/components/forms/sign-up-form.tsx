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
import { EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { type SignUpFormDto, signUpFormSchema } from "../../utils/schema";

export const SignUpForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const form = useForm<SignUpFormDto>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: SignUpFormDto) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

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
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button form="form-rhf-demo" type="submit">
            Create Account
          </Button>
          <FieldDescription className="text-center">
            Already have an account? <Link href="/auth/login">Login</Link>
          </FieldDescription>
        </Field>
      </CardFooter>
    </Card>
  );
};
