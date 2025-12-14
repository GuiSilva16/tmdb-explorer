/**
 * Hook de Paginação no Cliente
 * 
 * Gerencia página atual, tamanho da página e cálculos de paginação
 */

import { useState, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  paginatedItems: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
}

export function usePagination<T>(
  items: T[],
  initialPageSize: number = 12
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Garantir que a página atual não excede o total de páginas
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const { startIndex, endIndex, paginatedItems } = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    const end = start + pageSize;
    return {
      startIndex: start,
      endIndex: end,
      paginatedItems: items.slice(start, end),
    };
  }, [validCurrentPage, pageSize, items]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  };

  const prevPage = () => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setCurrentPage(1); // Resetar para primeira página ao mudar tamanho
  };

  return {
    currentPage: validCurrentPage,
    pageSize,
    totalPages: totalPages || 1,
    totalItems,
    startIndex,
    endIndex,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
}
