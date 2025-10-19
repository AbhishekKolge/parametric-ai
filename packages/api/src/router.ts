import { protectedProcedure, publicProcedure, router } from "./index";
import { experimentRouter } from "./modules/experiment/router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
  experiment: experimentRouter,
});

export type AppRouter = typeof appRouter;
