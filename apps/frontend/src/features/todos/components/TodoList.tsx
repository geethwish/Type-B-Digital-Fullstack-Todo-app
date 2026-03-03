import { useEffect } from 'react';
import { TodoItem } from './TodoItem';

import { Spinner } from '@/components/shared/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';

const filterEmptyMessages = {
  all: { title: 'No todos yet!', description: 'Add your first todo above to get started.' },
  active: { title: 'No active todos!', description: 'All caught up 🎉' },
  done: { title: 'No completed todos yet', description: 'Complete some todos to see them here.' },
};

export const TodoList = () => {
  const todos = [{
    _id: '1',
    title: 'Todo 1',
    description: 'Todo 1 description',
    done: false,
    createdAt: '2021-01-01',
    updatedAt: '2021-01-01',
  }];
  const status = "idle";
  const error = null;
  const filter = "all";


  useEffect(() => {
    console.log("fetch todos");

  }, []);

  if (status === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center py-24 gap-3 animate-fade-in">
        <Spinner size="lg" />
        <p className="text-sm text-gray-400">Loading your todos…</p>
      </div>
    );
  }

  if (status === 'failed' && error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 p-6 sm:p-8 text-center animate-fade-in">
        <p className="text-4xl mb-3">⚠️</p>
        <h3 className="text-red-600 font-semibold">Failed to load todos</h3>
        <p className="text-red-400 text-sm mt-1">{error}</p>
        <button
          className="mt-4 px-5 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 text-sm
            font-semibold transition-colors touch-manipulation active:scale-95"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <h2 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          My Todos
        </h2>
        {
          // filter options
        }
      </div>

      {todos.length === 0 ? (
        <EmptyState
          title={filterEmptyMessages[filter].title}
          description={filterEmptyMessages[filter].description}
          icon={filter === 'done' ? '🏆' : '📝'}
        />
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo._id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

