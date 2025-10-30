import { formatDuration, intervalToDuration } from "date-fns";
import { HUNDRED } from "./const";

export const getPercentage = ({
  part,
  total,
}: {
  part: number;
  total: number;
}): number => (part / total) * HUNDRED;

export const getTimeInterval = (time: Date) => {
  const duration = intervalToDuration({
    start: new Date(),
    end: time,
  });

  return formatDuration(duration, {
    format: ["hours", "minutes"],
  });
};
