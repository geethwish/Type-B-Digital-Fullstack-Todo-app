import { useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';

interface FormErrors {
  title?: string;
}

export const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      console.log({ title: title.trim(), description: description.trim() });

      setTitle('');
      setDescription('');
      setErrors({});
      toast.success('Todo created! 🎉');
    } catch (err) {
      toast.error((err as string) || 'Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 lg:mb-0 animate-slide-in"
      noValidate
    >
      {/* Form header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-700">Add New Todo</h2>
      </div>

      <div className="space-y-3">
        {/* Title field */}
        <div>
          <label htmlFor="title" className="block text-xs font-medium text-gray-500 mb-1.5">
            Task title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors({}); }}
            placeholder="What needs to be done?"
            maxLength={200}
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none
              ${errors.title
                ? 'border-red-400 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-indigo-400 bg-gray-50 focus:bg-white'
              }`}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.title ? (
              <p id="title-error" className="text-xs text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.title}
              </p>
            ) : <span />}
            <p className="text-xs text-gray-300 tabular-nums">{title.length}/200</p>
          </div>
        </div>

        {/* Description field */}
        <div>
          <label htmlFor="description" className="block text-xs font-medium text-gray-500 mb-1.5">
            Description <span className="text-gray-300">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white
              focus:border-indigo-400 text-sm transition-colors outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500
            hover:from-indigo-700 hover:to-indigo-600 disabled:from-indigo-300 disabled:to-indigo-300
            text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
            active:scale-[0.98] shadow-sm hover:shadow-indigo-200 hover:shadow-md touch-manipulation"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Creating…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Todo
            </>
          )}
        </button>
      </div>
    </form>
  );
};

