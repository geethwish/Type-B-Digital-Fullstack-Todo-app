import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';
import { TodoItem } from './TodoItem';
import todosReducer from '../store/todoSlice';
import * as todosApi from '../api/todosApi';
import type { Todo, TodosState } from '../types/todo.types';

vi.mock('../api/todosApi');

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: '1',
  title: 'Buy groceries',
  description: 'Milk and eggs',
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const baseState: Partial<TodosState> = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all',
  editingId: null,
};

const createStore = (preloaded: Partial<TodosState> = {}) =>
  configureStore({
    reducer: { todos: todosReducer },
    preloadedState: { todos: { ...baseState, ...preloaded } as TodosState },
  });

const renderWithStore = (todo: Todo, preloaded: Partial<TodosState> = {}) => {
  const store = createStore({ items: [todo], ...preloaded });
  render(
    <Provider store={store}>
      <Toaster />
      <TodoItem todo={todo} />
    </Provider>
  );
  return store;
};

describe('TodoItem', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders the todo title and description', () => {
    renderWithStore(makeTodo());
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Milk and eggs')).toBeInTheDocument();
  });

  it('shows "Active" badge for an incomplete todo', () => {
    renderWithStore(makeTodo({ done: false }));
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it('shows "Done" badge for a completed todo', () => {
    renderWithStore(makeTodo({ done: true }));
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it('does not show Edit button for a completed todo', () => {
    renderWithStore(makeTodo({ done: true }));
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('shows Edit button for an incomplete todo', () => {
    renderWithStore(makeTodo({ done: false }));
    expect(screen.getByRole('button', { name: /edit todo/i })).toBeInTheDocument();
  });

  it('calls todosApi.toggleDone when toggle button is clicked', async () => {
    const todo = makeTodo({ done: false });
    const spy = vi.spyOn(todosApi.todosApi, 'toggleDone').mockResolvedValue({ ...todo, done: true });
    renderWithStore(todo);
    fireEvent.click(screen.getByRole('button', { name: /mark as done/i }));
    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith('1');
    });
  });

  it('shows delete confirmation modal when Delete is clicked', () => {
    renderWithStore(makeTodo());
    fireEvent.click(screen.getByRole('button', { name: /delete todo/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/delete todo/i)).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', async () => {
    renderWithStore(makeTodo());
    fireEvent.click(screen.getByRole('button', { name: /delete todo/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes the modal on Escape key press', async () => {
    renderWithStore(makeTodo());
    fireEvent.click(screen.getByRole('button', { name: /delete todo/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls todosApi.delete when Delete is confirmed', async () => {
    vi.spyOn(todosApi.todosApi, 'delete').mockResolvedValue();
    renderWithStore(makeTodo({ _id: '1' }));
    fireEvent.click(screen.getByRole('button', { name: /delete todo/i }));
    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    await waitFor(() => {
      expect(todosApi.todosApi.delete).toHaveBeenCalledWith('1');
    });
  });

  it('shows TodoEditForm when this todo is the editingId', () => {
    const todo = makeTodo({ _id: '1' });
    vi.spyOn(todosApi.todosApi, 'update').mockResolvedValue(todo);
    renderWithStore(todo, { editingId: '1' });
    expect(screen.getByLabelText(/edit title/i)).toBeInTheDocument();
  });
});

