interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
}

export const EmptyState = ({ title, description, icon = '📝' }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center animate-fade-in">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50
        border border-indigo-100 flex items-center justify-center mb-5 shadow-sm">
        <span className="text-4xl sm:text-5xl" role="img" aria-label="empty">
          {icon}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-[240px] leading-relaxed">{description}</p>
      )}
    </div>
  );
};

