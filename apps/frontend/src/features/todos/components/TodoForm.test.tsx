import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Toaster } from 'react-hot-toast';
import { TodoForm } from './TodoForm';
import todosReducer from './../store/todoSlice';
import * as todosApi from '../api/todosApi';

vi.mock('../api/todosApi');

const mockTodo = {
  _id: '507f1f77bcf86cd799439011',
  title: 'New Todo',
  description: '',
  done: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const createStore = () =>
  configureStore({
    reducer: { todos: todosReducer },
  });

const renderWithStore = (store = createStore()) => {
  return render(
    <Provider store={store}>
      <Toaster />
      <TodoForm />
    </Provider>
  );
};

describe('TodoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    renderWithStore();
    expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add more details/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  it('shows validation error when submitting with empty title', async () => {
    renderWithStore();
    const submitButton = screen.getByRole('button', { name: /add todo/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for title exceeding 200 chars', async () => {
    renderWithStore();
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    // Use fireEvent.change to bypass the maxLength HTML attribute
    fireEvent.change(titleInput, { target: { value: 'a'.repeat(201) } });
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    await waitFor(() => {
      expect(screen.getByText(/200 characters/i)).toBeInTheDocument();
    });
  });

  it('clears error when typing in title field', async () => {
    renderWithStore();
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    await userEvent.type(titleInput, 'A');
    await waitFor(() => {
      expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    vi.spyOn(todosApi.todosApi, 'create').mockResolvedValue(mockTodo);
    renderWithStore();

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    await userEvent.type(titleInput, 'New Todo');

    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    await waitFor(() => {
      expect(todosApi.todosApi.create).toHaveBeenCalledWith({
        title: 'New Todo',
        description: '',
      });
    });
  });

  it('clears form after successful submission', async () => {
    vi.spyOn(todosApi.todosApi, 'create').mockResolvedValue(mockTodo);
    renderWithStore();

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    await userEvent.type(titleInput, 'New Todo');
    fireEvent.click(screen.getByRole('button', { name: /add todo/i }));

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
    });
  });

  it('shows char counter for title', async () => {
    renderWithStore();
    const titleInput = screen.getByPlaceholderText(/what needs to be done/i);
    await userEvent.type(titleInput, 'Hello');
    expect(screen.getByText('5/200')).toBeInTheDocument();
  });
});

