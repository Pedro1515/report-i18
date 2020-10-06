import { mutate, cache } from "swr";

export function mutateFromCache(urlKey: string) {
  cache.keys().forEach((key) => {
    if (key.includes(urlKey)) {
      mutate(key);
    }
  });
}
