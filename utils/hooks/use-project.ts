import useSWR from "swr";
import { Response, Project } from "api";

export function useProjects() {
  const { data, error } = useSWR<Response<Project[]>>("/rest/projects/q");

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useProject(id: string) {
  const { data, error } = useSWR<Project>(`/rest/projects/${id}`);
  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
  };
}
