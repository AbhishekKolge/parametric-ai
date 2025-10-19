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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@parametric-ai/ui/components/select";
import {
  MAX_EXPERIMENT_TAG_LENGTH,
  MIN_EXPERIMENT_TAG_LENGTH,
} from "@parametric-ai/utils/experiment/const";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { useDisclosure } from "@/hooks/use-disclosure";
import { trpc } from "@/services/trpc";
import { useCreateExperiment } from "../../hooks/use-create-experiment";
import { MAX_TAGS } from "../../utils/const";
import type { ExtendedCreateExperimentDto } from "../../utils/schema";

type CreateExperimentFormProps = Pick<
  ReturnType<typeof useDisclosure>,
  "close"
>;

export const CreateExperimentForm = ({ close }: CreateExperimentFormProps) => {
  const aiModels = useQuery(trpc.experiment.getAllAIModels.queryOptions());
  const createExperimentMutation = useCreateExperiment({
    onSuccess: () => {
      close();
      form.reset();
    },
  });
  const form = useForm<ExtendedCreateExperimentDto>({
    // resolver: zodResolver(extendedCreateExperimentSchema),
    defaultValues: {
      name: "",
      modelId: "",
      prompt: "",
      tags: [],
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

  const selectedModelId = form.watch("modelId");
  const selectedModel = useMemo(() => {
    if (!aiModels.data) {
      return null;
    }
    return aiModels.data.find((model) => model.id === selectedModelId);
  }, [aiModels.data, selectedModelId]);

  const maxPromptLength = selectedModel ? selectedModel.context_window : 0;

  return (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  For best results, select the model you want to use.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Select
                name={field.name}
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger
                  aria-invalid={fieldState.invalid}
                  className="min-w-[120px]"
                  id="modelId"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectSeparator />
                  {aiModels.data?.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.id} ({model.owned_by})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        {!!selectedModel && (
          <Controller
            control={form.control}
            name="prompt"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="prompt">Write a prompt</FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    aria-invalid={fieldState.invalid}
                    className="min-h-24 resize-none"
                    id="prompt"
                    maxLength={maxPromptLength}
                    placeholder="Enter experiment prompt"
                    rows={6}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/{maxPromptLength} characters (tokens)
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
            const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
              const inputValue = e.currentTarget.value;
              const trimmedInputValue = inputValue.trim() || "";

              if (
                !trimmedInputValue ||
                trimmedInputValue.length > MAX_EXPERIMENT_TAG_LENGTH ||
                trimmedInputValue.length < MIN_EXPERIMENT_TAG_LENGTH ||
                tagFields.length >= MAX_TAGS
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
                  Add upto {MAX_TAGS} tags to help organize your experiments
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
                  {tagFields.length < MAX_TAGS && (
                    <InputGroupInput
                      aria-invalid={fieldState.invalid}
                      id="tags"
                      maxLength={MAX_EXPERIMENT_TAG_LENGTH}
                      minLength={MIN_EXPERIMENT_TAG_LENGTH}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        tagFields.length
                          ? "Add more..."
                          : "Type a tag and press enter"
                      }
                      type="text"
                    />
                  )}
                </InputGroup>
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
};
