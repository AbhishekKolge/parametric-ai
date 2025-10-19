import {
  createExperimentSchema,
  experimentTagSchema,
} from "@parametric-ai/utils/experiment/schema";
import z from "zod";

export const extendedCreateExperimentSchema = createExperimentSchema.extend({
  tags: z
    .array(
      z.object({
        name: experimentTagSchema,
      })
    )
    .optional(),
});

export type ExtendedCreateExperimentDto = z.infer<
  typeof extendedCreateExperimentSchema
>;
