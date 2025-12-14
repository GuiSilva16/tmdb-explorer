/**
 * Componente SearchBar
 * 
 * Barra de pesquisa com debounce e suporte a Enter para pesquisa imediata
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = 'Pesquisar filmes ou séries...',
  isLoading = false,
  className,
  initialValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 400);

  // Executar pesquisa quando o valor debounced muda
  useEffect(() => {
    if (debouncedValue.trim()) {
      onSearch(debouncedValue.trim());
    }
  }, [debouncedValue, onSearch]);

  // Executar pesquisa imediatamente ao pressionar Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value.trim());
      }
    }
  };

  // Limpar pesquisa
  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg',
        className
      )}
    >
      <Search size={18} className="text-muted-foreground flex-shrink-0" />
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 border-0 bg-transparent focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        aria-label="Pesquisar"
        autoComplete="off"
      />
      {value && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="p-0 h-auto"
          aria-label="Limpar pesquisa"
          disabled={isLoading}
        >
          <X size={18} className="text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
