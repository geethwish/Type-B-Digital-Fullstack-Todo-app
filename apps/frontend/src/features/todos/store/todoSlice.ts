import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { todosApi } from "../api/todosApi";
import type {
  CreateTodoPayload,
  Todo,
  TodosState,
  UpdateTodoPayload,
} from "../types/todo.types";

export const fetchTodos = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>("todos/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await todosApi.getAll();
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const createTodo = createAsyncThunk<
  Todo,
  CreateTodoPayload,
  { rejectValue: string }
>("todos/create", async (payload, { rejectWithValue }) => {
  try {
    return await todosApi.create(payload);
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const updateTodo = createAsyncThunk<
  Todo,
  { id: string; payload: UpdateTodoPayload },
  { rejectValue: string }
>("todos/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await todosApi.update(id, payload);
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

/*
    Initial state
*/

const initialState: TodosState = {
  items: [],
  status: "idle",
  error: null,
  filter: "all",
  editingId: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setEditingId(state, action: PayloadAction<string | null>) {
      state.editingId = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchTodos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch todos";
      });

    // createTodo
    builder
      .addCase(createTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to create todo";
      });

    // updateTodo
    builder
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (t) => t._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
        state.editingId = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update todo";
      });
  },
});

export const { setEditingId } = todosSlice.actions;

export default todosSlice.reducer;
