import type { AppRouter } from "@parametric-ai/api/router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@parametric-ai/ui/components/accordion";
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
import { Progress } from "@parametric-ai/ui/components/progress";
import { Skeleton } from "@parametric-ai/ui/components/skeleton";
import type { ResponseMetrics } from "@parametric-ai/utils/experiment/types";
import type { inferProcedureOutput } from "@trpc/server";
import { format, formatDistanceToNow } from "date-fns";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import superjson from "superjson";
import {
  BADGE_METRICS_KEYS,
  METRICS_LABEL_MAP,
  PERFORMANCE_METRICS_KEYS,
  PERFORMANCE_METRICS_UNITS,
  PROGRESS_METRICS_KEYS,
} from "../../utils/const";
import { formatNumber } from "../../utils/helper";

export type ResponsesOutput = inferProcedureOutput<
  AppRouter["experiment"]["getResponses"]
>;

export type ResponseCardProps = ResponsesOutput["data"]["responses"][number];

export const ResponseCard = ({
  id,
  experimentId,
  createdAt,
  temperature,
  topP,
  maxCompletionTokens,
  content,
  metrics,
}: ResponseCardProps) => {
  const retypedMetrics = metrics as ResponseMetrics;

  const copyHandler = () => {
    const data = {
      id,
      experimentId,
      createdAt,
      temperature,
      topP,
      maxCompletionTokens,
      content,
      metrics,
    };
    const serialized = superjson.stringify(data);
    navigator.clipboard.writeText(serialized);
    toast.info("Response copied to clipboard");
  };
  return (
    <Card className="@container">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Overall Quality Score: {formatNumber(retypedMetrics.overallScore)}%
          </CardTitle>
          <Button onClick={copyHandler} size="icon" variant="ghost">
            <Copy />
          </Button>
        </div>
        <CardDescription className="flex items-center gap-2">
          <span>{format(createdAt, "dd MMM yyyy HH:mm a")}</span>
          <span>({formatDistanceToNow(createdAt, { addSuffix: true })})</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="line-clamp-5 text-ellipsis text-wrap text-sm">
          {content}
        </pre>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(retypedMetrics).map(([key, value]) => {
            if (!BADGE_METRICS_KEYS.includes(key as keyof ResponseMetrics)) {
              return null;
            }
            return (
              <Badge key={key}>
                {METRICS_LABEL_MAP[key as keyof ResponseMetrics]}:{" "}
                {formatNumber(value)}%
              </Badge>
            );
          })}
        </div>
        <Accordion className="w-full" collapsible type="single">
          <AccordionItem value="quality-metrics">
            <AccordionTrigger>Quality Metrics</AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-4">
                {Object.entries(retypedMetrics).map(([key, value]) => {
                  if (
                    !PROGRESS_METRICS_KEYS.includes(
                      key as keyof ResponseMetrics
                    )
                  ) {
                    return null;
                  }
                  return (
                    <li className="flex flex-col gap-2" key={key}>
                      <div className="flex items-center justify-between font-medium">
                        <span>
                          {METRICS_LABEL_MAP[key as keyof ResponseMetrics]}
                        </span>
                        <span>{formatNumber(value)}%</span>
                      </div>
                      <Progress value={value} />
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="performance-metrics">
            <AccordionTrigger>Performance Metrics</AccordionTrigger>
            <AccordionContent>
              <ul className="grid @lg:grid-cols-3 @md:grid-cols-2 gap-2">
                {Object.entries(retypedMetrics).map(([key, value]) => {
                  if (
                    !PERFORMANCE_METRICS_KEYS.includes(
                      key as keyof ResponseMetrics
                    )
                  ) {
                    return null;
                  }
                  return (
                    <li
                      className="flex flex-col gap-4 rounded-md border p-4"
                      key={key}
                    >
                      <span className="text-muted-foreground text-xs uppercase">
                        {METRICS_LABEL_MAP[key as keyof ResponseMetrics]}
                      </span>
                      <span className="flex items-baseline gap-1">
                        <strong className="text-lg">
                          {formatNumber(value)}
                        </strong>
                        <span className="text-muted-foreground">
                          {
                            PERFORMANCE_METRICS_UNITS[
                              key as keyof ResponseMetrics
                            ]
                          }
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="response">
            <AccordionTrigger>Full Response</AccordionTrigger>
            <AccordionContent>
              <pre className="text-wrap text-sm">{content}</pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
};

export const ResponseCardLoading = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>
          <Skeleton className="h-4 w-2xs" />
        </CardTitle>
        <Skeleton className="h-9 w-9" />
      </div>
      <CardDescription className="flex items-center gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-32" />
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-24 w-full" />
    </CardContent>
    <CardFooter className="flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map(() => (
          <Skeleton className="h-[22px] w-32" key={crypto.randomUUID()} />
        ))}
      </div>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </CardFooter>
  </Card>
);
