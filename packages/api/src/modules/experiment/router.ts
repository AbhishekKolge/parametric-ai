import {
  createExperimentSchema,
  deleteExperimentSchema,
  experimentQuerySchema,
  generateResponseSchema,
  metricsQuerySchema,
  responsesQuerySchema,
  singleExperimentQuerySchema,
} from "@parametric-ai/utils/experiment/schema";
import { protectedProcedure, router } from "../../index";
import {
  create,
  deleteOne,
  generateResponse,
  getAll,
  getAllAIModels,
  getAllMetrics,
  getOne,
  getResponses,
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
  getResponses: protectedProcedure
    .input(responsesQuerySchema)
    .query(getResponses),
  getAllMetrics: protectedProcedure
    .input(metricsQuerySchema)
    .query(getAllMetrics),
});
