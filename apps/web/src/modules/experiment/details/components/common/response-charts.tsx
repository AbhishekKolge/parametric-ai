"use client";

import { Skeleton } from "@parametric-ai/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EmptyBlock } from "@/components/blocks/empty-block";
import { ErrorBlock } from "@/components/blocks/error-block";
import {
  firstErrorRefetch,
  renderMultiQuery,
} from "@/hooks/render-multi-query";
import { trpc } from "@/services/trpc";
import type { ExperimentDetailsParams } from "../../types";
import { MetricsBarChart } from "../charts/metrics-bar-chart";
import { MetricsLineChart } from "../charts/metrics-line-chart";

export const ResponseCharts = () => {
  const { id } = useParams<ExperimentDetailsParams>();
  const metricsQuery = useQuery(
    trpc.experiment.getAllMetrics.queryOptions({
      id,
    })
  );

  return (
    <section className="flex h-full flex-col gap-4">
      {renderMultiQuery([metricsQuery], {
        isEmpty: ([data]) => !data.data.metrics.length,
        EmptyStateView: (
          <EmptyBlock
            className="h-full"
            message="Try adding new responses to track them here"
            title="No responses found"
          />
        ),
        ErrorStateView: (error) => (
          <ErrorBlock
            className="h-full"
            handleRetry={firstErrorRefetch([metricsQuery])}
            message={error.message}
          />
        ),
        LoadingStateView: (
          <>
            <Skeleton className="h-50 w-full md:h-80" />
            <Skeleton className="h-50 w-full md:h-80" />
          </>
        ),
        SuccessStateView: ([metricsData]) => (
          <>
            <MetricsBarChart metrics={metricsData.data.metrics} />
            <MetricsLineChart metrics={metricsData.data.metrics} />
          </>
        ),
      })}
    </section>
  );
};
