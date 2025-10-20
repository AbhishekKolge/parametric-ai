import { DEFAULT_EXPERIMENT_PAGE } from "@parametric-ai/utils/experiment/const";
import type { ExperimentQueryDto } from "@parametric-ai/utils/experiment/schema";
import { create } from "zustand";
import { DEFAULT_EXPERIMENT_FILTERS } from "../utils/const";

type ExperimentFilterState = {
  filters: ExperimentQueryDto;
  setPage: (page: ExperimentQueryDto["page"]) => void;
  setLimit: (limit: ExperimentQueryDto["limit"]) => void;
  setSearch: (search: ExperimentQueryDto["search"]) => void;
  setModelIds: (modelIds: ExperimentQueryDto["modelIds"]) => void;
  setSortBy: (sortBy: ExperimentQueryDto["sortBy"]) => void;
  setOrder: (order: ExperimentQueryDto["order"]) => void;
  resetFilters: () => void;
};

export const useExperimentFilters = create<ExperimentFilterState>()((set) => ({
  filters: DEFAULT_EXPERIMENT_FILTERS,
  setPage: (page) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page,
      },
    })),
  setLimit: (limit) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: DEFAULT_EXPERIMENT_PAGE,
        limit,
      },
    })),
  setSearch: (search) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: DEFAULT_EXPERIMENT_PAGE,
        search,
      },
    })),
  setModelIds: (modelIds) =>
    set((state) => ({
      filters: {
        ...state.filters,
        page: DEFAULT_EXPERIMENT_PAGE,
        modelIds,
      },
    })),
  setSortBy: (sortBy) =>
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy,
      },
    })),
  setOrder: (order) =>
    set((state) => ({
      filters: {
        ...state.filters,
        order,
      },
    })),
  resetFilters: () =>
    set(() => ({
      filters: DEFAULT_EXPERIMENT_FILTERS,
    })),
}));
