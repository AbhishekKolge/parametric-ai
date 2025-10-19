import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { type TRPCDefaultErrorShape, TRPCError } from "@trpc/server";
import { APIError } from "groq-sdk";
import { ZodError } from "zod";
import { handleGroqError } from "./groq-error";
import { handlePrismaError } from "./prisma-error";
import { handleZodError } from "./zod-error";

export const handleErrorShapes = ({
  shape,
  cause,
}: {
  shape: TRPCDefaultErrorShape;
  cause: TRPCError["cause"];
}) => {
  if (cause instanceof TRPCError) {
    return shape;
  }

  if (cause instanceof ZodError) {
    return handleZodError({
      shape,
      cause,
    });
  }

  if (
    cause instanceof PrismaClientKnownRequestError ||
    cause instanceof PrismaClientValidationError ||
    cause instanceof PrismaClientInitializationError ||
    cause instanceof PrismaClientRustPanicError
  ) {
    return handlePrismaError({
      shape,
      cause,
    });
  }

  if (cause instanceof APIError) {
    return handleGroqError({
      shape,
      cause,
    });
  }

  if (cause instanceof Error) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: "INTERNAL_SERVER_ERROR",
      },
    };
  }

  return {
    ...shape,
    message: "An unexpected error occurred",
    data: {
      ...shape.data,
      code: "INTERNAL_SERVER_ERROR",
    },
  };
};
