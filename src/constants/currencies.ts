export type SupportedCurrency =
  | 'USD'
  | 'EUR'
  | 'BRL'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'CNY'
  | 'SEK';

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  'USD',
  'EUR',
  'BRL',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'SEK',
];

export const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  USD: 'Dólar Americano',
  EUR: 'Euro',
  BRL: 'Real Brasileiro',
  GBP: 'Libra Esterlina',
  JPY: 'Iene Japonês',
  CAD: 'Dólar Canadense',
  AUD: 'Dólar Australiano',
  CHF: 'Franco Suíço',
  CNY: 'Yuan Chinês',
  SEK: 'Coroa Sueca',
};

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  BRL: 'R$',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr',
};

export const SUPPORTED_CURRENCIES_LABEL = SUPPORTED_CURRENCIES.join(', ');

// Bandeiras mapeadas para arquivos estáticos em public/assets
export const CURRENCY_FLAGS_ASSET: Record<SupportedCurrency, string> = {
  USD: '/assets/USD.svg',
  EUR: '/assets/EUR.svg',
  BRL: '/assets/BRL.svg',
  GBP: '/assets/GBP.svg',
  JPY: '/assets/JPY.svg',
  CAD: '/assets/CAD.svg',
  AUD: '/assets/AUD.svg',
  CHF: '/assets/CHF.svg',
  CNY: '/assets/CNY.svg',
  SEK: '/assets/SEK.svg',
};

// Taxas fixas de câmbio como fallback (via USD quando necessário)
export const FIXED_RATES: Record<string, Record<string, number>> = {
  USD: { BRL: 5.0, EUR: 0.9, GBP: 0.8, JPY: 110, CAD: 1.3, AUD: 1.4, CHF: 0.9, CNY: 6.5, SEK: 10.5 },
  EUR: { USD: 1.1, BRL: 5.5, GBP: 0.85, JPY: 120, CAD: 1.4, AUD: 1.5, CHF: 1.0, CNY: 7.0, SEK: 11.0 },
  BRL: { USD: 0.2, EUR: 0.18, GBP: 0.16, JPY: 22, CAD: 0.26, AUD: 0.28, CHF: 0.18, CNY: 1.3, SEK: 2.1 },
  GBP: { USD: 1.25, EUR: 1.18, BRL: 6.25, JPY: 140, CAD: 1.6, AUD: 1.7, CHF: 1.1, CNY: 8.0, SEK: 13.0 },
  JPY: { USD: 0.009, EUR: 0.008, BRL: 0.045, GBP: 0.007, CAD: 0.012, AUD: 0.013, CHF: 0.008, CNY: 0.06, SEK: 0.09 },
  CAD: { USD: 0.77, EUR: 0.71, BRL: 3.85, GBP: 0.63, JPY: 85, AUD: 1.08, CHF: 0.69, CNY: 5.0, SEK: 8.1 },
  AUD: { USD: 0.71, EUR: 0.67, BRL: 3.57, GBP: 0.59, JPY: 77, CAD: 0.93, CHF: 0.64, CNY: 4.6, SEK: 7.6 },
  CHF: { USD: 1.11, EUR: 1.0, BRL: 5.56, GBP: 0.91, JPY: 125, CAD: 1.45, AUD: 1.56, CNY: 7.8, SEK: 12.6 },
  CNY: { USD: 0.15, EUR: 0.14, BRL: 0.77, GBP: 0.13, JPY: 17, CAD: 0.2, AUD: 0.22, CHF: 0.13, SEK: 2.0 },
  SEK: { USD: 0.095, EUR: 0.091, BRL: 0.48, GBP: 0.077, JPY: 11, CAD: 0.12, AUD: 0.13, CHF: 0.079, CNY: 0.5 },
};

export function convertWithFixedRates(amount: number, from: SupportedCurrency, to: SupportedCurrency): number {
  if (from === to) return amount;
  if (from === 'USD') {
    return amount * (FIXED_RATES[from][to] || 1);
  }
  const amountInUSD = amount / (FIXED_RATES[from]['USD'] || 1);
  return amountInUSD * (FIXED_RATES['USD'][to] || 1);
}
