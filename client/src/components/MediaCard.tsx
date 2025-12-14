/**
 * Componente MediaCard
 * 
 * Exibe informações de um filme ou série em formato de card
 * Inclui:
 * - Poster com fallback
 * - Título (string)
 * - Data de lançamento (data formatada)
 * - Classificação (número formatado)
 * - Badge de adulto (booleano)
 * - Ícone de favorito
 */

import { Heart, Star } from 'lucide-react';
import { TMDBMovie, TMDBTV } from '@/lib/tmdb-config';
import {
  formatString,
  formatDate,
  formatRating,
  getTMDBImageUrl,
  getImageFallback,
  truncateText,
} from '@/lib/format-utils';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  media: TMDBMovie | TMDBTV;
  isFavorite?: boolean;
  onFavoriteToggle?: (media: TMDBMovie | TMDBTV) => void;
  onClick?: (media: TMDBMovie | TMDBTV) => void;
  className?: string;
}

export default function MediaCard({
  media,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  className,
}: MediaCardProps) {
  const isMovie = 'title' in media;
  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const posterUrl = getTMDBImageUrl(media.poster_path, 'poster') || getImageFallback('poster');

  return (
    <div
      className={cn(
        'group relative h-full flex flex-col rounded-lg overflow-hidden bg-card border border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer',
        className
      )}
      onClick={() => onClick?.(media)}
      role="article"
      aria-label={`${title} - ${formatRating(media.vote_average)}`}
    >
      {/* Poster Container */}
      <div className="relative w-full overflow-hidden bg-muted aspect-[2/3]">
        <img
          src={posterUrl}
          alt={`Poster de ${title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay com informações ao hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          {/* Favorito */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle?.(media);
              }}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              aria-label={isFavorite ? 'Remover de favoritos' : 'Adicionar a favoritos'}
              title={isFavorite ? 'Remover de favoritos' : 'Adicionar a favoritos'}
            >
              <Heart
                size={20}
                className={cn(
                  'transition-colors',
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
            </button>
          </div>

          {/* Overview truncado */}
          <div className="text-xs text-white">
            <p className="line-clamp-3">
              {truncateText(media.overview, 120)}
            </p>
          </div>
        </div>

        {/* Badge de adulto */}
        {isMovie && (media as TMDBMovie).adult && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
            +18
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-white">
            {formatRating(media.vote_average)}
          </span>
        </div>
      </div>

      {/* Informações */}
      <div className="flex-1 p-3 flex flex-col gap-2">
        {/* Título */}
        <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
          {formatString(title)}
        </h3>

        {/* Data */}
        <p className="text-xs text-muted-foreground">
          {formatDate(releaseDate)}
        </p>

        {/* Popularidade */}
        <p className="text-xs text-muted-foreground mt-auto">
          Popularidade: {formatString(media.popularity.toFixed(1))}
        </p>
      </div>
    </div>
  );
}
