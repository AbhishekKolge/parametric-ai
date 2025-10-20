import { HUNDRED } from "./const";

export const getPercentage = ({
  part,
  total,
}: {
  part: number;
  total: number;
}): number => (part / total) * HUNDRED;
