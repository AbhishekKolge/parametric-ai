"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AppRouter } from "@parametric-ai/api/router";
import { Button } from "@parametric-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@parametric-ai/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@parametric-ai/ui/components/field";
import { LoadingSwap } from "@parametric-ai/ui/components/loading-swap";
import { Skeleton } from "@parametric-ai/ui/components/skeleton";
import { Slider } from "@parametric-ai/ui/components/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@parametric-ai/ui/components/tooltip";
import {
  DEFAULT_COMPLETION_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  MAX_TEMPERATURE,
  MAX_TOP_P,
  MIN_COMPLETION_TOKENS,
  MIN_TEMPERATURE,
  MIN_TOP_P,
} from "@parametric-ai/utils/experiment/const";
import {
  type GenerateResponseDto,
  generateResponseSchema,
} from "@parametric-ai/utils/experiment/schema";
import { validatePrompt } from "@parametric-ai/utils/prompt/helper";
import { useQuery } from "@tanstack/react-query";
import type { inferProcedureOutput } from "@trpc/server";
import { Info } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorBlock } from "@/components/blocks/error-block";
import {
  firstErrorRefetch,
  renderMultiQuery,
} from "@/hooks/render-multi-query";
import { trpc } from "@/services/trpc";
import { useGenerateResponse } from "../../hooks/use-generate-response";
import type { ExperimentDetailsParams } from "../../types";
import {
  DEFAULT_MAX_COMPLETION_TOKENS_STEP,
  DEFAULT_TEMPERATURE_STEP,
  DEFAULT_TOP_P_STEP,
} from "../../utils/const";

export const ParametersForm = () => {
  const { id } = useParams<ExperimentDetailsParams>();
  const experimentQuery = useQuery(trpc.experiment.getOne.queryOptions({ id }));
  const generateResponseMutation = useGenerateResponse();
  const form = useForm<GenerateResponseDto>({
    resolver: zodResolver(generateResponseSchema),
    defaultValues: {
      maxCompletionTokens: DEFAULT_COMPLETION_TOKENS,
      topP: DEFAULT_TOP_P,
      temperature: DEFAULT_TEMPERATURE,
      experimentId: id,
    },
  });

  const onSubmit = (data: GenerateResponseDto) => {
    generateResponseMutation.mutate(data);
  };

  const promptValue = experimentQuery.data?.data.experiment.prompt || "";
  const selectedModel = (experimentQuery.data?.data.experiment.modelMetadata ||
    {}) as inferProcedureOutput<
    AppRouter["experiment"]["getAllAIModels"]
  >["data"]["models"][number];

  const tokenEstimation = useMemo(() => {
    if (!selectedModel.id) {
      return null;
    }
    return validatePrompt({
      prompt: promptValue,
      contextWindow: selectedModel.context_window,
    });
  }, [promptValue, selectedModel]);

  const temperatureHandler = (value: number[]) => {
    form.setValue("temperature", value[0]);
  };

  const topPHandler = (value: number[]) => {
    form.setValue("topP", value[0]);
  };

  const maxCompletionTokensHandler = (value: number[]) => {
    form.setValue("maxCompletionTokens", value[0]);
  };

  const resetFormHandler = () => {
    form.reset({
      maxCompletionTokens: DEFAULT_COMPLETION_TOKENS,
      temperature: DEFAULT_TEMPERATURE,
      topP: DEFAULT_TOP_P,
      experimentId: id,
    });
  };

  return renderMultiQuery([experimentQuery], {
    ErrorStateView: (error) => (
      <ErrorBlock
        className="h-full"
        handleRetry={firstErrorRefetch([experimentQuery])}
        message={error.message}
      />
    ),
    LoadingStateView: <ParametersFormLoading />,
    SuccessStateView: ([experimentData]) => (
      <Card className="w-full sm:max-w-none lg:max-w-md">
        <CardHeader>
          <CardTitle>{experimentData.data.experiment.name}</CardTitle>
          <CardDescription>
            Model used by this experiment is {selectedModel.id} (
            {selectedModel.owned_by})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="generate-response-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                control={form.control}
                name="temperature"
                render={({ field, fieldState }) => (
                  <Field className="gap-10" data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <FieldLabel htmlFor="temperature">Temperature</FieldLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-2xs" side="right">
                          <p>
                            Controls randomness in responses. Lower values make
                            responses more deterministic.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      {...field}
                      defaultValue={[DEFAULT_TEMPERATURE]}
                      max={MAX_TEMPERATURE}
                      min={MIN_TEMPERATURE}
                      onChange={() => null}
                      onValueChange={temperatureHandler}
                      step={DEFAULT_TEMPERATURE_STEP}
                      value={[field.value ?? DEFAULT_TEMPERATURE]}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="topP"
                render={({ field, fieldState }) => (
                  <Field className="gap-10" data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <FieldLabel htmlFor="topP">Top P</FieldLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-2xs" side="right">
                          <p>Controls diversity of token selection.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      {...field}
                      defaultValue={[DEFAULT_TOP_P]}
                      max={MAX_TOP_P}
                      min={MIN_TOP_P}
                      onChange={() => null}
                      onValueChange={topPHandler}
                      step={DEFAULT_TOP_P_STEP}
                      value={[field.value ?? DEFAULT_TOP_P]}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="maxCompletionTokens"
                render={({ field, fieldState }) => (
                  <Field className="gap-10" data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-2">
                      <FieldLabel htmlFor="maxCompletionTokens">
                        Max Completion Tokens
                      </FieldLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-2xs" side="right">
                          <p>
                            Maximum length of model's response. Default may be
                            too low for complex reasoning - consider increasing
                            for detailed step-by-step solutions.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Slider
                      {...field}
                      defaultValue={[DEFAULT_COMPLETION_TOKENS]}
                      max={
                        tokenEstimation?.estimatedTokens
                          ? selectedModel.max_completion_tokens -
                            tokenEstimation.estimatedTokens
                          : selectedModel.max_completion_tokens
                      }
                      min={MIN_COMPLETION_TOKENS}
                      onChange={() => null}
                      onValueChange={maxCompletionTokensHandler}
                      step={DEFAULT_MAX_COMPLETION_TOKENS_STEP}
                      value={[field.value ?? DEFAULT_COMPLETION_TOKENS]}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription>
                      We estimate the maximum completion tokens using Groq’s
                      model metadata. Actual limits may vary if Groq’s data
                      isn’t up to date, adjust this value manually if needed.
                    </FieldDescription>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button
              disabled={generateResponseMutation.isPending}
              form="generate-response-form"
              type="submit"
            >
              <LoadingSwap isLoading={generateResponseMutation.isPending}>
                Generate Response
              </LoadingSwap>
            </Button>
            <Button
              disabled={generateResponseMutation.isPending}
              onClick={resetFormHandler}
              type="button"
              variant="secondary"
            >
              Reset to Defaults
            </Button>
          </Field>
        </CardFooter>
      </Card>
    ),
  });
};

export const ParametersFormLoading = () => (
  <Card className="w-full sm:max-w-none lg:max-w-md">
    <CardHeader>
      <CardTitle>
        <Skeleton className="h-4 w-28" />
      </CardTitle>
      <CardDescription>
        <Skeleton className="h-5 w-28" />
      </CardDescription>
    </CardHeader>
    <CardContent>
      <FieldGroup>
        <Field className="gap-10">
          <div className="flex items-center gap-2">
            <FieldLabel htmlFor="temperature">Temperature</FieldLabel>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent className="max-w-2xs" side="right">
                <p>
                  Controls randomness in responses. Lower values make responses
                  more deterministic.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </Field>
        <Field className="gap-10">
          <div className="flex items-center gap-2">
            <FieldLabel htmlFor="topP">Top P</FieldLabel>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent className="max-w-2xs" side="right">
                <p>Controls diversity of token selection.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </Field>
        <Field className="gap-10">
          <div className="flex items-center gap-2">
            <FieldLabel htmlFor="maxCompletionTokens">
              Max Completion Tokens
            </FieldLabel>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent className="max-w-2xs" side="right">
                <p>
                  Maximum length of model's response. Default may be too low for
                  complex reasoning - consider increasing for detailed
                  step-by-step solutions.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </Field>
      </FieldGroup>
    </CardContent>
    <CardFooter>
      <Field>
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </Field>
    </CardFooter>
  </Card>
);
