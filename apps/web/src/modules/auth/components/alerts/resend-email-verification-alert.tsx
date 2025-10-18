"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@parametric-ai/ui/components/alert-dialog";
import { useRef, useState } from "react";
import type { useDisclosure } from "@/hooks/use-disclosure";
import type { authClient } from "@/lib/auth-client";
import {
  ONE_SECOND_MS,
  RESEND_EMAIL_COOL_DOWN_SECONDS,
} from "../../utils/const";
import { AuthActionButton } from "../buttons/auth-action-button";

type ResendEmailVerificationAlertProps = ReturnType<typeof useDisclosure> & {
  onResend: () => Promise<ReturnType<typeof authClient.sendVerificationEmail>>;
};

export const ResendEmailVerificationAlert = ({
  toggle,
  isOpen,
  onResend,
}: ResendEmailVerificationAlertProps) => {
  const [timeToNextResend, setTimeToNextResend] = useState(0);
  const interval = useRef<NodeJS.Timeout>(undefined);

  const startEmailVerificationCountdown = (
    time = RESEND_EMAIL_COOL_DOWN_SECONDS
  ) => {
    setTimeToNextResend(time);

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setTimeToNextResend((t) => {
        const newT = t - 1;

        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, ONE_SECOND_MS);
  };

  const resendHandler = () => {
    startEmailVerificationCountdown();
    return onResend();
  };
  const preventAlertClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
  };

  return (
    <AlertDialog onOpenChange={toggle} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Email Not Verified</AlertDialogTitle>
          <AlertDialogDescription>
            Your email address is not verified. Please check your inbox for the
            verification email. If you did not receive it, you can resend the
            verification email.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AuthActionButton
              action={resendHandler}
              disabled={timeToNextResend > 0}
              errorMessage="Failed to resend verification email"
              onClick={preventAlertClose}
              successMessage="Verification email resent. Please check your inbox."
            >
              {timeToNextResend > 0
                ? `Resend Email (${timeToNextResend})`
                : "Resend Email"}
            </AuthActionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
