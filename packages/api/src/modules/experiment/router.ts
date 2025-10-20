import {
  createExperimentSchema,
  deleteExperimentSchema,
  experimentQuerySchema,
} from "@parametric-ai/utils/experiment/schema";
import { protectedProcedure, router } from "../../index";
import { create, deleteOne, getAll, getAllAIModels } from "./controller";

export const experimentRouter = router({
  getAllAIModels: protectedProcedure.query(getAllAIModels),
  create: protectedProcedure.input(createExperimentSchema).mutation(create),
  getAll: protectedProcedure.input(experimentQuerySchema).query(getAll),
  delete: protectedProcedure.input(deleteExperimentSchema).mutation(deleteOne),
});
