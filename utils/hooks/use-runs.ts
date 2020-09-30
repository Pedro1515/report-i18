import useSWR from "swr";
import { Run, Response } from "api";

export function useRuns(projectId: string) {
  const { data, error } = useSWR<Response<Run[]>>(
    `/rest/runs/q?projectId=${projectId}`
  );

  return {
    runs: data,
    isLoading: !error && !data,
    isError: error,
  };
}
