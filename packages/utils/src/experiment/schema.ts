import z from "zod";
import {
  DEFAULT_EXPERIMENT_QUERY_LIMIT,
  MAX_EXPERIMENT_NAME_LENGTH,
  MAX_EXPERIMENT_QUERY_LIMIT,
  MAX_EXPERIMENT_SEARCH_TERM_LENGTH,
  MAX_EXPERIMENT_TAG_LENGTH,
  MAX_TAGS_LENGTH,
  MIN_EXPERIMENT_LIMIT,
  MIN_EXPERIMENT_NAME_LENGTH,
  MIN_EXPERIMENT_PAGE,
  MIN_EXPERIMENT_PROMPT_LENGTH,
  MIN_EXPERIMENT_TAG_LENGTH,
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
      MAX_EXPERIMENT_QUERY_LIMIT,
      `At most ${MAX_EXPERIMENT_QUERY_LIMIT} results allowed`
    )
    .default(DEFAULT_EXPERIMENT_QUERY_LIMIT),
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
