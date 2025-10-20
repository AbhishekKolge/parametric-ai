import { getTokenUtilizationLevel } from "@parametric-ai/utils/prompt/helper";

export const getTokenUtilizationColorClasses = (percentage: number): string => {
  const level = getTokenUtilizationLevel(percentage);
  switch (level) {
    case "danger":
      return "text-red-600";
    default:
      return "";
  }
};
