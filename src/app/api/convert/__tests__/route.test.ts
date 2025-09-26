import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import axios from 'axios';

// Mock do axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('/api/convert', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  describe('GET', () => {
    it('should convert currency successfully with API rates', async () => {
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

      const request = new NextRequest('http://localhost:3000/api/convert?amount=100&from=USD&to=BRL');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.originalAmount).toBe(100);
      expect(data.from).toBe('USD');
      expect(data.to).toBe('BRL');
      expect(data.convertedAmount).toBe(500);
      expect(data.source).toBe('API');
    });

    it('should convert currency with fixed rates when API fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const request = new NextRequest('http://localhost:3000/api/convert?amount=100&from=USD&to=BRL');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.originalAmount).toBe(100);
      expect(data.from).toBe('USD');
      expect(data.to).toBe('BRL');
      expect(data.convertedAmount).toBe(500);
      expect(data.source).toBe('Fixed rates');
    });

    it('should return error for invalid amount', async () => {
      const request = new NextRequest('http://localhost:3000/api/convert?amount=-100&from=USD&to=BRL');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Valor inválido. Deve ser um número positivo.');
    });

    it('should return error for missing parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/convert?amount=100');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Moedas de origem e destino são obrigatórias.');
    });

    it('should return error for unsupported currency', async () => {
      const request = new NextRequest('http://localhost:3000/api/convert?amount=100&from=INVALID&to=BRL');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Moeda não suportada');
    });

    it('should handle same currency conversion', async () => {
      const request = new NextRequest('http://localhost:3000/api/convert?amount=100&from=USD&to=USD');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.convertedAmount).toBe(100);
    });
  });

  describe('POST', () => {
    it('should return supported currencies', async () => {
      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.currencies).toContain('USD');
      expect(data.currencies).toContain('EUR');
      expect(data.currencies).toContain('BRL');
      expect(data.count).toBe(10);
    });
  });
});
