import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todoSlice';
import {
  selectAllTodos,
  selectTodosStatus,
  selectTodosError,
  selectTodosFilter,
  selectEditingId,
  selectFilteredTodos,
  selectTodosCount,
} from './todosSelectors';
import type { Todo, TodosState } from '../types/todo.types';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: '1',
  title: 'Test',
  description: '',
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const baseState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
  editingId: null,
};

const createTestStore = (preloaded: Partial<TodosState> = {}) =>
  configureStore({
    reducer: { todos: todosReducer },
    preloadedState: { todos: { ...baseState, ...preloaded } },
  });

describe('simple selectors', () => {
  it('selectAllTodos returns all items', () => {
    const items = [makeTodo({ _id: '1' }), makeTodo({ _id: '2' })];
    const store = createTestStore({ items });
    expect(selectAllTodos(store.getState())).toEqual(items);
  });

  it('selectTodosStatus returns the status', () => {
    const store = createTestStore({ status: 'loading' });
    expect(selectTodosStatus(store.getState())).toBe('loading');
  });

  it('selectTodosError returns the error', () => {
    const store = createTestStore({ error: 'Something went wrong' });
    expect(selectTodosError(store.getState())).toBe('Something went wrong');
  });

  it('selectTodosFilter returns the filter', () => {
    const store = createTestStore({ filter: 'done' });
    expect(selectTodosFilter(store.getState())).toBe('done');
  });

  it('selectEditingId returns the editingId', () => {
    const store = createTestStore({ editingId: 'abc' });
    expect(selectEditingId(store.getState())).toBe('abc');
  });
});

describe('selectFilteredTodos', () => {
  const activeTodo = makeTodo({ _id: '1', done: false });
  const doneTodo = makeTodo({ _id: '2', done: true });
  const items = [activeTodo, doneTodo];

  it('returns all todos when filter is "all"', () => {
    const store = createTestStore({ items, filter: 'all' });
    expect(selectFilteredTodos(store.getState())).toEqual(items);
  });

  it('returns only active todos when filter is "active"', () => {
    const store = createTestStore({ items, filter: 'active' });
    const result = selectFilteredTodos(store.getState());
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('1');
  });

  it('returns only done todos when filter is "done"', () => {
    const store = createTestStore({ items, filter: 'done' });
    const result = selectFilteredTodos(store.getState());
    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('2');
  });

  it('returns empty array when no todos match', () => {
    const store = createTestStore({ items: [activeTodo], filter: 'done' });
    expect(selectFilteredTodos(store.getState())).toHaveLength(0);
  });
});

describe('selectTodosCount', () => {
  it('returns zero counts when empty', () => {
    const store = createTestStore();
    expect(selectTodosCount(store.getState())).toEqual({ total: 0, active: 0, done: 0 });
  });

  it('correctly counts total, active, and done', () => {
    const items = [
      makeTodo({ _id: '1', done: false }),
      makeTodo({ _id: '2', done: true }),
      makeTodo({ _id: '3', done: true }),
    ];
    const store = createTestStore({ items });
    expect(selectTodosCount(store.getState())).toEqual({ total: 3, active: 1, done: 2 });
  });
});

