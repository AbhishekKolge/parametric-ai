"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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

  if (!metricsQuery.data?.data.metrics) {
    return <div>No metrics data available</div>;
  }

  return (
    <section className="flex flex-col gap-4">
      <MetricsBarChart metrics={metricsQuery.data.data.metrics} />
      <MetricsLineChart metrics={metricsQuery.data.data.metrics} />
    </section>
  );
};
