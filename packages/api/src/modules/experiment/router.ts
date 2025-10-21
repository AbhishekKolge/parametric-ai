import {
  createExperimentSchema,
  deleteExperimentSchema,
  experimentQuerySchema,
  generateResponseSchema,
  singleExperimentQuerySchema,
} from "@parametric-ai/utils/experiment/schema";
import { protectedProcedure, router } from "../../index";
import {
  create,
  deleteOne,
  generateResponse,
  getAll,
  getAllAIModels,
  getOne,
} from "./controller";

export const experimentRouter = router({
  getAllAIModels: protectedProcedure.query(getAllAIModels),
  create: protectedProcedure.input(createExperimentSchema).mutation(create),
  getAll: protectedProcedure.input(experimentQuerySchema).query(getAll),
  delete: protectedProcedure.input(deleteExperimentSchema).mutation(deleteOne),
  generateResponse: protectedProcedure
    .input(generateResponseSchema)
    .mutation(generateResponse),
  getOne: protectedProcedure.input(singleExperimentQuerySchema).query(getOne),
});
