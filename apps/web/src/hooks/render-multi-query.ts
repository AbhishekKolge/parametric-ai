import type { UseQueryResult } from "@tanstack/react-query";
import type { TRPCDefaultErrorShape } from "@trpc/server";

type MultiStateViews<TTuple extends readonly unknown[]> = {
  LoadingStateView: React.JSX.Element;
  ErrorStateView:
    | React.JSX.Element
    | ((error: TRPCDefaultErrorShape) => React.JSX.Element);
  showErrorState?: boolean;
  EmptyStateView?: React.JSX.Element;
  SuccessStateView: (
    data: { [K in keyof TTuple]: NonNullable<TTuple[K]> },
    queries: { [K in keyof TTuple]: UseQueryResult<TTuple[K]> }
  ) => React.JSX.Element;
  isEmpty?: (data: { [K in keyof TTuple]: NonNullable<TTuple[K]> }) => boolean;
};

export function renderMultiQuery<TTuple extends readonly unknown[]>(
  queries: { [K in keyof TTuple]: UseQueryResult<TTuple[K]> },
  {
    LoadingStateView,
    ErrorStateView,
    EmptyStateView,
    SuccessStateView,
    isEmpty: customIsEmpty,
    showErrorState,
  }: MultiStateViews<TTuple>
): React.JSX.Element {
  const erroredQuery = queries.find((q) => q.isError);
  if (showErrorState || erroredQuery) {
    const error = erroredQuery?.error as TRPCDefaultErrorShape | undefined;
    return typeof ErrorStateView === "function"
      ? ErrorStateView(error as TRPCDefaultErrorShape)
      : ErrorStateView;
  }

  if (queries.some((q) => q.isPending)) {
    return LoadingStateView;
  }

  const allData = queries.map((q) => q.data) as {
    [K in keyof TTuple]: TTuple[K];
  };

  const isDefaultEmpty = (d: unknown) =>
    d == null ||
    (Array.isArray(d) && d.length === 0) ||
    (typeof d === "object" && d !== null && Object.keys(d).length === 0);

  const isEmpty =
    customIsEmpty?.(
      allData as { [K in keyof TTuple]: NonNullable<TTuple[K]> }
    ) ?? allData.every((item) => isDefaultEmpty(item));

  if (isEmpty && EmptyStateView) {
    return EmptyStateView;
  }

  return SuccessStateView(
    allData as { [K in keyof TTuple]: NonNullable<TTuple[K]> },
    queries as { [K in keyof TTuple]: UseQueryResult<TTuple[K]> }
  );
}

export function firstErrorRefetch<TTuple extends readonly unknown[]>(
  queries: { [K in keyof TTuple]: UseQueryResult<TTuple[K]> }
): () => Promise<unknown> | null {
  const errored = queries.find((q) => q.isError);
  return errored ? errored.refetch : () => null;
}
