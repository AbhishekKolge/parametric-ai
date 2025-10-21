import {
  DEFAULT_EXPERIMENT_LIMIT,
  DEFAULT_EXPERIMENT_PAGE,
} from "@parametric-ai/utils/experiment/const";
import type { ExperimentQueryDto } from "@parametric-ai/utils/experiment/schema";

export const DEFAULT_EXPERIMENT_FILTERS: ExperimentQueryDto = {
  page: DEFAULT_EXPERIMENT_PAGE,
  limit: DEFAULT_EXPERIMENT_LIMIT,
  search: "",
  modelIds: [],
  sortBy: "createdAt",
  order: "desc",
};
