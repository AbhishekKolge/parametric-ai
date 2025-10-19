import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { trpc } from "@/services/trpc";

export const useCreateExperiment = (
  opts?: Parameters<typeof trpc.experiment.create.mutationOptions>[0]
) =>
  useMutation(
    trpc.experiment.create.mutationOptions({
      ...opts,
      onSuccess: (...args) => {
        toast.success("Experiment created successfully");
        opts?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toast.error(args[0].message);
        opts?.onError?.(...args);
      },
    })
  );
