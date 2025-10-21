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

export const downloadExcelFile = ({
  base64Data,
  fileName,
}: {
  base64Data: string;
  fileName: string;
}) => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = Array.from(byteCharacters).map((c) => c.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
};
