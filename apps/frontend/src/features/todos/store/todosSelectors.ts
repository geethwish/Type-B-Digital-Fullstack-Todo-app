import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

const selectTodosState = (state: RootState) => state.todos;

export const selectAllTodos = (state: RootState) => state.todos.items;
export const selectTodosStatus = (state: RootState) => state.todos.status;
export const selectTodosError = (state: RootState) => state.todos.error;
export const selectTodosFilter = (state: RootState) => state.todos.filter;
export const selectEditingId = (state: RootState) => state.todos.editingId;

export const selectFilteredTodos = createSelector(
  selectTodosState,
  ({ items, filter }) => {
    console.log(filter);

    switch (filter) {
      case "active":
        return items.filter((t) => !t.done);
      case "done":
        return items.filter((t) => t.done);
      default:
        return items;
    }
  },
);

export const selectTodosCount = createSelector(
  selectTodosState,
  ({ items }) => ({
    total: items.length,
    active: items.filter((t) => !t.done).length,
    done: items.filter((t) => t.done).length,
  }),
);
