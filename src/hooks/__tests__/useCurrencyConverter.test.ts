import { renderHook, act } from '@testing-library/react';
import { useCurrencyConverter } from '../useCurrencyConverter';

// Mock do fetch
global.fetch = jest.fn();

describe('useCurrencyConverter', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should convert currency successfully', async () => {
    const mockResponse = {
      originalAmount: 100,
      from: 'USD',
      to: 'BRL',
      convertedAmount: 500,
      rate: 5.0,
      source: 'API'
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useCurrencyConverter());

    let conversionResult;
    await act(async () => {
      conversionResult = await result.current.convertCurrency(100, 'USD', 'BRL');
    });

    expect(conversionResult).toEqual(mockResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle conversion error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Moeda não suportada' }),
    });

    const { result } = renderHook(() => useCurrencyConverter());

    let conversionResult;
    await act(async () => {
      conversionResult = await result.current.convertCurrency(100, 'INVALID', 'BRL');
    });

    expect(conversionResult).toBeNull();
    expect(result.current.error).toBe('Moeda não suportada');
    expect(result.current.isLoading).toBe(false);
  });

  it('should get supported currencies', async () => {
    const mockCurrencies = ['USD', 'EUR', 'BRL', 'GBP'];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ currencies: mockCurrencies }),
    });

    const { result } = renderHook(() => useCurrencyConverter());

    let currencies;
    await act(async () => {
      currencies = await result.current.getSupportedCurrencies();
    });

    expect(currencies).toEqual(mockCurrencies);
  });

  it('should handle network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCurrencyConverter());

    let conversionResult;
    await act(async () => {
      conversionResult = await result.current.convertCurrency(100, 'USD', 'BRL');
    });

    expect(conversionResult).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useCurrencyConverter());

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
