interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  return (
    <div
      role="status"
      className={`inline-block ${sizeMap[size]} animate-spin rounded-full border-4 border-solid border-indigo-400 border-r-transparent ${className}`}
      aria-label="Loading..."
    />
  );
};

