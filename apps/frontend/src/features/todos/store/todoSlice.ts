import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { todosApi } from "../api/todosApi";
import type { Todo, TodosState } from "../types/todo.types";

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
  reducers: {},
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
  },
});

export default todosSlice.reducer;
