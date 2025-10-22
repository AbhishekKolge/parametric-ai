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
import type { useDisclosure } from "@/hooks/use-disclosure";
import { authClient } from "@/lib/auth-client";
import { AuthActionButton } from "@/modules/auth/components/buttons/auth-action-button";

type LogoutAlertProps = ReturnType<typeof useDisclosure>;

export const LogoutAlert = ({ isOpen, close, toggle }: LogoutAlertProps) => {
  const logoutHandler = () =>
    authClient.signOut(
      {},
      {
        onSuccess: () => {
          close();
        },
      }
    );
  return (
    <AlertDialog onOpenChange={toggle} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction asChild>
            <AuthActionButton
              action={logoutHandler}
              className="text-white"
              errorMessage="Failed to log out. Please try again."
              successMessage="Logged out successfully."
              variant="destructive"
            >
              Log out
            </AuthActionButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
