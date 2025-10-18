"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { LoadingSwap } from "./loading-swap";

type ActionButtonProps = React.ComponentProps<typeof Button> & {
  action: () => Promise<{ error: boolean; message?: string }>;
};

export const ActionButton = ({ action, ...props }: ActionButtonProps) => {
  const [isLoading, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const data = await action();
      if (data.error) {
        toast.error(data.message || "Something went wrong");
      } else if (data.message) {
        toast.success(data.message);
      }
    });
  }

  const clickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    performAction();
    props.onClick?.(e);
  };

  return (
    <Button
      {...props}
      disabled={props.disabled ?? isLoading}
      onClick={clickHandler}
    >
      <LoadingSwap isLoading={isLoading}>{props.children}</LoadingSwap>
    </Button>
  );
};
