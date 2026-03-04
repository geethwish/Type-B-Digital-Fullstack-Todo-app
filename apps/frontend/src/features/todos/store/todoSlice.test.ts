import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import todosReducer, {
  fetchTodos,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodo,
  setEditingId,
  setFilter,
  clearError,
} from "./todoSlice";
import * as todosApiModule from "../api/todosApi";
import type { Todo, TodosState } from "../types/todo.types";

vi.mock("../api/todosApi");

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: "1",
  title: "Test todo",
  description: "",
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const baseState: TodosState = {
  items: [],
  status: "idle",
  error: null,
  filter: "all",
  editingId: null,
};

const createTestStore = (preloaded: Partial<TodosState> = {}) =>
  configureStore({
    reducer: { todos: todosReducer },
    preloadedState: { todos: { ...baseState, ...preloaded } },
  });

describe("todosSlice — synchronous reducers", () => {
  it("setFilter updates the filter", () => {
    const store = createTestStore();
    store.dispatch(setFilter("active"));
    expect(store.getState().todos.filter).toBe("active");
  });

  it("setEditingId sets the editing id", () => {
    const store = createTestStore();
    store.dispatch(setEditingId("abc"));
    expect(store.getState().todos.editingId).toBe("abc");
  });

  it("setEditingId can be cleared to null", () => {
    const store = createTestStore({ editingId: "abc" });
    store.dispatch(setEditingId(null));
    expect(store.getState().todos.editingId).toBeNull();
  });

  it("clearError sets error to null", () => {
    const store = createTestStore({ error: "oops" });
    store.dispatch(clearError());
    expect(store.getState().todos.error).toBeNull();
  });
});

describe("todosSlice — fetchTodos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sets status to loading on pending", () => {
    const store = createTestStore({ status: "idle" });
    store.dispatch(fetchTodos());
    expect(store.getState().todos.status).toBe("loading");
  });

  it("sets status to succeeded and populates items on fulfilled", async () => {
    const todos = [makeTodo({ _id: "1" }), makeTodo({ _id: "2" })];
    vi.spyOn(todosApiModule.todosApi, "getAll").mockResolvedValue(todos);
    const store = createTestStore();
    await store.dispatch(fetchTodos());
    expect(store.getState().todos.status).toBe("succeeded");
    expect(store.getState().todos.items).toEqual(todos);
  });

  it("sets status to failed and records error on rejected", async () => {
    vi.spyOn(todosApiModule.todosApi, "getAll").mockRejectedValue(
      new Error("Network error"),
    );
    const store = createTestStore();
    await store.dispatch(fetchTodos());
    expect(store.getState().todos.status).toBe("failed");
    expect(store.getState().todos.error).toBe("Network error");
  });
});

describe("todosSlice — createTodo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("prepends the new todo to items on fulfilled", async () => {
    const existing = makeTodo({ _id: "1", title: "Old" });
    const created = makeTodo({ _id: "2", title: "New" });
    vi.spyOn(todosApiModule.todosApi, "create").mockResolvedValue(created);
    const store = createTestStore({ items: [existing] });
    await store.dispatch(createTodo({ title: "New", description: "" }));
    const items = store.getState().todos.items;
    expect(items[0]).toEqual(created);
    expect(items[1]).toEqual(existing);
  });

  it("sets error on rejected", async () => {
    vi.spyOn(todosApiModule.todosApi, "create").mockRejectedValue(
      new Error("Failed"),
    );
    const store = createTestStore();
    await store.dispatch(createTodo({ title: "X" }));
    expect(store.getState().todos.error).toBe("Failed");
  });
});

describe("todosSlice — updateTodo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates the matching item and clears editingId on fulfilled", async () => {
    const todo = makeTodo({ _id: "1", title: "Old" });
    const updated = { ...todo, title: "Updated" };
    vi.spyOn(todosApiModule.todosApi, "update").mockResolvedValue(updated);
    const store = createTestStore({ items: [todo], editingId: "1" });
    await store.dispatch(
      updateTodo({ id: "1", payload: { title: "Updated" } }),
    );
    expect(store.getState().todos.items[0].title).toBe("Updated");
    expect(store.getState().todos.editingId).toBeNull();
  });

  it("sets error on rejected", async () => {
    vi.spyOn(todosApiModule.todosApi, "update").mockRejectedValue(
      new Error("Update failed"),
    );
    const store = createTestStore({ items: [makeTodo()] });
    await store.dispatch(updateTodo({ id: "1", payload: { title: "X" } }));
    expect(store.getState().todos.error).toBe("Update failed");
  });
});

describe("todosSlice — toggleTodoDone", () => {
  beforeEach(() => vi.clearAllMocks());

  it("optimistically flips done on pending", () => {
    const todo = makeTodo({ _id: "1", done: false });
    const store = createTestStore({ items: [todo] });
    // dispatch but don't await — check the optimistic state
    vi.spyOn(todosApiModule.todosApi, "toggleDone").mockResolvedValue({
      ...todo,
      done: true,
    });
    store.dispatch(toggleTodoDone("1"));
    expect(store.getState().todos.items[0].done).toBe(true);
  });

  it("reconciles item with server response on fulfilled", async () => {
    const todo = makeTodo({ _id: "1", done: false });
    const serverTodo = { ...todo, done: true };
    vi.spyOn(todosApiModule.todosApi, "toggleDone").mockResolvedValue(
      serverTodo,
    );
    const store = createTestStore({ items: [todo] });
    await store.dispatch(toggleTodoDone("1"));
    expect(store.getState().todos.items[0].done).toBe(true);
  });

  it("reverts optimistic update and sets error on rejected", async () => {
    const todo = makeTodo({ _id: "1", done: false });
    vi.spyOn(todosApiModule.todosApi, "toggleDone").mockRejectedValue(
      new Error("Toggle failed"),
    );
    const store = createTestStore({ items: [todo] });
    await store.dispatch(toggleTodoDone("1"));
    expect(store.getState().todos.items[0].done).toBe(false);
    expect(store.getState().todos.error).toBe("Toggle failed");
  });
});

describe("todosSlice — deleteTodo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("optimistically removes the todo on pending", () => {
    const todo = makeTodo({ _id: "1" });
    const store = createTestStore({ items: [todo] });
    vi.spyOn(todosApiModule.todosApi, "delete").mockResolvedValue();
    store.dispatch(deleteTodo("1"));
    expect(store.getState().todos.items).toHaveLength(0);
  });

  it("sets error on rejected", async () => {
    const todo = makeTodo({ _id: "1" });
    vi.spyOn(todosApiModule.todosApi, "delete").mockRejectedValue(
      new Error("Delete failed"),
    );
    const store = createTestStore({ items: [todo] });
    await store.dispatch(deleteTodo("1"));
    expect(store.getState().todos.error).toBe("Delete failed");
  });
});
