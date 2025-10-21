"use client";

import type { AppRouter } from "@parametric-ai/api/router";
import { Badge } from "@parametric-ai/ui/components/badge";
import { Button } from "@parametric-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@parametric-ai/ui/components/card";
import { Skeleton } from "@parametric-ai/ui/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@parametric-ai/ui/components/tooltip";
import type { inferProcedureOutput } from "@trpc/server";
import { formatDistanceToNow } from "date-fns";
import { Download, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useExportExperimentToExcel } from "../../hooks/use-export-experiment-to-excel";
import { DeleteExperimentAlert } from "../alerts/delete-experiment-alert";

export type ExperimentsOutput = inferProcedureOutput<
  AppRouter["experiment"]["getAll"]
>;

export type AiModelOutput = inferProcedureOutput<
  AppRouter["experiment"]["getAllAIModels"]
>;

export type ExperimentCardProps =
  ExperimentsOutput["data"]["experiments"][number];

export const ExperimentCard = ({
  name,
  prompt,
  modelMetadata,
  createdAt,
  _count,
  updatedAt,
  tags,
  id,
}: ExperimentCardProps) => {
  const deleteExperimentDisclosure = useDisclosure({});
  const model = modelMetadata as AiModelOutput["data"]["models"][number];
  const exportExperimentToExcelMutation = useExportExperimentToExcel();

  const handleDownload = () => {
    exportExperimentToExcelMutation.mutate({ id });
  };

  return (
    <>
      <Card className="@container hover:border-foreground">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-ellipsis text-lg">
            {name}
          </CardTitle>
          <CardDescription className="line-clamp-1 text-ellipsis text-sm">
            {prompt}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid @md:grid-cols-3 gap-2 text-sm">
            <div className="flex @md:flex-col @md:justify-start justify-between @md:gap-1 gap-2">
              <span>Responses</span>
              <span className="font-medium text-muted-foreground">
                {_count.responses}
              </span>
            </div>
            <div className="flex @md:flex-col @md:justify-start justify-between @md:gap-1 gap-2">
              <span>Created At</span>
              <span className="font-medium text-muted-foreground">
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </span>
            </div>
            <div className="flex @md:flex-col @md:justify-start justify-between @md:gap-1 gap-2">
              <span>Updated At</span>
              <span className="font-medium text-muted-foreground">
                {formatDistanceToNow(updatedAt, { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <span>AI Model</span>
            <span className="font-medium text-muted-foreground">
              {model.id} ({model.owned_by})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="mt-auto @md:flex-row flex-col @md:items-center items-stretch gap-2">
          <Button asChild className="flex-1" variant="outline">
            <Link href={`/experiment/${id}`}>
              <TrendingUp />
              {_count.responses ? "Continue" : "Start"} Experiment
            </Link>
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={exportExperimentToExcelMutation.isPending}
                onClick={handleDownload}
                variant="outline"
              >
                <Download />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={deleteExperimentDisclosure.open}
                variant="outline"
              >
                <Trash2 className="text-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
      <DeleteExperimentAlert
        {...deleteExperimentDisclosure}
        id={id}
        name={name}
      />
    </>
  );
};

export const ExperimentCardLoading = () => (
  <Card className="@container hover:border-foreground">
    <CardHeader>
      <CardTitle className="line-clamp-1 text-ellipsis text-lg">
        <Skeleton className="h-7 w-32" />
      </CardTitle>
      <CardDescription className="line-clamp-1 text-ellipsis text-sm">
        <Skeleton className="h-5 w-full" />
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col gap-4">
      <div className="grid @md:grid-cols-3 gap-2 text-sm">
        {Array.from({ length: 3 }).map(() => (
          <div
            className="flex @md:flex-col @md:justify-start justify-between @md:gap-1 gap-2"
            key={crypto.randomUUID()}
          >
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-14" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-full" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-[22px] w-20" />
        <Skeleton className="h-[22px] w-20" />
        <Skeleton className="h-[22px] w-20" />
      </div>
    </CardContent>
    <CardFooter className="mt-auto @md:flex-row flex-col @md:items-center items-stretch gap-2">
      <Skeleton className="h-9 w-full @md:flex-1" />
      <Skeleton className="h-9 @md:w-9 w-full" />
      <Skeleton className="h-9 @md:w-9 w-full" />
    </CardFooter>
  </Card>
);
