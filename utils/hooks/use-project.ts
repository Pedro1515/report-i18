import useSWR from "swr";
import { Response, Project } from "api";
import { objectToQueryParams } from "utils";
import { fetchAndCache } from "utils/swr";

export function useProjects(query?) {
  const queryParams = objectToQueryParams(query);
  const { data, error, mutate: mutateProjects } = useSWR<Response<Project[]>>(
    `/rest/projects/q?${queryParams}`
  );

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    mutateProjects,
  };
}

export function useProject(id: string) {
  const { data, error, mutate: mutateProject } = useSWR<Project>(
    `/rest/projects/${id}`
  );

  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutateProject,
  };
}

export function prefetchProject(id: string) {
  return fetchAndCache(`/rest/projects/${id}`);
}