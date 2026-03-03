import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import type { Todo } from '../types/todo.types';
import toast from 'react-hot-toast';

interface TodoEditFormProps {
  todo: Todo;
}

interface FormErrors {
  title?: string;
}

export const TodoEditForm = ({ todo }: TodoEditFormProps) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    else if (title.trim().length > 200) newErrors.title = 'Title cannot exceed 200 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      console.log({ id: todo._id, payload: { title: title.trim(), description: description.trim() } });

      toast.success('Todo updated ✏️');
    } catch (err) {
      toast.error((err as string) || 'Failed to update todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    console.log("canceled");

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 animate-fade-in" noValidate>
      <div>
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({}); }}
          maxLength={200}
          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors
            ${errors.title ? 'border-red-400 bg-red-50' : 'border-indigo-300 bg-indigo-50 focus:border-indigo-500'}`}
          aria-label="Edit title"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">⚠️ {errors.title}</p>
        )}
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        maxLength={1000}
        className="w-full px-3 py-2 rounded-lg border border-indigo-300 bg-indigo-50
          focus:border-indigo-500 text-sm outline-none resize-none transition-colors"
        aria-label="Edit description"
        placeholder="Description (optional)..."
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
            text-white text-xs font-medium transition-all active:scale-[0.98]"
        >
          {isSubmitting ? 'Saving...' : '✓ Save'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200
            text-gray-600 text-xs font-medium transition-all active:scale-[0.98]"
        >
          ✕ Cancel
        </button>
      </div>
    </form>
  );
};

