import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response interceptor - global error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ApiResponse>) => {
    const { response, request, message } = error;

    if (response) {
      // The server responded with an error status
      const status = response.status;
      const serverMessage = response.data?.message || "An error occurred";

      switch (status) {
        case 400:
          return Promise.reject(new Error(serverMessage));
        case 403:
          return Promise.reject(
            new Error("You do not have permission to perform this action."),
          );
        case 404:
          return Promise.reject(
            new Error(serverMessage || "Resource not found."),
          );
        case 422:
          return Promise.reject(
            new Error(serverMessage || "Validation failed."),
          );
        case 429:
          return Promise.reject(
            new Error("Too many requests. Please try again later."),
          );
        case 500:
        case 502:
        case 503:
          return Promise.reject(
            new Error("Server error. Please try again later."),
          );
        default:
          return Promise.reject(new Error(serverMessage));
      }
    } else if (request) {
      // Request was made but no response received
      return Promise.reject(
        new Error("No response from server. Please check your connection."),
      );
    } else {
      // Error setting up the request
      return Promise.reject(new Error(message || "Request failed."));
    }
  },
);

export default apiClient;
