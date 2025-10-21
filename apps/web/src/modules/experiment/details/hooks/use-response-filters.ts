import { DEFAULT_RESPONSE_PAGE } from "@parametric-ai/utils/experiment/const";
import type { ResponsesQueryDto } from "@parametric-ai/utils/experiment/schema";
import { create } from "zustand";
import { DEFAULT_RESPONSE_FILTERS } from "../utils/const";

type ResponseFilterState = {
  filters: Omit<ResponsesQueryDto, "experimentId">;
  setPage: (page: Omit<ResponsesQueryDto, "experimentId">["page"]) => void;
  setLimit: (limit: Omit<ResponsesQueryDto, "experimentId">["limit"]) => void;
  setSortBy: (
    sortBy: Omit<ResponsesQueryDto, "experimentId">["sortBy"]
  ) => void;
  setOrder: (order: Omit<ResponsesQueryDto, "experimentId">["order"]) => void;
  resetFilters: () => void;
};

export const useResponseFilters = create<ResponseFilterState>()((set) => ({
  filters: DEFAULT_RESPONSE_FILTERS,
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
        page: DEFAULT_RESPONSE_PAGE,
        limit,
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
      filters: DEFAULT_RESPONSE_FILTERS,
    })),
}));
