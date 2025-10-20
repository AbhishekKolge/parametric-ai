import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { queryClient, trpc } from "@/services/trpc";

export const useDeleteExperiment = (
  opts?: Parameters<typeof trpc.experiment.delete.mutationOptions>[0]
) =>
  useMutation(
    trpc.experiment.delete.mutationOptions({
      ...opts,
      onSuccess: (...args) => {
        toast.success("Experiment deleted successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getAll.queryKey(),
        });
        opts?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toast.error(args[0].message);
        opts?.onError?.(...args);
      },
    })
  );
