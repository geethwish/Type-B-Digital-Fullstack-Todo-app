import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Header from './Header';
import todosReducer from '@/features/todos/store/todoSlice';
import type { TodosState } from '@/features/todos/types/todo.types';

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
  render(
    <Provider store={createStore(preloaded)}>
      <Header />
    </Provider>
  );
};

describe('Header', () => {
  it('renders the app title', () => {
    renderWithStore();
    expect(screen.getByText('Todo')).toBeInTheDocument();
    expect(screen.getByText('App')).toBeInTheDocument();
  });

  it('shows 0 active and 0 done when no todos', () => {
    renderWithStore();
    const activeEl = screen.getByText('Active');
    const doneEl = screen.getByText('Done');
    expect(activeEl.previousSibling?.textContent).toBe('0');
    expect(doneEl.previousSibling?.textContent).toBe('0');
  });

  it('shows correct active and done counts', () => {
    const items = [
      { _id: '1', title: 'A', description: '', done: false, createdAt: '', updatedAt: '' },
      { _id: '2', title: 'B', description: '', done: true, createdAt: '', updatedAt: '' },
      { _id: '3', title: 'C', description: '', done: true, createdAt: '', updatedAt: '' },
    ];
    renderWithStore({ items });
    const activeEl = screen.getByText('Active');
    const doneEl = screen.getByText('Done');
    expect(activeEl.previousSibling?.textContent).toBe('1');
    expect(doneEl.previousSibling?.textContent).toBe('2');
  });

  it('does not show the progress bar when there are no todos', () => {
    renderWithStore({ items: [] });
    expect(screen.queryByText(/\d+\/\d+ done/)).not.toBeInTheDocument();
  });

  it('shows the progress bar with correct text when todos exist', () => {
    const items = [
      { _id: '1', title: 'A', description: '', done: true, createdAt: '', updatedAt: '' },
      { _id: '2', title: 'B', description: '', done: false, createdAt: '', updatedAt: '' },
    ];
    renderWithStore({ items });
    expect(screen.getByText('1/2 done')).toBeInTheDocument();
  });
});

