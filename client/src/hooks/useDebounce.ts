/**
 * Hook de Debounce
 * 
 * Atrasa a execução de um valor até que o utilizador pare de fazer alterações
 * Padrão: 400ms (conforme requisitos)
 */

import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
