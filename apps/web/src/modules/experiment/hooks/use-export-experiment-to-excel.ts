import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";
import { trpc } from "@/services/trpc";
import { downloadExcelFile } from "../utils/helper";

export const useExportExperimentToExcel = (
  opts?: Parameters<
    typeof trpc.experiment.exportExperimentToExcel.mutationOptions
  >[0]
) =>
  useMutation(
    trpc.experiment.exportExperimentToExcel.mutationOptions({
      ...opts,
      onSuccess: (...args) => {
        downloadExcelFile({
          base64Data: args[0].data.base64Data,
          fileName: `experiment_${args[0].data.experimentId}_${Date.now()}`,
        });
        toast.success("Experiment exported successfully");
        opts?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toast.error(args[0].message);
        opts?.onError?.(...args);
      },
    })
  );
