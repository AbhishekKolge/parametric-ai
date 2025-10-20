// import Groq from "groq-sdk";

import prisma, { type Prisma } from "@parametric-ai/db";
import type {
  CreateExperimentDto,
  DeleteExperimentDto,
  ExperimentQueryDto,
} from "@parametric-ai/utils/experiment/schema";
import { TRPCError } from "@trpc/server";
import type { Context } from "../../context";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getAllAIModels = () => {
  // const res = await groq.models.list();

  // return res.data.map((model) => ({
  //   id: model.id,
  //   owned_by: model.owned_by,
  //   active: "active" in model ? model.active : false,
  //   context_window: "context_window" in model ? (model.context_window ?? 0) : 0,
  //   max_completion_tokens:
  //     "max_completion_tokens" in model ? (model.max_completion_tokens ?? 0) : 0,
  // }));
  return {
    data: {
      models: [
        {
          id: "moonshotai/kimi-k2-instruct",
          owned_by: "Moonshot AI",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 16_384,
        },
        {
          id: "groq/compound",
          owned_by: "Groq",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 8192,
        },
        {
          id: "llama-3.1-8b-instant",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 131_072,
        },
        {
          id: "meta-llama/llama-prompt-guard-2-22m",
          owned_by: "Meta",
          active: true,
          context_window: 512,
          max_completion_tokens: 512,
        },
        {
          id: "meta-llama/llama-4-maverick-17b-128e-instruct",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 8192,
        },
        {
          id: "meta-llama/llama-guard-4-12b",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 1024,
        },
        {
          id: "groq/compound-mini",
          owned_by: "Groq",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 8192,
        },
        {
          id: "llama-3.3-70b-versatile",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 32_768,
        },
        {
          id: "whisper-large-v3-turbo",
          owned_by: "OpenAI",
          active: true,
          context_window: 448,
          max_completion_tokens: 448,
        },
        {
          id: "openai/gpt-oss-20b",
          owned_by: "OpenAI",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 65_536,
        },
        {
          id: "meta-llama/llama-4-scout-17b-16e-instruct",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 8192,
        },
        {
          id: "moonshotai/kimi-k2-instruct-0905",
          owned_by: "Moonshot AI",
          active: true,
          context_window: 262_144,
          max_completion_tokens: 16_384,
        },
        {
          id: "allam-2-7b",
          owned_by: "SDAIA",
          active: true,
          context_window: 4096,
          max_completion_tokens: 4096,
        },
        {
          id: "playai-tts",
          owned_by: "PlayAI",
          active: true,
          context_window: 8192,
          max_completion_tokens: 8192,
        },
        {
          id: "openai/gpt-oss-120b",
          owned_by: "OpenAI",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 65_536,
        },
        {
          id: "playai-tts-arabic",
          owned_by: "PlayAI",
          active: true,
          context_window: 8192,
          max_completion_tokens: 8192,
        },
        {
          id: "meta-llama/llama-prompt-guard-2-86m",
          owned_by: "Meta",
          active: true,
          context_window: 512,
          max_completion_tokens: 512,
        },
        {
          id: "qwen/qwen3-32b",
          owned_by: "Alibaba Cloud",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 40_960,
        },
        {
          id: "whisper-large-v3",
          owned_by: "OpenAI",
          active: true,
          context_window: 448,
          max_completion_tokens: 448,
        },
      ],
    },
    message: "AI Models fetched successfully",
  };
};

export const create = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreateExperimentDto;
}) => {
  await prisma.experiment.create({
    data: {
      ...input,
      userId: (ctx.session as NonNullable<Context["session"]>).user.id,
    },
  });
  return {
    message: "Experiment created successfully",
  };
};

export const getAll = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: ExperimentQueryDto;
}) => {
  const { page, limit, search, modelIds, sortBy, order } = input;
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  const where: Prisma.ExperimentWhereInput = {
    userId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { prompt: { contains: search, mode: "insensitive" } },
            { tags: { hasSome: [search] } },
          ],
        }
      : {}),
    ...(modelIds?.length ? { modelId: { in: modelIds } } : {}),
  };

  const [totalCount, experiments] = await prisma.$transaction([
    prisma.experiment.count({ where }),
    prisma.experiment.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: {
      experiments,
      totalPages,
      currentPage: page,
      totalCount,
    },
    message: "Experiments fetched successfully",
  };
};

export const deleteOne = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: DeleteExperimentDto;
}) => {
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  const result = await prisma.experiment.deleteMany({
    where: { id: input.id, userId },
  });

  if (!result.count) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Experiment not found",
    });
  }

  return {
    message: "Experiment deleted successfully",
  };
};
