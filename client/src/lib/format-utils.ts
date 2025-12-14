/**
 * Utilitários de Formatação
 * 
 * Funções para formatar diferentes tipos de dados da API TMDB
 * - Strings (com fallback "—")
 * - Números (com toLocaleString em pt-PT)
 * - Datas (com Intl.DateTimeFormat)
 * - Booleanos (com badges/ícones)
 * - URLs de imagens (com alt descritivo e fallback)
 */

import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from './tmdb-config';

/**
 * Formata uma string com fallback para "—"
 */
export function formatString(value: string | null | undefined, fallback = '—'): string {
  if (!value || value.trim() === '') {
    return fallback;
  }
  return value.trim();
}

/**
 * Formata um número com separador de milhares em pt-PT
 */
export function formatNumber(value: number | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  return value.toLocaleString('pt-PT');
}

/**
 * Formata uma data em formato pt-PT
 */
export function formatDate(dateString: string | null | undefined, fallback = '—'): string {
  if (!dateString) {
    return fallback;
  }

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return fallback;
  }
}

/**
 * Formata uma classificação de 0-10 para uma estrela visual
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) {
    return '—';
  }
  return `${rating.toFixed(1)}/10`;
}

/**
 * Formata duração em minutos para formato legível
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) {
    return '—';
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) {
    return `${mins}m`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Gera URL de imagem TMDB com tamanho especificado
 */
export function getTMDBImageUrl(
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES = 'poster'
): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`;
}

/**
 * Gera URL de fallback para imagem (placeholder)
 */
export function getImageFallback(type: 'poster' | 'backdrop' = 'poster'): string {
  if (type === 'backdrop') {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"%3E%3Crect fill="%23222" width="1280" height="720"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';
  }
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 513"%3E%3Crect fill="%23222" width="342" height="513"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3ESem poster%3C/text%3E%3C/svg%3E';
}

/**
 * Formata booleano para badge de texto
 */
export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '—';
  }
  return value ? '✓ Sim' : '✗ Não';
}

/**
 * Trunca texto com elipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number = 150): string {
  if (!text) {
    return '—';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Formata moeda em EUR
 */
export function formatCurrency(value: number | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined || value === 0) {
    return fallback;
  }
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}
