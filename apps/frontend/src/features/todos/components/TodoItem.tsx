import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types/todo.types';
import { TodoEditForm } from './TodoEditForm';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { deleteTodo, setEditingId, toggleTodoDone } from '../store/todoSlice';
import { selectEditingId } from '../store/todosSelectors';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const dispatch = useAppDispatch();
  const editingId = useAppSelector(selectEditingId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isEditing = editingId === todo._id;

  const handleToggle = () => {
    dispatch(toggleTodoDone(todo._id));
    toast.success(todo.done ? 'Marked as active 🔄' : 'Marked as done ✅', { duration: 1500 });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = useCallback(async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      await dispatch(deleteTodo(todo._id)).unwrap();
      toast.success('Todo deleted 🗑️');
    } catch (err) {
      toast.error((err as string) || 'Failed to delete todo');
      setIsDeleting(false);
    }
  }, [dispatch, todo._id]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  /* Close modal on Escape key */
  useEffect(() => {
    if (!showDeleteModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelDelete(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showDeleteModal, cancelDelete]);

  const handleEdit = () => {
    dispatch(setEditingId(todo._id));
  };

  const formattedDate = new Date(todo.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      {/* ── Delete confirmation modal ─────────────────────── */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={cancelDelete}
            aria-hidden="true"
          />

          {/* Card */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-xl p-6 animate-slide-in">

            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h3
              id="delete-modal-title"
              className="text-base font-bold text-gray-800 text-center"
            >
              Delete Todo?
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 text-center leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-gray-700 break-words">
                &ldquo;{todo.title}&rdquo;
              </span>
              ? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-sm font-semibold
                  text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]
                  transition-all duration-200 touch-manipulation"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-500
                  hover:from-red-600 hover:to-rose-600 text-white text-sm font-semibold
                  shadow-sm hover:shadow-red-200 hover:shadow-md active:scale-[0.98]
                  transition-all duration-200 touch-manipulation flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`group bg-white rounded-2xl border transition-all duration-300 p-4 sm:p-5 animate-bounce-in
        ${todo.done
            ? 'border-emerald-100 bg-emerald-50/30 shadow-sm'
            : 'border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md'}
        ${isDeleting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
      `}
      >
        {isEditing ? (
          <TodoEditForm todo={todo} />
        ) : (
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Checkbox — larger tap target on mobile */}
            <button
              onClick={handleToggle}
              className={`mt-0.5 flex-shrink-0 h-6 w-6 sm:h-5 sm:w-5 rounded-full border-2 transition-all duration-200
              flex items-center justify-center touch-manipulation
              ${todo.done
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95'
                }`}
              aria-label={todo.done ? 'Mark as active' : 'Mark as done'}
              title={todo.done ? 'Mark as active' : 'Mark as done'}
            >
              {todo.done && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold leading-snug break-words transition-all duration-300
              ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-1 text-xs leading-relaxed break-words
                ${todo.done ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
                  {todo.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium
                ${todo.done
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-indigo-50 text-indigo-400'
                  }`}>
                  {todo.done ? '✓ Done' : '● Active'}
                </span>
                <p className="text-xs text-gray-300">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
              {!todo.done && (
                <button
                  onClick={handleEdit}
                  className="p-2 sm:p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50
                  active:scale-95 transition-all duration-200 touch-manipulation"
                  aria-label="Edit todo"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50
                active:scale-95 transition-all duration-200 touch-manipulation"
                aria-label="Delete todo"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

