import useSWR from "swr";
import { Run, Response } from "api";
import { objectToQueryParams } from "utils/string";

export function useRuns(query?) {
  const queryParams = objectToQueryParams(query);
  const { data, error, mutate: mutateRuns } = useSWR<Response<Run[]>>(
    `/rest/runs/q?${queryParams}`
  );

  return {
    runs: data,
    isLoading: !error && !data,
    isError: error,
    mutateRuns,
  };
}
