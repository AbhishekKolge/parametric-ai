import { zodResolver } from "@hookform/resolvers/zod";
import type { AppRouter } from "@parametric-ai/api/router";
import { Button } from "@parametric-ai/ui/components/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@parametric-ai/ui/components/field";
import { Input } from "@parametric-ai/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@parametric-ai/ui/components/input-group";
import { LoadingSwap } from "@parametric-ai/ui/components/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@parametric-ai/ui/components/select";
import { cn } from "@parametric-ai/ui/lib/utils";
import {
  MAX_EXPERIMENT_TAG_LENGTH,
  MAX_TAGS_LENGTH,
  MIN_EXPERIMENT_TAG_LENGTH,
} from "@parametric-ai/utils/experiment/const";
import { EXPECTED_OUTPUT_TOKENS_DEFAULT } from "@parametric-ai/utils/prompt/const";
import {
  formatTokenDisplay,
  validatePrompt,
} from "@parametric-ai/utils/prompt/helper";
import { useQuery } from "@tanstack/react-query";
import type { inferProcedureOutput } from "@trpc/server";
import { X } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { useDisclosure } from "@/hooks/use-disclosure";
import { trpc } from "@/services/trpc";
import { useCreateExperiment } from "../../hooks/use-create-experiment";
import { getTokenUtilizationColorClasses } from "../../utils/helper";
import {
  type ExtendedCreateExperimentDto,
  extendedCreateExperimentSchema,
} from "../../utils/schema";

type CreateExperimentFormProps = Pick<
  ReturnType<typeof useDisclosure>,
  "toggle"
>;

export const CreateExperimentForm = ({ toggle }: CreateExperimentFormProps) => {
  const aiModelsQuery = useQuery(trpc.experiment.getAllAIModels.queryOptions());
  const createExperimentMutation = useCreateExperiment({
    onSuccess: () => {
      toggle();
      form.reset();
    },
  });
  const form = useForm<ExtendedCreateExperimentDto>({
    resolver: zodResolver(extendedCreateExperimentSchema),
    defaultValues: {
      name: "",
      modelId: "",
      prompt: "",
      tags: [],
      modelMetadata: {},
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const onSubmit = (data: ExtendedCreateExperimentDto) => {
    const tags = data.tags?.length ? data.tags.map((tag) => tag.name) : [];
    const formattedData = {
      ...data,
      tags,
    };
    createExperimentMutation.mutate(formattedData);
  };

  const modelChangeHandler = (modelId: string) => {
    const modelMetadata = aiModelsQuery.data?.data.models.find(
      (model) => model.id === modelId
    ) as inferProcedureOutput<
      AppRouter["experiment"]["getAllAIModels"]
    >["data"]["models"][number];

    form.setValue("modelId", modelId);
    form.setValue("modelMetadata", modelMetadata);
  };

  const selectedModel = form.watch("modelMetadata") as inferProcedureOutput<
    AppRouter["experiment"]["getAllAIModels"]
  >["data"]["models"][number];
  const promptValue = form.watch("prompt");

  const tokenEstimation = useMemo(() => {
    if (!selectedModel.id) {
      return null;
    }
    return validatePrompt({
      prompt: promptValue,
      contextWindow: selectedModel.context_window,
    });
  }, [promptValue, selectedModel]);

  const maxPromptLength = tokenEstimation?.maxPromptCharacters || 0;

  return (
    <>
      <form id="create-experiment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="name"
                  placeholder="Enter experiment name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="modelId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="modelId">LLM Model</FieldLabel>
                  <FieldDescription>
                    Select the model you want to use in this experiment
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Select
                  name={field.name}
                  onValueChange={modelChangeHandler}
                  value={field.value}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid} id="modelId">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {aiModelsQuery.data?.data.models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.id} ({model.owned_by})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          {!!selectedModel.id && (
            <Controller
              control={form.control}
              name="prompt"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="prompt">Write a prompt</FieldLabel>
                  <FieldDescription>
                    Model capacity:{" "}
                    {formatTokenDisplay(selectedModel.context_window)} tokens
                    (reserving min.{" "}
                    {formatTokenDisplay(EXPECTED_OUTPUT_TOKENS_DEFAULT)} for
                    output)
                  </FieldDescription>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="max-h-24 resize-none"
                      id="prompt"
                      maxLength={maxPromptLength}
                      placeholder="Enter experiment prompt"
                      rows={6}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        <span
                          className={cn(
                            getTokenUtilizationColorClasses(
                              tokenEstimation?.utilizationPercentage
                                ? tokenEstimation.utilizationPercentage
                                : 0
                            )
                          )}
                        >
                          {field.value.length} / {maxPromptLength}
                        </span>
                        <span>characters</span>
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
          <Controller
            control={form.control}
            name="tags"
            render={({ fieldState }) => {
              const handleAddTag = (
                e: React.KeyboardEvent<HTMLInputElement>
              ) => {
                const inputValue = e.currentTarget.value;
                const trimmedInputValue = inputValue.trim() || "";

                if (
                  !trimmedInputValue ||
                  trimmedInputValue.length > MAX_EXPERIMENT_TAG_LENGTH ||
                  trimmedInputValue.length < MIN_EXPERIMENT_TAG_LENGTH ||
                  tagFields.length >= MAX_TAGS_LENGTH
                ) {
                  return;
                }
                const isTagIncluded = tagFields.some(
                  (tag) => tag.name === trimmedInputValue
                );
                if (!isTagIncluded) {
                  appendTag({ name: trimmedInputValue });
                  e.currentTarget.value = "";
                }
              };

              const handleKeyDown = (
                e: React.KeyboardEvent<HTMLInputElement>
              ) => {
                const inputValue = e.currentTarget.value;
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(e);
                } else if (
                  e.key === "Backspace" &&
                  !inputValue &&
                  !!tagFields.length
                ) {
                  removeTag(tagFields.length - 1);
                }
              };

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="tags">Tags</FieldLabel>
                  <FieldDescription>
                    Add upto {MAX_TAGS_LENGTH} tags to help organize your
                    experiments
                  </FieldDescription>
                  <InputGroup>
                    {!!tagFields.length && (
                      <InputGroupAddon
                        align="block-start"
                        className="flex-wrap gap-2"
                      >
                        {tagFields.map((tag, index) => (
                          <InputGroupText
                            className="min-w-auto rounded-full bg-white ps-4 text-secondary"
                            key={tag.id}
                          >
                            <span className="max-w-[150px] truncate">
                              {tag.name}
                            </span>
                            <Button
                              aria-label={`Remove tag ${tag.name}`}
                              className="rounded-full"
                              onClick={() => removeTag(index)}
                              size="icon-sm"
                              type="button"
                              variant="ghost"
                            >
                              <X />
                            </Button>
                          </InputGroupText>
                        ))}
                      </InputGroupAddon>
                    )}

                    <InputGroupInput
                      aria-invalid={fieldState.invalid}
                      disabled={tagFields.length >= MAX_TAGS_LENGTH}
                      id="tags"
                      maxLength={MAX_EXPERIMENT_TAG_LENGTH}
                      minLength={MIN_EXPERIMENT_TAG_LENGTH}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        tagFields.length < MAX_TAGS_LENGTH
                          ? "Type a tag and press enter"
                          : "Max tags reached"
                      }
                      type="text"
                    />
                  </InputGroup>
                </Field>
              );
            }}
          />
        </FieldGroup>
      </form>
      <div className="flex justify-end gap-2">
        <Button onClick={toggle} variant="outline">
          Cancel
        </Button>
        <Button
          disabled={createExperimentMutation.isPending}
          form="create-experiment-form"
          type="submit"
        >
          <LoadingSwap isLoading={createExperimentMutation.isPending}>
            Create
          </LoadingSwap>
        </Button>
      </div>
    </>
  );
};
