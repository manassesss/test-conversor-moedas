'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useCurrencyConverter, SupportedCurrency, ConversionResult } from '@/hooks/useCurrencyConverter';
import { ArrowLeftRight, Loader2 } from 'lucide-react';

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

const CURRENCY_FLAGS: Record<SupportedCurrency, string> = {
  USD: 'USD',
  EUR: 'EUR',
  BRL: 'BRL',
  GBP: 'GBP',
  JPY: 'JPY',
  CAD: 'CAD',
  AUD: 'AUD',
  CHF: 'CHF',
  CNY: 'CNY',
  SEK: 'SEK'
};

// Componente para renderizar bandeiras SVG circulares
function CircularFlag({ currency, size = 32 }: { currency: SupportedCurrency; size?: number }) {
  return (
    <div 
      className="rounded-full overflow-hidden border-2 border-gray-200 shadow-sm flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img
        src={`/assets/${currency}.svg`}
        alt={`${currency} flag`}
        className="w-full h-full object-cover"
        style={{ transform: 'scale(1.1)' }} // Aumenta um pouco para preencher melhor o círculo
      />
    </div>
  );
}

interface SearchableSelectProps {
  value: SupportedCurrency;
  onChange: (currency: SupportedCurrency) => void;
  options: SupportedCurrency[];
  placeholder: string;
  label: string;
}

function SearchableSelect({ value, onChange, options, placeholder, label }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter(currency => 
      currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      CURRENCY_NAMES[currency].toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
    if (!isOpen) setIsOpen(true);
  };

  const handleOptionClick = (currency: SupportedCurrency) => {
    onChange(currency);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay to allow option clicks to register
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  const displayValue = isOpen ? searchTerm : `${value} - ${CURRENCY_NAMES[value]}`;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="flex items-center space-x-3">
          <CircularFlag currency={value} size={40} />
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
          />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((currency, index) => (
              <div
                key={currency}
                onClick={() => handleOptionClick(currency)}
                className={`px-4 py-3 cursor-pointer flex items-center space-x-3 ${
                  index === highlightedIndex
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <CircularFlag currency={currency} size={32} />
                <div>
                  <div className="font-medium">{currency}</div>
                  <div className="text-sm text-gray-500">{CURRENCY_NAMES[currency]}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 text-center">
              Nenhuma moeda encontrada
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<SupportedCurrency>('USD');
  const [toCurrency, setToCurrency] = useState<SupportedCurrency>('BRL');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [supportedCurrencies, setSupportedCurrencies] = useState<SupportedCurrency[]>([]);
  const [isClient, setIsClient] = useState(false);

  const { convertCurrency, getSupportedCurrencies, isLoading, error, clearError } = useCurrencyConverter();

  // Evitar problemas de hidratação
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Evitar problemas de hidratação
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white text-black font-[Montserrat] relative flex flex-col">
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg mb-4 w-96"></div>
                <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-[Montserrat] relative flex flex-col">
      {/* Waves na parte inferior */}
      <div 
        className="absolute top-0 left-0 right-0 h-200"
        style={{
          backgroundImage: 'url(/waves.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>
      
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="max-w-6xl mx-auto px-4 w-full">
        {/* Título principal fora do card */}
        <h1 className="text-6xl md:text-7xl font-bold text-center text-white mb-12">
          CONVERSOR DE MOEDAS
        </h1>
        <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-12">
        Bem-vindo à ferramenta de conversão de moedas, possivelmente, mais confiável do mundo.
        </h2>

        {/* Card principal */}
        <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="space-y-6">
            {/* Layout responsivo: linha no desktop, coluna no mobile */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              {/* Input de valor */}
              <div className="flex-1">
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

              {/* Seleção de moedas - De */}
              <div className="flex-1">
                <SearchableSelect
                  value={fromCurrency}
                  onChange={setFromCurrency}
                  options={supportedCurrencies}
                  placeholder="Pesquisar moeda de origem..."
                  label="De"
                />
              </div>

              {/* Botão de troca */}
              <div className="flex items-end">
                <button
                  onClick={handleSwapCurrencies}
                  className="w-full lg:w-16 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center group"
                  title="Trocar moedas"
                >
                  <ArrowLeftRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                </button>
              </div>

              {/* Seleção de moedas - Para */}
              <div className="flex-1">
                <SearchableSelect
                  value={toCurrency}
                  onChange={setToCurrency}
                  options={supportedCurrencies}
                  placeholder="Pesquisar moeda de destino..."
                  label="Para"
                />
              </div>
            </div>

            {/* Botão de conversão */}
            <div className="flex justify-center">
              <div className="relative group">
                <button
                  onClick={handleConvert}
                  disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                  className="
                    px-12 py-4 text-white rounded-lg font-medium text-lg
                    bg-gradient-to-r from-[#6413C2] via-[#7319D8] to-[#8A2AE8]
                    hover:from-[#5611A8] hover:via-[#6413C2] hover:to-[#7A23D0]
                    disabled:from-[#9E7CE0] disabled:via-[#A789E6] disabled:to-[#B79EF0]
                    disabled:text-white/80 disabled:cursor-not-allowed
                    transition-all duration-200 shadow-lg hover:shadow-xl
                    transform hover:scale-105 disabled:transform-none
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6F1FD0]
                    flex items-center justify-center space-x-2
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <span>Converter</span>
                  )}
                </button>
                
                {/* Tooltip */}
                {(!amount || parseFloat(amount) <= 0) && !isLoading && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Digite o valor
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Convertendo...
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Exibição de erro */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <strong>Erro:</strong> {error}
              </div>
            )}

            {/* Resultado da conversão */}
            {result && (
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Resultado da Conversão
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valor original:</span>
                    <span className="font-medium text-black">
                      {formatCurrency(result.originalAmount, result.from)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valor convertido:</span>
                    <span className="font-bold text-gray-800 text-xl">
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
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Moedas Suportadas ({supportedCurrencies.length})
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {supportedCurrencies.map((currency) => (
                  <div
                    key={currency}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <CircularFlag currency={currency} size={24} />
                    <span className="text-sm font-medium">{currency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}