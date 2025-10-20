import {
  DEFAULT_EXPERIMENT_PAGE,
  DEFAULT_EXPERIMENT_QUERY_LIMIT,
} from "@parametric-ai/utils/experiment/const";
import type { ExperimentQueryDto } from "@parametric-ai/utils/experiment/schema";

export const DEFAULT_EXPERIMENT_FILTERS: ExperimentQueryDto = {
  page: DEFAULT_EXPERIMENT_PAGE,
  limit: DEFAULT_EXPERIMENT_QUERY_LIMIT,
  search: "",
  modelIds: [],
  sortBy: "createdAt",
  order: "desc",
};
