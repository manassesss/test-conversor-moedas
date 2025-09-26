import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Tipos para as moedas suportadas
export type SupportedCurrency = 'USD' | 'EUR' | 'BRL' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'SEK';

// Taxas de câmbio fixas como fallback
const FIXED_RATES: Record<string, Record<string, number>> = {
  USD: { BRL: 5.0, EUR: 0.9, GBP: 0.8, JPY: 110, CAD: 1.3, AUD: 1.4, CHF: 0.9, CNY: 6.5, SEK: 10.5 },
  EUR: { USD: 1.1, BRL: 5.5, GBP: 0.85, JPY: 120, CAD: 1.4, AUD: 1.5, CHF: 1.0, CNY: 7.0, SEK: 11.0 },
  BRL: { USD: 0.2, EUR: 0.18, GBP: 0.16, JPY: 22, CAD: 0.26, AUD: 0.28, CHF: 0.18, CNY: 1.3, SEK: 2.1 },
  GBP: { USD: 1.25, EUR: 1.18, BRL: 6.25, JPY: 140, CAD: 1.6, AUD: 1.7, CHF: 1.1, CNY: 8.0, SEK: 13.0 },
  JPY: { USD: 0.009, EUR: 0.008, BRL: 0.045, GBP: 0.007, CAD: 0.012, AUD: 0.013, CHF: 0.008, CNY: 0.06, SEK: 0.09 },
  CAD: { USD: 0.77, EUR: 0.71, BRL: 3.85, GBP: 0.63, JPY: 85, AUD: 1.08, CHF: 0.69, CNY: 5.0, SEK: 8.1 },
  AUD: { USD: 0.71, EUR: 0.67, BRL: 3.57, GBP: 0.59, JPY: 77, CAD: 0.93, CHF: 0.64, CNY: 4.6, SEK: 7.6 },
  CHF: { USD: 1.11, EUR: 1.0, BRL: 5.56, GBP: 0.91, JPY: 125, CAD: 1.45, AUD: 1.56, CNY: 7.8, SEK: 12.6 },
  CNY: { USD: 0.15, EUR: 0.14, BRL: 0.77, GBP: 0.13, JPY: 17, CAD: 0.2, AUD: 0.22, CHF: 0.13, SEK: 2.0 },
  SEK: { USD: 0.095, EUR: 0.091, BRL: 0.48, GBP: 0.077, JPY: 11, CAD: 0.12, AUD: 0.13, CHF: 0.079, CNY: 0.5 }
};

// Função para buscar taxas de câmbio da API externa
async function fetchExchangeRates(): Promise<Record<string, number> | null> {
  try {
    const response = await axios.get('https://api.exchangerate.host/latest?base=USD');
    
    if (response.data.success) {
      return response.data.rates;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error);
    return null;
  }
}

// Função para converter moeda usando taxas da API ou fallback
function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency,
  rates: Record<string, number> | null
): number {
  if (from === to) return amount;

  // Se temos taxas da API, usar elas
  if (rates) {
    // Converter para USD primeiro se necessário
    let amountInUSD = amount;
    if (from !== 'USD') {
      amountInUSD = amount / rates[from];
    }
    
    // Converter de USD para moeda destino
    return amountInUSD * rates[to];
  }

  // Usar taxas fixas como fallback
  if (from === 'USD') {
    return amount * (FIXED_RATES[from][to] || 1);
  }

  // Converter via USD usando taxas fixas
  const amountInUSD = amount / (FIXED_RATES[from]['USD'] || 1);
  return amountInUSD * (FIXED_RATES['USD'][to] || 1);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') || '');
    const from = searchParams.get('from') as SupportedCurrency;
    const to = searchParams.get('to') as SupportedCurrency;

    // Validações
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'Valor inválido. Deve ser um número positivo.' },
        { status: 400 }
      );
    }

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Moedas de origem e destino são obrigatórias.' },
        { status: 400 }
      );
    }

    const supportedCurrencies: SupportedCurrency[] = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK'];
    
    if (!supportedCurrencies.includes(from) || !supportedCurrencies.includes(to)) {
      return NextResponse.json(
        { error: 'Moeda não suportada. Moedas suportadas: USD, EUR, BRL, GBP, JPY, CAD, AUD, CHF, CNY, SEK' },
        { status: 400 }
      );
    }

    // Buscar taxas de câmbio
    const rates = await fetchExchangeRates();
    const convertedAmount = convertCurrency(amount, from, to, rates);

    return NextResponse.json({
      originalAmount: amount,
      from,
      to,
      convertedAmount: Math.round(convertedAmount * 100) / 100, // Arredondar para 2 casas decimais
      rate: Math.round((convertedAmount / amount) * 10000) / 10000, // Taxa com 4 casas decimais
      source: rates ? 'API' : 'Fixed rates'
    });

  } catch (error) {
    console.error('Erro na conversão:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para listar moedas suportadas
export async function POST() {
  const supportedCurrencies: SupportedCurrency[] = ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK'];
  
  return NextResponse.json({
    currencies: supportedCurrencies,
    count: supportedCurrencies.length
  });
}
