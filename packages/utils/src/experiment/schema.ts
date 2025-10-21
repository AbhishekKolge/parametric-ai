import z from "zod";
import {
  DEFAULT_EXPERIMENT_LIMIT,
  DEFAULT_RESPONSE_LIMIT,
  MAX_EXPERIMENT_LIMIT,
  MAX_EXPERIMENT_NAME_LENGTH,
  MAX_EXPERIMENT_SEARCH_TERM_LENGTH,
  MAX_EXPERIMENT_TAG_LENGTH,
  MAX_RESPONSE_LIMIT,
  MAX_TAGS_LENGTH,
  MAX_TEMPERATURE,
  MAX_TOP_P,
  MIN_COMPLETION_TOKENS,
  MIN_EXPERIMENT_LIMIT,
  MIN_EXPERIMENT_NAME_LENGTH,
  MIN_EXPERIMENT_PAGE,
  MIN_EXPERIMENT_PROMPT_LENGTH,
  MIN_EXPERIMENT_TAG_LENGTH,
  MIN_RESPONSE_LIMIT,
  MIN_RESPONSE_PAGE,
  MIN_TEMPERATURE,
  MIN_TOP_P,
} from "./const";

export const experimentTagSchema = z
  .string()
  .trim()
  .min(
    MIN_EXPERIMENT_TAG_LENGTH,
    `At least ${MIN_EXPERIMENT_TAG_LENGTH} characters long`
  )
  .max(
    MAX_EXPERIMENT_TAG_LENGTH,
    `At most ${MAX_EXPERIMENT_TAG_LENGTH} characters long`
  )
  .nonempty("Tag cannot be empty");

export const createExperimentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      MIN_EXPERIMENT_NAME_LENGTH,
      `At least ${MIN_EXPERIMENT_NAME_LENGTH} characters long`
    )
    .max(
      MAX_EXPERIMENT_NAME_LENGTH,
      `At most ${MAX_EXPERIMENT_NAME_LENGTH} characters long`
    )
    .nonempty("Name is required"),
  modelId: z.string().trim().nonempty("Model is required"),
  modelMetadata: z.record(z.string(), z.any()),
  prompt: z
    .string()
    .trim()
    .min(
      MIN_EXPERIMENT_PROMPT_LENGTH,
      `At least ${MIN_EXPERIMENT_PROMPT_LENGTH} characters long`
    )
    .nonempty("Prompt is required"),
  tags: z
    .array(experimentTagSchema)
    .max(MAX_TAGS_LENGTH, `At most ${MAX_TAGS_LENGTH} tags allowed`)
    .optional(),
});

export type CreateExperimentDto = z.infer<typeof createExperimentSchema>;

export const experimentQuerySchema = z.object({
  page: z
    .int()
    .min(MIN_EXPERIMENT_PAGE, `At least page ${MIN_EXPERIMENT_PAGE}`)
    .default(MIN_EXPERIMENT_PAGE),
  limit: z
    .int()
    .min(MIN_EXPERIMENT_LIMIT, `At least ${MIN_EXPERIMENT_LIMIT} result`)
    .max(
      MAX_EXPERIMENT_LIMIT,
      `At most ${MAX_EXPERIMENT_LIMIT} results allowed`
    )
    .default(DEFAULT_EXPERIMENT_LIMIT),
  search: z
    .string()
    .max(
      MAX_EXPERIMENT_SEARCH_TERM_LENGTH,
      `At most ${MAX_EXPERIMENT_SEARCH_TERM_LENGTH} characters long`
    )
    .optional(),
  modelIds: z.array(z.string()).optional(),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ExperimentQueryDto = z.infer<typeof experimentQuerySchema>;

export const deleteExperimentSchema = z.object({
  id: z.string().trim().nonempty("Experiment ID is required"),
});

export type DeleteExperimentDto = z.infer<typeof deleteExperimentSchema>;

export const generateResponseSchema = z.object({
  maxCompletionTokens: z
    .int()
    .min(MIN_COMPLETION_TOKENS, `At least ${MIN_COMPLETION_TOKENS} token`),
  topP: z
    .number()
    .min(MIN_TOP_P, `At least ${MIN_TOP_P}`)
    .max(MAX_TOP_P, `At most ${MAX_TOP_P}`),
  temperature: z
    .number()
    .min(MIN_TEMPERATURE, `At least ${MIN_TEMPERATURE}`)
    .max(MAX_TEMPERATURE, `At most ${MAX_TEMPERATURE}`),
  experimentId: z.string().trim().nonempty("Experiment ID is required"),
});

export type GenerateResponseDto = z.infer<typeof generateResponseSchema>;

export const singleExperimentQuerySchema = z.object({
  id: z.string().trim().nonempty("Experiment ID is required"),
});

export type SingleExperimentQueryDto = z.infer<
  typeof singleExperimentQuerySchema
>;

export const responsesQuerySchema = z.object({
  experimentId: z.string().trim().nonempty("Experiment ID is required"),
  page: z
    .int()
    .min(MIN_RESPONSE_PAGE, `At least page ${MIN_RESPONSE_PAGE}`)
    .default(MIN_RESPONSE_PAGE),
  limit: z
    .int()
    .min(MIN_RESPONSE_LIMIT, `At least ${MIN_RESPONSE_LIMIT} result`)
    .max(MAX_RESPONSE_LIMIT, `At most ${MAX_RESPONSE_LIMIT} results allowed`)
    .default(DEFAULT_RESPONSE_LIMIT),
  sortBy: z
    .enum(["temperature", "topP", "maxCompletionTokens", "createdAt"])
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ResponsesQueryDto = z.infer<typeof responsesQuerySchema>;
