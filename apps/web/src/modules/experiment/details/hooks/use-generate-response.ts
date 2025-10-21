import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { queryClient, trpc } from "@/services/trpc";

export const useGenerateResponse = (
  opts?: Parameters<typeof trpc.experiment.generateResponse.mutationOptions>[0]
) =>
  useMutation(
    trpc.experiment.generateResponse.mutationOptions({
      ...opts,
      onSuccess: (...args) => {
        toast.success("Response generated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getAll.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getOne.queryKey({
            // id: args[0],
          }),
        });
        opts?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toast.error(args[0].message);
        opts?.onError?.(...args);
      },
    })
  );
