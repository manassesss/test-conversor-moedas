import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { SUPPORTED_CURRENCIES, type SupportedCurrency, SUPPORTED_CURRENCIES_LABEL, convertWithFixedRates } from '@/constants/currencies';

// Interface para a resposta da API de câmbio
interface ExchangeRateResponse {
  success: boolean;
  rates: Record<string, number>;
}

// FIXED_RATES movido para src/constants/currencies.ts

// Função para buscar taxas de câmbio da API externa
async function fetchExchangeRates(): Promise<Record<string, number> | null> {
  try {
    const response = await axios.get<ExchangeRateResponse>('https://api.exchangerate.host/latest?base=USD');
    
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
  return convertWithFixedRates(amount, from, to);
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

    if (!SUPPORTED_CURRENCIES.includes(from) || !SUPPORTED_CURRENCIES.includes(to)) {
      return NextResponse.json(
        { error: `Moeda não suportada. Moedas suportadas: ${SUPPORTED_CURRENCIES_LABEL}` },
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
  return NextResponse.json({
    currencies: SUPPORTED_CURRENCIES,
    count: SUPPORTED_CURRENCIES.length
  });
}
