import { createExperimentSchema } from "@parametric-ai/utils/experiment/schema";
import { protectedProcedure, router } from "../../index";
import { create, getAllAIModels } from "./controller";

export const experimentRouter = router({
  getAllAIModels: protectedProcedure.query(getAllAIModels),
  create: protectedProcedure.input(createExperimentSchema).mutation(create),
});
