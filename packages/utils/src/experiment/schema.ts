import z from "zod";
import {
  MAX_EXPERIMENT_NAME_LENGTH,
  MAX_EXPERIMENT_TAG_LENGTH,
  MIN_EXPERIMENT_NAME_LENGTH,
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
  tags: z.array(experimentTagSchema).optional(),
});

export type CreateExperimentDto = z.infer<typeof createExperimentSchema>;
