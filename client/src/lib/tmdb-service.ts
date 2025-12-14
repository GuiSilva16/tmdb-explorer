/**
 * Serviço TMDB
 * 
 * Funções para interagir com a API TMDB
 * Inclui pesquisa, filtros, ordenação e detalhes
 */

import { fetchWithTimeout, FetchError } from './fetch-api';
import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDBMovie,
  TMDBTV,
  TMDBSearchResponse,
  TMDBMovieDetails,
  TMDBTVDetails,
  SortOption,
} from './tmdb-config';

/**
 * Pesquisa filmes por termo
 */
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBSearchResponse<TMDBMovie>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: query.trim(),
    page: page.toString(),
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/search/movie?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBMovie>>(url, { timeout: 8000 });
}

/**
 * Pesquisa séries por termo
 */
export async function searchTV(
  query: string,
  page: number = 1
): Promise<TMDBSearchResponse<TMDBTV>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query: query.trim(),
    page: page.toString(),
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/search/tv?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBTV>>(url, { timeout: 8000 });
}

/**
 * Descobre filmes com filtros e ordenação
 */
export async function discoverMovies(
  page: number = 1,
  sortBy: SortOption = 'popularity.desc',
  genreIds?: number[],
  yearFrom?: number,
  yearTo?: number
): Promise<TMDBSearchResponse<TMDBMovie>> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    sort_by: sortBy,
    language: 'pt-PT',
    include_adult: 'false',
  });

  if (genreIds && genreIds.length > 0) {
    params.append('with_genres', genreIds.join(','));
  }

  if (yearFrom) {
    params.append('primary_release_date.gte', `${yearFrom}-01-01`);
  }

  if (yearTo) {
    params.append('primary_release_date.lte', `${yearTo}-12-31`);
  }

  const url = `${TMDB_BASE_URL}/discover/movie?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBMovie>>(url, { timeout: 8000 });
}

/**
 * Descobre séries com filtros e ordenação
 */
export async function discoverTV(
  page: number = 1,
  sortBy: SortOption = 'popularity.desc',
  genreIds?: number[],
  yearFrom?: number,
  yearTo?: number
): Promise<TMDBSearchResponse<TMDBTV>> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    sort_by: sortBy,
    language: 'pt-PT',
  });

  if (genreIds && genreIds.length > 0) {
    params.append('with_genres', genreIds.join(','));
  }

  if (yearFrom) {
    params.append('first_air_date.gte', `${yearFrom}-01-01`);
  }

  if (yearTo) {
    params.append('first_air_date.lte', `${yearTo}-12-31`);
  }

  const url = `${TMDB_BASE_URL}/discover/tv?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBTV>>(url, { timeout: 8000 });
}

/**
 * Obtém detalhes de um filme
 */
export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/movie/${movieId}?${params}`;
  return fetchWithTimeout<TMDBMovieDetails>(url, { timeout: 8000 });
}

/**
 * Obtém detalhes de uma série
 */
export async function getTVDetails(tvId: number): Promise<TMDBTVDetails> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/tv/${tvId}?${params}`;
  return fetchWithTimeout<TMDBTVDetails>(url, { timeout: 8000 });
}

/**
 * Obtém filmes populares
 */
export async function getPopularMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/movie/popular?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBMovie>>(url, { timeout: 8000 });
}

/**
 * Obtém séries populares
 */
export async function getPopularTV(page: number = 1): Promise<TMDBSearchResponse<TMDBTV>> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/tv/popular?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBTV>>(url, { timeout: 8000 });
}

/**
 * Obtém filmes em cartaz
 */
export async function getNowPlayingMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/movie/now_playing?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBMovie>>(url, { timeout: 8000 });
}

/**
 * Obtém filmes em breve
 */
export async function getUpcomingMovies(page: number = 1): Promise<TMDBSearchResponse<TMDBMovie>> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    page: page.toString(),
    language: 'pt-PT',
  });

  const url = `${TMDB_BASE_URL}/movie/upcoming?${params}`;
  return fetchWithTimeout<TMDBSearchResponse<TMDBMovie>>(url, { timeout: 8000 });
}
