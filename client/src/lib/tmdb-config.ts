/**
 * Configuração da API TMDB
 * 
 * Esta aplicação utiliza a API The Movie Database (TMDB) para obter dados sobre filmes e séries.
 * Documentação: https://developer.themoviedb.org/docs
 * 
 * Endpoints principais utilizados:
 * - GET /search/movie - Pesquisa de filmes
 * - GET /search/tv - Pesquisa de séries
 * - GET /discover/movie - Descobrir filmes com filtros
 * - GET /movie/{id} - Detalhes de um filme
 * - GET /tv/{id} - Detalhes de uma série
 */

export const TMDB_API_KEY = '24ee39e0c0d72b6dd19dd688b5c1b386';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster: 'w342',
  backdrop: 'w1280',
  profile: 'w185',
} as const;

/**
 * Tipos de dados extraídos da API TMDB
 */

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string; // Data em formato YYYY-MM-DD
  vote_average: number; // Número de 0 a 10
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  media_type?: string;
}

export interface TMDBTV {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string; // Data em formato YYYY-MM-DD
  vote_average: number; // Número de 0 a 10
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  media_type?: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBSearchResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  revenue: number;
  runtime: number; // Duração em minutos
  status: string;
  genres: TMDBGenre[];
  production_companies: Array<{ id: number; name: string }>;
}

export interface TMDBTVDetails extends TMDBTV {
  genres: TMDBGenre[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  networks: Array<{ id: number; name: string }>;
}

export const GENRES_MAP: Record<number, string> = {
  28: 'Ação',
  12: 'Aventura',
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Horror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Filme de TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Faroeste',
  10759: 'Ação & Aventura',
  10762: 'Crianças',
  10763: 'Notícias',
  10764: 'Reality',
  10765: 'Ficção Científica & Fantasia',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'Guerra & Política',
};

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularidade (Descendente)' },
  { value: 'popularity.asc', label: 'Popularidade (Ascendente)' },
  { value: 'vote_average.desc', label: 'Classificação (Descendente)' },
  { value: 'vote_average.asc', label: 'Classificação (Ascendente)' },
  { value: 'release_date.desc', label: 'Data de Lançamento (Mais Recente)' },
  { value: 'release_date.asc', label: 'Data de Lançamento (Mais Antigo)' },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];
