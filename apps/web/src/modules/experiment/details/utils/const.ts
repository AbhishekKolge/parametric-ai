import {
  DEFAULT_RESPONSE_LIMIT,
  DEFAULT_RESPONSE_PAGE,
} from "@parametric-ai/utils/experiment/const";
import type { ResponsesQueryDto } from "@parametric-ai/utils/experiment/schema";
import type { ResponseMetrics } from "@parametric-ai/utils/experiment/types";

export const DEFAULT_TEMPERATURE_STEP = 0.01;
export const DEFAULT_TOP_P_STEP = 0.01;
export const DEFAULT_MAX_COMPLETION_TOKENS_STEP = 128;

export const DEFAULT_RESPONSE_FILTERS: Omit<ResponsesQueryDto, "experimentId"> =
  {
    page: DEFAULT_RESPONSE_PAGE,
    limit: DEFAULT_RESPONSE_LIMIT,
    sortBy: "createdAt",
    order: "desc",
  };

export const METRICS_LABEL_MAP: Record<keyof ResponseMetrics, string> = {
  completionTokens: "Completion Tokens",
  promptTime: "Prompt Time",
  completionTime: "Completion Time",
  totalTokens: "Total Tokens",
  totalTime: "Total Time",
  coherence: "Coherence",
  relevance: "Relevance",
  creativity: "Creativity",
  completeness: "Completeness",
  readability: "Readability",
  sentimentBalance: "Sentiment Balance",
  informationDensity: "Information Density",
  overallScore: "Overall Score",
};

export const BADGE_METRICS_KEYS: (keyof ResponseMetrics)[] = [
  "coherence",
  "relevance",
  "creativity",
];

export const PROGRESS_METRICS_KEYS: (keyof ResponseMetrics)[] = [
  "coherence",
  "relevance",
  "creativity",
  "completeness",
  "readability",
  "sentimentBalance",
  "informationDensity",
  "overallScore",
];

export const PERFORMANCE_METRICS_KEYS: (keyof ResponseMetrics)[] = [
  "completionTokens",
  "completionTime",
  "totalTokens",
];

export const PERFORMANCE_METRICS_UNITS: Partial<
  Record<keyof ResponseMetrics, string>
> = {
  completionTokens: "",
  completionTime: "s",
  totalTokens: "",
};
