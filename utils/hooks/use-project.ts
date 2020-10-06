import useSWR from "swr";
import { Response, Project } from "api";

export function useProjects() {
  const { data, error, mutate: mutateProjects } = useSWR<Response<Project[]>>("/rest/projects/q");

  return {
    projects: data,
    isLoading: !error && !data,
    isError: error,
    mutateProjects,
  };
}

export function useProject(id: string) {
  const { data, error, mutate: mutateProject } = useSWR<Project>(`/rest/projects/${id}`);
  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutateProject
  };
}
