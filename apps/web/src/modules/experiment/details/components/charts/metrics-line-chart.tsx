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
import { useIsMobile } from "@parametric-ai/ui/hooks/use-mobile";
import type { inferProcedureOutput } from "@trpc/server";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  MAX_VISIBLE_METRIC_BARS,
  MOBILE_MAX_VISIBLE_METRIC_BARS,
} from "../../utils/const";
import { formatNumber } from "../../utils/helper";

export type metricsOutput = inferProcedureOutput<
  AppRouter["experiment"]["getAllMetrics"]
>;

export type MetricsLineChartProps = {
  metrics: metricsOutput["data"]["metrics"][number][];
};

export const MetricsLineChart = ({ metrics }: MetricsLineChartProps) => {
  const isMobile = useIsMobile();
  const [startIndex, setStartIndex] = useState(0);

  const chartData = metrics.map((r, index) => ({
    response: `R${index + 1}`,
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

  const endIndex =
    startIndex +
    (isMobile ? MOBILE_MAX_VISIBLE_METRIC_BARS : MAX_VISIBLE_METRIC_BARS);
  const visibleData = chartData.slice(startIndex, endIndex);

  const canNavigateLeft = startIndex > 0;
  const canNavigateRight = endIndex < chartData.length;

  const navigateLeftHandler = () => {
    setStartIndex((previousIndex) => Math.max(0, previousIndex - 1));
  };

  const navigateRightHandler = () => {
    setStartIndex((previousIndex) =>
      Math.min(
        chartData.length -
          (isMobile ? MOBILE_MAX_VISIBLE_METRIC_BARS : MAX_VISIBLE_METRIC_BARS),
        previousIndex + 1
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-end gap-4">
          {chartData.length >
            (isMobile
              ? MOBILE_MAX_VISIBLE_METRIC_BARS
              : MAX_VISIBLE_METRIC_BARS) && (
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
        <ChartContainer className="h-50 w-full md:h-80" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={visibleData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid />
            <XAxis
              axisLine={false}
              dataKey="response"
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
            {!isMobile && <ChartLegend content={<ChartLegendContent />} />}
            <Line
              dataKey="coherence"
              dot={false}
              stroke={chartConfig.coherence.color}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="relevance"
              dot={false}
              stroke={chartConfig.relevance.color}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="creativity"
              dot={false}
              stroke={chartConfig.creativity.color}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="completeness"
              dot={false}
              stroke={chartConfig.completeness.color}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="readability"
              dot={false}
              stroke={chartConfig.readability.color}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="sentimentBalance"
              dot={false}
              stroke={chartConfig.sentimentBalance.color}
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="informationDensity"
              dot={false}
              stroke={chartConfig.informationDensity.color}
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
