/**
 * Componente LoadingState
 * 
 * Exibe skeleton cards durante o carregamento
 */

import { cn } from '@/lib/utils';

interface LoadingStateProps {
  count?: number;
  className?: string;
}

export default function LoadingState({
  count = 12,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-lg overflow-hidden bg-card border border-border"
        >
          {/* Skeleton poster */}
          <div className="w-full aspect-[2/3] bg-muted animate-pulse" />

          {/* Skeleton info */}
          <div className="p-3 space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
