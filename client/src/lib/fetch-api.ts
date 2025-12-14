/**
 * Módulo de Fetch Robusto
 * 
 * Implementa:
 * - AbortController para cancelamento de pedidos anteriores
 * - Timeout configurável (padrão: 8 segundos)
 * - Verificação de response.ok antes de parsear JSON
 * - Tratamento de erros com mensagens amigáveis
 * - Normalização de payloads ([] e {data:[]})
 */

export interface FetchOptions extends RequestInit {
  timeout?: number; // em milissegundos, padrão 8000
  retryCount?: number; // número de tentativas, padrão 1
}

export class FetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

/**
 * Realiza um pedido HTTP com timeout e tratamento de erros
 * 
 * @param url - URL do pedido
 * @param options - Opções do fetch (timeout, retryCount, etc.)
 * @returns Promise com os dados parseados
 */
export async function fetchWithTimeout<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = 8000,
    retryCount = 1,
    ...fetchOptions
  } = options;

  // Criar AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      // 404 é tratado como empty state em alguns contextos
      if (response.status === 404) {
        throw new FetchError('Recurso não encontrado', 404);
      }

      // Tentar extrair mensagem de erro da resposta
      let errorMessage = `Erro ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json() as { status_message?: string };
        if (errorData.status_message) {
          errorMessage = errorData.status_message;
        }
      } catch {
        // Se não conseguir parsear, usar mensagem padrão
      }

      throw new FetchError(errorMessage, response.status);
    }

    // Parsear JSON
    const data = await response.json() as T;

    // Normalizar payload (lidar com {data: []} ou [] diretamente)
    const normalized = normalizePayload(data);
    return normalized as T;
  } catch (error) {
    clearTimeout(timeoutId);

    // Verificar se foi abortado (timeout)
    if (error instanceof DOMException && error.name === 'AbortError') {
      // Tentar novamente se houver tentativas restantes
      if (retryCount > 1) {
        console.warn(`Timeout na requisição ${url}. Tentando novamente...`);
        return fetchWithTimeout(url, {
          ...options,
          retryCount: retryCount - 1,
        });
      }
      throw new FetchError(
        'Pedido expirou. Por favor, tente novamente.',
        undefined,
        error
      );
    }

    // Se for um erro de fetch já tratado, relançar
    if (error instanceof FetchError) {
      throw error;
    }

    // Erro de rede ou outro erro
    if (error instanceof TypeError) {
      throw new FetchError(
        'Erro de conexão. Verifique a sua ligação à internet.',
        undefined,
        error
      );
    }

    // Erro desconhecido
    throw new FetchError(
      'Erro desconhecido ao processar o pedido',
      undefined,
      error
    );
  }
}

/**
 * Normaliza o payload da resposta
 * Lida com respostas em formato {data: []} ou [] diretamente
 */
function normalizePayload(data: unknown): unknown {
  if (data === null || data === undefined) {
    return [];
  }

  if (typeof data === 'object' && 'data' in data && Array.isArray((data as Record<string, unknown>).data)) {
    return (data as Record<string, unknown>).data;
  }

  return data;
}

/**
 * Hook para gerenciar AbortController em componentes React
 * Permite cancelar pedidos quando o componente é desmontado
 */
export function useAbortController() {
  const controllerRef = React.useRef<AbortController | null>(null);

  const getSignal = () => {
    if (!controllerRef.current) {
      controllerRef.current = new AbortController();
    }
    return controllerRef.current.signal;
  };

  const abort = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      abort();
    };
  }, []);

  return { getSignal, abort };
}

import React from 'react';
