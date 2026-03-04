import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "@/features/todos/store/todoSlice";

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
