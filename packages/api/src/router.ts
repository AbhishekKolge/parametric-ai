import { protectedProcedure, publicProcedure, router } from "./index";
import { aiRouter } from "./modules/ai/router";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  privateData: protectedProcedure.query(({ ctx }) => ({
    message: "This is private",
    user: ctx.session.user,
  })),
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
