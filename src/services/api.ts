import { QuoteResponse } from '../types/api';

const BASE_URL = 'https://dummyjson.com';
const TIMEOUT_MS = 10000;

function isQuoteResponse(value: unknown): value is QuoteResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const data = value as Record<string, unknown>;
  return (
    typeof data.id === 'number' &&
    typeof data.quote === 'string' &&
    typeof data.author === 'string'
  );
}

async function request(path: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Erro ${response.status} ao acessar a API.`);
    }
    const data: unknown = await response.json();
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

/** Busca uma frase motivacional aleatória na API pública DummyJSON. */
export async function fetchRandomQuote(): Promise<QuoteResponse> {
  const data = await request('/quotes/random');
  if (!isQuoteResponse(data)) {
    throw new Error('Resposta inesperada da API.');
  }
  return data;
}
