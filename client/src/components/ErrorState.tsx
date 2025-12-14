/**
 * Componente ErrorState
 * 
 * Exibe mensagem de erro com opção de tentar novamente
 */

import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  showIcon?: boolean;
}

export default function ErrorState({
  title = 'Erro ao carregar dados',
  message = 'Ocorreu um erro ao processar o seu pedido. Por favor, tente novamente.',
  onRetry,
  className,
  showIcon = true,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
      role="alert"
      aria-live="assertive"
      aria-label={title}
    >
      {showIcon && (
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      )}
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="default"
          size="sm"
          className="gap-2"
          aria-label="Tentar novamente"
        >
          <RotateCcw size={16} />
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}
