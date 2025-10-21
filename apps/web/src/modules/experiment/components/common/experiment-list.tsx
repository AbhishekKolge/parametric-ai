"use client";

import { Button } from "@parametric-ai/ui/components/button";
import { MultiSelect } from "@parametric-ai/ui/components/multi-select";
import { Pagination } from "@parametric-ai/ui/components/pagination";
import { Search } from "@parametric-ai/ui/components/search";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@parametric-ai/ui/components/select";
import {
  DEFAULT_EXPERIMENT_LIMIT,
  DEFAULT_EXPERIMENT_PAGE,
} from "@parametric-ai/utils/experiment/const";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { EmptyBlock } from "@/components/blocks/empty-block";
import { ErrorBlock } from "@/components/blocks/error-block";
import {
  firstErrorRefetch,
  renderMultiQuery,
} from "@/hooks/render-multi-query";
import { useDisclosure } from "@/hooks/use-disclosure";
import { trpc } from "@/services/trpc";
import { useExperimentFilters } from "../../hooks/use-experiment-filters";
import {
  ExperimentCard,
  ExperimentCardLoading,
} from "../cards/experiment-card";
import { CreateExperimentDialog } from "../dialogs/create-experiment-dialog";

export const ExperimentList = () => {
  const createExperimentDisclosure = useDisclosure({});
  const { filters, setPage, setSearch, setModelIds, setSortBy, setOrder } =
    useExperimentFilters();
  const aiModelsQuery = useQuery(trpc.experiment.getAllAIModels.queryOptions());
  const experimentsQuery = useQuery(
    trpc.experiment.getAll.queryOptions(filters)
  );
  const aiModelOptions = useMemo(() => {
    if (!aiModelsQuery.data?.data.models.length) {
      return [];
    }
    return aiModelsQuery.data?.data.models.map((model) => ({
      label: model.id,
      value: model.id,
    }));
  }, [aiModelsQuery.data?.data.models]);

  return (
    <>
      <div className="flex h-full flex-col gap-6 md:gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-col gap-4 md:grid-cols-2 lg:flex lg:flex-row lg:items-center">
            <Search
              inputGroupProps={{
                className: "lg:w-2xs",
              }}
              search={filters.search}
              setSearch={setSearch}
            />
            <div>
              <MultiSelect
                maxCount={0}
                onValueChange={setModelIds}
                options={aiModelOptions}
                placeholder="Select models"
                value={filters.modelIds}
                variant="secondary"
              />
            </div>
            <Select onValueChange={setSortBy} value={filters.sortBy}>
              <SelectTrigger className="w-full lg:w-fit">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="createdAt">Created At</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setOrder} value={filters.order}>
              <SelectTrigger className="w-full lg:w-fit">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={createExperimentDisclosure.open}>
            <Plus /> New Experiment
          </Button>
        </div>
        {renderMultiQuery([experimentsQuery], {
          isEmpty: ([data]) => !data.data.experiments.length,
          EmptyStateView: (
            <EmptyBlock
              className="h-full"
              message="Try adding new experiments to track them here"
              title="No experiments found"
            />
          ),
          ErrorStateView: (error) => (
            <ErrorBlock
              className="h-full"
              handleRetry={firstErrorRefetch([experimentsQuery])}
              message={error.message}
            />
          ),
          LoadingStateView: (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: DEFAULT_EXPERIMENT_LIMIT }).map(() => (
                  <ExperimentCardLoading key={crypto.randomUUID()} />
                ))}
              </div>
              <Pagination
                currentPage={DEFAULT_EXPERIMENT_PAGE}
                isLoading
                label="experiments"
                limit={DEFAULT_EXPERIMENT_LIMIT}
                onPageChange={setPage}
                totalCount={0}
                totalPages={0}
              />
            </>
          ),
          SuccessStateView: ([experimentsData]) => (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {experimentsData.data.experiments.map((experiment) => (
                  <ExperimentCard key={experiment.id} {...experiment} />
                ))}
              </div>
              <Pagination
                currentPage={experimentsData.data.currentPage}
                label="experiments"
                limit={filters.limit}
                onPageChange={setPage}
                totalCount={experimentsData.data.totalCount}
                totalPages={experimentsData.data.totalPages}
              />
            </>
          ),
        })}
      </div>
      <CreateExperimentDialog {...createExperimentDisclosure} />
    </>
  );
};
