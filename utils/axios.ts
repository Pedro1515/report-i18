import axios from "axios";

export const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST_URL,
});

export const apiFetcher = (url) => apiInstance.get(url).then((res) => res.data);
