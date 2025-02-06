import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        variant === 'default'
          ? 'border border-surface-200 bg-white shadow-sm hover:shadow-md dark:border-surface-700 dark:bg-surface-800'
          : 'glass glass-hover shadow-glass-lg hover:shadow-glass-xl',
        className
      )}
      {...props}
    />
  );
}