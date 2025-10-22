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
import { Button } from "@parametric-ai/ui/components/button";
import { LoadingSwap } from "@parametric-ai/ui/components/loading-swap";
import type { useDisclosure } from "@/hooks/use-disclosure";
import { useDeleteExperiment } from "../../hooks/use-delete-experiment";

type DeleteExperimentAlertProps = ReturnType<typeof useDisclosure> & {
  name: string;
  id: string;
};

export const DeleteExperimentAlert = ({
  toggle,
  isOpen,
  name,
  id,
  close,
}: DeleteExperimentAlertProps) => {
  const deleteExperimentMutation = useDeleteExperiment({
    onSuccess: () => {
      close();
    },
  });

  const deleteExperimentHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteExperimentMutation.mutate({
      id,
    });
  };
  return (
    <AlertDialog onOpenChange={toggle} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name} Experiment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this experiment? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteExperimentMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="text-white"
              disabled={deleteExperimentMutation.isPending}
              onClick={deleteExperimentHandler}
              variant="destructive"
            >
              <LoadingSwap isLoading={deleteExperimentMutation.isPending}>
                Delete
              </LoadingSwap>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
