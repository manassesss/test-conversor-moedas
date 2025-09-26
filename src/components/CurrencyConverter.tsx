'use client';

import { useState, useEffect } from 'react';
import { useCurrencyConverter, SupportedCurrency } from '@/hooks/useCurrencyConverter';

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  BRL: 'R$',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  SEK: 'kr'
};

const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  USD: 'Dólar Americano',
  EUR: 'Euro',
  BRL: 'Real Brasileiro',
  GBP: 'Libra Esterlina',
  JPY: 'Iene Japonês',
  CAD: 'Dólar Canadense',
  AUD: 'Dólar Australiano',
  CHF: 'Franco Suíço',
  CNY: 'Yuan Chinês',
  SEK: 'Coroa Sueca'
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>('USD');
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>('BRL');
  const [result, setResult] = useState<any>(null);
  const [supportedCurrencies, setSupportedCurrencies] = useState<SupportedCurrency[]>([]);

  const { convertCurrency, getSupportedCurrencies, isLoading, error, clearError } = useCurrencyConverter();

  useEffect(() => {
    const loadCurrencies = async () => {
      const currencies = await getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    };
    loadCurrencies();
  }, [getSupportedCurrencies]);

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    clearError();
    const conversionResult = await convertCurrency(
      parseFloat(amount),
      fromCurrency,
      toCurrency
    );

    if (conversionResult) {
      setResult(conversionResult);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const formatCurrency = (value: number, currency: SupportedCurrency) => {
    return `${CURRENCY_SYMBOLS[currency]} ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        💱 Conversor de Moedas
      </h1>

      <div className="space-y-6">
        {/* Input de valor */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            Valor
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Digite o valor"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
        </div>

        {/* Seleção de moedas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
              De
            </label>
            <select
              id="from"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as SupportedCurrency)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency} - {CURRENCY_NAMES[currency]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSwapCurrencies}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center"
              title="Trocar moedas"
            >
              ↔️
            </button>
          </div>

          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
              Para
            </label>
            <select
              id="to"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as SupportedCurrency)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency} - {CURRENCY_NAMES[currency]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão de conversão */}
        <button
          onClick={handleConvert}
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {isLoading ? '🔄 Convertendo...' : '💱 Converter'}
        </button>

        {/* Exibição de erro */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {/* Resultado da conversão */}
        {result && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Resultado da Conversão
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor original:</span>
                <span className="font-medium">
                  {formatCurrency(result.originalAmount, result.from)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor convertido:</span>
                <span className="font-bold text-green-700 text-xl">
                  {formatCurrency(result.convertedAmount, result.to)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taxa de câmbio:</span>
                <span className="font-medium">
                  1 {result.from} = {result.rate.toFixed(4)} {result.to}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fonte:</span>
                <span className="text-sm text-gray-500">
                  {result.source === 'API' ? '🌐 Taxas em tempo real' : '📊 Taxas fixas'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Informações sobre moedas suportadas */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Moedas Suportadas ({supportedCurrencies.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {supportedCurrencies.map((currency) => (
              <span
                key={currency}
                className="px-2 py-1 bg-white text-gray-600 rounded text-xs border"
              >
                {currency}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
