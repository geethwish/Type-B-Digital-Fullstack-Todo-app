import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';
import { TodoList } from './TodoList';
import todosReducer from '../store/todoSlice';
import * as todosApi from '../api/todosApi';
import type { Todo, TodosState } from '../types/todo.types';

vi.mock('../api/todosApi');

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: '1',
  title: 'Test todo',
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

const createStore = (preloaded: Partial<TodosState> = {}) =>
  configureStore({
    reducer: { todos: todosReducer },
    preloadedState: { todos: { ...baseState, ...preloaded } },
  });

const renderWithStore = (preloaded: Partial<TodosState> = {}) => {
  const store = createStore(preloaded);
  render(
    <Provider store={store}>
      <Toaster />
      <TodoList />
    </Provider>
  );
  return store;
};

describe('TodoList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner while status is "loading"', () => {
    vi.spyOn(todosApi.todosApi, 'getAll').mockImplementation(
      () => new Promise(() => { }) // never resolves
    );
    renderWithStore({ status: 'loading' });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading your todos/i)).toBeInTheDocument();
  });

  it('shows error message when status is "failed"', async () => {
    vi.spyOn(todosApi.todosApi, 'getAll').mockRejectedValue(new Error('Connection refused'));
    renderWithStore({ status: 'idle' });
    await waitFor(() => {
      expect(screen.getByText(/failed to load todos/i)).toBeInTheDocument();
      expect(screen.getByText(/connection refused/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when there are no todos (filter: all)', async () => {
    vi.spyOn(todosApi.todosApi, 'getAll').mockResolvedValue([]);
    renderWithStore({ items: [], status: 'succeeded', filter: 'all' });
    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });

  it('shows correct empty message for "active" filter', async () => {
    vi.spyOn(todosApi.todosApi, 'getAll').mockResolvedValue([]);
    renderWithStore({ items: [], status: 'succeeded', filter: 'active' });
    await waitFor(() => {
      expect(screen.getByText(/no active todos/i)).toBeInTheDocument();
    });
  });

  it('shows correct empty message for "done" filter', async () => {
    vi.spyOn(todosApi.todosApi, 'getAll').mockResolvedValue([]);
    renderWithStore({ items: [], status: 'succeeded', filter: 'done' });
    await waitFor(() => {
      expect(screen.getByText(/no completed todos/i)).toBeInTheDocument();
    });
  });

  it('renders todo items when they exist', async () => {
    const todos = [
      makeTodo({ _id: '1', title: 'First task' }),
      makeTodo({ _id: '2', title: 'Second task' }),
    ];
    vi.spyOn(todosApi.todosApi, 'getAll').mockResolvedValue(todos);
    renderWithStore({ items: todos, status: 'succeeded' });
    await waitFor(() => {
      expect(screen.getByText('First task')).toBeInTheDocument();
      expect(screen.getByText('Second task')).toBeInTheDocument();
    });
  });

  it('fetches todos on mount', async () => {
    const spy = vi.spyOn(todosApi.todosApi, 'getAll').mockResolvedValue([]);
    renderWithStore();
    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('only shows done todos when filter is "done"', async () => {
    const todos = [
      makeTodo({ _id: '1', title: 'Active task', done: false }),
      makeTodo({ _id: '2', title: 'Done task', done: true }),
    ];
    vi.spyOn(todosApi.todosApi, 'getAll').mockResolvedValue(todos);
    renderWithStore({ items: todos, status: 'succeeded', filter: 'done' });
    await waitFor(() => {
      expect(screen.getByText('Done task')).toBeInTheDocument();
      expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    });
  });
});

