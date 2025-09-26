import { useState, useCallback } from 'react';
import type { SupportedCurrency } from '@/constants/currencies';

export interface ConversionResult {
  originalAmount: number;
  from: SupportedCurrency;
  to: SupportedCurrency;
  convertedAmount: number;
  rate: number;
  source: 'API' | 'Fixed rates';
}

export interface ConversionError {
  error: string;
}

export function useCurrencyConverter() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertCurrency = useCallback(async (
    amount: number,
    from: SupportedCurrency,
    to: SupportedCurrency
  ): Promise<ConversionResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/convert?amount=${amount}&from=${from}&to=${to}`
      );

      if (!response.ok) {
        const errorData: ConversionError = await response.json();
        throw new Error(errorData.error);
      }

      const result: ConversionResult = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSupportedCurrencies = useCallback(async (): Promise<SupportedCurrency[]> => {
    try {
      const response = await fetch('/api/convert', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar moedas suportadas');
      }

      const data = await response.json();
      return data.currencies;
    } catch (err) {
      console.error('Erro ao buscar moedas:', err);
      // Retornar moedas padrão em caso de erro
      return ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK'];
    }
  }, []);

  return {
    convertCurrency,
    getSupportedCurrencies,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
