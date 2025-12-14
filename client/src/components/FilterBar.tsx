/**
 * Componente FilterBar
 * 
 * Barra de filtros e ordenação
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GENRES_MAP, SORT_OPTIONS, SortOption } from '@/lib/tmdb-config';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedGenres: number[];
  onGenresChange: (genres: number[]) => void;
  mediaType: 'movie' | 'tv';
  onMediaTypeChange: (type: 'movie' | 'tv') => void;
  className?: string;
}

export default function FilterBar({
  sortBy,
  onSortChange,
  selectedGenres,
  onGenresChange,
  mediaType,
  onMediaTypeChange,
  className,
}: FilterBarProps) {
  const [showGenres, setShowGenres] = useState(false);

  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || 'Ordenar';

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      onGenresChange(selectedGenres.filter((id) => id !== genreId));
    } else {
      onGenresChange([...selectedGenres, genreId]);
    }
  };

  const genreEntries = Object.entries(GENRES_MAP);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 p-4 bg-card border border-border rounded-lg',
        className
      )}
    >
      {/* Tipo de mídia */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
        <div className="flex gap-1 bg-muted rounded-md p-1">
          <Button
            onClick={() => onMediaTypeChange('movie')}
            variant={mediaType === 'movie' ? 'default' : 'ghost'}
            size="sm"
            className="text-xs"
            aria-pressed={mediaType === 'movie'}
          >
            Filmes
          </Button>
          <Button
            onClick={() => onMediaTypeChange('tv')}
            variant={mediaType === 'tv' ? 'default' : 'ghost'}
            size="sm"
            className="text-xs"
            aria-pressed={mediaType === 'tv'}
          >
            Séries
          </Button>
        </div>
      </div>

      {/* Ordenação */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            aria-label="Ordenar por"
          >
            {currentSortLabel}
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SORT_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={cn(
                'cursor-pointer',
                sortBy === option.value && 'bg-accent'
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Géneros */}
      <DropdownMenu open={showGenres} onOpenChange={setShowGenres}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs"
            aria-label="Filtrar por género"
          >
            Géneros {selectedGenres.length > 0 && `(${selectedGenres.length})`}
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
          <DropdownMenuLabel>Selecionar Géneros</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {genreEntries.map(([id, name]) => (
            <DropdownMenuItem
              key={id}
              onClick={() => toggleGenre(Number(id))}
              className="cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(Number(id))}
                onChange={() => {}}
                className="mr-2 w-4 h-4 rounded border-border"
                aria-label={`Filtrar por ${name}`}
              />
              <span>{name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Limpar filtros */}
      {selectedGenres.length > 0 && (
        <Button
          onClick={() => onGenresChange([])}
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          aria-label="Limpar filtros de género"
        >
          Limpar Géneros
        </Button>
      )}
    </div>
  );
}
