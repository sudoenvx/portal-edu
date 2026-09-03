'use client'

import { API_URL } from "@/core/config";
import axios, { type InternalAxiosRequestConfig } from "axios";


export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Accept": "application/json",
    "lang": "en",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Global kick-out logic or token refresh goes here
    }
    return Promise.reject(error);
  }
);


export const useAxios = () => apiClient;