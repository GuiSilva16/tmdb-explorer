/**
 * Página Home
 * 
 * Página principal da aplicação com:
 * - Pesquisa com debounce
 * - Filtros e ordenação
 * - Paginação no cliente
 * - Estados (loading, error, empty, success)
 * - Persistência de favoritos
 * - Filtro para visualizar apenas favoritos
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import MediaCard from '@/components/MediaCard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { usePagination } from '@/hooks/usePagination';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FetchError } from '@/lib/fetch-api';
import {
  searchMovies,
  searchTV,
  getPopularMovies,
  getPopularTV,
} from '@/lib/tmdb-service';
import { TMDBMovie, TMDBTV, SortOption } from '@/lib/tmdb-config';

type MediaItem = TMDBMovie | TMDBTV;

interface AppState {
  items: MediaItem[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export default function Home() {
  // Estado da pesquisa
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Estado da aplicação
  const [appState, setAppState] = useState<AppState>({
    items: [],
    isLoading: false,
    error: null,
    hasSearched: false,
  });

  // Persistência de favoritos
  const [favorites, setFavorites] = useLocalStorage<number[]>('tmdb-favorites', []);

  // Paginação
  const pagination = usePagination(appState.items, 12);

  // Referência para AbortController
  const abortControllerRef = React.useRef<AbortController | null>(null);

  /**
   * Função para carregar dados
   */
  const loadData = useCallback(async (query: string, type: 'movie' | 'tv') => {
    // Cancelar pedido anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      let results;

      if (query.trim()) {
        // Pesquisa por termo
        if (type === 'movie') {
          const response = await searchMovies(query);
          results = response.results || [];
        } else {
          const response = await searchTV(query);
          results = response.results || [];
        }
      } else {
        // Carregamento inicial (populares)
        if (type === 'movie') {
          const response = await getPopularMovies();
          results = response.results || [];
        } else {
          const response = await getPopularTV();
          results = response.results || [];
        }
      }

      // Filtrar por géneros se selecionados
      let filtered: MediaItem[] = results;
      if (selectedGenres.length > 0) {
        filtered = results.filter((item) =>
          selectedGenres.some((genreId) => item.genre_ids?.includes(genreId))
        ) as MediaItem[];
      }

      // Ordenar
      const sorted = sortResults(filtered, sortBy);

      setAppState({
        items: sorted as MediaItem[],
        isLoading: false,
        error: null,
        hasSearched: query.trim().length > 0,
      });

      pagination.goToPage(1);
    } catch (err) {
      // Não mostrar erro se foi abortado
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }

      let errorMessage = 'Erro ao carregar dados';
      if (err instanceof FetchError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setAppState({
        items: [],
        isLoading: false,
        error: errorMessage,
        hasSearched: query.trim().length > 0,
      });

      toast.error(errorMessage);
    }
  }, [selectedGenres, sortBy, pagination]);

  /**
   * Ordenar resultados
   */
  const sortResults = (items: MediaItem[], sort: SortOption): (TMDBMovie | TMDBTV)[] => {
    const sorted = [...items];

    switch (sort) {
      case 'popularity.desc':
        return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'popularity.asc':
        return sorted.sort((a, b) => (a.popularity || 0) - (b.popularity || 0));
      case 'vote_average.desc':
        return sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'vote_average.asc':
        return sorted.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
      case 'release_date.desc': {
        const isMovie = 'title' in sorted[0];
        return sorted.sort((a, b) => {
          const dateA = isMovie ? (a as TMDBMovie).release_date : (a as TMDBTV).first_air_date;
          const dateB = isMovie ? (b as TMDBMovie).release_date : (b as TMDBTV).first_air_date;
          return new Date(dateB || 0).getTime() - new Date(dateA || 0).getTime();
        });
      }
      case 'release_date.asc': {
        const isMovie = 'title' in sorted[0];
        return sorted.sort((a, b) => {
          const dateA = isMovie ? (a as TMDBMovie).release_date : (a as TMDBTV).first_air_date;
          const dateB = isMovie ? (b as TMDBMovie).release_date : (b as TMDBTV).first_air_date;
          return new Date(dateA || 0).getTime() - new Date(dateB || 0).getTime();
        });
      }
      default:
        return sorted;
    }
  };

  /**
   * Carregar dados iniciais
   */
  useEffect(() => {
    if (!showFavorites) {
      loadData(searchQuery, mediaType);
    }
  }, [mediaType, searchQuery]);

  /**
   * Executar pesquisa quando a query muda
   */
  useEffect(() => {
    if (!showFavorites && searchQuery.trim()) {
      loadData(searchQuery, mediaType);
    }
  }, [searchQuery, mediaType]);

  /**
   * Re-ordenar quando sort muda
   */
  useEffect(() => {
    if (appState.items.length > 0 && !showFavorites) {
      const sorted = sortResults(appState.items, sortBy);
      setAppState((prev) => ({
        ...prev,
        items: sorted,
      }));
      pagination.goToPage(1);
    }
  }, [sortBy]);

  /**
   * Re-filtrar quando géneros mudam
   */
  useEffect(() => {
    if (!showFavorites) {
      loadData(searchQuery, mediaType);
    }
  }, [selectedGenres]);

  /**
   * Filtrar favoritos quando showFavorites muda
   */
  useEffect(() => {
    if (showFavorites) {
      // Filtrar items que estão em favoritos
      const favoriteItems = appState.items.filter(item => favorites.includes(item.id));
      setAppState(prev => ({
        ...prev,
        items: favoriteItems,
        hasSearched: true,
      }));
      pagination.goToPage(1);
    }
  }, [showFavorites, favorites]);

  /**
   * Limpar AbortController ao desmontar
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Toggle favorito
   */
  const toggleFavorite = (media: MediaItem) => {
    const isFavorite = favorites.includes(media.id);
    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== media.id));
      toast.success('Removido de favoritos');
    } else {
      setFavorites([...favorites, media.id]);
      toast.success('Adicionado a favoritos');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="container py-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-orange-500 fill-orange-500" />
              <h1 className="text-3xl font-bold text-foreground">TMDB Explorer</h1>
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showFavorites
                  ? 'bg-orange-500 text-white'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
              aria-pressed={showFavorites}
              title={showFavorites ? 'Ver todos' : 'Ver favoritos'}
            >
              <Heart
                size={18}
                className={`inline mr-2 ${
                  showFavorites ? 'fill-white' : ''
                }`}
              />
              Meus Favoritos ({favorites.length})
            </button>
          </div>
          <p className="text-muted-foreground text-sm">
            {showFavorites
              ? `Você tem ${favorites.length} filme(s)/série(s) nos favoritos`
              : 'Descubra filmes e séries com a API The Movie Database'}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 space-y-6">
        {/* Pesquisa e Filtros - Ocultos quando mostrando favoritos */}
        {!showFavorites && (
          <>
            <SearchBar
              onSearch={setSearchQuery}
              isLoading={appState.isLoading}
              placeholder="Pesquisar filmes ou séries..."
            />

            {/* Filtros */}
            <FilterBar
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedGenres={selectedGenres}
              onGenresChange={setSelectedGenres}
              mediaType={mediaType}
              onMediaTypeChange={setMediaType}
            />
          </>
        )}

        {/* Estado de Carregamento */}
        {appState.isLoading && <LoadingState count={12} />}

        {/* Estado de Erro */}
        {appState.error && !appState.isLoading && (
          <ErrorState
            title="Erro ao carregar dados"
            message={appState.error}
            onRetry={() => loadData(searchQuery, mediaType)}
          />
        )}

        {/* Estado Vazio */}
        {!appState.isLoading && !appState.error && appState.items.length === 0 && (
          <EmptyState
            title={
              showFavorites
                ? 'Nenhum favorito ainda'
                : appState.hasSearched
                ? 'Nenhum resultado encontrado'
                : 'Nenhum conteúdo disponível'
            }
            description={
              showFavorites
                ? 'Adicione filmes ou séries aos seus favoritos clicando no ícone de coração.'
                : appState.hasSearched
                ? 'Tente ajustar os seus filtros ou pesquisar por outro termo.'
                : 'Comece a pesquisar ou explore o conteúdo popular.'
            }
          />
        )}

        {/* Grid de Resultados */}
        {!appState.isLoading && !appState.error && pagination.paginatedItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pagination.paginatedItems.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  isFavorite={favorites.includes(media.id)}
                  onFavoriteToggle={toggleFavorite}
                />
              ))}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.pageSize}
                onPageChange={pagination.goToPage}
                onPageSizeChange={pagination.setPageSize}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>
            Dados fornecidos por{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              The Movie Database (TMDB)
            </a>
          </p>
          <p className="mt-2">© 2025 TMDB Explorer. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
