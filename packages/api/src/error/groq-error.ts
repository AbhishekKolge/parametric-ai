import type { TRPCDefaultErrorShape } from "@trpc/server";
import type { APIError } from "groq-sdk";
import { StatusCodes } from "http-status-codes";

export const handleGroqError = ({
  shape,
  cause,
}: {
  shape: TRPCDefaultErrorShape;
  cause: APIError & {
    error: {
      error: {
        message: string;
        type: string;
        code: string;
      };
    };
  };
}) => {
  const { error, status } = cause;

  if (status === StatusCodes.BAD_REQUEST) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "BAD_REQUEST",
      },
    };
  }
  if (status === StatusCodes.UNAUTHORIZED) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "UNAUTHORIZED",
      },
    };
  }
  if (status === StatusCodes.FORBIDDEN) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "FORBIDDEN",
      },
    };
  }
  if (status === StatusCodes.NOT_FOUND) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "NOT_FOUND",
      },
    };
  }
  if (status === StatusCodes.REQUEST_TOO_LONG) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "PAYLOAD_TOO_LARGE",
      },
    };
  }
  if (status === StatusCodes.UNPROCESSABLE_ENTITY) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "UNPROCESSABLE_CONTENT",
      },
    };
  }
  if (status === StatusCodes.TOO_MANY_REQUESTS) {
    return {
      ...shape,
      message: error.error.message,
      data: {
        ...shape.data,
        code: "TOO_MANY_REQUESTS",
      },
    };
  }

  return {
    ...shape,
    message: "An unexpected error occurred with Groq API",
    data: {
      ...shape.data,
      code: "INTERNAL_SERVER_ERROR",
    },
  };
};
