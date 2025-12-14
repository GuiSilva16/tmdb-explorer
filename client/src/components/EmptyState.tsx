/**
 * Componente EmptyState
 * 
 * Exibe mensagem quando não há resultados
 */

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'Nenhum resultado encontrado',
  description = 'Tente ajustar os seus filtros ou pesquisar por outro termo.',
  icon = <Search className="w-12 h-12 text-muted-foreground" />,
  className,
  action,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
