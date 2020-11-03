import useSWR from "swr";
import { Run, Response } from "api";

export function useMedia(testId: string) {
  const { data, error, mutate: mutateTests } = useSWR(
    `/rest/tests/media/`+testId
  );

  return {data};
}
