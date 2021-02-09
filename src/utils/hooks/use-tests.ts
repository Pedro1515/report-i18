import useSWR from "swr";
import { Run, Response } from "src/api";
import { objectToQueryParams } from "src/utils/string";

export function useTests(query) {
  const queryParams = objectToQueryParams(query);
  const { data, error, mutate: mutateTests } = useSWR(
    `/rest/tests/q?${queryParams}`
  );

  return {
    tests: data,
    isLoading: !error && !data,
    isError: error,
    mutateTests,
  };
}
