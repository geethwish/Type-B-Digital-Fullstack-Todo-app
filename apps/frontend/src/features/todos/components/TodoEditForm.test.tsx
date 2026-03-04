import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';
import { TodoEditForm } from './TodoEditForm';
import todosReducer from '../store/todoSlice';
import * as todosApi from '../api/todosApi';
import type { Todo } from '../types/todo.types';

vi.mock('../api/todosApi');

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  _id: '1',
  title: 'Original Title',
  description: 'Original description',
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

const createStore = () =>
  configureStore({ reducer: { todos: todosReducer } });

const renderWithStore = (todo: Todo, store = createStore()) =>
  render(
    <Provider store={store}>
      <Toaster />
      <TodoEditForm todo={todo} />
    </Provider>
  );

describe('TodoEditForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders with the todo title and description pre-filled', () => {
    const todo = makeTodo();
    renderWithStore(todo);
    expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original description')).toBeInTheDocument();
  });

  it('renders Save and Cancel buttons', () => {
    renderWithStore(makeTodo());
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting with empty title', async () => {
    renderWithStore(makeTodo());
    const titleInput = screen.getByLabelText(/edit title/i);
    await userEvent.clear(titleInput);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when title exceeds 200 chars', async () => {
    renderWithStore(makeTodo());
    const titleInput = screen.getByLabelText(/edit title/i);
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(201) } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => {
      expect(screen.getByText(/200 characters/i)).toBeInTheDocument();
    });
  });

  it('clears validation error when user types in title', async () => {
    renderWithStore(makeTodo());
    const titleInput = screen.getByLabelText(/edit title/i);
    await userEvent.clear(titleInput);
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(screen.getByText(/title is required/i)).toBeInTheDocument());
    await userEvent.type(titleInput, 'A');
    await waitFor(() => expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument());
  });

  it('calls todosApi.update with trimmed values on save', async () => {
    const todo = makeTodo({ _id: '1', title: 'Original Title' });
    const updated = { ...todo, title: 'Updated Title' };
    vi.spyOn(todosApi.todosApi, 'update').mockResolvedValue(updated);
    renderWithStore(todo);

    const titleInput = screen.getByLabelText(/edit title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Title');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(todosApi.todosApi.update).toHaveBeenCalledWith('1', {
        title: 'Updated Title',
        description: 'Original description',
      });
    });
  });

  it('dispatches setEditingId(null) when Cancel is clicked', async () => {
    const store = createStore();
    store.dispatch = vi.fn(store.dispatch) as unknown as typeof store.dispatch;
    renderWithStore(makeTodo(), store);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: null })
      );
    });
  });
});

