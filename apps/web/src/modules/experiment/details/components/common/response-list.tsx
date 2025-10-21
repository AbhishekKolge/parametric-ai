"use client";

import { Pagination } from "@parametric-ai/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@parametric-ai/ui/components/select";
import {
  DEFAULT_RESPONSE_LIMIT,
  DEFAULT_RESPONSE_PAGE,
} from "@parametric-ai/utils/experiment/const";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EmptyBlock } from "@/components/blocks/empty-block";
import { ErrorBlock } from "@/components/blocks/error-block";
import {
  firstErrorRefetch,
  renderMultiQuery,
} from "@/hooks/render-multi-query";
import { trpc } from "@/services/trpc";
import { useResponseFilters } from "../../hooks/use-response-filters";
import type { ExperimentDetailsParams } from "../../types";
import { ResponseCard, ResponseCardLoading } from "../cards/response-card";

export const ResponseList = () => {
  const { id } = useParams<ExperimentDetailsParams>();
  const { filters, setPage, setSortBy, setOrder } = useResponseFilters();
  const responsesQuery = useQuery(
    trpc.experiment.getResponses.queryOptions({
      experimentId: id,
      ...filters,
    })
  );

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex items-center gap-4">
        <Select onValueChange={setSortBy} value={filters.sortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="temperature">Temperature</SelectItem>
            <SelectItem value="topP">Top P</SelectItem>
            <SelectItem value="maxCompletionTokens">
              Max Completion Tokens
            </SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={setOrder} value={filters.order}>
          <SelectTrigger>
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderMultiQuery([responsesQuery], {
        isEmpty: ([data]) => !data.data.responses.length,
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
            handleRetry={firstErrorRefetch([responsesQuery])}
            message={error.message}
          />
        ),
        LoadingStateView: (
          <>
            <div className="flex flex-col gap-4">
              {Array.from({ length: DEFAULT_RESPONSE_LIMIT }).map(() => (
                <ResponseCardLoading key={crypto.randomUUID()} />
              ))}
            </div>
            <Pagination
              currentPage={DEFAULT_RESPONSE_PAGE}
              isLoading
              label="responses"
              limit={DEFAULT_RESPONSE_LIMIT}
              onPageChange={setPage}
              totalCount={0}
              totalPages={0}
            />
          </>
        ),
        SuccessStateView: ([responsesData]) => (
          <div className="flex h-full flex-col gap-8">
            <div className="flex flex-col gap-4">
              {responsesData.data.responses.map((response) => (
                <ResponseCard key={response.id} {...response} />
              ))}
            </div>
            <Pagination
              currentPage={responsesData.data.currentPage}
              label="responses"
              limit={filters.limit}
              onPageChange={setPage}
              totalCount={responsesData.data.totalCount}
              totalPages={responsesData.data.totalPages}
            />
          </div>
        ),
      })}
    </div>
  );
};
