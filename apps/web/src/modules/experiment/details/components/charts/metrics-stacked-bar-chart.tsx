"use client";

import type { AppRouter } from "@parametric-ai/api/router";
import { Button } from "@parametric-ai/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@parametric-ai/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@parametric-ai/ui/components/chart";
import type { inferProcedureOutput } from "@trpc/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { MAX_VISIBLE_METRIC_BARS } from "../../utils/const";
import { formatNumber } from "../../utils/helper";

export type metricsOutput = inferProcedureOutput<
  AppRouter["experiment"]["getAllMetrics"]
>;

export type CustomChartProps = {
  metrics: metricsOutput["data"]["metrics"][number][];
};

export const MetricsStackedBarChart = ({ metrics }: CustomChartProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const chartData = metrics.map((r, idx) => ({
    response: `R${idx + 1}`,
    coherence: formatNumber(r.coherence),
    relevance: formatNumber(r.relevance),
    creativity: formatNumber(r.creativity),
    completeness: formatNumber(r.completeness),
    readability: formatNumber(r.readability),
    sentimentBalance: formatNumber(r.sentimentBalance),
    informationDensity: formatNumber(r.informationDensity),
  }));
  const chartConfig = {
    coherence: { label: "Coherence", color: "var(--chart-1)" },
    relevance: { label: "Relevance", color: "var(--chart-2)" },
    creativity: { label: "Creativity", color: "var(--chart-3)" },
    completeness: { label: "Completeness", color: "var(--chart-4)" },
    readability: { label: "Readability", color: "var(--chart-5)" },
    sentimentBalance: { label: "Sentiment Balance", color: "var(--chart-6)" },
    informationDensity: {
      label: "Information Density",
      color: "var(--chart-7)",
    },
  } satisfies ChartConfig;

  const endIndex = startIndex + MAX_VISIBLE_METRIC_BARS;
  const visibleData = chartData.slice(startIndex, endIndex);

  const canNavigateLeft = startIndex > 0;
  const canNavigateRight = endIndex < chartData.length;

  const navigateLeftHandler = () => {
    setStartIndex((previousIndex) => Math.max(0, previousIndex - 1));
  };

  const navigateRightHandler = () => {
    setStartIndex((previousIndex) =>
      Math.min(chartData.length - MAX_VISIBLE_METRIC_BARS, previousIndex + 1)
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-end gap-4">
          {chartData.length > MAX_VISIBLE_METRIC_BARS && (
            <>
              <Button
                disabled={!canNavigateLeft}
                onClick={navigateLeftHandler}
                size="icon"
                variant="outline"
              >
                <ChevronLeft />
              </Button>
              <Button
                disabled={!canNavigateRight}
                onClick={navigateRightHandler}
                size="icon"
                variant="outline"
              >
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-80 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={visibleData}>
            <CartesianGrid />
            <XAxis
              axisLine={false}
              dataKey="response"
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="coherence"
              fill={chartConfig.coherence.color}
              stackId="a"
            />
            <Bar
              dataKey="relevance"
              fill={chartConfig.relevance.color}
              stackId="a"
            />
            <Bar
              dataKey="creativity"
              fill={chartConfig.creativity.color}
              stackId="a"
            />
            <Bar
              dataKey="completeness"
              fill={chartConfig.completeness.color}
              stackId="a"
            />
            <Bar
              dataKey="readability"
              fill={chartConfig.readability.color}
              stackId="a"
            />
            <Bar
              dataKey="sentimentBalance"
              fill={chartConfig.sentimentBalance.color}
              stackId="a"
            />
            <Bar
              dataKey="informationDensity"
              fill={chartConfig.informationDensity.color}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
