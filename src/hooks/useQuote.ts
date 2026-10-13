import { useCallback, useEffect, useState } from 'react';
import { fetchRandomQuote } from '../services/api';
import { QuoteResponse } from '../types/api';

interface UseQuoteResult {
  quote: QuoteResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/** Busca uma frase motivacional e expõe os estados de carregamento e erro. */
export function useQuote(): UseQuoteResult {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      setQuote(await fetchRandomQuote());
    } catch {
      setError('Não foi possível carregar a frase do dia. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { quote, isLoading, error, refresh };
}
