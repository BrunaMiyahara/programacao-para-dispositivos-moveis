import { useEffect } from "react";
import axios from "axios";

const useAxiosSecure = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.URL_EXPO_API_PUBLICA,
  });

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      config => config,
      error => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      error => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosInstance;
};

export default useAxiosSecure;