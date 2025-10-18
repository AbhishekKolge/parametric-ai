"use client";
import { ActionButton } from "@parametric-ai/ui/components/action-button";

type AuthActionButtonProps<T> = Omit<
  React.ComponentProps<typeof ActionButton>,
  "action"
> & {
  action: () => Promise<T>;
  successMessage?: string;
  errorMessage?: string;
};

export function AuthActionButton<
  T extends { error: null | { message?: string } },
>({
  action,
  successMessage,
  errorMessage,
  ...props
}: AuthActionButtonProps<T>) {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action();
        if (res.error) {
          return {
            error: true,
            message: res.error.message || errorMessage || "Action failed",
          };
        }
        return { error: false, message: successMessage };
      }}
    />
  );
}
