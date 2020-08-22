import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";
import { keycloak } from "../util/auth";

export const useAxios = (): AxiosInstance => {
  const instance = useMemo(() => {
    const axiosInst = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
    });
    axiosInst.interceptors.request.use((config) => {
      if (keycloak?.token) {
        config.headers["Authorization"] = "Bearer " + keycloak?.token;
        return config;
      }
      return new Promise((resolve, reject) => {
        keycloak.onAuthSuccess = () => {
          config.headers["Authorization"] = "Bearer " + keycloak?.token;
          resolve(config);
        
        }
        keycloak.onAuthError = () => {
          reject(config);
        }
      });
    });
    return axiosInst;
  }, []);
  return instance;
};
