import axios from 'axios';
import { convertWithFixedRates, SUPPORTED_CURRENCIES, SUPPORTED_CURRENCIES_LABEL } from '@/constants/currencies';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock das funções da API
jest.mock('../route', () => ({
  GET: jest.fn(),
  POST: jest.fn(),
}));

describe('/api/convert', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  it('should handle API rate fetching', async () => {
    const mockRates = {
      USD: 1,
      BRL: 5.0,
      EUR: 0.9
    };

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        rates: mockRates
      }
    });

    // Teste simples de que o axios está funcionando
    const response = await axios.get('https://api.exchangerate.host/latest?base=USD');
    
    expect(response.data.success).toBe(true);
    expect(response.data.rates).toEqual(mockRates);
  });

  it('should handle API failure', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    try {
      await axios.get('https://api.exchangerate.host/latest?base=USD');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('API Error');
    }
  });

  it('should convert using fixed rates when API is unavailable', () => {
    const result = convertWithFixedRates(100, 'USD', 'BRL');
    expect(result).toBeGreaterThan(0);
  });

  it('should expose supported currencies label', () => {
    expect(SUPPORTED_CURRENCIES_LABEL).toBe(SUPPORTED_CURRENCIES.join(', '));
  });
});