import prisma, { type Prisma } from "@parametric-ai/db";
import { computeQualityMetrics } from "@parametric-ai/utils/experiment/helpers";
import type {
  CreateExperimentDto,
  DeleteExperimentDto,
  ExperimentQueryDto,
  ExportExperimentToExcelDto,
  GenerateResponseDto,
  MetricsQueryDto,
  ResponsesQueryDto,
  SingleExperimentQueryDto,
} from "@parametric-ai/utils/experiment/schema";
import type { ResponseMetrics } from "@parametric-ai/utils/experiment/types";
// import { EXPECTED_OUTPUT_TOKENS_DEFAULT } from "@parametric-ai/utils/prompt/const";
import { type inferProcedureOutput, TRPCError } from "@trpc/server";
import Groq from "groq-sdk";
import { utils, write } from "xlsx";
import type { Context } from "../../context";
import type { AppRouter } from "../../router";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getAllAIModels = () => {
  // const res = await groq.models.list();
  // const models = res.data
  //   .map((model) => ({
  //     id: model.id,
  //     owned_by: model.owned_by,
  //     active: ("active" in model ? model.active : false) as boolean,
  //     context_window: ("context_window" in model
  //       ? (model.context_window ?? 0)
  //       : 0) as number,
  //     max_completion_tokens: ("max_completion_tokens" in model
  //       ? (model.max_completion_tokens ?? 0)
  //       : 0) as number,
  //   }))
  //   .filter((model) => model.context_window > EXPECTED_OUTPUT_TOKENS_DEFAULT);

  return {
    data: {
      models: [
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
          id: "groq/compound-mini",
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
          id: "openai/gpt-oss-20b",
          owned_by: "OpenAI",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 65_536,
        },
        {
          id: "meta-llama/llama-guard-4-12b",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 1024,
        },
        {
          id: "qwen/qwen3-32b",
          owned_by: "Alibaba Cloud",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 40_960,
        },
        {
          id: "moonshotai/kimi-k2-instruct",
          owned_by: "Moonshot AI",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 16_384,
        },
        {
          id: "meta-llama/llama-4-maverick-17b-128e-instruct",
          owned_by: "Meta",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 8192,
        },
        {
          id: "groq/compound",
          owned_by: "Groq",
          active: true,
          context_window: 131_072,
          max_completion_tokens: 8192,
        },
        {
          id: "playai-tts",
          owned_by: "PlayAI",
          active: true,
          context_window: 8192,
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
          id: "playai-tts-arabic",
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
  const experiment = await prisma.experiment.create({
    data: {
      ...input,
      userId: (ctx.session as NonNullable<Context["session"]>).user.id,
    },
  });
  return {
    message: "Experiment created successfully",
    data: {
      id: experiment.id,
    },
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

export const generateResponse = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GenerateResponseDto;
}) => {
  const { maxCompletionTokens, topP, temperature, experimentId } = input;
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  const experiment = await prisma.experiment.findFirstOrThrow({
    where: { id: experimentId, userId },
  });

  const { usage, choices } = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: experiment.prompt,
      },
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    max_completion_tokens: maxCompletionTokens,
    top_p: topP,
    temperature,
  });

  const metrics = {
    ...(usage
      ? {
          completionTokens: usage.completion_tokens,
          promptTime: usage.prompt_time,
          completionTime: usage.completion_time,
          totalTokens: usage.total_tokens,
          totalTime: usage.total_time,
        }
      : {}),
    ...computeQualityMetrics(
      experiment.prompt,
      choices[0]?.message.content || ""
    ),
  };

  await prisma.response.create({
    data: {
      experimentId,
      temperature,
      topP,
      maxCompletionTokens,
      content: choices[0]?.message.content || "",
      metrics,
    },
  });

  return {
    data: {
      experimentId,
    },
    message: "Response generated successfully",
  };
};

export const getOne = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: SingleExperimentQueryDto;
}) => {
  const { id } = input;
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  const experiment = await prisma.experiment.findFirstOrThrow({
    where: { id, userId },
  });

  return {
    data: {
      experiment,
    },
    message: "Experiment fetched successfully",
  };
};

export const getResponses = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: ResponsesQueryDto;
}) => {
  const { experimentId, page, limit, sortBy, order } = input;
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  await prisma.experiment.findFirstOrThrow({
    where: { id: experimentId, userId },
  });

  const [totalCount, responses] = await prisma.$transaction([
    prisma.response.count({
      where: {
        experimentId,
      },
    }),
    prisma.response.findMany({
      where: {
        experimentId,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: order },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: {
      responses,
      totalPages,
      currentPage: page,
      totalCount,
    },
    message: "Responses fetched successfully",
  };
};

export const getAllMetrics = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: MetricsQueryDto;
}) => {
  const { id } = input;
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  await prisma.experiment.findFirstOrThrow({
    where: { id, userId },
  });

  const responses = await prisma.response.findMany({
    where: {
      experimentId: id,
    },
    select: {
      temperature: true,
      topP: true,
      maxCompletionTokens: true,
      metrics: true,
      createdAt: true,
    },
  });

  const responseMetrics = responses.map(({ metrics, ...rest }) => ({
    ...rest,
    ...(metrics as ResponseMetrics),
  }));

  return {
    data: {
      metrics: responseMetrics,
    },
    message: "Metrics fetched successfully",
  };
};

export const exportExperimentToExcel = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: ExportExperimentToExcelDto;
}) => {
  const { id } = input;
  const userId = (ctx.session as NonNullable<Context["session"]>).user.id;

  const experiment = await prisma.experiment.findFirstOrThrow({
    where: { id, userId },
    include: {
      responses: true,
    },
  });

  const experimentRow = {
    ExperimentID: experiment.id,
    ExperimentName: experiment.name,
    ModelID: experiment.modelId,
    Prompt: experiment.prompt,
    Tags: experiment.tags.join(", "),
    CreatedAt: experiment.createdAt.toISOString(),
    UpdatedAt: experiment.updatedAt.toISOString(),
  };

  const modelMetadata = experiment.modelMetadata as inferProcedureOutput<
    AppRouter["experiment"]["getAllAIModels"]
  >["data"]["models"][number];

  const modelRow = {
    ModelID: modelMetadata.id,
    OwnedBy: modelMetadata.owned_by,
    Active: modelMetadata.active.toString(),
    ContextWindow: modelMetadata.context_window.toString(),
    MaxCompletionTokens: modelMetadata.max_completion_tokens.toString(),
  };

  const responseRow = experiment.responses.map((response, index) => {
    const metrics = response.metrics as ResponseMetrics;
    return {
      ResponseNumber: index + 1,
      ResponseID: response.id,
      Temperature: response.temperature,
      TopP: response.topP,
      MaxCompletionTokens: response.maxCompletionTokens.toString(),
      Content: response.content,
      CreatedAt: response.createdAt.toISOString(),
      Coherence: metrics.coherence,
      Relevance: metrics.relevance,
      Creativity: metrics.creativity,
      Completeness: metrics.completeness,
      Readability: metrics.readability,
      SentimentBalance: metrics.sentimentBalance,
      InformationDensity: metrics.informationDensity,
      OverallScore: metrics.overallScore,
      CompletionTokens: metrics.completionTokens,
      PromptTime: metrics.promptTime,
      CompletionTime: metrics.completionTime,
      TotalTokens: metrics.totalTokens,
      TotalTime: metrics.totalTime,
    };
  });

  const workbook = utils.book_new();
  const experimentSheet = utils.json_to_sheet([experimentRow]);
  const modelSheet = utils.json_to_sheet([modelRow]);
  const responsesSheet = utils.json_to_sheet(responseRow);

  utils.book_append_sheet(workbook, experimentSheet, "Experiment Info");
  utils.book_append_sheet(workbook, modelSheet, "Model Info");
  utils.book_append_sheet(workbook, responsesSheet, "Responses");

  const buffer = write(workbook, { type: "buffer", bookType: "xlsx" });

  return {
    data: {
      base64Data: buffer.toString("base64"),
      experimentId: experiment.id,
    },
    message: "Experiment exported to Excel successfully",
  };
};
