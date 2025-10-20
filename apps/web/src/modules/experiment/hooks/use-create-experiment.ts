import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { queryClient, trpc } from "@/services/trpc";

export const useCreateExperiment = (
  opts?: Parameters<typeof trpc.experiment.create.mutationOptions>[0]
) =>
  useMutation(
    trpc.experiment.create.mutationOptions({
      ...opts,
      onSuccess: (...args) => {
        toast.success("Experiment created successfully");
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
