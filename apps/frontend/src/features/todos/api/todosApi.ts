import apiClient from "@/api/client";
import type { ApiResponse } from "@/api/client";
import type {
  Todo,
  CreateTodoPayload,
  UpdateTodoPayload,
} from "../types/todo.types";

const TODOS_BASE = "/api/v1/todos";

export const todosApi = {
  getAll: async (): Promise<Todo[]> => {
    const { data } = await apiClient.get<ApiResponse<Todo[]>>(TODOS_BASE);
    return data.data ?? [];
  },

  create: async (payload: CreateTodoPayload): Promise<Todo> => {
    const { data } = await apiClient.post<ApiResponse<Todo>>(
      TODOS_BASE,
      payload,
    );
    return data.data!;
  },

  update: async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
    const { data } = await apiClient.put<ApiResponse<Todo>>(
      `${TODOS_BASE}/${id}`,
      payload,
    );
    return data.data!;
  },

  toggleDone: async (id: string): Promise<Todo> => {
    const { data } = await apiClient.patch<ApiResponse<Todo>>(
      `${TODOS_BASE}/${id}/done`,
    );
    return data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${TODOS_BASE}/${id}`);
  },
};
