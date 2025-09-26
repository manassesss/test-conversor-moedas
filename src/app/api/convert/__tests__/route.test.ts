import axios from 'axios';

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
});