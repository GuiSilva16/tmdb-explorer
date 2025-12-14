/**
 * Componente Pagination
 * 
 * Controles de paginação com navegação entre páginas
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const pageSizeOptions = [6, 12, 24, 48];

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg',
        className
      )}
    >
      {/* Tamanho da página */}
      <div className="flex items-center gap-2">
        <label htmlFor="page-size" className="text-sm text-muted-foreground">
          Itens por página:
        </label>
        <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(Number(val))}>
          <SelectTrigger id="page-size" className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-2">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-foreground">
            Página {currentPage}
          </span>
          <span className="text-sm text-muted-foreground">de {totalPages}</span>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          aria-label="Próxima página"
        >
          <ChevronRight size={16} />
        </Button>
      </div>

      {/* Informação de total */}
      <div className="text-sm text-muted-foreground">
        Total de páginas: {totalPages}
      </div>
    </div>
  );
}
