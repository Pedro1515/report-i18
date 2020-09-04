import useSWR from "swr";

// function useProject(id) {
//   const { data, error } = useSWR(`/rest/projects/select/${id}`, fetcher);
//   return {
//     user: data,
//     isLoading: !error && !data,
//     isError: error,
//   };
// }

export default function Project() {
  const { data } = useSWR("/api/posts");
  return null;
}
