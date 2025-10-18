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
import { INVALID_TOKEN_ERROR } from "../../utils/const";

export const InvalidEmailVerificationAlert = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInvalidToken = searchParams.get("error") === INVALID_TOKEN_ERROR;
  const disclosure = useDisclosure({
    onClose: () => {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      Promise.resolve().then(() => {
        router.replace(`?${newParams.toString()}`, { scroll: false });
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
          <AlertDialogTitle>Email Verification Failed</AlertDialogTitle>
          <AlertDialogDescription>
            The email verification link is invalid or has expired.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
