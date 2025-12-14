/**
 * Hook de Persistência em localStorage
 * 
 * Sincroniza estado com localStorage e restaura ao carregar a página
 * Útil para favoritos, filtros e preferências do utilizador
 */

import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Inicializar com valor do localStorage ou valor inicial
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage para chave "${key}":`, error);
      return initialValue;
    }
  });

  // Atualizar localStorage quando o estado muda
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Erro ao escrever em localStorage para chave "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
