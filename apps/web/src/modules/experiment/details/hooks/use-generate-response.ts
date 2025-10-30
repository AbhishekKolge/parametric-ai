import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { queryClient, trpc } from "@/services/trpc";

export const useGenerateResponse = (
  opts?: Parameters<typeof trpc.experiment.generateResponse.mutationOptions>[0]
) => {
  const { refetch } = authClient.useSession();
  return useMutation(
    trpc.experiment.generateResponse.mutationOptions({
      ...opts,
      onSuccess: (...args) => {
        toast.success("Response generated successfully");
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getAll.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getOne.queryKey({
            id: args[0].data.experimentId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getResponses.queryKey({
            experimentId: args[0].data.experimentId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.experiment.getAllMetrics.queryKey({
            id: args[0].data.experimentId,
          }),
        });
        refetch();
        opts?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toast.error(args[0].message);
        opts?.onError?.(...args);
      },
    })
  );
};
