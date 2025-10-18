"use client";
import { ActionButton } from "@parametric-ai/ui/components/action-button";

type AuthActionButtonProps = Omit<
  React.ComponentProps<typeof ActionButton>,
  "action"
> & {
  action: () => Promise<{ error: null | { message?: string } }>;
  successMessage?: string;
  errorMessage?: string;
};

export function AuthActionButton({
  action,
  successMessage,
  errorMessage,
  ...props
}: AuthActionButtonProps) {
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
