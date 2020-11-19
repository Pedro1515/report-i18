import axios from "axios";
import Cookies from "js-cookie";

const baseURL = process.env.REACT_APP_RSAPI

export const apiInstance = axios.create({
  //baseURL: process.env.NEXT_PUBLIC_API_HOST_URL,
  //baseURL: "http://vps2.crowdaronline.com:8082",
  //baseURL: "https://rsapi.automation.crowdaronline.com",
  baseURL:baseURL, 
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use(function (config) {
  const token = Cookies.get("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export const fetcher = (url) => apiInstance.get(url).then((res) => res.data);
