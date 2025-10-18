"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@parametric-ai/ui/components/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDisclosure } from "@/hooks/use-disclosure";
import { INVALID_RESET_PASSWORD_TOKEN_ERROR } from "../../utils/const";

export const InvalidResetPasswordVerificationAlert = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInvalidToken =
    searchParams.get("error") === INVALID_RESET_PASSWORD_TOKEN_ERROR;
  const disclosure = useDisclosure({
    onClose: () => {
      Promise.resolve().then(() => {
        router.replace("/auth/forgot-password");
      });
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: dependencies are fine
  useEffect(() => {
    if (isInvalidToken) {
      disclosure.open();
    }
  }, [isInvalidToken]);

  return (
    <AlertDialog onOpenChange={disclosure.toggle} open={disclosure.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password Failed</AlertDialogTitle>
          <AlertDialogDescription>
            The reset password link is invalid or has expired.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
