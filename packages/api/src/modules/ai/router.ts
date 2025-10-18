import { protectedProcedure, router } from "../../index";
import { getAllModels } from "./controller";

export const aiRouter = router({
  getAllModels: protectedProcedure.query(getAllModels),
});
