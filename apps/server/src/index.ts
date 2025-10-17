import "dotenv/config";
import { createContext } from "@parametric-ai/api/context";
import { appRouter } from "@parametric-ai/api/router";
import { auth } from "@parametric-ai/auth";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { shutdown } from "./utils/process";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(StatusCodes.OK).send("OK");
});

const port = process.env.PORT;
app.listen(port, () => {
  process.stdout.write(`Server is running on port ${port}\n`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
